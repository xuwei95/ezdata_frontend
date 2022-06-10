import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { CacheTypeEnum } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';
import { TOKEN_KEY, LOGIN_INFO_KEY, TENANT_ID } from '/@/enums/cacheEnum';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

/**
 * 获取token
 */
export function getToken() {
  return getAuthCache(TOKEN_KEY);
}
/**
 * 获取登录信息
 */
export function getLoginBackInfo() {
  return getAuthCache(LOGIN_INFO_KEY);
}
/**
 * 获取租户id
 */
export function getTenantId() {
  return getAuthCache(TENANT_ID);
}
/**
 * 获取用户租户id
 */
export function getUserTenantId(username) {
  return getAuthCache(username);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}
/**
 * 移除缓存中的某个属性
 * @param key
 * @update:移除缓存中的某个属性
 * @updateBy:lsq
 * @updateDate:2021-09-07
 */
export function removeAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.removeLocal : Persistent.removeSession;
  return fn(key) as T;
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}
