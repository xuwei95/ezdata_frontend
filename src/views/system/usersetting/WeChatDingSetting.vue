<template>
  <div class="account-padding">
    <div class="my-account">第三方APP</div>
    <div class="account-row-item">
      <div class="account-label gray-75">企业微信绑定</div>
      <span>
        <icon-font :style="!bindData.bindWechat ? { color: '#9e9e9e' } : { color: '#1ec563' }" class="item-icon" type="icon-qiyeweixin3" />
        <span class="gray-75" style="margin-left: 12px">企业微信</span>
        <span class="gray-75" style="margin-left: 8px" v-if="bindData.bindWechat">{{ '已绑定：' + bindData.weChatName }}</span>
        <span class="blue-e5 pointer" style="margin-left: 24px" @click="wechatBind">{{ !bindData.bindWechat ? '绑定' : '解绑' }}</span>
      </span>
    </div>
    <div class="account-row-item">
      <div class="account-label gray-75">钉钉绑定</div>
      <span>
        <DingtalkCircleFilled :style="!bindData.bindDing ? { color: '#9e9e9e' } : { color: '#1ec563' }" class="item-icon" />
        <span class="gray-75" style="margin-left: 12px">钉钉</span>
        <span class="gray-75" style="margin-left: 8px" v-if="bindData.bindDing">{{ '已绑定：' + bindData.dingName }}</span>
        <span class="blue-e5 pointer" style="margin-left: 24px" @click="dingDingBind">{{ !bindData.bindDing ? '绑定' : '解绑' }}</span>
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup name="we-chat-ding-setting">
  import { onMounted, ref, reactive } from 'vue';
  import { CollapseContainer } from '/@/components/Container';
  import { getUserData } from './UserSetting.api';
  import { useUserStore } from '/@/store/modules/user';
  import { useModal } from '/@/components/Modal';
  import { DingtalkCircleFilled, createFromIconfontCN } from '@ant-design/icons-vue';

  const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2316098_umqusozousr.js',
  });
  const userDetail = ref<any>([]);
  const userStore = useUserStore();
  const bindData = reactive<any>({
    bindWechat: false,
    weChatName: '昵称',
    bindDing: false,
    dingName: '昵称',
  });

  /**
   * 初始化钉钉和企业微信数据
   */
  function initUserDetail() {}

  /**
   * 微信绑定解绑事件
   */
  function wechatBind() {
    console.log('微信绑定解绑事件');
  }

  /**
   * 钉钉绑定解绑事件
   */
  function dingDingBind() {
    console.log('钉钉绑定解绑事件');
  }

  onMounted(() => {
    initUserDetail();
  });
</script>
<style lang="less" scoped>
  .account-row-item {
    align-items: center;
    border-bottom: 1px solid #eaeaea;
    box-sizing: border-box;
    display: flex;
    height: 71px;
    position: relative;
  }

  .account-label {
    text-align: left;
    width: 160px;
  }

  .gray-75 {
    color: #757575 !important;
  }

  .pointer {
    cursor: pointer;
  }

  .blue-e5 {
    color: #1e88e5;
  }

  .phone-margin {
    margin-left: 24px;
    margin-right: 24px;
  }

  .clearfix:after {
    clear: both;
  }

  .clearfix:before {
    content: '';
    display: table;
  }
  .account-padding {
    padding: 30px 40px 0 20px;
  }
  .my-account {
    font-size: 17px;
    font-weight: 700 !important;
    color: #333 !important;
    margin-bottom: 20px;
  }
</style>
