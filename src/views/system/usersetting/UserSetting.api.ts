import { defHttp } from "/@/utils/http/axios";

enum Api {
  userEdit='/sys/user/login/setting/userEdit',
  getUserData='/sys/user/login/setting/getUserData',
  queryNameByCodes='/sys/position/queryByCodes',
  updateMobile='/sys/user/updateMobile',
  updateUserPassword='/sys/user/updatePassword',
  getTenantListByUserId = '/sys/tenant/getTenantListByUserId',
  cancelApplyTenant = '/sys/tenant/cancelApplyTenant',
  exitUserTenant = '/sys/tenant/exitUserTenant',
  changeOwenUserTenant = '/sys/tenant/changeOwenUserTenant',
}

/**
 * 用户编辑
 * @param params
 */
export const userEdit = (params) => {
  return defHttp.post({ url: Api.userEdit, params },{ isTransformResponse:false });
}

/**
 * 获取用户信息
 * @param params
 */
export const getUserData = () => {
  return defHttp.get({ url: Api.getUserData },{ isTransformResponse:false });
}

/**
 * 获取多个职务信息
 * @param params
 */
export const queryNameByCodes = (params) => {
  return defHttp.get({ url: Api.queryNameByCodes, params },{isTransformResponse:false});
}

/**
 * 修改手机号
 * @param params
 */
export const updateMobile = (params) => {
  return defHttp.put({ url: Api.updateMobile, params },{isTransformResponse:false});
}

/**
 * 修改密码
 * @param params
 */
export const updateUserPassword = (params) => {
  return defHttp.put({ url: Api.updateUserPassword, params },{isTransformResponse:false});
}

/**
 * 通过用户id获取租户列表
 * @param params
 */
export const getTenantListByUserId = (params) => {
  return defHttp.get({ url: Api.getTenantListByUserId, params }, { isTransformResponse: false });
};

/**
 * 取消申请
 * @param params
 */
export const cancelApplyTenant = (params) => {
  return defHttp.put({ url: Api.cancelApplyTenant, data: params }, { joinParamsToUrl: true, isTransformResponse: false });
};

/**
 * 用户退出租户
 * @param params
 */
export const exitUserTenant = (params)=>{
  return defHttp.delete({ url: Api.exitUserTenant, params },{ isTransformResponse: false, joinParamsToUrl: true });
}

/**
 * 变更租户拥有者
 * @param params
 */
export const changeOwenUserTenant = (params)=>{
  return defHttp.post({ url: Api.changeOwenUserTenant, params },{ isTransformResponse: false, joinParamsToUrl: true });
}
