<template>
  <a-row :class="['p-4', `${prefixCls}--box`]" type="flex" :gutter="10">
    <a-col :xl="4" :lg="6" :md="6" :sm="24" style="margin-bottom: 10px">
      <DataLeftTree ref="leftTree" @select="onTreeSelect" @rootTreeData="onRootTreeData" />
    </a-col>
    <a-col :xl="20" :lg="18" :md="18" :sm="24" style="margin-bottom: 10px">
      <div style="height: 100%; background-color: white">
        <a-tabs defaultActiveKey="data-query">
          <a-tab-pane tab="基本信息" key="base-info" style="position: relative">
            <div style="padding: 20px">
              <DataFormTab :data="modelData" />
            </div>
          </a-tab-pane>
          <a-tab-pane tab="数据查询" key="data-query">
            <div style="padding: 0 20px 20px">
              <DataQueryTab :data="modelData" />
            </div>
          </a-tab-pane>
          <a-tab-pane tab="数据接口" key="data-interface">
            <div style="padding: 0 20px 20px">
              <DataInterFaceTab :data="modelData" />
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup name="data-model-query">
  import { provide, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getInfoById } from './dataquery.api';
  import DataLeftTree from './components/DataLeftTree.vue';
  import DataFormTab from './components/DataInfoTab.vue';
  import DataQueryTab from './components/DataQueryTab.vue';
  import DataInterFaceTab from './components/DataInterFaceTab/index.vue';

  const { prefixCls } = useDesign('model-query');
  provide('prefixCls', prefixCls);

  // 给子组件定义一个ref变量
  const leftTree = ref();

  // 当前选中
  const modelData = ref({});
  const rootTreeData = ref<any[]>([]);

  // 左侧树选择后触发
  async function onTreeSelect(data) {
    console.log('onTreeSelect: ', data);
    if (data.type == 'datasource') {
      console.log('select source', data);
    } else {
      const res_data = await getInfoById({ id: data.value });
      if (res_data) {
        modelData.value = res_data;
      } else {
        console.log('error', res_data);
      }
    }
  }

  // 左侧树rootTreeData触发
  function onRootTreeData(data) {
    rootTreeData.value = data;
  }
</script>

<style lang="less">
  @import './index.less';
</style>
