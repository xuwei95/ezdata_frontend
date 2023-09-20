<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';

  // 解决日期时间国际化问题
  import 'dayjs/locale/zh-cn';
  // support Multi-language
  const { getAntdLocale } = useLocale();

  useTitle();
</script>
<style lang="less">
// update-begin--author:liaozhiyang---date:20230803---for：【QQYUN-5839】windi会影响到html2canvas绘制的图片样式
img{display:inline-block;}
// update-end--author:liaozhiyang---date:20230803---for：【QQYUN-5839】windi会影响到html2canvas绘制的图片样式
</style>
