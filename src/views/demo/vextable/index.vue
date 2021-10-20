<template>
    <div class="p-4">
        <BasicTable @register="registerTable">
            <template #toolbar>
                <span style="padding-right: 5px;">新增方式:</span>
                <a-radio-group v-model:value="addType">
                    <a-radio :value="1">一对一</a-radio>
                    <a-radio :value="2">一对多</a-radio>
                    <a-radio :value="3">一对多(VexTable)</a-radio>
                </a-radio-group>
                <a-button type="primary" @click="handleCreate"> 新增</a-button>
            </template>
            <template #ctype="{ record }">
                <Tag color="green" v-if="record.ctype==1">
                    国内订单
                </Tag>
                <Tag color="red" v-if="record.ctype==2">
                    国际订单
                </Tag>
            </template>
            <template #action="{ record }">
                <TableAction :actions="getAction(record)" :dropDownActions="getDropDownActions(record)"/>
            </template>
        </BasicTable>
        <!--        <TableDrawer @register="registerDrawer" @success="handleSuccess" />-->
        <TableModal @register="registerModal"/>
        <VexTableModal @register="registerVexTableModal"></VexTableModal>
        <OneToOneModal @register="registerOneToOneModal"></OneToOneModal>
    </div>
</template>
<script lang="ts">
    import {defineComponent, ref} from 'vue';
    import {BasicTable, useTable, BasicColumn, TableAction} from '/@/components/Table';
    import {useDrawer} from '/@/components/Drawer';

    import {getDemoTableListByPage} from '/@/api/demo/system';
    import TableDrawer from './drawer.vue';
    import TableModal from './modal.vue';
    import VexTableModal from './VexTableModal.vue';
    import OneToOneModal from './OneToOneModal.vue';
    import {useModal} from "/@/components/Modal";

    const columns: BasicColumn[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            fixed: 'left',
            width: 100,
        },
        {
            title: '订单号',
            dataIndex: 'orderCode',
            width: 260,
        },
        {
            title: '订单类型',
            dataIndex: 'ctype',
            slots: { customRender: 'ctype' }
        },
        {
            title: '订单日期',
            dataIndex: 'orderDate',
            width: 300,
        },
        {
            title: '订单金额',
            width: 200,
            dataIndex: 'orderMoney',
        },
        {
            title: '订单备注',
            width: 200,
            dataIndex: 'content',
        }
    ];
    export default defineComponent({
        components: {BasicTable, TableAction, TableDrawer, TableModal, VexTableModal, OneToOneModal},
        setup() {
            const addType = ref<number>(1);
            const [registerDrawer, {openDrawer}] = useDrawer();
            const [registerModal, {openModal}] = useModal();
            const [registerVexTableModal, {openModal: openVexTableModal}] = useModal();
            const [registerOneToOneModal, {openModal: openOneToOneModal}] = useModal();
            //定义表格行操作
            const getAction = (record) => {
                return [{
                    label: '编辑',
                    onClick: handleEidt.bind(null, record),
                }]
            }
            const getDropDownActions = (record) => {
                return [
                    {
                        label: '删除',
                        auth: 'super',
                        popConfirm: {
                            title: '是否删除？',
                            confirm: handleOpen.bind(null, record),
                        },
                    },
                ]
            }
            //定义表格属性
            const [registerTable] = useTable({
                title: '表格功能示例',
                api: getDemoTableListByPage,
                columns: columns,
                rowSelection: {type: 'radio'},
                bordered: true,
                actionColumn: {
                    width: 160,
                    title: '操作',
                    dataIndex: 'action',
                    slots: {customRender: 'action'},
                },
            });

            //添加事件
            function handleCreate() {
                let type = addType.value;
                if (type == 1) {
                    openOneToOneModal(true, {
                        isUpdate: false,
                    });
                }
                if (type == 2) {
                    openModal(true, {
                        isUpdate: false,
                    });
                }
                if (type == 3) {
                    openVexTableModal(true, {
                        isUpdate: false,
                    });
                }
            }

            //编辑事件
            function handleEidt(record: Recordable) {
                let type = addType.value;
                if (type == 1) {
                    openOneToOneModal(true, {
                        record,
                        isUpdate: true,
                    });
                }
                if (type == 2) {
                    openModal(true, {
                        record,
                        isUpdate: true,
                    });
                }
                if (type == 3) {
                    openVexTableModal(true, {
                        record,
                        isUpdate: true,
                    });
                }
            }

            function handleOpen(record: Recordable) {
                console.log('点击了启用', record);
            }

            return {
                addType,
                getAction,
                getDropDownActions,
                registerTable,
                registerDrawer,
                registerModal,
                registerVexTableModal,
                handleEidt,
                registerOneToOneModal,
                handleCreate,
                handleOpen,
            };
        },
    });
</script>
