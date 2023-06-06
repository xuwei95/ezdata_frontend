<template>
  <CardList
    :searchFormSchema="searchFormSchema"
    :params="params"
    :api="list"
    @getMethod="getMethod"
    @delete="handleDelete"
    @view="handleView"
    @design="handleDesign"
    @edit="handleEdit"
    @copy="handleCopy"
    @template="handleTemplate"
  >
    <template #header>
      <a-button preIcon="ant-design:plus-outlined" type="primary" @click="handleCreate">新增</a-button>
    </template>
    <template #cardTitle>
      <a-tabs defaultActiveKey="1" @change="tabChange" size="small">
        <a-tab-pane key="1">
          <template #tab>
            <span>
              <Icon icon="ant-design:bar-chart-outlined" :size="20"></Icon>
              仪表盘设计
            </span>
          </template>
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #tab>
            <span>
              <Icon icon="ant-design:star-outlined" :size="20"></Icon>
              模板
            </span>
          </template>
        </a-tab-pane>
      </a-tabs>
    </template>
  </CardList>
  <!--编辑弹窗-->
  <PageModal @register="registerModal" @success="handleOk" />
  <!--保护密码弹窗-->
  <PasswordModal ref="passwordRef" @success="checkPassOk"/>
  <!--页面配置弹窗-->
  <DragPageModal @register="registerDragModal" @success="success" :isLowApp="false"/>
</template>
<script lang="ts" setup name="drag-page">
  import CardList from './components/CardList.vue';
  import PageModal from './components/PageModal.vue';
  import PasswordModal from './components/PasswordModal.vue';
  import DragPageModal from './components/DragPageModal.vue';
  import { ref,reactive } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { router } from '/@/router';
  import { list, deleteOne, copyPage ,saveOrUpdate} from './page.api';
  import { searchFormSchema } from './page.data';

  const [registerModal, { openModal }] = useModal();
  const [registerDragModal, { openModal: openDragModal }] = useModal();
  const passwordRef = ref()
  let reload = (params?) => {};
   //额外的查询参数
  const params = reactive({type:"1",izTemplate:'0'});
  // 获取内部fetch方法;
  function getMethod(m: any) {
    reload = m;
  }
  /**
   * 提交后的回调
   */
  function handleOk(record) {
    reload();
    record && handleDesign(record);
  }

  /**
   * 新增事件
   */
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    //判断是否有保护密码
    let hasPassword = record.protectionCode && record.protectionCode.length > 0;
    if (hasPassword) {
      passwordRef.value.showModal('edit', record);
      //passwordRef.value.extraMsg = '面板被保护中,编辑前请先输入保护码';
    } else {
      openModal(true, {
        record,
        isUpdate: true,
      });
    }
  }
  /**
   * 密码校验成功
   */
  async function checkPassOk(type, record) {
    if (type == 'edit') {
      openModal(true, {
        record,
        isUpdate: true,
      });
    } else if (type == 'delete') {
      await deleteOne({ id: record.id }, reload);
    }
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    //判断是否有保护密码
    let hasPassword = record.protectionCode && record.protectionCode.length > 0;
    if (hasPassword) {
      passwordRef.value.showModal('delete', record);
      passwordRef.value.extraMsg = '面板被保护中,删除前请先输入保护码';
    } else {
      await deleteOne({ id: record.id }, reload);
    }
  }

  /**
   * 页面配置
   */
  function handleDesign(record) {
    openDragModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 页面预览
   */
  function handleView(id) {
    router.push({ name: 'drag-page-view-@id'!, params: { id } });
  }
  /**
   * 面板复制
   */
  async function handleCopy(id) {
    await copyPage({ id }, reload);
  }
  /**
   * 收藏模板
   */
  async function handleTemplate(id,template) {
    let params = {id, izTemplate:template};
    const res = await saveOrUpdate(params,true);
    console.log('handleTemplate-------------->res:',res)
    reload();
  }
  // 面板类型
  function tabChange(key) {
    if(key!=='3'){
      params.type = key;
      params.izTemplate = '0';
    }else{
      params.type = '';
      params.izTemplate = '1';
    }
    reload({pageNo:1});
  }

  /**
   * 成功回调，刷新列表
   */
  function success() {
    reload();
  }
</script>
