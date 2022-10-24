import type { App } from 'vue';
import { registerJVxeTable } from '/@/components/jeecg/JVxeTable';
import { registerJVxeCustom } from '/@/components/JVxeCustom';

import { Picker } from 'emoji-mart-vue-fast/src';
import { EmojiIndex } from "emoji-mart-vue-fast/src";
import data from "emoji-mart-vue-fast/data/apple.json";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';

export async function registerThirdComp(app: App) {
  // 注册 JVxeTable 组件
  registerJVxeTable(app);
  // 注册 JVxeTable 自定义组件
  await registerJVxeCustom();
  //---------------------------------------------------------------------
  // 注册全局聊天表情包
  app.component('Picker', Picker);
  let myEmojiIndex = new EmojiIndex(data, {
    function() {
      return true;
    },
    exclude:['recent','people','nature','foods','activity','places','objects','symbols','flags']
  });
  app.config.globalProperties.$globalEmojiIndex = myEmojiIndex
  app.provide('$globalEmojiIndex', myEmojiIndex)
  //---------------------------------------------------------------------
  // 注册全局dayjs
  dayjs.locale('zh');
  dayjs.extend(relativeTime);
  dayjs.extend(customParseFormat);
  app.config.globalProperties.$dayjs = dayjs
  app.provide('$dayjs', dayjs)
  //---------------------------------------------------------------------
}
