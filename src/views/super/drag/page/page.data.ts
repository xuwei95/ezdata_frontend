import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
  },
];
export const searchFormSchema: FormSchema[] = [
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 6 },
  },
];

export const formSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    required: true,
  },
  {
    label: '封面图',
    field: 'coverUrl',
    component: 'JImageUpload',
    componentProps: {
      fileMax: 1,
    },
  },
  {
    label: '分类',
    field: 'type',
    component: 'Select',
    defaultValue: '1',
    required: true,
    componentProps: {
      options: [
        {
          label: '仪表盘设计',
          value: '1',
          key: '1',
        },
        {
          label: '门户设计器',
          value: '2',
          key: '2',
        }
      ]
    }
  },
  {
    label: '保护码',
    field: 'protectionCode',
    component: 'StrengthMeter'
  }
];
