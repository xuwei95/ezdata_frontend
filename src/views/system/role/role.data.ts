import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { isRoleExist } from './role.api';

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    width: 200,
  },
  {
    title: '角色编码',
    dataIndex: 'roleCode',
    width: 180,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleNme',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 8 },
  }
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    show:false
  },
  {
    field: 'roleName',
    label: '角色名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'roleCode',
    label: '角色编码',
    required: true,
    component: 'Input',
    dynamicRules: ({ values,model }) => {
      console.log("values:",values)
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('请输入角色编码');
            }
            if(values){
              return new Promise((resolve, reject) => {
                isRoleExist({id:model.id,roleCode:value})
                  .then((res) => {
                    res.success? resolve(): reject(res.message || '校验失败');
                  }).catch((err) => {
                  reject(err.message || '验证失败');
                });
              });
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
  {
    label: '备注',
    field: 'description',
    component: 'InputTextArea',
  }
];

