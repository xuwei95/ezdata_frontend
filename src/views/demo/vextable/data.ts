import {BasicColumn} from '/@/components/Table';

export const columns: BasicColumn[] = [
    {
        title: '订单号',
        dataIndex: 'orderCode',
        width: 260,
    },
    {
        title: '订单类型',
        dataIndex: 'ctype',
        slots: {customRender: 'ctype'}
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

