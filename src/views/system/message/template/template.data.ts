import { BasicColumn, FormSchema } from '/@/components/Table'
import { rules } from '/@/utils/helper/validator'

export const columns: BasicColumn[] = [
  {
    title: '模板标题',
    dataIndex: 'templateName',
    width: 80,
  },
  {
    title: '模板编码',
    dataIndex: 'templateCode',
    width: 100,
  },
  {
    title: '模板内容',
    dataIndex: 'templateContent',
    width: 150,
  },
  {
    title: '模板类型',
    dataIndex: 'templateType',
    width: 100,
    customRender: function ({ text }) {
      if (text == '1') {
        return '短信'
      }
      if (text == '2') {
        return '邮件'
      }
      if (text == '3') {
        return '微信'
      }
      if (text == '4') {
        return '系统'
      }
      return text
    },
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    label: '模板标题',
    field: 'templateName',
    component: 'Input',
  },
  {
    label: '模板编码',
    field: 'templateCode',
    component: 'Input',
  },
  {
    label: '模板类型',
    field: 'templateType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'msgType',
    },
  },
]

export const formSchemas: FormSchema[] = [
  {
    label: 'ID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '模板标题',
    field: 'templateName',
    component: 'Input',
    required: true,
  },
  {
    label: '模板编码',
    field: 'templateCode',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '请输入模板编码！' },
        ...rules.duplicateCheckRule('sys_sms_template', 'template_code', model, schema, true),
      ]
    },
    // 编辑模式下不可修改编码
    dynamicDisabled: (params) => !!params.values.id,
  }
  ,
  {
    label: '模板类型',
    field: 'templateType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'msgType',
      placeholder: '请选择模板类型',
    },
    required: true,
  },
  {
    label: '模板内容',
    field: 'templateContent',
    component: 'InputTextArea',
    componentProps: {
      autoSize: {
        minRows: 8,
        maxRows: 8,
      },
    },
    ifShow: ({ values }) => {
      return !['2', '4'].includes(values.templateType)
    },
  },

  {
    label: '模板内容',
    field: 'templateContent',
    component: 'JEditor',
    ifShow: ({ values }) => {
      return ['2', '4'].includes(values.templateType)
    },
  },
]

export const sendTestFormSchemas: FormSchema[] = [
  {
    label: '模板编码',
    field: 'templateCode',
    component: 'Input',
    show: false,
  },
  {
    label: '模板标题',
    field: 'templateName',
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    label: '模板内容',
    field: 'templateContent',
    component: 'InputTextArea',
    componentProps: { disabled: true, rows: 5 },
  },
  {
    label: '测试数据',
    field: 'testData',
    component: 'InputTextArea',
    required: true,
    helpMessage: 'JSON数据',
    componentProps: {
      placeholder: '请输入JSON格式测试数据',
      rows: 5,
    },
  },
  {
    label: '消息类型',
    field: 'msgType',
    component: 'JDictSelectTag',
    required: true,
    componentProps: { dictCode: 'msgType' },
  },
  {
    label: '消息接收方',
    field: 'receiver',
    component: 'Input',
    required: true,
  },
]
