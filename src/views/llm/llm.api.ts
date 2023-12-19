import { defHttp } from '/@/utils/http/axios';
enum Api {
  chat = '/llm/function_chat',
}
/**
 * 聊天接口
 * @param params
 */
export const chat = (params) => defHttp.post({ url: Api.chat, params });
