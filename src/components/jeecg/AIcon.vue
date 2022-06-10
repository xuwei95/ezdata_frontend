<template>
  <Icon :icon="icon"></Icon>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { isEmpty } from '/@/utils/is';

  export default defineComponent({
    name: 'AIcon',
    components: { Icon },
    props: {
      icon: String,
      type: String,
    },
    setup(props) {
      const icon = computed(() => {
        if (props.icon && !isEmpty(props.icon)) {
          return props.icon;
        }
        return `ant-design:${props.type}`;
      });

      return {
        icon,
      };
    },
  });
</script>

<style scoped></style>
