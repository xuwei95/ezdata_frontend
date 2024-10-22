import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/llm/chat_app/token/list',
  getInfoById = '/llm/chat_app/token/queryById',
  apply = '/llm/chat_app/token/apply',
  statusUpdate = '/llm/chat_app/token/status',
}
/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 * 详情接口
 * @param params
 */
export const getInfoById = (params) => defHttp.get({ url: Api.getInfoById, params });
/**
 * 更新状态
 * @param params
 */
export const UpdateStatus = (params, handleSuccess) => {
  return defHttp.post({ url: Api.statusUpdate, params }).then(() => {
    handleSuccess();
  });
};
/**
 * 申请接口
 * @param params
 */
export const Apply = (params) => {
  return defHttp.post({ url: Api.apply, params });
};
