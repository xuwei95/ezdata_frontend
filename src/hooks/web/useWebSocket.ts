// noinspection JSUnusedGlobalSymbols

import { computed, reactive, ref, unref } from 'vue'
import { useWebSocket as $useWebSocket, WebSocketResult } from '@vueuse/core'
import { getToken } from '/@/utils/auth';

const state = reactive({
  server: '',
  sendValue: '',
  recordList: [] as { id: number; time: number; res: string }[],
})

const result = ref<WebSocketResult<any>>()

const listeners = new Map()

/**
 * 开启 WebSocket 链接，全局只需执行一次
 * @param url
 */
export function connectWebSocket(url: string) {
  if (!unref(getIsOpen)) {
    state.server = url
    //update-begin-author:taoyan date:2022-4-24 for: v2.4.6 的 websocket 服务端，存在性能和安全问题。 #3278
    let token = (getToken() || '') as string
    result.value = $useWebSocket(state.server, {
      // 自动重连
      autoReconnect: true,
      // 心跳检测
      heartbeat: false,
      //protocols: [token],
    })
    //update-end-author:taoyan date:2022-4-24 for: v2.4.6 的 websocket 服务端，存在性能和安全问题。 #3278
    result.value.open()
    const ws = unref(result.value.ws)
    if (ws) {
      ws.onopen = onOpen
      ws.onclose = onClose
      ws.onerror = onError
      ws.onmessage = onMessage
    }
  }
}

function onOpen() {
  console.log('[WebSocket] 连接成功')
}

function onClose(e) {
  console.log('[WebSocket] 连接断开：', e)
}

function onError(e) {
  console.log('[WebSocket] 连接发生错误: ', e)
}

function onMessage(e) {
  if (e.data === 'ping') {
    return
  }
  console.debug('[WebSocket] -----接收消息-------', e.data)
  try {
    const data = JSON.parse(e.data)
    for (const callback of listeners.keys()) {
      try {
        callback(data)
      } catch (err) {
        console.error(err)
      }
    }
  } catch (err) {
    console.error('[WebSocket] data解析失败：', err)
  }
}

/**
 * 判断 WebSocket 是否是开启状态
 */
export const getIsOpen = computed(() => result.value?.status.value === 'OPEN')

/**
 * 添加 WebSocket 消息监听
 * @param callback
 */
export function onWebSocket(callback: (data: object) => any) {
  if (!listeners.has(callback)) {
    if (typeof callback === 'function') {
      listeners.set(callback, null)
    } else {
      console.debug('[WebSocket] 添加 WebSocket 消息监听失败：传入的参数不是一个方法')
    }
  }
}

/**
 * 解除 WebSocket 消息监听
 *
 * @param callback
 */
export function offWebSocket(callback: (data: object) => any) {
  listeners.delete(callback)
}

export function useWebSocket() {
  return unref(result)
}
