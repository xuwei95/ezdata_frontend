<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" @ok="handleSubmit" width="800px" destroyOnClose>
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup name="tenant-pack-menu-modal">
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { packMenuFormSchema } from './tenant.data';
  import { addPackPermission, editPackPermission } from './tenant.api';

  const isUpdate = ref<boolean>(false);
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    schemas: packMenuFormSchema,
    showActionButtonGroup: false,
  });
  //租户
  const tenantId = ref<number>();
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    isUpdate.value = !!data?.isUpdate;
    tenantId.value = data.tenantId;
    if (unref(isUpdate)) {
      //表单赋值
      console.log(data.record)
      await setFieldsValue({ ...data.record });
    }
  });
  //设置标题
  const title = computed(() => (unref(isUpdate) ? '新增租户产品包' : '编辑租户产品包'));
  //表单提交事件
  async function handleSubmit(v) {
    const values = await validate();
    
    setModalProps({ confirmLoading: true });
    values.tenantId = unref(tenantId);
    if (!unref(isUpdate)) {
      await addPackPermission(values);
    } else {
      await editPackPermission(values);
    }
    emit('success');
    setModalProps({ confirmLoading: false });
    closeModal();
  }
</script>
