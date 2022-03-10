<template>
  <JPopup v-bind="popupProps"/>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { JPopup } from '/@/components/Form'
import { JVxeComponent } from '/@/components/jeecg/JVxeTable/types'
import { useJVxeComponent, useJVxeCompProps } from '/@/components/jeecg/JVxeTable/hooks'
import { dispatchEvent, vModel } from '/@/components/jeecg/JVxeTable/utils'
import { isEmpty } from '/@/utils/is'

export default defineComponent({
  name: 'JVxePopupCell',
  components: { JPopup },
  props: useJVxeCompProps(),
  setup(props: JVxeComponent.Props) {
    const {
      innerValue,
      row,
      originColumn,
      cellProps,
      handleChangeCommon,
    } = useJVxeComponent(props)

    const popupProps = computed(() => {
      return {
        ...cellProps,
        value: innerValue.value,
        field: originColumn.value.field || originColumn.value.key,
        code: originColumn.value.popupCode,
        fieldConfig: originColumn.value.fieldConfig,
        // orgFields: originColumn.value.orgFields,
        // destFields: originColumn.value.destFields,
        groupId: 'j-vxe-popup',
        param: originColumn.value.params,
        sorter: originColumn.value.sorter,
        setFieldsValue: (values) => {
          if (!isEmpty(values)) {
            let popupValue = ''
            Object.keys(values).forEach(key => {
              let currentValue = values[key]
              // 当前列直接赋值，其他列通过vModel赋值
              if (key === originColumn.value.key) {
                popupValue = currentValue
              } else {
                vModel(currentValue, row, key)
              }
            })
            handleChangeCommon(popupValue)
          }
        },
      }
    })

    return {
      popupProps,
    }
  },
  // 【组件增强】注释详见：JVxeComponent.Enhanced
  enhanced: {
    aopEvents: {
      editActived({ $event }) {
        dispatchEvent({
          $event,
          props: this.props,
          className: '.ant-input',
          isClick: true,
        })
      },
    },
  } as JVxeComponent.EnhancedPartial,
})
</script>