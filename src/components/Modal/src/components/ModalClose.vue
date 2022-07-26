<template>
  <div :class="getClass" :style="{ width: closeWidth + 'px' }">
    <template v-if="canFullscreen">
      <Tooltip :title="t('component.modal.restore')" placement="bottom" v-if="fullScreen">
        <FullscreenExitOutlined role="full" @click="handleFullScreen" />
      </Tooltip>
      <Tooltip :title="t('component.modal.maximize')" placement="bottom" v-else>
        <FullscreenOutlined role="close" @click="handleFullScreen" />
      </Tooltip>
    </template>

    <!-- 是否开启评论区域 -->
    <template v-if="enableComment">
      <Tooltip title="关闭" placement="bottom" v-if="commentSpan > 0">
        <RightSquareOutlined @click="handleCloseComment" style="font-size: 16px" />
      </Tooltip>
      <Tooltip title="展开" placement="bottom" v-else>
        <LeftSquareOutlined @click="handleOpenComment" style="font-size: 16px" />
      </Tooltip>
    </template>

    <Tooltip :title="t('component.modal.close')" placement="bottom">
      <CloseOutlined @click="handleCancel" />
    </Tooltip>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { FullscreenExitOutlined, FullscreenOutlined, CloseOutlined, LeftSquareOutlined, RightSquareOutlined } from '@ant-design/icons-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Tooltip } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    name: 'ModalClose',
    components: { Tooltip, FullscreenExitOutlined, FullscreenOutlined, CloseOutlined, LeftSquareOutlined, RightSquareOutlined },
    props: {
      canFullscreen: { type: Boolean, default: true },
      fullScreen: { type: Boolean },
      enableComment: { type: Boolean, default: false },
      commentSpan: { type: Number, default: 0 },
    },
    emits: ['cancel', 'fullscreen', 'comment'],
    setup(props, { emit }) {
      const { prefixCls } = useDesign('basic-modal-close');
      const { t } = useI18n();

      const getClass = computed(() => {
        return [
          prefixCls,
          `${prefixCls}--custom`,
          {
            [`${prefixCls}--can-full`]: props.canFullscreen,
          },
        ];
      });

      function handleCancel(e: Event) {
        emit('cancel', e);
      }

      function handleFullScreen(e: Event) {
        e?.stopPropagation();
        e?.preventDefault();
        if (props.commentSpan == 0 || props.enableComment == false) {
          emit('fullscreen');
        }
      }

      //update-begin-author:taoyan date:2022-7-18 for: 关闭按钮的区域宽度 取决于是否有其他图标
      const closeWidth = computed(() => {
        if (props.canFullscreen && props.enableComment) {
          return 140;
        } else {
          return 96;
        }
      });
      //update-end-author:taoyan date:2022-7-18 for: 关闭按钮的区域宽度 取决于是否有其他图标

      /**
       * 开启评论区域
       * @param e
       */
      function handleOpenComment(e: Event) {
        e?.stopPropagation();
        e?.preventDefault();
        if (props.fullScreen == false) {
          emit('fullscreen');
        }
        emit('comment', true);
      }

      /**
       * 关闭评论区域
       * @param e
       */
      function handleCloseComment(e: Event) {
        e?.stopPropagation();
        e?.preventDefault();
        emit('comment', false);
      }

      return {
        t,
        getClass,
        prefixCls,
        handleCancel,
        handleFullScreen,
        closeWidth,
        handleOpenComment,
        handleCloseComment,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-modal-close';
  .@{prefix-cls} {
    display: flex;
    height: 95%;
    align-items: center;

    .ant-modal-close-x {
      width: 140px !important;
    }

    > span {
      margin-left: 48px;
      font-size: 16px;
    }

    &--can-full {
      > span {
        margin-left: 12px;
      }
    }

    &:not(&--can-full) {
      > span:nth-child(1) {
        &:hover {
          font-weight: 700;
        }
      }
      /** 展开/关闭 评论图标样式*/
      > span:nth-child(2) {
        &:hover {
          font-weight: 700;
        }
      }
    }

    & span:nth-child(1) {
      display: inline-block;
      padding: 10px;

      &:hover {
        color: @primary-color;
      }
    }
    /** 展开/关闭 评论图标样式*/
    & span:nth-child(2) {
      display: inline-block;
      padding: 10px 10px 10px 0;

      &:hover {
        color: @primary-color;
      }
    }

    & span:last-child {
      &:hover {
        color: @error-color;
      }
    }
  }
</style>
