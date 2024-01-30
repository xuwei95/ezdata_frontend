<template>
  <div class="chat-head">
    最大分析数据量: <a-input-number v-model:value="maxRow"></a-input-number>
    <span style="margin-left: 20px">
      <a-button :disabled="loading" @click="clearMessages">清空对话记录</a-button>
    </span>
  </div>
  <div class="chat-container">
    <div class="chat-messages" id="scrollRef" ref="scrollRef">
      <!-- 显示聊天消息的区域 -->
      <div v-for="(message, index) in messages" :key="index" class="chat-message">
        <Message :message="message" />
      </div>
    </div>
    <div class="sticky bottom-0 left-0 flex justify-center">
      <a-button v-if="loading" type="warning" preIcon="ant-design:stop-outline" @click="handleStop">
        Stop Responding
      </a-button>
    </div>
    <div class="chat-input">
      <!-- 用户输入框 -->
      <a-textarea v-model:value="question" :autoSize="{ minRows: 1, maxRows: 8 }" @pressEnter="sendMessage" placeholder="请输入问题" />
      <span style="width: 10px"></span>
      <a-button type="primary" @click="sendMessage" :disabled="loading">发送</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { dataChat } from './datachat.api';
  import Message from './message.vue';
  import { useScroll } from './hooks/useScroll';
  import { Modal } from 'ant-design-vue';
  import { useMessage } from '@/hooks/web/useMessage';
  const { scrollRef, scrollToBottom } = useScroll();
  const { createMessage } = useMessage();
  const props = defineProps({
    genQuery: {
      type: Function,
      default: null,
    },
  });
  const messages = ref<any[]>([]);
  const question = ref('');
  const maxRow = ref(10000);
  const loading = ref(false);
  // 清空聊天
  async function clearMessages() {
    Modal.confirm({
      title: '清空确认',
      content: '确认清空对话记录？',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        messages.value = [];
        createMessage.success('清空成功！');
      },
    });
  }
  // 停止响应
  async function handleStop() {
    if (loading.value) {
      const result_msg = {
        type: 'result',
        message: {
          text: 'Something went wrong, please try again later.',
          data: [],
          html: '',
        },
      };
      messages.value.push(result_msg);
      loading.value = false;
    }
  }
  // 发送请求
  async function sendMessage() {
    if (loading.value) {
      return;
    }
    const query_info = await props.genQuery();
    query_info['pagesize'] = maxRow.value;
    const chatReq = { question: question.value, query_info: query_info };
    const user_msg = {
      type: 'user',
      message: {
        text: question.value,
        data: [],
        html: '',
      },
    };
    messages.value.push(user_msg);
    question.value = '';
    scrollToBottom();
    loading.value = true;
    const res_data = await dataChat(chatReq);
    if (res_data) {
      if (loading.value) {
        loading.value = false;
        const result_msg = {
          type: 'result',
          message: res_data,
        };
        messages.value.push(result_msg);
        scrollToBottom();
      }
      console.log('result666', res_data);
    } else {
      const result_msg = {
        type: 'result',
        message: {
          text: 'Something went wrong, please try again later.',
          data: [],
          html: '',
        },
      };
      messages.value.push(result_msg);
      loading.value = false;
      scrollToBottom();
      console.log('error', res_data);
    }
  }
</script>

<style scoped>
  .chat-head {
    /*border-bottom: 1px solid rgba(144, 147, 153, 0.3);*/
  }
  .chat-container {
    margin: 0 auto;
    padding: 20px;
  }
  .chat-messages {
    min-height: 400px;
    max-height: 1000px;
    overflow-y: scroll;
  }
  .chat-message {
    margin-bottom: 10px;
  }
  .chat-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
</style>
