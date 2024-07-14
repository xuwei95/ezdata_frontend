import { BasicColumn, FormSchema } from '/@/components/Table';
import { allList as allDataSourceList } from '@/views/dataManage/dataSource/datasource.api';
import { allList as allDataModelList } from '@/views/dataManage/dataModel/datamodel.api';
import { allList as allDocumentList } from '../document/document.api';
import { allList as allDataSetList } from '../document/document.api';

// 定义一个函数来获取映射
const [dataSourceList, dataModelList, documentList, dataSetList] = await Promise.all([
  allDataSourceList({}),
  allDataModelList({}),
  allDocumentList({}),
  allDataSetList({}),
]);

const dataSourceMap = new Map(dataSourceList.map((item) => [item.id, item.name]));
const dataModelMap = new Map(dataModelList.map((item) => [item.id, item.name]));
const documentMap = new Map(documentList.map((item) => [item.id, item.name]));
const dataSetMap = new Map(dataSetList.map((item) => [item.id, item.name]));

// 定义列
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    align: 'center',
    dataIndex: 'id',
    defaultHidden: true,
    width: 300,
  },
  {
    title: '内容',
    align: 'center',
    dataIndex: 'content',
    width: 600,
  },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'chunk_type',
    customRender: ({ text }) => {
      return text == 'qa' ? '问答对' : '知识段';
    },
  },
  {
    title: '所属数据集',
    align: 'center',
    dataIndex: 'dataset_id',
    customRender: ({ text }) => {
      return dataSetMap.get(text) || text;
    },
  },
  {
    title: '所属文档',
    align: 'center',
    dataIndex: 'document_id',
    customRender: ({ text }) => {
      return documentMap.get(text) || text;
    },
  },
  {
    title: '所属数据源',
    align: 'center',
    dataIndex: 'datasource_id',
    customRender: ({ text }) => {
      return dataSourceMap.get(text) || text;
    },
  },
  {
    title: '所属数据模型',
    align: 'center',
    dataIndex: 'datamodel_id',
    customRender: ({ text }) => {
      return dataModelMap.get(text) || text;
    },
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return text == 1 ? '已同步' : '未同步';
    },
  },
  {
    title: '标记状态',
    align: 'center',
    dataIndex: 'star_flag',
    customRender: ({ text }) => {
      return text == 1 ? '已标记' : '未标记';
    },
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
  },
  {
    title: '简介描述',
    align: 'center',
    dataIndex: 'description',
  },
];

//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '关键词',
    field: 'content',
    component: 'Input',
  },
  {
    label: '类型',
    field: 'chunk_type',
    component: 'JSelectInput',
    // defaultValue: '知识段',
    componentProps: {
      options: [
        { label: '知识段', value: 'chunk' },
        { label: '问答对', value: 'qa' },
      ],
    },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectInput',
    // defaultValue: 1,
    componentProps: {
      options: [
        { label: '已同步', value: 1 },
        { label: '未同步', value: 0 },
      ],
    },
  },
  {
    label: '所属文档',
    field: 'document_id',
    component: 'ApiSelect',
    componentProps: {
      api: allDocumentList,
      params: {},
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    label: '所属数据模型',
    field: 'datamodel_id',
    component: 'ApiSelect',
    componentProps: {
      api: allDataModelList,
      params: {},
      labelField: 'name',
      valueField: 'id',
    },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '所属文档',
    field: 'document_id',
    required: false,
    component: 'ApiSelect',
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    componentProps: {
      api: allDocumentList,
      params: {},
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    label: '所属数据模型',
    field: 'datamodel_id',
    required: false,
    component: 'ApiSelect',
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    componentProps: {
      api: allDataModelList,
      params: {},
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    label: '类型',
    field: 'chunk_type',
    required: true,
    component: 'RadioGroup',
    defaultValue: 'chunk',
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    componentProps: {
      options: [
        { label: '知识段', value: 'chunk' },
        { label: '问答对', value: 'qa' },
      ],
    },
  },
  {
    label: '问题',
    field: 'question',
    required: true,
    component: 'Input',
    ifShow: ({ values }) => values.chunk_type == 'qa',
  },
  {
    label: '回答',
    field: 'answer',
    required: true,
    component: 'JMarkdownEditor',
    ifShow: ({ values }) => values.chunk_type == 'qa',
  },
  {
    label: '内容',
    field: 'content',
    required: true,
    component: 'JMarkdownEditor',
    ifShow: ({ values }) => values.chunk_type != 'qa',
  },
  {
    label: '状态',
    field: 'status',
    required: true,
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '已同步', value: 1 },
        { label: '未同步', value: 0 },
      ],
    },
  },
  {
    label: '标记状态',
    field: 'star_flag',
    required: true,
    component: 'RadioGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '已标记', value: 1 },
        { label: '未标记', value: 0 },
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
