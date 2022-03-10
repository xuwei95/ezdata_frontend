import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '日志内容',
    dataIndex: 'logContent',
    width: 100,
    align: 'left',
  },
  {
    title: '操作人ID',
    dataIndex: 'userid',
    width: 80,
  },
  {
    title: '操作人',
    dataIndex: 'username',
    width: 80,
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    width: 80,
  },
  {
    title: '耗时(毫秒)',
    dataIndex: 'costTime',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    width: 80,
  },
  {
    title: '操作类型',
    dataIndex: 'operateType_dictText',
    width: 40,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'keyWord',
    label: '搜索日志',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'fieldTime',
    component: 'RangePicker',
    label: '创建时间',
    colProps: {
      span: 8,
    },
  },
];
