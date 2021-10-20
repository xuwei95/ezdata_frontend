<template>
    <div>
        <BasicTable @register="registerTable" :rowSelection="rowSelection">
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
                <a-button type="primary" @click="handleAdd">新增</a-button>
            </template>
            <template #action="{ record }">
                <TableAction :actions="getActions(record)"/>
            </template>
        </BasicTable>
        <TenantModal @register="registerModal" @success="reload"/>
    </div>
</template>
<script lang="ts" setup>
    import {ref} from 'vue';
    import {BasicTable, useTable, TableAction} from '/@/components/Table';
    import {useModal} from '/@/components/Modal';
    import {getTenantList, deleteTenant, batchDeleteTenant} from './tenant.api';
    import {columns, searchFormSchema} from './tenant.data';
    import TenantModal from './TenantModal.vue';
    import {useMessage} from "/@/hooks/web/useMessage";

    const {createMessage} = useMessage();
    const [registerModal, {openModal}] = useModal();
    const checkedKeys = ref<Array<string | number>>([]);

    const [registerTable, {reload}] = useTable({
        title: '租户列表',
        api: getTenantList,
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
     * 操作列定义
     * @param record
     */
    function getActions(record) {
        return [
            {
                icon: 'ant-design:edit',
                onClick: handleEdit.bind(null, record),
            },
            {
                icon: 'ant-design:delete-outlined',
                popConfirm: {
                    arrowPointAtCenter: 'LT',
                    title: '是否确认删除',
                    confirm: handleDelete.bind(null, record),
                },
            },
        ]
    }

    /**
     * 选择事件
     */
    function onSelectChange(selectedRowKeys: (string | number)[]) {
        checkedKeys.value = selectedRowKeys;
    }

    /**
     * 新增事件
     */
    function handleAdd() {
        openModal(true, {
            isUpdate: false,
        });
    }

    /**
     * 编辑事件
     */
    function handleEdit(record) {
        openModal(true, {
            record,
            isUpdate: true,
        });
    }

    /**
     * 删除事件
     */
    async function handleDelete(record) {
        await deleteTenant({id: record.id}, reload);
    }

    /**
     * 批量删除事件
     */
    async function batchHandleDelete() {
        await batchDeleteTenant({ids: checkedKeys.value}, reload);
    }
</script>
