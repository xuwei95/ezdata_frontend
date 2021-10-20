import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/sys/user/list',
  save='/sys/user/add',
  edit='/sys/user/edit',
  getUserRole = '/sys/user/queryUserRole',
  duplicateCheck = '/sys/duplicate/check',
  deleteUser = '/sys/user/delete',
  deleteBatch = '/sys/user/deleteBatch',
  importExcel = '/jeecg-boot/sys/user/importExcel',
  recycleBinList = '/sys/user/recycleBin',
  putRecycleBin = '/sys/user/putRecycleBin',
  deleteRecycleBin = '/sys/user/deleteRecycleBin',
  allRolesList = '/sys/role/queryall',
  allTenantList = '/sys/tenant/queryList',
  allPostList = '/sys/position/list',
}

/**
 * 列表接口
 * @param params
 */
export const list = (params) =>
  defHttp.get({url: Api.list, params});

/**
 * 用户角色接口
 * @param params
 */
export const getUserRoles = (params) =>
  defHttp.get({url: Api.getUserRole, params}, {errorMessageMode: 'none'});

/**
 * 删除用户
 */
export const deleteUser = (params,handleSuccess) => {
  return defHttp.delete({url: Api.deleteUser, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除用户
 * @param params
 */
export const batchDeleteUser = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.deleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新用户
 * @param params
 */
export const saveOrUpdateUser = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({url: url, params});
}
/**
 * 唯一校验
 * @param params
 */
export const duplicateCheck = (params) =>
  defHttp.get({url: Api.duplicateCheck, params},{isTransformResponse:false});
/**
 * 自定义上传
 * @param customUpload
 */
export const customUpload = (params) =>
  defHttp.uploadFile({url: Api.importExcel},params);
/**
 * 获取全部角色
 * @param params
 */
export const getAllRolesList = (params) =>
  defHttp.get<RoleListGetResultModel>({url: Api.allRolesList, params});
/**
 * 获取全部租户
 */
export const getAllTenantList = (params) =>
  defHttp.get({url: Api.allTenantList, params});
/**
 * 获取全部职务
 */
export const getAllPostList = (params) => {
  return new Promise((resolve, reject) => {
    defHttp.get({url: Api.allPostList, params}).then(res => {
      resolve(res.records)
    });
  })
}
/**
 * 回收站列表
 * @param params
 */
export const getRecycleBinList = (params) =>
  defHttp.get({url: Api.recycleBinList, params});
/**
 * 回收站还原
 * @param params
 */
export const putRecycleBin = (params) =>
  defHttp.put({url: Api.putRecycleBin, params},{isTransformResponse:false});
/**
 * 回收站删除
 * @param params
 */
export const deleteRecycleBin = (params,handleSuccess) => {
  return defHttp.delete({url: Api.deleteRecycleBin, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
