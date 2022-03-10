import { ref, reactive, provide, resolveComponent } from 'vue'
import { useDesign } from '/@/hooks/web/useDesign'
import { JVxeDataProps, JVxeRefs, JVxeTableProps } from '../types'
import { VxeGridInstance } from 'vxe-table'
import { randomString } from '/@/utils/common/compUtils'

export function useData(props: JVxeTableProps): JVxeDataProps {
  const { prefixCls } = useDesign('j-vxe-table')
  provide('prefixCls', prefixCls)
  return {
    prefixCls: prefixCls,
    caseId: `j-vxe-${randomString(8)}`,
    vxeDataSource: ref([]),
    scroll: reactive({ top: 0, left: 0 }),
    scrolling: ref(false),
    defaultVxeProps: reactive({
      rowId: props.rowKey,
      // 高亮hover的行
      highlightHoverRow: true,
      // 溢出隐藏并显示tooltip
      showOverflow: true,
      // 表头溢出隐藏并显示tooltip
      showHeaderOverflow: true,
      showFooterOverflow: true,
      // 可编辑配置
      editConfig: {
        trigger: 'click',
        mode: 'cell',
        activeMethod: () => !props.disabled,
      },
      expandConfig: {
        iconClose: 'ant-table-row-expand-icon ant-table-row-collapsed',
        iconOpen: 'ant-table-row-expand-icon ant-table-row-expanded',
      },
      // 虚拟滚动配置，y轴大于30条数据时启用虚拟滚动
      // 'scroll-y': {
      //   gt: 30
      // },
      // 'scroll-x': {
      //   gt: 15
      // },
      radioConfig: { highlight: true },
      checkboxConfig: { highlight: true },
    }),
    selectedRows: ref<any[]>([]),
    selectedRowIds: ref<string[]>([]),
    disabledRowIds: [],
    statistics: reactive({
      has: false,
      sum: [],
      average: [],
    }),
    authsMap: ref(null),
    innerEditRules: {},
    innerLinkageConfig: new Map<string, any>(),
    reloadEffectRowKeysMap: reactive({}),
  }
}

export function useRefs(): JVxeRefs {
  return {
    gridRef: ref<VxeGridInstance>(),
    subPopoverRef: ref<any>(),
    detailsModalRef: ref<any>(),
  }
}

export function useResolveComponent(...t: any[]): any {
  // @ts-ignore
  return resolveComponent(...t)
}