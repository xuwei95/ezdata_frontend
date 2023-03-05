<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:plus-outlined"  @click="handleCreate"> 新增</a-button>
        <JThirdAppButton biz-type="user" :selected-row-keys="selectedRowKeys" syncToApp syncToLocal @sync-finally="onSyncFinally" />
        <a-button type="primary" @click="openQuitModal(true, {})" preIcon="ant-design:user-delete-outlined">离职信息</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
    </BasicTable>
    <!--用户抽屉-->
    <UserDrawer @register="registerDrawer" @success="handleSuccess" />
    <!-- 离职受理人弹窗 -->
    <UserQuitAgentModal @register="registerQuitAgentModal" @success="reload" />
    <!-- 离职人员列弹窗 -->
    <UserQuitModal @register="registerQuitModal" @success="reload" />
  </div>
</template>

<script lang="ts" name="tenant-system-user" setup>
  //ts语法
  import { unref } from 'vue';
  import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
  import UserDrawer from './UserDrawer.vue';
  import JThirdAppButton from '/@/components/jeecg/thirdApp/JThirdAppButton.vue';
  import UserQuitAgentModal from './UserQuitAgentModal.vue';
  import UserQuitModal from './UserQuitModal.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, searchFormSchema } from './user.data';
  import { list , deleteUser, batchDeleteUser, getImportUrl, getExportUrl, frozenBatch, syncUser, getUserTenantPageList, updateUserTenantStatus } from './user.api';
  // import { usePermission } from '/@/hooks/web/usePermission'
  // const { hasPermission } = usePermission();
  import { userTenantColumns, userTenantFormSchema } from './user.data';
  import { useUserStore } from '/@/store/modules/user';

  const { createMessage, createConfirm } = useMessage();

  //注册drawer
  const [registerDrawer, { openDrawer }] = useDrawer();
  //离职代理人model
  const [registerQuitAgentModal, { openModal: openQuitAgentModal }] = useModal();
  //离职用户列表model
  const [registerQuitModal, { openModal: openQuitModal }] = useModal();
  const userStore = useUserStore();
  const createBy = userStore.getUserInfo.username;

  // 列表页面公共参数、方法
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    designScope: 'user-list',
    tableProps: {
      title: '租户用户列表',
      api: getUserTenantPageList,
      columns: userTenantColumns,
      size: 'small',
      formConfig: {
        schemas: userTenantFormSchema,
      },
      actionColumn: {
        width: 120,
      },
      beforeFetch: (params) => {
        params['userTenantStatus'] = '1,3,4';
        return Object.assign({ column: 'createTime', order: 'desc' }, params);
      },
    },
  });

  //注册table数据
  const [registerTable, { reload, updateTableDataRecord }, { rowSelection, selectedRows, selectedRowKeys }] = tableContext;

  /**
   * 新增事件
   */
  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 编辑事件
   */
  async function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  async function handleDetail(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }

  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
  }

  /**
   *同步钉钉和微信回调
   */
  function onSyncFinally({ isToLocal }) {
    // 同步到本地时刷新下数据
    if (isToLocal) {
      reload();
    }
  }

  /**
   * 操作栏
   */
  function getTableAction(record): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        // ifShow: () => hasPermission('system:user:edit'),
      },
    ];
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record): ActionItem[] {
    return [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
      {
        label: '离职',
        onClick: handleQuit.bind(null, record.username),
        //update-begin---author:wangshuai ---date:20230130  for：[QQYUN-3974]租户的创建人 不应该有离职按钮------------
        ifShow: () =>{
          return record.username!== record.createBy;
        }
        //update-end---author:wangshuai ---date:20230130  for：[QQYUN-3974]租户的创建人 不应该有离职按钮------------
      },
      {
        label: '同意',
        onClick: updateStatus.bind(null, record.id, '1'),
        ifShow: () => {
          return (record.status === '3' || record.status === '4') && record.createBy === createBy;
        },
      },
      {
        label: '拒绝',
        popConfirm: {
          title: '是否确认拒绝',
          confirm: updateStatus.bind(null, record.id, '4'),
        },
        ifShow: () => {
          return record.status === '3' && record.createBy === createBy;
        },
      },
    ];
  }

  /**
   * 离职
   * @param userName
   */
  function handleQuit(userName) {
    //打开离职代理人弹窗
    openQuitAgentModal(true, { userName });
  }

  /**
   * 更新用户租户状态
   * @param id
   * @param status
   */
  function updateStatus(id, status) {
    updateUserTenantStatus({ userId: id, status: status })
      .then((res) => {
        if (res.success) {
          handleSuccess();
        }
      })
      .catch((e) => {
        createMessage.warning(e.message);
      });
  }
</script>

<style scoped></style>
