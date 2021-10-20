<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" :rowSelection="rowSelection" class="w-4/4 xl:w-5/5">
      <template #headerTop>
        <a-alert type="success" show-icon class="alert">
          <template #message>
            <template v-if="checkedKeys.length > 0">
              <span>已选中{{ checkedKeys.length }}条记录(可跨页)</span>
              <a-button type="link" @click="checkedKeys = []" size="small">清空</a-button>
            </template>
            <template v-else>
              <span>未选中任何项目</span>
            </template>
          </template>
        </a-alert>
      </template>
      <template #tableTitle>
        <a-dropdown v-if="checkedKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined"></Icon>
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button>批量操作
            <Icon icon="ant-design:down-outlined"></Icon>
          </a-button>
        </a-dropdown>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增角色</a-button>
        <a-button type="primary" @click="handleExportXls"> 导出</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="getTableAction(record)"
          :dropDownActions="getDropDownAction(record)"
        />
      </template>
    </BasicTable>
    <RoleDrawer @register="registerDrawer" @success="reload"/>
    <user-role-drawer @register="registerDrawer1"></user-role-drawer>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import {ref} from 'vue'
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import {list, deleteRole, batchDeleteRole, exportXls} from './role.api';
  import {useDrawer} from '/@/components/Drawer';
  import {PageWrapper} from '/@/components/Page';
  import RoleDrawer from './RoleDrawer.vue';
  import UserRoleDrawer from './UserRoleDrawer.vue';
  import {columns, searchFormSchema} from './role.data';
  const checkedKeys = ref<Array<string | number>>([]);
  const [registerDrawer, {openDrawer}] = useDrawer();
  const [registerDrawer1, {openDrawer: openUserRoleDrawer}] = useDrawer();
  const [registerTable, {reload}] = useTable({
    title: '角色列表',
    api: list,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    striped: true,
    useSearchForm: true,
    showTableSetting: true,
    clickToRowSelect: false,
    bordered: true,
    showIndexColumn: false,
    tableSetting: {fullScreen: true},
    canResize: false,
    rowKey: 'id',
    actionColumn: {
      width: 30,
      title: '操作',
      dataIndex: 'action',
      slots: {customRender: 'action'},
      fixed: undefined,
    },
  });
  /**
   * 选择列配置
   */
  const rowSelection = {
    type: 'checkbox',
    columnWidth: 20,
    selectedRowKeys: checkedKeys,
    onChange: onSelectChange
  }
  /**
   * 选择事件
   */
  function onSelectChange(selectedRowKeys: (string | number)[]) {
    checkedKeys.value = selectedRowKeys;
  }
  /**
   * 新增
   */
  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
    });
  }
  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }
  /**
   * 详情
   */
  async function handleDetail(record) {
    openDrawer(true, {
      record,
      isUpdate: true,
      hideFooter: true,
    });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteRole({id: record.id}, reload);
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDeleteRole({ids: checkedKeys.value}, reload);
  }
  /**
   * 导出
   */
  async function handleExportXls() {
    let fileName = '角色列表';
    await exportXls(fileName);
  }
  /**
   * 授权弹窗
   */
  function handlePerssion(record) {
    openUserRoleDrawer(true, {roleId: record.id});
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        icon: 'clarity:note-edit-line',
        onClick: handleEdit.bind(null, record),
      }
    ]
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    return [
      {
        label: '授权',
        onClick: handlePerssion.bind(null, record),
      },
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      }, {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      }
    ]
  }

</script>
