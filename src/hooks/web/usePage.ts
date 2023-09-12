import type { RouteLocationRaw, Router } from 'vue-router';

import { PageEnum } from '/@/enums/pageEnum';
import { isString } from '/@/utils/is';
import { unref } from 'vue';

import { useRouter } from 'vue-router';
import { REDIRECT_NAME } from '/@/router/constant';
import { useUserStore } from '/@/store/modules/user';

export type RouteLocationRawEx = Omit<RouteLocationRaw, 'path'> & { path: PageEnum };

function handleError(e: Error) {
  console.error(e);
}

// page switch
export function useGo(_router?: Router) {
  // update-begin--author:liaozhiyang---date:20230908---for：【issues/694】404返回首页问题
  const userStore = useUserStore();
  const homePath = userStore.getUserInfo.homePath || PageEnum.BASE_HOME;
  // update-end--author:liaozhiyang---date:20230908---for：【issues/694】404返回首页问题
  let router;
  if (!_router) {
    router = useRouter();
  }
  const { push, replace } = _router || router;
  function go(opt: PageEnum | RouteLocationRawEx | string = homePath, isReplace = false) {
    if (!opt) {
      return;
    }
    if (isString(opt)) {
      isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
    } else {
      const o = opt as RouteLocationRaw;
      isReplace ? replace(o).catch(handleError) : push(o).catch(handleError);
    }
  }
  return go;
}

/**
 * @description: redo current page
 */
export const useRedo = (_router?: Router) => {
  const { push, currentRoute } = _router || useRouter();
  const { query, params = {}, name, fullPath } = unref(currentRoute.value);
  function redo(): Promise<boolean> {
    return new Promise((resolve) => {
      if (name === REDIRECT_NAME) {
        resolve(false);
        return;
      }
      if (name && Object.keys(params).length > 0) {
        //update-begin-author:taoyan date:2022-10-19 for: VUEN-2356 【vue3】online表单、表单设计器 功能测试 右键刷新时 404
        if(isDynamicRoute(params, name)){
          params['_redirect_type'] = 'path';
          params['path'] = fullPath;
        }else{
          params['_redirect_type'] = 'name';
          params['path'] = String(name);
        }
        //update-end-author:taoyan date:2022-10-19 for: VUEN-2356 【vue3】online表单、表单设计器 功能测试 右键刷新时 404
      } else {
        params['_redirect_type'] = 'path';
        params['path'] = fullPath;
      }
      push({ name: REDIRECT_NAME, params, query }).then(() => resolve(true));
    });
  }
  return redo;
};

/**
 * 判断是不是动态路由的跳转
 * @param params
 * @param name
 */
function isDynamicRoute(params, name){
  let arr = Object.keys(params);
  let flag = false; 
  for(let i=0;i<arr.length;i++){
    let key = '@'+arr[i];
    if((name as string).indexOf(key)>0){
      flag = true;
      break;
    }
  }
  return flag;
}
