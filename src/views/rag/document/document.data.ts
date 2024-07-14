import { BasicColumn, FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '主键',
    align: 'center',
    dataIndex: 'id',
    defaultHidden: true,
    width: 300,
  },
  {
    title: '所属数据集',
    align: 'center',
    dataIndex: 'dataset_id',
  },
  {
    title: '文档类型',
    align: 'center',
    dataIndex: 'document_type',
    customRender: ({ text }) => {
      return render.renderDict(text, 'datamodel_type');
    },
  },
  {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '元数据信息',
    align: 'center',
    dataIndex: 'meta_data',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return text == 1 ? '启用' : '禁用';
    },
  },
  {
    title: '简介描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '创建者',
    align: 'center',
    dataIndex: 'create_by',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'create_time',
    width: 200,
  },
  {
    title: '修改者',
    align: 'center',
    dataIndex: 'update_by',
  },
  {
    title: '修改时间',
    align: 'center',
    dataIndex: 'update_time',
    width: 200,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '文档类型',
    field: 'document_type',
    component: 'JSelectInput',
  },
  {
    label: '所属数据集',
    field: 'dataset_id',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectInput',
    // defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '所属数据集',
    field: 'dataset_id',
    required: false,
    component: 'ApiSelect',
  },
  {
    label: '文档类型',
    field: 'document_type',
    required: false,
    component: 'JSelectInput',
  },
  {
    label: '名称',
    field: 'name',
    required: false,
    component: 'Input',
  },
  {
    label: '元数据信息',
    field: 'meta_data',
    required: false,
    component: 'InputTextArea',
  },
  {
    label: '分段策略',
    field: 'chunk_strategy',
    required: false,
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status',
    required: true,
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
  {
    label: '简介描述',
    field: 'description',
    required: false,
    component: 'InputTextArea',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
