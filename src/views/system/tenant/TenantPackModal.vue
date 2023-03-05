<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" @ok="handleSubmit" width="800px" :showCancelBtn="false" :showOkBtn="false">
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <a-button preIcon="ant-design:plus-outlined" type="primary" @click="handleAdd" style="margin-right: 5px">新增 </a-button>
        <a-button
          v-if="selectedRowKeys.length > 0"
          preIcon="ant-design:delete-outlined"
          type="primary"
          @click="handlePackBatch"
          style="margin-right: 5px"
          >批量删除
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="getActions(record)" />
      </template>
    </BasicTable>
  </BasicModal>
  <TenantPackMenuModal @register="registerPackMenu" @success="success" />
</template>
<script lang="ts" setup name="tenant-pack-modal">
  import { ref, unref } from 'vue';
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { packColumns, userColumns, packFormSchema } from './tenant.data';
  import { getTenantUserList, leaveTenant, packList, deletePackPermissions } from './tenant.api';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicTable, TableAction } from '/@/components/Table';
  import TenantPackMenuModal from './TenantPackMenuModal.vue';
  import {Modal} from "ant-design-vue";

  const [registerPackMenu, { openModal }] = useModal();
  const tenantId = ref<number>(0);
  // 列表页面公共参数、方法
  const { prefixCls, tableContext } = useListPage({
    designScope: 'tenant-template',
    tableProps: {
      api: packList,
      columns: packColumns,
      immediate: false,
      formConfig: {
        schemas: packFormSchema,
        labelCol: {
          xxl: 8,
        },
        actionColOptions: {
          xs: 24,
          sm: 8,
          md: 8,
          lg: 8,
          xl: 8,
          xxl: 8,
        },
      },
      beforeFetch: (params) => {
        return Object.assign(params, { tenantId: unref(tenantId) });
      },
    },
  });
  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    tenantId.value = data.tenantId;
    success();
  });
  //设置标题
  const title = '租户产品包列表';

  //表单提交事件
  async function handleSubmit(v) {
    closeModal();
  }

  function getActions(record) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除租户产品包',
          confirm: handleDelete.bind(null, record.id),
        },
      },
    ];
  }

  /**
   * 成功
   */
  function success() {
    (selectedRowKeys.value = []) && reload();
  }

  /**
   * 编辑
   * @param record
   */
  async function handleEdit(record) {
    openModal(true, {
      isUpdate: true,
      record: record,
      tenantId: unref(tenantId)
    });
  }

  /**
   * 删除产品包
   * @param 删除
   */
  async function handleDelete(id) {
    await deletePackPermissions({ ids: id }, success);
  }

  /**
   * 批量删除产品包
   */
  async function handlePackBatch() {
    Modal.confirm({
      title: '删除租户产品包',
      content: '是否删除租户产品包',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await deletePackPermissions({ ids: selectedRowKeys.value.join(',')}, success);
      }
    })
  }

  /**
   *
   * 新增表单
   */
  function handleAdd() {
    openModal(true, {
      isUpdate: false,
      tenantId: unref(tenantId),
    });
  }
</script>
