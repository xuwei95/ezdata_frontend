<template>
    <div>
        <BasicTable @register="registerTable" :searchInfo="searchInfo">
            <template #tableTitle>
                <a-button type="primary" @click="handlerReadAllMsg">全部标注已读</a-button>
            </template>
            <template #action="{ record }">
                <TableAction :actions="getActions(record)"/>
            </template>
        </BasicTable>
        <DetailModal @register="register"/>
    </div>
</template>
<script lang="ts" name="monitor-mynews" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import DetailModal from './DetailModal.vue';
  import { getMyNewsList,editCementSend,syncNotic,readAllMsg} from './mynews.api';
  import { columns, searchFormSchema } from './mynews.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getToken } from '/@/utils/auth';
  import { useModal } from '/@/components/Modal';
  import { useGlobSetting } from '/@/hooks/setting';
  const glob = useGlobSetting();
  const { createMessage } = useMessage();
  const checkedKeys = ref<Array<string | number>>([]);
  const content = ref({});
  const searchInfo = { logType: '1' };
  const [register, {openModal:openDetail}] = useModal();
  import { useListPage } from '/@/hooks/system/useListPage'
  import { getLogList } from '/@/views/monitor/log/log.api';

  const { prefixCls,tableContext } = useListPage({
    designScope: 'mynews-list',
    tableProps: {
      title: '我的消息',
      api: getMyNewsList,
      columns: columns,
      formConfig: {
        schemas:searchFormSchema,
        fieldMapToTime: [['fieldTime', ['createTime_begin', 'createTime_end'], 'YYYY-MM-DD HH:mm:ss']],
      },
    }
  })
  const [registerTable, { reload }] = tableContext;
  /**
   * 操作列定义
   * @param record
   */
  function getActions(record) {
    return [
      {
        label: '查看',
        onClick: handleDetail.bind(null, record),
      },
    ]
  }

  /**
   * 查看
   */
  function handleDetail(record) {
    let anntId=record.anntId;
    editCementSend({anntId:anntId}).then((res)=>{
        reload();
        syncNotic({anntId:anntId})
    });
    openDetail(true, {
      record,
      isUpdate: true,
    });
  }
  // 日志类型
  function callback(key) {
    searchInfo.logType = key;
    reload();
  }

  //全部标记已读
  function handlerReadAllMsg() {
    readAllMsg({},reload);
  }

  /**
   * 选择事件
   */
  function onSelectChange(selectedRowKeys: (string | number)[]) {
    checkedKeys.value = selectedRowKeys;
  }

</script>
