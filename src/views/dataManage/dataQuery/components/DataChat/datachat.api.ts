import { defHttp } from '/@/utils/http/axios';
enum Api {
  DataChat = '/llm/data_chat',
}
/**
 * 聊天接口
 * @param params
 */
export const dataChat = (params) => defHttp.post({ url: Api.DataChat, params, timeout: 180 * 1000 });
