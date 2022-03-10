import { defHttp } from '/@/utils/http/axios';

enum Api {
  actuatorList = '/actuator/httptrace'
}


/**
 * 追踪信息
 */
export const getActuatorList = () => {
  return defHttp.get({ url: Api.actuatorList },{ isTransformResponse: false });
};

