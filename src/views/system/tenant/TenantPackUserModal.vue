<template>
  <BasicModal @register="registerModal" destroyOnClose :title="title" :width="1000" @ok="handleSubmit">
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #departNames="{ text, record }">
        <template v-if="text && text.length > 0">
          {{ getName(text) }}
        </template>
      </template>
      <template #positionNames="{ text, record }">
        <template v-if="text && text.length > 0">
          {{ getName(text) }}
        </template>
      </template>
      <template #tableTitle>
        <a-button preIcon="ant-design:usergroup-add-outlined" type="primary" @click="addUser">邀请成员</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <user-select-modal :multi="true" @register="registerUserModal" @selected="onSelected"></user-select-modal>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { tenantPackUserColumns } from './tenant.data';
  import { queryTenantPackUserList, deleteTenantPackUser, addTenantPackUser } from './tenant.api';
  import UserSelectModal from '/@/components/Form/src/jeecg/components/userSelect/UserSelectModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'TenantPackUserModal',
    components: { BasicModal, BasicTable, TableAction, UserSelectModal },
    setup() {
      //产品包信息
      const tenantPackData = reactive<any>({});
      //表单赋值
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: false });
        Object.assign(tenantPackData, data.record);
        await reload();
      });
      const { createMessage } = useMessage();
      //设置标题
      const title = ref<string>('用户');
      //注册table数据
      const { tableContext } = useListPage({
        tableProps: {
          api: queryTenantPackUserList,
          immediate: false,
          columns: tenantPackUserColumns,
          canResize: false,
          useSearchForm: false,
          beforeFetch: (params) => {
            params.tenantId = tenantPackData.tenantId;
            params.packId = tenantPackData.id;
            params.status = 1;
            return params;
          },
          actionColumn: {
            width: 120,
            fixed: 'right',
          },
        },
      });
      const [registerUserModal, { openModal: openUserModal, closeModal: closeUserModal }] = useModal();
      const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

      /**
       * 获取部门/职务名称
       * @param value
       */
      function getName(value) {
        return value.join(',');
      }

      /**
       * 表格操作列
       * @param record
       */
      function getTableAction(record) {
        const userStore = useUserStore();
        let username = userStore.getUserInfo.username;
        if (username != tenantPackData.createBy) {
        }
        return [
          {
            label: '移除',
            popConfirm: {
              title: '是否确认移除',
              confirm: handleDelete.bind(null, record),
            },
            ifShow: username == tenantPackData.createBy,
          },
          {
            label: '---',
            ifShow: username != tenantPackData.createBy,
          },
        ];
      }

      /**
       * 删除
       */
      async function handleDelete(record) {
        let params = {
          packId: record.packId,
          packName: record.packName,
          tenantId: record.tenantId,
          userId: record.id,
          realname: record.realname,
        };
        await deleteTenantPackUser(params);
        await reload();
      }

      /**
       * 添加用户弹窗
       */
      function addUser() {
        openUserModal(true, {
          list: [],
        });
      }

      /**
       * 邀请人回调事件
       * @param arr
       */
      async function onSelected(arr) {
        if (arr && arr.length > 0) {
          let names: any[] = [];
          let ids: any[] = [];
          for (let u of arr) {
            names.push(u.realname);
            ids.push(u.id);
          }
          console.log(tenantPackData);
          let params = {
            packId: tenantPackData.id,
            packName: tenantPackData.packName,
            tenantId: tenantPackData.tenantId,
            userId: ids.join(','),
            realname: names.join(','),
          };
          await addTenantPackUser(params);
          await reload();
        }
        closeUserModal();
      }

      return {
        title,
        registerModal,
        registerTable,
        rowSelection,
        getName,
        getTableAction,
        registerUserModal,
        addUser,
        onSelected,
      };
    },
  });
</script>

<style lang="less" scoped></style>
