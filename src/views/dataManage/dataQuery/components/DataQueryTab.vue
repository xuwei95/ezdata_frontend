<template>
  <div class="query-panel">
    <ModelQuery ref="queryRef" :data="queryInfo" />
  </div>
  <a-tabs defaultActiveKey="data-table">
    <a-tab-pane tab="数据表格" key="data-table" style="position: relative">
      <JVxeTable
        ref="tableRef"
        toolbar
        resizable
        maxHeight="600"
        :toolbarConfig="{ btn: [] }"
        :loading="loading"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        @pageChange="handlePageChange"
      >
        <template #toolbarSuffix>
          <a-button @click="fetchData(false)" style="float: right" preIcon="ant-design:search-outlined">查询</a-button>
          <a-button @click="copyQuery" style="float: right" preIcon="ant-design:copy-outlined">复制查询条件</a-button>
          <a-button :loading="loading" @click="outputData" style="float: right" preIcon="ant-design:export-outlined">导出数据</a-button>
        </template>
      </JVxeTable>
    </a-tab-pane>
    <a-tab-pane tab="数据对话" key="data-chat" style="position: relative" v-if="hasPermission(['llm:data:chat'])">
      <DataChat :genQuery="genQuery" />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
  import { watch, ref, unref, onMounted, reactive } from 'vue';
  import { JVxeTypes, JVxeColumn, JVxeTableInstance } from '/@/components/jeecg/JVxeTable/types';
  import { queryData } from '../dataquery.api';
  import ModelQuery from './modelQuery.vue';
  import DataChat from './DataChat/index.vue';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneObject } from '/@/utils';
  import { parseTableRecords } from '/@/utils/common_utils';
  import { useMethods } from '/@/hooks/system/useMethods';
  import { usePermission } from '@/hooks/web/usePermission';
  const { handleExportExcel } = useMethods();
  const { createMessage } = useMessage();
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const { hasPermission } = usePermission();
  const tableRef = ref<JVxeTableInstance>();
  const queryRef = ref(null);
  const props = defineProps({
    data: { type: Object, default: () => ({}) },
    rootTreeData: { type: Array, default: () => [] },
  });
  const loading = ref<boolean>(false);
  const model = ref<object>({}); // 模型数据
  const columns = ref<JVxeColumn[]>([]); // 字段列表
  const dataSource = ref<any[]>([]); // 数据列表
  const modelFields = ref<any[]>([]); // 模型字段列表
  const queryInfo = reactive({
    extract_rules: [], // 筛选规则列表
    search_type_list: [], // 高级查询列表
    fields: [], //  字段列表
  }); // 查询配置
  const pagination = reactive({
    current: 1,
    pageSize: 100,
    pageSizeOptions: ['100', '500', '1000', '2000', '5000', '10000'],
    total: 0,
  });
  // 初始化查询配置
  function initData() {
    columns.value = [];
    dataSource.value = [];
    queryInfo.extract_rules = [];
    queryInfo.search_type_list = [];
    queryInfo.fields = [];
    pagination.pageSize = 100;
    pagination.current = 1;
  }
  /** 获取值，忽略表单验证 */
  // 当分页参数变化时触发的事件
  async function handlePageChange(event) {
    console.log(event);
    // 重新赋值
    pagination.current = event.current;
    pagination.pageSize = event.pageSize;
    // 查询数据
    await fetchData(false);
  }
  // 导出excel
  async function outputData() {
    console.log(dataSource.value);
    handleExportExcel('数据导出结果_' + Date.now() + '.xlsx', dataSource.value);
  }
  // 获取查询结构
  async function genQuery(include_id = true) {
    const extract_info = cloneObject(queryRef.value.genQuery());
    extract_info['page'] = pagination.current;
    extract_info['pagesize'] = pagination.pageSize;
    if (include_id) {
      extract_info['id'] = model.value.id;
    }
    console.log('query', extract_info);
    return extract_info;
  }
  // 复制查询条件
  async function copyQuery() {
    // queryRef
    const extract_info = await genQuery(false);
    const value = unref(JSON.stringify(extract_info));
    if (!value) {
      createMessage.warning('请输入要复制的内容！');
      return;
    }
    clipboardRef.value = value;
    if (unref(copiedRef)) {
      createMessage.success('复制成功！');
    }
  }
  // 查询模型数据
  async function fetchData(is_init = false) {
    // queryRef
    const extract_info = await genQuery(true);
    loading.value = true;
    try {
      const res_data = await queryData(extract_info);
      if (res_data) {
        pagination.total = res_data.total;
        dataSource.value = parseTableRecords(res_data.records);
        // 重置字段列表
        let fields = res_data.fields;
        columns.value = [];
        for (let i in fields) {
          let field = fields[i];
          columns.value.push({
            title: field,
            key: field,
            type: JVxeTypes.normal,
            width: 240,
          });
        }
        if (is_init) {
          // 重置筛选规则列表, 高级查询列表
          queryInfo.extract_rules = res_data.extract_rules || [];
          queryInfo.search_type_list = res_data.search_type_list || [];
          queryInfo.fields = res_data.fields || [];
          console.log(7, queryInfo);
        }
      } else {
        console.log('error', res_data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      loading.value = false;
    }
  }
  // 监听 data 变化
  onMounted(() => {
    watch(
      () => props.data,
      async () => {
        let record = unref(props.data);
        if (typeof record !== 'object') {
          record = {};
        }
        if (record.id) {
          model.value = record;
          modelFields.value = record.fields;
          await initData();
          await fetchData(true);
        }
      },
      { deep: true, immediate: true }
    );
  });
</script>

<style>
  .query-panel {
    min-height: 55px;
  }
</style>
