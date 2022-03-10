<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="工单授权" @ok="handleSubmit" width="1200px">
    <!--工单授权部分-->
    <template v-for="(item,index) of processTypeDictOptions">
      <a-card :title="item.text" :style="{ marginTop:(index==0?'0px':'12px'),height:'auto' }" :headStyle="{ backgroundColor:'#eaeaea' }">
        <a-checkbox-group @change="designNameChange" v-model:value="designNameValue[index]" style="width: 100%">
          <a-row>
            <template v-for="(des) in designNameOption">
              <a-col :span="6" v-if="des.procType == item.value">
                <a-checkbox :value="des.value">{{ des.text }}</a-checkbox>
              </a-col>
            </template>
          </a-row>
        </a-checkbox-group>
      </a-card>
    </template>
    <!--树操作部分-->
    <template #insertFooter>
      <a-dropdown placement="topCenter">
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="checkALL">全部勾选</a-menu-item>
            <a-menu-item key="2" @click="cancelCheckALL">取消全选</a-menu-item>
          </a-menu>
        </template>
        <a-button style="float: left;">
          树操作 <Icon icon="ant-design:up-outlined" />
        </a-button>
      </a-dropdown>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import {ref, computed, unref} from 'vue';
  import {BasicModal, useModalInner} from '/src/components/Modal';
  import {getParentDesignList, getRoleDegisnList,saveRoleDesign} from '../role.api';
  import {initDictOptions} from '/@/utils/dict/index';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  //角色id
  const roleId = ref('');
  //原始工单id
  const oldDesignId = ref('');
  //新工单id
  const newDesignId = ref('');
  //工单字典类型
  const processTypeDict = ref([]);
  //工单字典类型项
  const processTypeDictOptions = ref([]);
  //工单集合
  const desformList = ref([]);
  //工单名称集合
  const designNameOption = ref([]);
  //工单数据集合
  const designNameValue = ref([]);
  //表单赋值
  const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
    setModalProps({confirmLoading: false});
    roleId.value = data.roleId;
    //初始化数据
    initData()
  });

  /**
   * 初始化数据
   */
  async function initData() {
    //获取字典配置
    let dictRes = await initDictOptions('bpm_process_type');
    if (dictRes) {
      processTypeDict.value = dictRes;
    }
    //获取表单设计信息
    let designList = await getParentDesignList();
    if (designList) {
      desformList.value = designList;
      //获取指定属性的数据集合
      let procTypeArr = [...new Set(Array.from(unref(designList), ({procType}) => procType))];
      //工单类型字典项
      processTypeDictOptions.value = processTypeDict.value.filter(item => procTypeArr.indexOf(item.value) != -1);
      //工单名称集合
      designNameOption.value = designList.map((design) => {
        return {value: design.id, text: design.desformName, procType: design.procType};
      })
    }
    //获取角色表单信息
    let roleDegisnList = await getRoleDegisnList({roleId: unref(roleId)})
    if (roleDegisnList.length > 0) {
      let{designName,designValues}= selectedDesign(roleDegisnList);
      oldDesignId.value = designName.join(",");
      newDesignId.value = designName.join(",");
      designNameValue.value = designValues;
    }
  }
  /**
   * 点击修改
   */
  function designNameChange(selectedValue) {
    newDesignId.value = unref(designNameValue).join(",");
  }
  /**
   * 全选
   */
  function checkALL(){
    let{designName,designValues}= selectedDesign(unref(desformList));
    designNameValue.value = designValues;
    newDesignId.value = designName.join(",");
  }
  /**
   * 取消全选
   */
  function cancelCheckALL(){
    designNameValue.value=[];
    newDesignId.value="";
  }
  /**
   * 选中工单信息
   */
  function selectedDesign(selectedList){
      let designName = [];
      let designValues = [];
      for(let option of unref(processTypeDictOptions)){
          let values = [];
          for (let value of selectedList) {
              if(option.value == value.procType){
                  designName.push(value.id);
                  values.push(value.id);
              }
          }
          designValues.push(values);
      }
      return {designName,designValues}
  }
  /**
   * 提交事件
   */
  async function handleSubmit() {
    try {
      setModalProps({confirmLoading: true});
      //提交表单
      await saveRoleDesign({roleId:unref(roleId),newDesignId:unref(newDesignId),oldDessignId:unref(oldDesignId)});
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({confirmLoading: false});
    }
  }
</script>
