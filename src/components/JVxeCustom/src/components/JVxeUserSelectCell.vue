<template>
  <div :class="[prefixCls]">
    <JSelectUser :value="selectedValue" :maxTagCount="1" :showButton="false" v-bind="cellProps" @change="handleChange" />
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { JSelectUser } from '/@/components/Form';
  import { JVxeComponent } from '/@/components/jeecg/JVxeTable/types';
  import { useJVxeComponent, useJVxeCompProps } from '/@/components/jeecg/JVxeTable/hooks';
  import { dispatchEvent } from '/@/components/jeecg/JVxeTable/utils';
  import { isArray, isEmpty, isString } from '/@/utils/is';

  export default defineComponent({
    name: 'JVxeUserSelectCell',
    components: { JSelectUser },
    props: useJVxeCompProps(),
    setup(props: JVxeComponent.Props) {
      const { innerValue, cellProps, handleChangeCommon, useCellDesign } = useJVxeComponent(props);
      const { prefixCls } = useCellDesign('user-select');

      const selectedValue = computed(() => {
        let val: any = innerValue.value;
        if (val == null) {
          return val;
        }
        if (isEmpty(val)) {
          return [];
        }
        if (isArray(val)) {
          return val;
        }
        if (isString(val)) {
          // @ts-ignore
          return val.split(',');
        }
        return [val];
      });
      // @ts-ignore
      const multiple = computed(() => cellProps.value.multi != false);

      function handleChange(values) {
        handleChangeCommon(values.join(','));
      }

      return {
        prefixCls,
        selectedValue,
        multiple,
        cellProps,
        handleChange,
      };
    },
    enhanced: {
      switches: {
        visible: true,
      },
      translate: {
        enabled: false,
      },
      aopEvents: {
        editActived({ $event }) {
          dispatchEvent({
            $event,
            props: this.props,
            className: '.ant-select .ant-select-selection-search-input',
            isClick: true,
          });
        },
      },
    } as JVxeComponent.EnhancedPartial,
  });
</script>

<style lang="less">
  // noinspection LessUnresolvedVariable
  @prefix-cls: ~'@{namespace}-vxe-cell-user-select';

  .@{prefix-cls} {
    // 限制tag最大长度为100px，防止选中文字过多的选项时换行
    .ant-select .ant-select-selection-overflow-item {
      max-width: 100px;
    }
  }
</style>
