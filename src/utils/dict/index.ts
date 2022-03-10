import {getAuthCache} from "/@/utils/auth";
import {DB_DICT_DATA_KEY} from "/@/enums/cacheEnum";
import {defHttp} from "/@/utils/http/axios";

/**
 * 从缓存中获取字典配置
 * @param code
 */
export const getDictItemsByCode= (code) =>  {
  if (getAuthCache(DB_DICT_DATA_KEY) && getAuthCache(DB_DICT_DATA_KEY)[code]) {
    return getAuthCache(DB_DICT_DATA_KEY)[code];
  }
}
/**
 * 获取字典数组
 * @param dictCode 字典Code
 * @return List<Map>
 */
export const initDictOptions = (code) =>{
  //1.优先从缓存中读取字典配置
  if(getDictItemsByCode(code)){
    return new Promise((resolve, reject) => {
      resolve(getDictItemsByCode(code))
    })
  }
  //2.获取字典数组
  return defHttp.get({url: `/sys/dict/getDictItems/${code}`});
};
/**
 * 获取字典数组
 * @param code 字典Code
 * @param params 查询参数
 * @return List<Map>
 */
export const ajaxGetDictItems = (code, params)=>defHttp.get({url:`/sys/dict/getDictItems/${code}`,params});
