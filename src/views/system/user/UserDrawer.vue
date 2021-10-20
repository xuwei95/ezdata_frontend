<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" width="30%" @ok="handleSubmit">
    <BasicForm @register="registerForm"/>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import {defineComponent, ref, computed, unref,defineEmits} from 'vue';
  import {BasicForm, useForm} from '/@/components/Form/index';
  import {formSchema} from './user.data';
  import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';
  import {saveOrUpdateUser} from './user.api';
  // 获取emit
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  // 隐藏下角按钮
  const hideFooter = ref(true);
  const rowId = ref('');
  //表单配置
  const [registerForm, {resetFields, setFieldsValue, validate, updateSchema}] = useForm({
    labelWidth: 90,
    schemas: formSchema,
    showActionButtonGroup: false,
  });
  //表单赋值
  const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {
    await resetFields();
    hideFooter.value = !!data?.hideFooter;
    setDrawerProps({confirmLoading: false, showFooter: !unref(hideFooter)});
    rowId.value = data.record.id;
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      //TODO 目前的图片设置，暂时先这样
      console.log("data",data)
      if (!Array.isArray(data.record.avatar)) {
        data.record.avatar = [data.record.avatar];
      }
      setFieldsValue({
        ...data.record,
      });
    }
    //编辑时隐藏密码
    updateSchema([
      {
        field: 'password',
        show: !unref(isUpdate),
      },
      {
        field: 'confirmPassword',
        ifShow: !unref(isUpdate),
      }
    ]);
  });
  //获取标题
  const getTitle = computed(() => (!unref(isUpdate) ? '新增用户' : '编辑用户'));

  async function handleSubmit() {
    try {
      let values = await validate();
      if (values.selectedroles) {
        values.selectedroles = values.selectedroles.join(",");
      }
      if (Array.isArray(values.avatar)) {
        values.avatar = values.avatar[0];
      }
      setDrawerProps({confirmLoading: true});
      //提交表单
      await saveOrUpdateUser(values, unref(isUpdate));
      //关闭弹窗
      closeDrawer();
      //刷新列表
      emit('success', {isUpdate: unref(isUpdate), values: {...values, id: rowId.value}});
    } finally {
      setDrawerProps({confirmLoading: false});
    }
  }
</script>
