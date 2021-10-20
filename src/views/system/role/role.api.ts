import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
const { createMessage } = useMessage();
enum Api {
  list = '/sys/role/list',
  save = '/sys/role/add',
  edit = '/sys/role/edit',
  deleteRole = '/sys/role/delete',
  deleteBatch = '/sys/role/deleteBatch',
  exportXls = '/sys/role/exportXls',
  isRoleExist = '/sys/role/checkRoleCode',
  queryTreeListForRole = '/sys/role/queryTreeList',
  queryRolePermission = '/sys/permission/queryRolePermission',
  saveRolePermission = '/sys/permission/saveRolePermission',
}

/**
 * 列表接口
 * @param params
 */
export const list = (params) =>
  defHttp.get({url: Api.list, params});

/**
 * 删除角色
 */
export const deleteRole = (params, handleSuccess) => {
  return defHttp.delete({url: Api.deleteRole, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除角色
 * @param params
 */
export const batchDeleteRole = (params, handleSuccess) => {
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
 * 保存或者更新角色
 * @param params
 */
export const saveOrUpdateRole = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({url: url, params});
}
/**
 * 编码校验
 * @param params
 */
export const isRoleExist = (params) =>
  defHttp.get({url: Api.isRoleExist, params}, {isTransformResponse: false});
/**
 * 导出
 * @param fileName
 */
export const exportXls = (fileName) => {
  defHttp.get({url: Api.exportXls, responseType: 'blob'}, {isTransformResponse: false}).then((data) => {
    if (!data) {
      createMessage.warning("文件下载失败")
      return
    }
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(new Blob([data], {type: 'application/vnd.ms-excel'}), fileName + '.xls')
    } else {
      let url = window.URL.createObjectURL(new Blob([data], {type: 'application/vnd.ms-excel'}))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName + '.xls')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    }
  });
}
/**
 * 根据角色查询树信息
 */
export const queryTreeListForRole = () =>
  defHttp.get({url: Api.queryTreeListForRole});
/**
 * 查询角色权限
 */
export const queryRolePermission = (params) =>
  defHttp.get({url: Api.queryRolePermission, params});
/**
 * 保存角色权限
 */
export const saveRolePermission = (params) =>
  defHttp.post({url: Api.saveRolePermission, params});
