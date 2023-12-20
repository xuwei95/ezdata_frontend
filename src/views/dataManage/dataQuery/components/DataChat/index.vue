<template>
  最大分析数据量: <a-input-number v-model:value="maxRow"></a-input-number>
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
  const { scrollRef, scrollToBottom } = useScroll();
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
  // 获取当前时间
  function getNowDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 月份需要补齐两位数
    const day = currentDate.getDate().toString().padStart(2, '0'); // 日需要补齐两位数
    const hours = currentDate.getHours().toString().padStart(2, '0'); // 小时需要补齐两位数
    const minutes = currentDate.getMinutes().toString().padStart(2, '0'); // 分钟需要补齐两位数
    const seconds = currentDate.getSeconds().toString().padStart(2, '0'); // 秒需要补齐两位数
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }
  async function handleStop() {
    if (loading.value) {
      const result_msg = {
        type: 'result',
        time: getNowDate(),
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
      time: getNowDate(),
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
          time: getNowDate(),
          message: res_data,
        };
        messages.value.push(result_msg);
        scrollToBottom();
      }
      console.log('result666', res_data);
    } else {
      console.log('error', res_data);
    }
  }
</script>

<style scoped>
  .chat-container {
    margin: 0 auto;
    padding: 20px;
  }
  .chat-messages {
    min-height: 400px;
    /*max-height: 100%;*/
    /*overflow-y: scroll;*/
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
