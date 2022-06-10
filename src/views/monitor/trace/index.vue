<template>
  <div class="p-4">
    <BasicTable @register="registerTable" :dataSource="dataSource">
      <template #tableTitle>
        <div slot="message">
          共追踪到 {{ dataSource.length }} 条近期HTTP请求记录
          <a-divider type="vertical" />
          <a @click="loadDate">立即刷新</a>
        </div>
      </template>
      <template #timeTaken="{ record, text }">
        <a-tag v-if="text < 500" color="green">{{ text }} ms</a-tag>
        <a-tag v-else-if="text < 1000" color="cyan">{{ text }} ms</a-tag>
        <a-tag v-else-if="text < 1500" color="orange">{{ text }} ms</a-tag>
        <a-tag v-else color="red">{{ text }} ms</a-tag>
      </template>

      <template #responseStatus="{ record, text }">
        <a-tag v-if="text < 200" color="pink">{{ text }}</a-tag>
        <a-tag v-else-if="text < 201" color="green">{{ text }}</a-tag>
        <a-tag v-else-if="text < 399" color="cyan">{{ text }}</a-tag>
        <a-tag v-else-if="text < 403" color="orange">{{ text }}</a-tag>
        <a-tag v-else-if="text < 501" color="red">{{ text }}</a-tag>
        <span v-else>{{ text }}</span>
      </template>
      <template #requestMethod="{ record, text }">
        <a-tag v-if="text === 'GET'" color="#87d068">{{ text }}</a-tag>
        <a-tag v-else-if="text === 'POST'" color="#2db7f5">{{ text }}</a-tag>
        <a-tag v-else-if="text === 'PUT'" color="#ffba5a">{{ text }}</a-tag>
        <a-tag v-else-if="text === 'DELETE'" color="#f50">{{ text }}</a-tag>
        <span v-else>{{ text }} ms</span>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" name="monitor-trace" setup>
  import { onMounted, ref, reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getActuatorList } from './trace.api';
  import { columns } from './trace.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  const dataSource = ref([]);
  const { createMessage } = useMessage();

  const [registerTable, { reload }] = useTable({
    columns,
    showIndexColumn: false,
    bordered: true,
    rowKey: 'id',
  });

  function loadDate() {
    getActuatorList().then((res) => {
      let filterData = [];
      for (let d of res.traces) {
        if (d.request.method !== 'OPTIONS' && d.request.uri.indexOf('httptrace') === -1) {
          filterData.push(d);
        }
      }
      dataSource.value = filterData;
    });
  }

  onMounted(() => {
    loadDate();
  });
</script>
