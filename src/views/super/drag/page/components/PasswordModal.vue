<!--面板保护密码弹窗-->
<template>
  <a-modal
    v-model:visible="visible"
    okText="确认"
    :bodyStyle="{ padding: '24px 0 0 0' }"
    :closable="false"
    :maskClosable="false"
    v-bind="$attrs"
    centered
    destroyOnClose
  >
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item :extra="extraMsg" label="保护码" name="password">
        <a-input v-model:value="formState.password" type="password" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="handleClosed">关闭</a-button>
      <a-button key="submit" type="primary" @click="handleOk">确认</a-button>
    </template>
  </a-modal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRaw, unref } from 'vue';
  import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { encryptByBase64 } from '/@/utils/cipher.ts';
  import { setCacheByDynKey } from '/@/utils/auth';
  import { JDragConfigEnum } from '/@/enums/jeecgEnum';
  
  export default defineComponent({
    name: 'PasswordModal',
    emits: ['success', 'closed'],
    setup(props, { emit }) {
      //表单modal实例
      const formRef = ref();
      //表单信息
      const formModal = ref();
      //保护码提示语
      const extraMsg = ref('面板被保护中,编辑前请先输入保护码');
      //操作类型
      const operatorType = ref('');
      //弹窗显隐标记
      const visible = ref(false);
      //表单信息
      const formState = reactive({ password: '' });
      //显示modal
      function showModal(type,record) {
        formModal.value = { ...record };
        formState.password = '';
        operatorType.value = type;
        visible.value = true;
      }
      //关闭后的回调
      function handleClosed() {
        visible.value = false;
        emit('closed');
      }
      //校验密码
      let validatePass = async (rule: RuleObject, value: string) => {
        if (value === '') {
          return Promise.reject('密码不能为空');
        } else {
          let password = formModal.value.protectionCode;
          if (password !== encryptByBase64(value)) {
            return Promise.reject('密码不正确');
          }
          return Promise.resolve();
        }
      };
      //校验规则
      const rules = { password: [{ validator: validatePass, trigger: 'change' }] };
      //确实
      const handleOk = () => {
        formRef.value
          .validate()
          .then(async () => {
            let values = toRaw(unref(formModal));
            //返回表单信息，编辑时候需要
            emit('success', unref(operatorType),values);
            //判断是设计页面的时候弹窗
            let isEdit = unref(extraMsg) && unref(extraMsg).length > 0;
            //设计页面密码正确后，保存到缓存中
            !isEdit && setCacheByDynKey(JDragConfigEnum.DRAG_CACHE_PREFIX+values.id, values.protectionCode);
            visible.value = false;
          })
          .catch((error) => {
            console.log('error', error);
          });
      };
      return {
        visible,
        showModal,
        handleClosed,
        extraMsg,
        handleOk,
        formRef,
        formState,
        rules,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      };
    },
  });
</script>
