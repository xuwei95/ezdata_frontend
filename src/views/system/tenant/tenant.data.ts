import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';

export const columns: BasicColumn[] = [
    {
        title: '租户名称',
        dataIndex: 'name',
        width: 70,
        align: 'left',
    },
    {
        title: '租户编号',
        dataIndex: 'id',
        width: 30,
    },
    {
        title: '开始时间',
        dataIndex: 'beginDate',
        width: 40,
    },
    {
        title: '结束时间',
        dataIndex: 'endDate',
        width: 40
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 40,
    },
    {
        title: '状态',
        dataIndex: 'status_dictText',
        width: 20
    }
];

export const searchFormSchema: FormSchema[] = [
    {
        field: 'name',
        label: '租户名称',
        component: 'Input',
        colProps: {span: 8},
    },
    {
        field: 'status',
        label: '状态',
        component: 'Select',
        componentProps: {
            options: [
                {label: '启用', value: 1},
                {label: '停用', value: 0},
            ],
        },
        colProps: {span: 8},
    },
];

export const formSchema: FormSchema[] = [
    {
        field: 'name',
        label: '租户名称',
        component: 'Input',
        required: true,
        componentProps: {
            placeholder: '请输入租户名称',
        }
    },
    {
        field: 'id',
        label: '租户编号',
        component: 'InputNumber',
        required: true,
        componentProps: {
            placeholder: '请输入编号',
        }
    },
    {
        field: 'beginDate',
        label: '开始时间',
        component: 'DatePicker',
        componentProps: {
            showTime:true,
            valueFormat:'YYYY-MM-DD HH:mm:ss',
            placeholder: '请选择开始时间',
        }
    },
    {
        field: 'endDate',
        label: '结束时间',
        component: 'DatePicker',
        componentProps: {
            showTime:true,
            valueFormat:'YYYY-MM-DD HH:mm:ss',
            placeholder: '请选择结束时间',
        }
    },
    {
        field: 'status',
        label: '状态',
        component: 'RadioButtonGroup',
        defaultValue: 1,
        componentProps: {
            options: [
                {label: '正常', value: 1},
                {label: '冻结', value: 0},
            ],
        },
    },
];
