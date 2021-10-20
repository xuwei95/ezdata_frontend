<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="用户回收站" :showOkBtn="false" width="50%" destroyOnClose>
    <BasicTable @register="registerTable">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction
          :actions="getTableAction(record)"
        />
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import {defineEmits} from 'vue';
  import {BasicModal, useModalInner} from '/@/components/Modal';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import {columns} from './user.data';
  import {getRecycleBinList, putRecycleBin, deleteRecycleBin} from './user.api';
  // 获取emit
  const emit = defineEmits(['success', 'register']);
  const [registerModal, {setModalProps, closeModal}] = useModalInner();
  //注册table数据
  const [registerTable, {reload}] = useTable({
    api: getRecycleBinList,
    columns,
    useSearchForm: false,
    showTableSetting: false,
    bordered: true,
    showIndexColumn: false,
    pagination: false,
    maxHeight: 200,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      slots: {customRender: 'action'},
      fixed: undefined,
    },
  })
  //还原
  async function handleRevert(record) {
    const result = await putRecycleBin({userIds: record.id})
    if (result.success) {
      reload();
      emit('success')
    }
  }
  //删除
  async function handleDelete(record) {
    await deleteRecycleBin({userIds: record.id},reload)
  }
  //获取操作栏事件
  function getTableAction(record) {
    return [
      {
        icon: 'ant-design:redo-outlined',
        onClick: handleRevert.bind(null, record),
      },
      {
        icon: 'ant-design:delete-outlined',
        color: 'error',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      }
    ]
  }
   
</script>
