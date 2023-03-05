import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
  list = '/sys/tenant/list',
  save = '/sys/tenant/add',
  edit = '/sys/tenant/edit',
  get = '/sys/tenant/queryById',
  delete = '/sys/tenant/delete',
  deleteBatch = '/sys/tenant/deleteBatch',
  getCurrentUserTenants = '/sys/tenant/getCurrentUserTenant',
  invitationUserJoin = '/sys/tenant/invitationUserJoin',
  getTenantUserList = '/sys/tenant/getTenantUserList',
  leaveTenant = '/sys/tenant/leaveTenant',
  packList = '/sys/tenant/packList',
  addPackPermission = '/sys/tenant/addPackPermission',
  editPackPermission = '/sys/tenant/editPackPermission',
  deletePackPermissions = '/sys/tenant/deletePackPermissions',
  recycleBinPageList = '/sys/tenant/recycleBinPageList',
  deleteLogicDeleted = '/sys/tenant/deleteLogicDeleted',
  revertTenantLogic = '/sys/tenant/revertTenantLogic',
}

/**
 * 查询租户列表
 * @param params
 */
export const getTenantList = (params) => {
  return defHttp.get({ url: Api.list, params });
};

/**
 * 保存或者更新租户
 * @param params
 */
export const saveOrUpdateTenant = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};

/**
 * 查询租户详情
 * @param params
 */
export const getTenantById = (params) => {
  return defHttp.get({ url: Api.get, params });
};

/**
 * 删除租户
 * @param params
 */
export const deleteTenant = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.delete, data: params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * 批量删除租户
 * @param params
 */
export const batchDeleteTenant = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};

/**
 * 获取登录用户部门信息
 */
export const getUserTenants = (params?) => defHttp.get({ url: Api.getCurrentUserTenants, params });

/**
 * 邀请用户加入租户
 * @param params
 */
export const invitationUserJoin = (params) => defHttp.put({ url: Api.invitationUserJoin, params }, { joinParamsToUrl: true });

/**
 * 通过租户id获取数据
 * @param params
 */
export const getTenantUserList = (params) => {
  return defHttp.get({ url: Api.getTenantUserList, params });
};

/**
 * 用户离开租户
 * @param params
 */
export const leaveTenant = (params, handleSuccess) => {
  Modal.confirm({
    title: '请离',
    content: '是否请离该用户',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.put({ url: Api.leaveTenant, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};

/**
 * 获取产品包列表
 * @param params
 */
export const packList = (params) => {
  return defHttp.get({ url: Api.packList, params });
};

/**
 * 添加菜单
 * @param params
 */
export const addPackPermission = (params) => {
  return defHttp.post({ url: Api.addPackPermission, params });
};

/**
 * 添加菜单
 * @param params
 */
export const editPackPermission = (params) => {
  return defHttp.put({ url: Api.editPackPermission, params });
};

/**
 * 删除菜单
 * @param params
 */
export const deletePackPermissions = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deletePackPermissions, data: params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * 获取租户回收站的列表
 * @param params
 */
export const recycleBinPageList = (params) => {
  return defHttp.get({ url: Api.recycleBinPageList, params });
};

/**
 * 租户彻底删除
 * @param params
 */
export const deleteLogicDeleted = (params,handleSuccess) => {
  return defHttp.delete({ url: Api.deleteLogicDeleted, params },{ joinParamsToUrl: true }).then(() => {
    handleSuccess();
  }).catch(()=>{
    handleSuccess();
  });
};

/**
 * 租户还原
 * @param params
 */
export const revertTenantLogic = (params,handleSuccess) => {
  return defHttp.put({ url: Api.revertTenantLogic, params },{ joinParamsToUrl: true }).then(() => {
    handleSuccess();
  })
};
