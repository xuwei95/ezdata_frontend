<template>
  <BasicModal
    v-bind="$attrs"
    :footer="null"
    wrapClassName="drag-design-process-modal"
    :style="{ top: '0', padding: '0' }"
    @register="registerModal"
    :bodyStyle="bodyStyle"
    :canFullscreen="false"
    :closable="false"
    defaultFullscreen
    destroyOnClose
  >
    <div id="dragEngineBox" style="height:100vh;overflow-y: auto">
      <DragEngine
          v-if="refresh"
          :dragData="dragData"
          :pageId="pageId"
          :token="getToken()"
          :tenantId="getTenantId()"
          :lowAppId="lowAppId"
          :isLowApp="false"
          @save="handleSave"
          @close="handleClose"
          @scroll="handleScroll"
          @openWindow="openWindow"
      >
      </DragEngine>
    </div>
  </BasicModal>
  <PasswordModal ref="passwordRef" @closed="closeModal"></PasswordModal>
</template>

<script lang="ts" setup>
  import { ref, unref, reactive, nextTick,computed } from 'vue';
  import { getToken,getTenantId } from '/@/utils/auth';
  import { queryById } from '../page.api';
  import { BasicModal, useModalInner } from '/src/components/Modal';
  import { getCacheByDynKey } from '/@/utils/auth';
  import { JDragConfigEnum } from '/@/enums/jeecgEnum';
  import PasswordModal from './PasswordModal.vue';
  // 声明Emits
  const emit = defineEmits(['success', 'register', 'close']);
  const bodyStyle = {
    padding: '0',
    height: window.innerHeight + 'px',
  };

  //组件接受传参
  const props = defineProps({
    lowAppId: { type: String },
    // 是否低代码模式（简化使用难度）
    isLowApp: { type: Boolean, default: true }
  });
  

  //页面Id
  const pageId = ref('');
  const title = ref('');
  const refresh = ref(true);
  const passwordRef = ref();
  //拖拽信息
  const dragData = ref({
    componentData: [],
    name: '',
    coverUrl: '',
    backgroundColor: '',
    backgroundImage: '',
    designType: 100,
    theme: 'default',
    style: 'default',
    updateCount: null,
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ showCancelBtn: false, showOkBtn: false });
    refresh.value = false;
    pageId.value = data.record.id;
    //校验保护码
    checkCode(data.record);
    title.value = `页面设计 [${data.record.name}]`;
    const res = await queryById({ id: unref(pageId) });
    if (res.success) {
      dragData.value.name = res.result.name;
      dragData.value.coverUrl = res.result.coverUrl;
      let template = res.result.template ? JSON.parse(res.result.template) : [];
      dragData.value.componentData = template;
      dragData.value.backgroundColor = res.result.backgroundColor;
      dragData.value.backgroundImage = res.result.backgroundImage;
      dragData.value.designType = res.result.designType;
      dragData.value.style = res.result.style || 'default';
      dragData.value.theme = res.result.theme || 'default';
      //设置乐观锁字段
      dragData.value.updateCount = res.result.updateCount;
    }
    setTimeout(() => {
      nextTick(() => {
        refresh.value = true;
      });
    }, 300);
  });
  /**
   * 检验保护码
   */
  function checkCode(result) {
    const password = result.protectionCode;
    let passIsExit = getCacheByDynKey(JDragConfigEnum.DRAG_CACHE_PREFIX + unref(pageId));
    let hasPassword = password && password.length > 0;
    if (hasPassword && !passIsExit) {
      passwordRef.value.showModal('design', result);
      passwordRef.value.extraMsg = '';
    }
  }
  /**
   * 关闭事件
   */
  function handleClose() {
    closeModal();
    emit('success');
    emit('close')
  }
  /**
   * 保存布局后的回调事件
   * @param data
   */
  function handleSave(data) {
    //保存后不关闭modal
    //closeModal()
    emit('success');
  }
  /**
   * 新增组件后的滚动事件
   * @param data
   */
  function handleScroll(scrollHeight) {
    let dom = document.getElementById("dragEngineBox");
    scrollIntoView(dom,scrollHeight)
  }
  
  /**
   * 模拟滚动效果
   * @param element 滚动元素
   * @param scrollHeight 滚动高度
   */
  function scrollIntoView(element,scrollHeight) {
    // 当前滚动高度
    let scrollTop = element.scrollTop;
    // 滚动step方法
    const step = () =>{
      // 距离目标滚动距离
      let distance = scrollHeight - scrollTop;
      // 目标需要滚动的距离，也就是只走全部距离的十分之一
      scrollTop = scrollTop + distance / 10;
      if (Math.abs(distance) < 1) {
        element.scrollTo(0, scrollHeight);
      } else {
        element.scrollTo(0, scrollTop);
        setTimeout(step, 20);
      }
    };
    step();
  }

  /**
   * 打开分享
   * @param url
   */
  function openWindow(url){
    window.open(url, '_blank');
  }
</script>
<style lang="less">
  @import '@qiaoqiaoyun/drag-free/lib/index.css';
  
  .drag-design-process-modal {
    .ant-modal-header {
      padding: 0 !important;
    }
    .ant-modal-body > .scrollbar {
      padding-top: 0;
    }
    
    .jeecg-modal-content > .scroll-container {
      padding: 0 !important;
    }
  }
</style>
