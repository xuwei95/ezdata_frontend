<template>
  <div class="chat-container">
    <div class="chat-messages">
      <!-- 显示聊天消息的区域 -->
      <div v-for="(message, index) in messages" :key="index" class="chat-message">
        {{ message }}
      </div>
    </div>
    <div class="chat-input">
      <!-- 用户输入框 -->
      <a-input v-model="inputText" @pressEnter="sendMessage" placeholder="请输入消息" />
      <a-button type="primary" @click="sendMessage">发送</a-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        inputText: '',
        messages: [],
      };
    },
    methods: {
      sendMessage() {
        // 处理用户发送的消息，并返回回复
        const reply = ''; // 调用ChatGPT API获取回复
        this.messages.push(this.inputText, reply);
        this.inputText = '';
      }
    }
  };
</script>

<style scoped>
.chat-container {
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.chat-messages {
  height: 300px;
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
