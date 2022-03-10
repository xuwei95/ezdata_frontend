import { unref, isRef, Ref } from 'vue'
import { useDefaultEnhanced } from '../hooks/useJVxeComponent'
import { isFunction, isObject, isString } from '/@/utils/is'
import { JVxeTypes } from '../types'
import { JVxeComponent } from '../types/JVxeComponent'
import { componentMap } from '../componentMap'

// 已注册的组件增强
const enhancedMap = new Map<JVxeTypes, JVxeComponent.Enhanced>()

/**
 * 获取某个组件的增强
 * @param type JVxeTypes
 */
export function getEnhanced(type: JVxeTypes | string): JVxeComponent.Enhanced {
  let $type: JVxeTypes = <JVxeTypes>type
  if (!enhancedMap.has($type)) {
    let defaultEnhanced = useDefaultEnhanced()
    if (componentMap.has($type)) {
      let enhanced = componentMap.get($type)?.enhanced ?? {}
      if (isObject(enhanced)) {
        Object.keys(defaultEnhanced).forEach(key => {
          let def = defaultEnhanced[key]
          if (enhanced.hasOwnProperty(key)) {
            // 方法如果存在就不覆盖
            if (!isFunction(def) && !isString(def)) {
              enhanced[key] = Object.assign({}, def, enhanced[key])
            }
          } else {
            enhanced[key] = def
          }
        })
        enhancedMap.set($type, <JVxeComponent.Enhanced>enhanced)
        return <JVxeComponent.Enhanced>enhanced
      }
    } else {
      throw new Error(`[JVxeTable] ${$type} 组件尚未注册，获取增强失败`)
    }
    enhancedMap.set($type, <JVxeComponent.Enhanced>defaultEnhanced)
  }
  return <JVxeComponent.Enhanced>enhancedMap.get($type)
}

/** 辅助方法：替换${...}变量 */
export function replaceProps(col, value) {
  if (value && typeof value === 'string') {
    let text = value
    text = text.replace(/\${title}/g, col.title)
    text = text.replace(/\${key}/g, col.key)
    text = text.replace(/\${defaultValue}/g, col.defaultValue)
    return text
  }
  return value
}

type dispatchEventOptions = { props, $event, className: string, handler?: Fn, isClick?: boolean }

/** 模拟触发事件 */
export function dispatchEvent(options: dispatchEventOptions) {
  const { props, $event, className, handler, isClick } = options
  if (!$event || !$event.path) {
    return
  }
  // alwaysEdit 下不模拟触发事件，否者会导致触发两次
  if (props && props.alwaysEdit) {
    return
  }
  let getCell = () => {
    for (const el of $event.path) {
      if (el.classList.contains('vxe-body--column')) {
        return el as HTMLElement
      }
    }
    return null
  }
  let cell = getCell()
  if (cell) {
    window.setTimeout(() => {
      let getElement = () => {
        let classList = className.split(' ')
        if (classList.length > 0) {
          const getClassName = (cls: string) => {
            if (cls.startsWith('.')) {
              return cls.substring(1, cls.length)
            }
            return cls
          }
          let get = (target, className, idx = 0) => {
            let elements = target.getElementsByClassName(getClassName(className))
            if (elements && elements.length > 0) {
              return elements[idx]
            }
            return null
          }
          let element: HTMLElement = get(cell, classList[0])
          for (let i = 1; i < classList.length; i++) {
            if (!element) {
              break
            }
            element = get(element, classList[i])
          }
          return element
        }
        return null
      }
      let element = getElement()
      if (element) {
        if (isFunction(handler)) {
          handler(element)
        } else {
          // 模拟触发点击事件
          if (isClick) {
            element.click()
          } else {
            element.dispatchEvent($event)
          }
        }
      }
    }, 10)
  } else {
    console.warn('【JVxeTable】dispatchEvent 获取 cell 失败')
  }
}

/** 绑定 VxeTable 数据 */
export function vModel(value, row, column: Ref<any> | string) {
  let property = isRef(column) ? column.value.property : column
  unref(row)[property] = value
}