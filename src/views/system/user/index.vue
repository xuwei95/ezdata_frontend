<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:表格上方-->
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
      <!--插槽:table标题-->
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
      <!--插槽:工具栏-->
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增</a-button>
        <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" :customRequest="handleUpload"  @change="handleImport">
          <a-button type="primary">导入</a-button>
        </a-upload>
        <a-button type="primary" @click="openModal(true)"> 回收站</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction
          :actions="getTableAction(record)"
          :dropDownActions="getDropDownAction(record)"
        />
      </template>
    </BasicTable>
    <!--用户抽屉-->
    <UserDrawer @register="registerDrawer" @success="handleSuccess"/>
    <!--回收站-->
    <user-recycle-bin-modal @register="registerModal" @success="reload"/>
  </div>
</template>

<script lang="ts" setup>
  //ts语法
  import {ref,computed} from 'vue';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import {list, getUserRoles, deleteUser,batchDeleteUser,customUpload} from './user.api';
  import {useDrawer} from '/@/components/Drawer';
  import {useModal} from '/@/components/Modal';
  import UserDrawer from './UserDrawer.vue';
  import UserRecycleBinModal from './UserRecycleBinModal.vue';
  import {columns, searchFormSchema} from './user.data';
  import {useUserStore} from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {Upload} from 'ant-design-vue';
  
  const AUpload = Upload;
  const userStore = useUserStore();
  const { createMessage } = useMessage();
  const checkedKeys = ref<Array<string | number>>([]);
  //注册drawer
  const [registerDrawer, {openDrawer}] = useDrawer();
  //注册model
  const [registerModal, {openModal}] = useModal();
  //注册table数据
  const [registerTable, {reload, updateTableDataRecord}] = useTable({
    title: '用户列表数据',
    api: list,
    rowKey: 'id',
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
    actionColumn: {
      width: 30,
      title: '操作',
      dataIndex: 'action',
      slots: {customRender: 'action'},
      fixed: undefined,
    },
  })
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
   * 导入header
   */
  const tokenHeader = computed(() => ({ 'X-Access-Token':userStore.getToken }));
  /**
   * 导入action
   */
  const importExcelUrl = computed(() => ('http://localhost:8080/jeecg-boot/sys/user/importExcel'));

  /**
   * 选择事件
   */
  function onSelectChange(selectedRowKeys: (string | number)[]) {
    checkedKeys.value = selectedRowKeys;
  }
  /**
   * 新增事件
   */
  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
    });
  }
  /**
   * 编辑事件
   */
  async function handleEdit(record: Recordable) {
    try {
      const userRoles = await getUserRoles({userid: record.id});
      if (userRoles && userRoles.length > 0) {
        record.selectedroles = userRoles;
      }
    } catch (e) {
      console.error(e)
    }
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }
  /**
   * 详情
  */
  async function handleDetail(record: Recordable) {
    try {
      const userRoles = await getUserRoles({userid: record.id});
      if (userRoles && userRoles.length > 0) {
        record.selectedroles = userRoles;
      }
    } catch (e) {
      console.error(e)
    }
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
    await deleteUser({id: record.id},reload);
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDeleteUser({ids: checkedKeys.value}, reload);
  }
  /**
   * 自定义上传
   */
  async function handleUpload(data) {
    const result = await customUpload({file: data.file});
    if(result.data.success){
      createMessage.success(result.data.message);
      reload()
    }
  }
  /**
   * 成功回调
   */
  function handleSuccess({isUpdate, values}) {
    if (isUpdate) {
      const result = updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }
  /**
   * 导入
   */
  function handleImport(info){
    console.log("handleImport>",info)
    if (info.file.status === 'done') {
      if (info.file.response.success) {
        reload()
      }
    }
  }
  /**
   * 操作栏
   */
  function getTableAction(record){
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
  function getDropDownAction(record){
    return [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },{
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

<style scoped>

</style>
