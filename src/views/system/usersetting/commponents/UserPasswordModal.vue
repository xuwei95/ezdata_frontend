<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="修改密码" @ok="handleSubmit">
    <a-form class="antd-modal-form" ref="formRef" :model="formState" :rules="validatorRules">
      <a-form-item name="oldpassword">
        <div class="black font-size-13">原有密码</div>
        <div class="pass-padding">
          <a-input-password v-model:value="formState.oldpassword" placeholder="原有密码" />
        </div>
        <div style="display: block">
          <span class="gray-9e float-left font-size-13">进入网站的登录密码</span>
        </div>
      </a-form-item>
      <a-form-item name="password">
        <span class="black font-size-13">新密码</span>
        <div class="pass-padding">
          <a-input-password v-model:value="formState.password" placeholder="新密码" />
        </div>
        <span class="gray-9e font-size-13">8-20位，需包含字母和数字</span>
      </a-form-item>
    </a-form>
  </BasicModal>
</template>
<script lang="ts" name="user-pass-word-modal" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Rule } from '/@/components/Form/index';
  import { updateUserPassword } from '../UserSetting.api';
  import { useMessage } from "/@/hooks/web/useMessage";
  import { useUserStore, useUserStoreWithOut } from "/@/store/modules/user";

  const $message = useMessage();
  //用户名
  const username = ref<string>('')
  const formRef = ref();
  const formState = reactive({
    oldpassword:'',
    password:'',
  });
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });
    username.value = data.record.username
  });
  const userStore = useUserStore();
  const validatorRules: Record<string, Rule[]> = {
    password: [{ required: true, validator:checkPassword},{ pattern:/^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,20})$/,message:'8-20位，需包含字母和数字'}],
    oldpassword: [{ required: true, message: '请输入原有密码' }],
  };

  //表单提交事件
  async function handleSubmit() {
    try {
      let values = await formRef.value.validateFields();
      setModalProps({ confirmLoading: true });
      //提交表单
      values.username = unref(username);
      values.confirmpassword = values.password ;
      await updateUserPassword(values).then((res) =>{
        if(res.success){
          $message.createMessage.info({
            content:'密码修改成功，请重新登录！3s后自动退出登录',
            duration: 3
          })
          //3s后返回登录页面
          setTimeout(()=>{
            userStore.logout(true);
          },3000)
          //关闭弹窗
          closeModal();
        }else{
          $message.createMessage.warn(res.message);
        }
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  /**
   * 验证新密码是否为空
   */
  function checkPassword(_rule: Rule, value: string) {
    if(value === ''){
      return Promise.reject('请输入新密码');
    }
    return Promise.resolve();
  }
</script>
<style lang="less" scoped>
  .black {
    color: #000000;
  }
  .font-size-13 {
    font-size: 13px;
    line-height: 15px;
  }
  .gray-9e {
    color: #9e9e9e;
  }
  .float-left {
    float: left;
  }
  .pass-padding {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .forget{
    float: right;
    color: #1e88e5!important;
    cursor: pointer
  }
</style>
