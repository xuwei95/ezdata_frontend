<template>
  <JInputPop
      :value="innerValue"
      :width="300"
      :height="210"
      v-bind="cellProps"
      style="width: 100%;"
      @blur="handleBlurCommon"
      @change="handleChangeCommon"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import JInputPop from '/@/components/Form/src/jeecg/components/JInputPop.vue'
import { dispatchEvent } from '/@/components/jeecg/JVxeTable/utils'
import { JVxeComponent } from '/@/components/jeecg/JVxeTable/types'
import { useJVxeComponent, useJVxeCompProps } from '/@/components/jeecg/JVxeTable/hooks'

export default defineComponent({
  name: 'JVxeTextareaCell',
  components: { JInputPop },
  props: useJVxeCompProps(),
  setup(props: JVxeComponent.Props) {
    const { innerValue, cellProps, handleChangeCommon, handleBlurCommon } = useJVxeComponent(props)
    return { innerValue, cellProps, handleChangeCommon, handleBlurCommon }
  },
  // 【组件增强】注释详见：JVxeComponent.Enhanced
  enhanced: {
    installOptions: {
      autofocus: '.ant-input',
    },
    aopEvents: {
      editActived({$event, column}) {
        // 是否默认打开右侧弹窗
        if ((column.params.defaultOpen ?? false)) {
          dispatchEvent({
            $event,
            props: this.props,
            className: '.ant-input-suffix .app-iconify',
            isClick: true,
          })
        }
      },
    },
  } as JVxeComponent.EnhancedPartial,
})
</script>
