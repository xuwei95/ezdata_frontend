import { BasicColumn, FormSchema } from '/@/components/Table';
import { getAutoScrollContainer } from '/@/utils/common/compUtils';
import { render } from "/@/utils/common/renderUtils";

export const columns: BasicColumn[] = [
  {
    title: '租户名称',
    dataIndex: 'name',
    width: 200,
    align: 'left',
  },
  {
    title: '租户编号(ID)',
    dataIndex: 'id',
    width: 180,
  },{
    title: '组织LOGO',
    dataIndex: 'companyLogo',
    width: 100,
    customRender: ({ text }) => {
      if(!text){
        return text;
      }
      return render.renderImage({text});
    },
  },
  {
    dataIndex: 'trade_dictText',
    title: '所属行业',
    width: 150
  },
  {
    dataIndex: 'companySize_dictText',
    title: '公司规模',
    width: 100
  },
  {
    dataIndex: 'houseNumber',
    title: '门牌号',
    width: 100,
  },
  {
    dataIndex: 'position_dictText',
    title: '职级',
    width: 150
  },
  {
    dataIndex: 'department_dictText',
    title: '部门',
    width: 150
  },
/*  {
    title: '开始时间',
    dataIndex: 'beginDate',
    sorter: true,
    width: 180,
  },
  {
    title: '结束时间',
    dataIndex: 'endDate',
    sorter: true,
    width: 180,
  },*/
  {
    title: '状态',
    dataIndex: 'status_dictText',
    width: 100,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '租户名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '正常', value: 1 },
        { label: '冻结', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
  // {
  //   field: 'fieldTime',
  //   component: 'RangePicker',
  //   label: '时间字段',
  //   componentProps: {
  //     valueType: 'Date',
  //   },
  //   colProps: {
  //     span: 8,
  //   },
  // },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '租户名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'id',
    label: '租户编号(ID)',
    component: 'InputNumber',
    required: true,
    ifShow: ({ values }) => {
      return values.id!=null;
    },
  },
  {
    field: 'companyLogo',
    label: '组织LOGO',
    component: 'JImageUpload',
    componentProps:{
      text:'logo'
    }
  },
  {
    field: 'trade',
    label: '所属行业',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode:'trade',
    }
  }, {
    field: 'companySize',
    label: '公司规模',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode:'company_size',
    }
  }, {
    field: 'companyAddress',
    label: '公司地址',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入公司地址',
      rows: 4,
    }
  },
/*  {
    field: 'beginDate',
    label: '开始时间',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      getPopupContainer: getAutoScrollContainer,
    },
  },
  {
    field: 'endDate',
    label: '结束时间',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      getPopupContainer: getAutoScrollContainer,
    },
  },*/
  {
    field: 'houseNumber',
    label: '门牌号',
    component: 'Input',
    dynamicDisabled: true,
    ifShow: ({ values }) => {
      return values.id!=null;
    },
  },
  {
    field: 'position',
    label: '职级',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode: 'company_rank'
    }
  },
  {
    field: 'department',
    label: '部门',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:'company_department'
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '正常', value: 1 },
        { label: '冻结', value: 0 },
      ],
    },
  },
];

//定义用户表格列
export const userColumns: BasicColumn[] =[
  {
    title: '用户账号',
    dataIndex: 'username',
    width: 100,
    align: 'left',
  },
  {
    title: '用户姓名',
    dataIndex: 'realname',
    width: 100,
  },
  {
    title: '性别',
    dataIndex: 'sex_dictText',
    width: 100,
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    width: 100,
  },
];

//邀请用户搜索表单
export const userSearchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: { span: 10 },
  },
  {
    field: 'realname',
    label: '真实姓名',
    component: 'Input',
    colProps: { span: 10 },
  },
];

//产品包列表
export const packColumns: BasicColumn[] = [
  {
    title: '产品包名称',
    dataIndex: 'packName',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      console.log("text::",text)
      if (text === '1') {
        return '开启';
      } else {
        return '关闭';
      }
    },
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 150,
  },
];

//产品包搜索表单
export const packFormSchema: FormSchema[] = [
  {
    field: 'packName',
    label: '产品包名称',
    component: 'JInput',
    colProps: { xxl: 8 },
  },
];

//产品包表单
export const packMenuFormSchema: FormSchema[] = [
  {
    field: 'packName',
    label: '产品包名称',
    component: 'Input',
  },
  {
    field: 'permissionIds',
    label: '菜单列表',
    component: 'JTreeSelect',
    componentProps: {
      dict: 'sys_permission,name,id',
      pidField: 'parent_id',
      multiple: true,
      treeCheckAble:true,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'remarks',
    label: '描述',
    component: 'InputTextArea',
  },
  {
    field: 'status',
    label: '开启状态',
    component: 'Switch',
    componentProps: {
      checkedValue: '1',
      checkedChildren: '开启',
      unCheckedValue: '0',
      unCheckedChildren: '关闭',
    },
    defaultValue: '1',
  },
  {
    field: 'id',
    label: '开启状态',
    component: 'Input',
    show: false
  },
];

//回收站列表
export const recycleColumns : BasicColumn[] = [
  {
    title: '租户名称',
    dataIndex: 'name',
    width: 100,
    align: 'left',
  },
  {
    title: '租户编号(ID)',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '组织LOGO',
    dataIndex: 'companyLogo',
    width: 100,
    customRender: ({ text }) => {
      if(!text){
        return text;
      }
      return render.renderImage({text});
    },
  },
  {
    dataIndex: 'houseNumber',
    title: '门牌号',
    width: 100,
  }
]

//租户回收站搜索表单
export const searchRecycleFormSchema : FormSchema[] = [
  {
    field: 'name',
    label: '租户名称',
    component: 'Input',
  },
  {
    field: 'houseNumber',
    label: '门牌号',
    component: 'Input',
  },
]
