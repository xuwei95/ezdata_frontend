import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
import {useMessage} from "/@/hooks/web/useMessage";

const { createMessage, createErrorModal } = useMessage();
enum Api {

  Login = '/sys/login',
  phoneLogin = '/sys/phoneLogin',
  Logout = '/sys/logout',
  GetUserInfo = '/sys/user/getUserInfo',
  GetPermCode = '/sys/permission/getPermCode',
  //新加的获取图形验证码的接口
  getInputCode = '/sys/randomImage',
 //获取短信验证码的接口
  getCaptcha = '/sys/sms',
  //注册接口
  registerApi = '/sys/user/register',
  //校验用户接口
  checkOnlyUser = '/sys/user/checkOnlyUser',
  //校验手机号
  phoneVerify = '/sys/user/phoneVerification',
  //修改密码
  passwordChange = '/sys/user/passwordChange',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

/**
 * @description: user phoneLogin api
 */
export function phoneLoginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.phoneLogin,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function getCodeInfo(currdatetime) {
  let url = Api.getInputCode+`/${currdatetime}`
  return defHttp.get({ url: url });
}
/**
 * @description: 获取短信验证码
 */
export function getCaptcha(params) {
  return new Promise((resolve, reject) => {
    defHttp.post({url: Api.getCaptcha,params},{isTransformResponse: false}).then(res=>{
      console.log(res)
      if(res.success){
        resolve(true)
      }else{
        createErrorModal({ title: '错误提示', content: res.message||'未知问题' });
        reject()
      }
    });
  })
}

/**
 * @description: 注册接口
 */
export function register(params) {
  return defHttp.post({url: Api.registerApi,params},{isReturnNativeResponse: true})
}

/**
 *校验用户是否存在
 * @param params
 */
export const checkOnlyUser = (params) =>
  defHttp.get({url: Api.checkOnlyUser, params},{isTransformResponse:false});
/**
 *校验手机号码
 * @param params
 */
export const phoneVerify = (params) =>
  defHttp.post({url: Api.phoneVerify, params},{isTransformResponse:false});
/**
 *密码修改
 * @param params
 */
export const passwordChange = (params) =>
  defHttp.get({url: Api.passwordChange, params},{isTransformResponse:false});
