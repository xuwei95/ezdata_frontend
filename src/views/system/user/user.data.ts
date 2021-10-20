import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { getAllRolesList, duplicateCheck ,getAllTenantList,getAllPostList} from "./user.api";
import { uploadApi } from '/@/api/sys/upload';
import {h} from 'vue';
import {Avatar} from 'ant-design-vue';

export const columns: BasicColumn[] = [
  {
    title: '用户账号',
    dataIndex: 'username',
    width: 200,
  },
  {
    title: '用户姓名',
    dataIndex: 'realname',
    width: 180,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 180,
    customRender: ({record}) => {
      return h(Avatar, {src: record.avatar,shape:'square',size:'large'});
    },
  }
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  }
];

export const formSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show:false
  },
  {
    label: '用户账号',
    field: 'username',
    component: 'Input',
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    dynamicRules: ({ model }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('请输入用户账号');
            }
            return new Promise((resolve, reject) => {
              let params = {
                tableName: "sys_user",
                fieldName: "username",
                fieldVal: value,
                dataId: model.id,
              };
              duplicateCheck(params)
                .then((res) => {
                  res.success? resolve(): reject(res.message || '校验失败');
                }).catch((err) => {
                reject(err.message || '验证失败');
              });
            });
          },
        },
      ];
    },
  },
  {
    label: '登录密码',
    field: 'password',
    component: 'StrengthMeter',
    componentProps: {
      placeholder: '登录密码',
    },
    rules: [
      {
        required: true,
        message: '请输入登录密码',
      },
    ],
  },
  {
    label: '确认密码',
    field: 'confirmPassword',
    component: 'InputPassword',
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('不能为空');
            }
            if (value !== values.password) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
  {
    label: '用户姓名',
    field: 'realname',
    required: true,
    component: 'Input',
  },
  {
    label: '工号',
    field: 'workNo',
    required: true,
    component: 'Input',
    dynamicRules: ({ model }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('请输入工号');
            }
            return new Promise((resolve, reject) => {
              let params = {
                tableName: "sys_user",
                fieldName: "work_no",
                fieldVal: value,
                dataId: model.id,
              };
              duplicateCheck(params)
                .then((res) => {
                  res.success? resolve(): reject(res.message || '校验失败');
                }).catch((err) => {
                reject(err.message || '验证失败');
              });
            });
          },
        },
      ];
    },
  },
  {
    label: '职务',
    field: 'post',
    component: 'ApiSelect',
    componentProps: {
      api: getAllPostList,
      labelField: 'name',
      valueField: 'code',
    },
  },
  {
    label: '角色',
    field: 'selectedroles',
    component: 'ApiSelect',
    componentProps: {
      mode:"multiple",
      api: getAllRolesList,
      labelField: 'roleName',
      valueField: 'id',
    },
  },
  /*{
    label: '租户',
    field: 'relTenantIds',
    component: 'ApiSelect',
    componentProps: {
      mode:"multiple",
      numberToString:true,
      api: getAllTenantList,
      labelField: 'name',
      valueField: 'id',
    }
  },*/
 /* {
    label: '所属部门',
    field: 'selecteddeparts',
    component: 'ApiTreeSelect',
    componentProps: {
      replaceFields: {
        title: 'deptName',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },*/
  {
    label: '头像',
    field: 'avatar',
    component: 'Upload',
    componentProps: ({formModel, formActionType}) => {
      return {
        api: uploadApi,
        maxNumber:1,
        emptyHidePreview:true,
        onChange: (fileList) => {
            console.log("fileList===>",fileList);
          },
      };
    }
  },
  {
    label: '生日',
    field: 'birthday',
    component: 'DatePicker',
  },
  {
    label: '性别',
    field: 'sex',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '男',
          value: 1,
          key: '1',
        },
        {
          label: '女',
          value: 2,
          key: '2',
        },
      ],
    },
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    rules: [
      {
        required: false,
        // @ts-ignore
        validator: async (rule, value) => {
          if (!new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)) {
            return Promise.reject('邮箱格式有误');
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],
  },
  {
    label: '手机号码',
    field: 'phone',
    component: 'Input',
    dynamicRules: ({ model }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('请输入手机号码');
            }
            console.log("new RegExp(/^1[3|4|5|7|8|9][0-9]\\d{8}$/).test(value)",new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value))
            if (!new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
              return Promise.reject('手机号码格式有误');
            }
            return new Promise((resolve, reject) => {
              let params = {
                tableName: "sys_user",
                fieldName: "phone",
                fieldVal: value,
                dataId: model.id,
              };
              duplicateCheck(params)
                .then((res) => {
                  res.success? resolve(): reject(res.message || '校验失败');
                }).catch((err) => {
                reject(err.message || '验证失败');
              });
            });
          },
        },
      ];
    },
  },
  {
    label: '工作流引擎',
    field: 'activitiSync',
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: '同步',
          value: 1,
        },
        {
          label: '不同步',
          value: 0,
        },
      ],
    },
  }
];
