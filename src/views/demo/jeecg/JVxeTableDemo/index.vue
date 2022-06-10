<template>
  <PageWrapper>
    <a-card :bordered="false">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="基础示例" key="1">
          <JVxeDemo1 />
        </a-tab-pane>
        <a-tab-pane tab="高级示例" key="2">
          <JVxeDemo2 />
        </a-tab-pane>
        <a-tab-pane tab="排序示例" key="3">
          <JVxeDemo3 />
        </a-tab-pane>
        <a-tab-pane tab="联动示例" key="4">
          <JVxeDemo4 />
        </a-tab-pane>
        <a-tab-pane tab="键盘操作" key="5">
          <JVxeDemo5 />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </PageWrapper>
</template>

<script lang="ts" setup>
  // noinspection ES6UnusedImports
  import { PageWrapper } from '/@/components/Page';
  import JVxeDemo1 from './JVxeDemo1.vue';
  import JVxeDemo2 from './JVxeDemo2.vue';
  import JVxeDemo3 from './JVxeDemo3.vue';
  import JVxeDemo4 from './JVxeDemo4.vue';
  import JVxeDemo5 from './JVxeDemo5.vue';
</script>
