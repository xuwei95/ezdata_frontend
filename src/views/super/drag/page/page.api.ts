import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
  list = '/drag/page/list',
  queryById = '/drag/page/queryById',
  queryPageById = '/drag/page/queryPageById',
  save = '/drag/page/add',
  edit = '/drag/page/edit',
  copyPage = '/drag/page/copyPage',
  deleteOne = '/drag/page/delete',
  deleteBatch = '/drag/page/deleteBatch',
}

/**
 * 列表
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 * 根据id查询
 * @param params
 */
export const queryById = (params) => defHttp.get({ url: Api.queryById, params }, { isTransformResponse: false });
/**
 * 根据id查询(不租户隔离)
 * @param params
 */
export const queryPageById = (params) => defHttp.get({ url: Api.queryPageById, params }, { isTransformResponse: false });

/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};
/**
 * 删除
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * 批量删除
 * @param params
 */
export const batchDelete = (params, handleSuccess) => {
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
 * 复制
 */
export const copyPage = (params, handleSuccess) => {
  return defHttp.get({ url: Api.copyPage, params }, { isTransformResponse: false }).then(() => {
    handleSuccess();
  });
};

