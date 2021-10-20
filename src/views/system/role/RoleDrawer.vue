<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" width="500px" @ok="handleSubmit">
    <BasicForm @register="registerForm"/>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import {defineEmits,ref, computed, unref} from 'vue';
  import {BasicForm, useForm} from '/@/components/Form/index';
  import {formSchema} from './role.data';
  import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';
  import {BasicTree, TreeItem} from '/@/components/Tree';
  import {saveOrUpdateRole} from './role.api';
  // 获取emit
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const hideFooter = ref(true);
  const treeData = ref<TreeItem[]>([]);
  const [registerForm, {resetFields, setFieldsValue, validate}] = useForm({
    labelWidth: 90,
    schemas: formSchema,
    showActionButtonGroup: false,
  });
  const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {
    resetFields();
    hideFooter.value = !!data?.hideFooter;
    setDrawerProps({confirmLoading: false, showFooter: !unref(hideFooter)});
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      });
    }
  });
  /**
   * 标题
   */
  const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));
  /**
   * 提交
   */
  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({confirmLoading: true});
      //提交表单
      await saveOrUpdateRole(values, isUpdate.value);
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({confirmLoading: false});
    }
  }
</script>
