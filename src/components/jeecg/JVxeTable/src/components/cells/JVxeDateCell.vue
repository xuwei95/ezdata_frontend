<template>
  <a-date-picker :value="innerDateValue" allowClear :format="dateFormat" :showTime="isDatetime" dropdownClassName="j-vxe-date-picker" style="min-width: 0" v-bind="cellProps" @change="handleChange" />
</template>

<script lang="ts">
  import { ref, computed, watch, defineComponent } from 'vue';
  import moment from 'moment';
  import { dispatchEvent } from '/@/components/jeecg/JVxeTable/utils';
  import { JVxeComponent, JVxeTypes } from '/@/components/jeecg/JVxeTable/types';
  import { useJVxeComponent, useJVxeCompProps } from '/@/components/jeecg/JVxeTable/hooks';
  import { isEmpty } from '/@/utils/is';

  export default defineComponent({
    name: 'JVxeDateCell',
    props: useJVxeCompProps(),
    setup(props: JVxeComponent.Props) {
      const { innerValue, cellProps, originColumn, handleChangeCommon } = useJVxeComponent(props);
      const innerDateValue = ref<any>(null);
      const isDatetime = computed(() => props.type === JVxeTypes.datetime);
      const dateFormat = computed(() => {
        let format = originColumn.value.format;
        return format ? format : isDatetime.value ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
      });
      watch(
        innerValue,
        (val) => {
          if (val == null || isEmpty(val)) {
            innerDateValue.value = null;
          } else {
            innerDateValue.value = moment(val, dateFormat.value);
          }
        },
        { immediate: true }
      );

      function handleChange(_mom, dateStr) {
        handleChangeCommon(dateStr);
      }

      return {
        cellProps,
        isDatetime,
        dateFormat,
        innerDateValue,
        handleChange,
      };
    },
    // 【组件增强】注释详见：JVxeComponent.Enhanced
    enhanced: {
      aopEvents: {
        editActived({ $event, row, column }) {
          dispatchEvent({
            $event,
            row,
            column,
            props: this.props,
            instance: this,
            className: '.ant-calendar-picker',
            isClick: false,
            handler: (el) => el.children[0].click(),
          });
        },
      },
    } as JVxeComponent.EnhancedPartial,
  });
</script>
