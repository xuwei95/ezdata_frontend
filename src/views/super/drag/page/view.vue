<template>
  <div ref="exportRef">
    <ViewEngine :dragData="dragData" :token="getToken()" @go="compRouter" @btnClick="btnClick"></ViewEngine>  
  </div>
  
  <DemoModal @register="registerModal"/>
  <DesformViewModal @register="registerRecordModal" :showComment="false" :showFiles="false" :showDataLog="false"/>
    
</template>

<script lang="ts" name="drag-page-view" setup>
  import { ref, unref, reactive,computed, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {queryById} from './page.api';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useModal } from '/@/components/Modal';
  import { openWindow } from '/@/utils';
  import { getToken } from '/@/utils/auth';
  import { useUserStore } from '/@/store/modules/user';
  import DemoModal from '/@/views/system/examples/demo/DemoModal.vue';
  import {router} from "/@/router";
  import {useExportImage} from './useExportImage'
  
  const { setTitle } = useTabs();
  const userStore = useUserStore();
  //当前页面id
  const currentId: any = ref('');
  //当前路由信息
  const { currentRoute, push, resolve: pathResolve } = useRouter();
  //拖拽信息
  const dragData = ref({
    name: '',
    coverUrl: '',
    backgroundColor: '',
    theme: 'default',
    style: 'default',
    designType: 100,
    backgroundImage: '',
    componentData: [],
  });

  //初始化数据
  async function initData() {
    const { params, path } = unref(currentRoute);
    let id = params.id ? params.id : path.substr(path.lastIndexOf('/') + 1);
    currentId.value = id;
    const res = await queryById({ id });
    if (res.success) {
      console.info(123, res);
      await setTitle(res.result.name);
      let template = res.result.template ? JSON.parse(res.result.template) : [];
      dragData.value.componentData = template;
      dragData.value.name = res.result.name;
      dragData.value.coverUrl = res.result.coverUrl;
      dragData.value.backgroundColor = res.result.backgroundColor;
      dragData.value.backgroundImage = res.result.backgroundImage;
      dragData.value.designType = res.result.designType;
      dragData.value.theme = res.result.theme || 'default';
      dragData.value.style = res.result.style || 'default';
    }
  }
  //界面跳转
  function compRouter(url: any, params: any) {
    if (url && url.indexOf('http') > -1) {
      openWindow(url);
    } else {
      push({ path: url, query: params });
    }
  }
  //********************按钮问点击回调后的逻辑begin*****************************************
  const [registerModal, { openModal }] = useModal();
  // 注册创建记录弹窗
  const [registerRecordModal, { openModal: openRecordModal }] = useModal();
  const route = useRoute();

  /**
   * 跳转路由页面
   * @param path
   * @param openMode
   */
  function goPage(nextRoute, params) {
    if(params.openMode==='2'){
      // 新页面打开视图
      let winUrl = pathResolve(nextRoute);
      window.open(winUrl.href, '_blank')
    }else{
      // 当前页面打开视图
      push(nextRoute)
    }
  }
  
  function btnClick(params) {
    console.log("btnClick---->params",params);
    let operationType = params.operationType;
    if(operationType=='1'){
      let modalData = {
        mode: 'add',
        desformCode: params.worksheet.value,
        dataId: null,
        isOnline: false,
        viewId: '',
        lowAppId: route.params.appId
      }
      console.log('创建记录 打开modal的参数', modalData)
      openRecordModal(true, modalData);
    }else if(operationType=='2'){
      let appId = route.params.appId;
      let designFormCode = params.worksheet.value;
      let nextRoute = {
        path: `/myapp/${appId}/desform/${designFormCode}`,
      };
      if(params.view){
        nextRoute['query']={
          view: params.view
        }
      }
      console.log('打开视图 路由', nextRoute)
      goPage(nextRoute, params)
      //update-end-author:taoyan date:2023-2-23 for: QQYUN-3674【仪表盘】按钮配置，打开创建model和打开视图
    
    }else if(operationType=='3'){
      
      //update-begin-author:taoyan date:2023-3-1 for: QQYUN-4420【仪表盘】打开仪表盘 打不开或者跳转到后台了 应该在应用里边打开
      let appId = route.params.appId;
      let dragId = params.customPage.value;
      let nextRoute = {
        path: `/myapp/${appId}/drag/${dragId}`,
      };
      goPage(nextRoute, params);
      //update-end-author:taoyan date:2023-3-1 for: QQYUN-4420【仪表盘】打开仪表盘 打不开或者跳转到后台了 应该在应用里边打开
    
    }else if(operationType=='4'){
      //打开链接
     
    }
  }
  //********************按钮问点击回调后的逻辑end*****************************************

  //update-begin-author:taoyan date:2023-2-24 for: QQYUN-3663【应用】仪表盘页面上，添加分享和导出图片功能
  const emit = defineEmits(['loadOk']);
  const props = defineProps({
    routeInfo: {
      type: Object,
      default: ()=>{}
    },
  });
  const { exportRef, onExportImage } = useExportImage();
  watch(()=>props.routeInfo, (info)=>{
    if(info){
      if(info.exportImage){
        console.log('导出图片》》》');
        let name = dragData.value.name;
        onExportImage(name);
      }
    }
  }, {deep: true, immediate: true});
  //update-end-author:taoyan date:2023-2-24 for: QQYUN-3663【应用】仪表盘页面上，添加分享和导出图片功能
  
  initData();
</script>
<style lang="less" scoped>
  @import '@qiaoqiaoyun/drag-free/lib/index.css';
</style>
