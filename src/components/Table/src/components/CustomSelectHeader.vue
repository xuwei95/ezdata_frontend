<!-- 自定义选择列，表头实现部分 -->
<template>
  <a-checkbox :checked="checked" :indeterminate="isHalf" @update:checked="onChange" />
</template>
<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps({
    selectedLength: {
      type: Number,
      required: true,
    },
    // 当前页条目数
    pageSize: {
      type: Number,
      required: true,
    },
  });
  const emit = defineEmits(['select-all']);

  // 是否全选
  const checked = computed(() => {
    return props.selectedLength > 0 && props.selectedLength >= props.pageSize;
  });

  // 是否半选
  const isHalf = computed(() => {
    return props.selectedLength > 0 && props.selectedLength < props.pageSize;
  });

  function onChange(checked: boolean) {
    emit('select-all', checked);
  }
</script>

<style scoped lang="scss"></style>
