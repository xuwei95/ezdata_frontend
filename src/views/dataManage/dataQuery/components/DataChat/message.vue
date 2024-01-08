<template>
  <div class="chat-message" :class="{ 'is-user': isUser }">
    <div v-if="isUser">
      <img class="chat-message__avatar" :src="userImg" />
    </div>
    <div v-else>
      <img class="chat-message__avatar" :src="aiImg" />
    </div>
    <div class="chat-message__body">
      <div class="chat-message__header">
      </div>
      <div class="text-black" :class="wrapClass">
        <div ref="textRef" class="leading-relaxed break-words">
          <div class="markdown-body" v-html="renderedText"></div>
        </div>
      </div>
      <div v-if="showTable">
        <JVxeTable ref="tableRef" toolbar resizable maxHeight="400" :toolbarConfig="{ btn: [] }" :columns="columns" :dataSource="dataSource">
          <template #toolbarSuffix>
            <a-button @click="outputData" style="float: right" preIcon="ant-design:export-outlined">导出数据</a-button>
          </template>
        </JVxeTable>
      </div>
      <div class="html-body" v-if="htmlText !== ''">
        <a-button @click="outputChart" style="float: right" preIcon="ant-design:export-outlined">导出图表</a-button>
        <iframe :srcdoc="htmlText" width="100%" height="100%"></iframe>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, onUnmounted, onUpdated, defineProps, unref } from 'vue';
  import MarkdownIt from 'markdown-it';
  import mdKatex from '@traptitech/markdown-it-katex';
  import mila from 'markdown-it-link-attributes';
  import hljs from 'highlight.js';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { JVxeTypes, JVxeColumn, JVxeTableInstance } from '/@/components/jeecg/JVxeTable/types';
  import { useMethods } from '/@/hooks/system/useMethods';
  import aiImg from '/@/assets/images/ai.png';
  import userImg from '/@/assets/images/header.jpg';
  const props = defineProps({
    message: {
      type: Object,
      required: true,
    },
  });
  const message = ref(props.message);
  const isUser = computed(() => message.value.type === 'user');
  const { createMessage } = useMessage();
  // 数据表格相关配置
  const tableRef = ref<JVxeTableInstance>();
  const showTable = ref(false);
  const columns = ref<JVxeColumn[]>([]); // 字段列表
  const dataSource = ref<any[]>([]); // 数据列表
  // html渲染相关配置
  const htmlText = ref('');
  // markdown 相关配置
  const textRef = ref<HTMLElement>();
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const mdi = new MarkdownIt({
    html: false,
    linkify: true,
    highlight(code, language) {
      const validLang = !!(language && hljs.getLanguage(language));
      if (validLang) {
        const lang = language ?? '';
        return highlightBlock(hljs.highlight(code, { language: lang }).value, lang);
      }
      return highlightBlock(hljs.highlightAuto(code).value, '');
    },
  });
  mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } });
  mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' });
  const wrapClass = computed(() => {
    return ['text-wrap', 'min-w-[20px]', 'rounded-md', 'px-3 py-2', 'bg-[#f4f6f8]', 'dark:bg-[#1e1e20]', 'message-reply'];
  });
  const renderedText = computed(() => {
    return mdi.render(message.value.message.text);
  });
  // 数据表格 导出excel
  const { handleExportExcel } = useMethods();
  async function outputData() {
    console.log(dataSource.value);
    handleExportExcel('数据导出_' + Date.now() + '.xlsx', dataSource.value);
  }
  function handleTableData() {
    const data_li = message.value.message.data;
    if (data_li.length > 0) {
      columns.value = [];
      const fields = Object.keys(data_li[0]);
      console.log(fields);
      for (let i in fields) {
        const field_key = fields[i];
        columns.value.push({
          title: field_key,
          key: field_key,
          type: JVxeTypes.normal,
          width: 200,
        });
      }
      dataSource.value = data_li;
      showTable.value = true;
    }
  }
  // 渲染html图表
  function handleHtmlData() {
    const html_text = message.value.message.html;
    if (html_text !== '') {
      htmlText.value = html_text;
    }
  }
  async function outputChart() {
    console.log(dataSource.value);
    const output_name = '图表导出_' + Date.now() + '.html';
    const data = new Blob([htmlText.value], { type: 'text/html' });
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', output_name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  // markdown 复制代码
  function highlightBlock(str: string, lang?: string) {
    return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__copy">
      复制</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`;
  }

  function addCopyEvents() {
    if (textRef.value) {
      const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy');
      copyBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
          const code = btn.parentElement?.nextElementSibling?.textContent;
          if (code) {
            clipboardRef.value = code;
            if (unref(copiedRef)) {
              createMessage.success('复制成功！');
            }
          }
        });
      });
    }
  }

  function removeCopyEvents() {
    if (textRef.value) {
      const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy');
      copyBtn.forEach((btn) => {
        btn.removeEventListener('click', () => {});
      });
    }
  }
  onMounted(() => {
    addCopyEvents();
    handleTableData();
    handleHtmlData();
  });
  onUpdated(() => {
    addCopyEvents();
  });
  onUnmounted(() => {
    removeCopyEvents();
  });
</script>

<style scoped>
  .html-body {
    height: 500px;
    overflow: scroll;
  }
  .chat-message {
    display: flex;
    margin-bottom: 16px;
  }
  .chat-message__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #ccc;
    margin-left: 8px;
  }
  .chat-message.is-user {
    flex-direction: row-reverse;
  }
  .chat-message.is-user .chat-message__avatar {
    margin-right: 8px;
    margin-left: 0;
  }
  .chat-message__body {
    max-width: 90%;
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 8px;
    box-sizing: border-box;
  }
  .chat-message__header {
    margin-bottom: 8px;
  }
  .chat-message__time {
    font-size: 12px;
    color: #999;
  }
</style>

<style lang="less">
  .markdown-body {
    line-height: 1.5;
    background-color: transparent;
    font-size: 14px;
    .code-block-header__copy {
      margin-top: -20px;
    }
    p {
      white-space: pre-wrap;
    }

    ol {
      list-style-type: decimal;
    }

    ul {
      list-style-type: disc;
    }

    pre code,
    pre tt {
      line-height: 1.65;
    }

    .highlight pre,
    pre {
      background-color: #fff;
    }

    code.hljs {
      padding: 0;
    }

    .code-block {
      &-wrapper {
        position: relative;
        padding-top: 24px;
      }

      &-header {
        position: absolute;
        top: 5px;
        right: 0;
        width: 100%;
        padding: 0 1rem;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: #b3b3b3;

        &__copy {
          cursor: pointer;
          margin-left: 0.5rem;
          user-select: none;

          &:hover {
            color: #65a665;
          }
        }
      }
    }

    &.markdown-body-generate > dd:last-child:after,
    &.markdown-body-generate > dl:last-child:after,
    &.markdown-body-generate > dt:last-child:after,
    &.markdown-body-generate > h1:last-child:after,
    &.markdown-body-generate > h2:last-child:after,
    &.markdown-body-generate > h3:last-child:after,
    &.markdown-body-generate > h4:last-child:after,
    &.markdown-body-generate > h5:last-child:after,
    &.markdown-body-generate > h6:last-child:after,
    &.markdown-body-generate > li:last-child:after,
    &.markdown-body-generate > ol:last-child li:last-child:after,
    &.markdown-body-generate > p:last-child:after,
    &.markdown-body-generate > pre:last-child code:after,
    &.markdown-body-generate > td:last-child:after,
    &.markdown-body-generate > ul:last-child li:last-child:after {
      animation: blink 1s steps(5, start) infinite;
      color: #000;
      content: '_';
      font-weight: 700;
      margin-left: 3px;
      vertical-align: baseline;
    }

    @keyframes blink {
      to {
        visibility: hidden;
      }
    }
  }

  html.dark {
    .markdown-body {
      &.markdown-body-generate > dd:last-child:after,
      &.markdown-body-generate > dl:last-child:after,
      &.markdown-body-generate > dt:last-child:after,
      &.markdown-body-generate > h1:last-child:after,
      &.markdown-body-generate > h2:last-child:after,
      &.markdown-body-generate > h3:last-child:after,
      &.markdown-body-generate > h4:last-child:after,
      &.markdown-body-generate > h5:last-child:after,
      &.markdown-body-generate > h6:last-child:after,
      &.markdown-body-generate > li:last-child:after,
      &.markdown-body-generate > ol:last-child li:last-child:after,
      &.markdown-body-generate > p:last-child:after,
      &.markdown-body-generate > pre:last-child code:after,
      &.markdown-body-generate > td:last-child:after,
      &.markdown-body-generate > ul:last-child li:last-child:after {
        color: #65a665;
      }
    }

    .message-reply {
      .whitespace-pre-wrap {
        white-space: pre-wrap;
        color: var(--n-text-color);
      }
    }

    .highlight pre,
    pre {
      background-color: #282c34;
    }
  }
  @media screen and (max-width: 533px) {
    .markdown-body .code-block-wrapper {
      padding: unset;
      code {
        padding: 24px 16px 16px 16px;
      }
    }
  }
</style>
