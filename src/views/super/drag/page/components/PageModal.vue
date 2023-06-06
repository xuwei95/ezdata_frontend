<template>
  <BasicModal v-bind="$attrs" @register="registerModal" okText="保存" :title="getTitle" @ok="handleSubmit" :width="700" destroyOnClose>
    <BasicForm @register="registerForm" />
    <template #appendFooter>
      <a-button type="primary" @click="handleSubmit(1)">保存并设计</a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from '../page.data';
  import { saveOrUpdate } from '../page.api';
  import { removeCacheByDynKey } from '/@/utils/auth';
  import { JDragConfigEnum } from '/@/enums/jeecgEnum';
  import { encryptByBase64,decodeByBase64 } from '/@/utils/cipher.ts';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    schemas: formSchema,
    showActionButtonGroup: false,
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
			let obj = {...data.record}
			//解密
			if(obj.protectionCode && obj.protectionCode.length>0){
				 obj.protectionCode = decodeByBase64( obj.protectionCode)
			}
      //表单赋值
      await setFieldsValue({
        ...obj,
      });
    }
  });
  //设置标题
  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

  /**
   * 表单提交事件
   * @param flag 标识0:保存/1:保存并设计
   */
  async function handleSubmit(flag = 0) {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      //加密
      if(values.protectionCode){
        values.protectionCode = encryptByBase64(values.protectionCode)   
			}
      //提交表单
      const res = await saveOrUpdate(values, isUpdate.value);
      //编辑后，将缓存中的密码清除掉
      values.id && removeCacheByDynKey(JDragConfigEnum.DRAG_CACHE_PREFIX + values.id);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success', flag === 1 ? res : null);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
