<template>
  <!-- 按钮区域 -->
  <div class="j-super-query-button">
    <a-tooltip v-if="superQueryFlag" :mouseLeaveDelay="0.2">
      <template #title>
        <span>已有高级查询条件生效</span>
        <divider type="vertical" style="background-color: #fff" />
        <a @click="handleReset">清空</a>
      </template>
      <a-button-group>
        <a-button type="primary" @click="handleOpen">
          <AppstoreTwoTone :spin="true" />
          <span>高级查询</span>
        </a-button>
      </a-button-group>
    </a-tooltip>
    <a-button v-else type="primary" preIcon="ant-design:filter-outlined" @click="handleOpen"> 高级查询 </a-button>
  </div>

  <!-- 高级查询弹框 -->
  <teleport to="body">
    <BasicModal title="高级查询构造器" :canFullscreen="false" :width="1050" @register="registerFormModal" @ok="handleSubmit">
      <template #footer>
        <div style="float: left">
          <a-button :loading="loading" @click="handleReset">重置</a-button>
          <a-button :loading="loading" @click="handleSave">保存查询条件</a-button>
        </div>

        <a-button key="submit" type="primary" @click="handleSubmit">确定</a-button>
        <a-button key="back" @click="handleCancel">关闭</a-button>
      </template>

      <a-empty v-if="dynamicRowValues.values.length == 0">
        <div slot="description">
          <span>没有任何查询条件</span>
          <a-divider type="vertical" />
          <a @click="addOne(-1)">点击新增</a>
        </div>
      </a-empty>

      <a-row :class="'j-super-query-modal-content'">
        <a-col :sm="24" :md="18">
          <a-row v-show="dynamicRowValues.values.length > 0">
            <a-col :md="12" :xs="24">
              <a-form-item label="过滤条件匹配" :labelCol="{ md: 6, xs: 24 }" :wrapperCol="{ md: 18, xs: 24 }" style="width: 100%">
                <a-select v-model:value="matchType" :getPopupContainer="(node) => node.parentNode" style="width: 100%">
                  <a-select-option value="and">AND（所有条件都要求匹配）</a-select-option>
                  <a-select-option value="or">OR（条件中的任意一个匹配）</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-form v-show="dynamicRowValues.values.length > 0" ref="formRef" :class="'jee-super-query-form'" :model="dynamicRowValues" @finish="onFinish">
            <a-space v-for="(item, index) in dynamicRowValues.values" :key="item.key" style="display: flex; margin-bottom: 8px" align="baseline">
              <a-form-item :name="['values', index, 'field']" style="width: 180px">
                <a-tree-select
                  style="width: 100%"
                  placeholder="请选择字段"
                  v-model:value="item.field"
                  show-search
                  tree-node-filter-prop="title"
                  allow-clear
                  tree-default-expand-all
                  :dropdown-style="{ maxHeight: '180px', overflow: 'auto' }"
                  @change="handleChangeField(item)"
                  :tree-data="fieldTreeData"
                >
                </a-tree-select>
              </a-form-item>
              <a-form-item :name="['values', index, 'rule']" style="width: 180px">
                <a-select style="width: 100%" placeholder="请选择匹配规则" v-model:value="item.rule">
                  <a-select-option value="eq">等于</a-select-option>
                  <a-select-option value="like">模糊</a-select-option>
                  <a-select-option value="right_like">以..开始</a-select-option>
                  <a-select-option value="left_like">以..结尾</a-select-option>
                  <a-select-option value="in">在...中</a-select-option>
                  <a-select-option value="ne">不等于</a-select-option>
                  <a-select-option value="gt">大于</a-select-option>
                  <a-select-option value="ge">大于等于</a-select-option>
                  <a-select-option value="lt">小于</a-select-option>
                  <a-select-option value="le">小于等于</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :name="['values', index, 'val']" style="width: 280px">
                <online-super-query-val-component
                  style="width: 100%"
                  :schema="getSchema(item, index)"
                  :formModel="item"
                  :setFormModel="
                    (key, value) => {
                      setFormModel(key, value, item);
                    }
                  "
                />
              </a-form-item>

              <a-form-item>
                <a-button @click="addOne(index)" style="margin-right: 6px">
                  <PlusOutlined #icon />
                </a-button>
                <a-button @click="removeOne(item)">
                  <MinusCircleOutlined #icon />
                </a-button>
              </a-form-item>
            </a-space>
          </a-form>
        </a-col>

        <a-col :sm="24" :md="6">
          <!-- 查询记录 -->
          <a-card class="j-super-query-history-card" :bordered="true">
            <template #title><div>保存的查询</div></template>
            <a-empty v-if="saveTreeData.length === 0" class="j-super-query-history-empty" description="没有保存任何查询" />
            <a-tree v-else class="j-super-query-history-tree" :treeData="saveTreeData" :selectedKeys="[]" :show-icon="true" @select="handleTreeSelect">
              <template #title="{ title }">
                <div>
                  <span :title="title">{{ title.length > 10 ? title.substring(0, 10) + '...' : title }}</span>
                  <span class="icon-cancle"><close-circle-outlined @click="handleRemoveSaveInfo(title)" /></span>
                </div>
              </template>
              <!-- antd-2是这么写的 升级到3会也许会改变写法 -->
              <template #custom>
                <file-text-outlined />
              </template>
            </a-tree>
          </a-card>
        </a-col>
      </a-row>
    </BasicModal>
  </teleport>

  <!-- 保存信息弹框 -->
  <a-modal title="请输入保存的名称" :visible="saveInfo.visible" @cancel="saveInfo.visible = false" @ok="doSaveQueryInfo">
    <div style="height: 80px; line-height: 75px; width: 100%; text-align: center">
      <a-input v-model:value="saveInfo.title" style="width: 90%" placeholder="请输入保存的名称"></a-input>
    </div>
  </a-modal>
</template>

<script lang="ts">
  import { ref, watch } from 'vue';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { useSuperQuery } from './useSuperQuery';
  import OnlineSuperQueryValComponent from './SuperQueryValComponent.vue';
  import { MinusCircleOutlined, PlusOutlined, FileTextOutlined, CloseCircleOutlined, AppstoreTwoTone } from '@ant-design/icons-vue';
  import { Divider } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default {
    name: 'OnlineSuperQuery',
    props: {
      config: {
        type: Object,
        default: [],
      },
      status: {
        type: Boolean,
        default: false,
      },
    },
    components: {
      BasicModal,
      MinusCircleOutlined,
      PlusOutlined,
      OnlineSuperQueryValComponent,
      FileTextOutlined,
      CloseCircleOutlined,
      AppstoreTwoTone,
      Divider,
    },
    emits: ['search'],
    setup(props, { emit }) {
      const [registerFormModal, formModal] = useModal();
      const { createMessage: $message } = useMessage();
      /**
       * 关闭按钮事件
       */
      function handleCancel() {
        formModal.closeModal();
      }

      /**
       * 确认按钮事件
       */
      function handleSubmit() {
        //console.log('handleSubmit', dynamicRowValues.values)
        let dataArray = getQueryInfo(true);
        if (dataArray && dataArray.length > 0) {
          let result = getSuperQueryParams(dataArray);
          //console.log('查询数据1', dataArray)
          //console.log('查询数据2', result)
          emit('search', result);
        } else {
          $message.warning('空条件无法查询！');
        }
      }

      function getSuperQueryParams(dataArray) {
        let arr: any = [];
        for (let item of dataArray) {
          let field = item.field;
          let val = item.val;
          if (val instanceof Array) {
            val = val.join(',');
          }
          arr.push({
            ...item,
            field,
            val,
          });
        }
        if (arr.length > 0) {
          superQueryFlag.value = true;
        } else {
          superQueryFlag.value = false;
        }
        let result = {
          superQueryMatchType: matchType.value,
          superQueryParams: encodeURI(JSON.stringify(arr)),
        };
        return result;
      }

      /**
       * 重置按钮事件
       */
      function handleReset() {
        dynamicRowValues.values = [];
        addOne(false);
        let result = getSuperQueryParams([]);
        emit('search', result);
      }

      const {
        formRef,
        init,
        dynamicRowValues,
        matchType,
        registerModal,

        handleSave,
        doSaveQueryInfo,
        saveInfo,
        saveTreeData,
        handleTreeSelect,
        handleRemoveSaveInfo,
        fieldTreeData,
        addOne,
        removeOne,
        setFormModel,
        getSchema,
        loading,
        getQueryInfo,
        initDefaultValues,
      } = useSuperQuery();

      /*--------------------按钮区域-beign------------------*/
      const superQueryFlag = ref(false);
      watch(
        () => props.status,
        (val) => {
          superQueryFlag.value = val;
        },
        { immediate: true }
      );

      function handleOpen() {
        formModal.openModal();
        addOne(true);
      }
      /*--------------------按钮区域-end------------------*/

      function getPopupContainer() {
        return document.getElementsByClassName('jee-super-query-form')[0];
      }
      function onFinish(a) {
        console.log('onfinish', a);
      }

      function handleChangeField(item) {
        item['val'] = '';
      }

      watch(
        () => props.config,
        (val) => {
          if (val) {
            console.log('123', val);
            console.log('123', val);
            console.log('123', val);
            Object.keys(val).map((k) => {
              console.log(k, val[k]);
            });
            console.log('123', val);
            console.log('123', val);
            console.log('123', val);
            init(val);
          }
        },
        { immediate: true }
      );

      return {
        formRef,
        registerFormModal,
        init,
        handleChangeField,
        dynamicRowValues,
        matchType,
        registerModal,
        handleSubmit,
        handleCancel,
        handleSave,
        handleReset,
        doSaveQueryInfo,
        saveInfo,
        saveTreeData,
        handleTreeSelect,
        handleRemoveSaveInfo,
        fieldTreeData,
        addOne,
        removeOne,
        setFormModel,
        getSchema,
        loading,
        onFinish,
        getPopupContainer,
        superQueryFlag,
        handleOpen,
        initDefaultValues,
      };
    },
  };
</script>

<style scoped lang="less">
  .jee-super-query-form .ant-form-item {
    margin-bottom: 9px;
  }
  .j-super-query-history-tree {
    ::v-deep .ant-tree-switcher {
      width: 0px;
    }
    ::v-deep .ant-tree-node-content-wrapper {
      width: 100%;
      &:hover {
        background-color: #e6f7ff !important;
        border-radius: 0;
      }
    }
    ::v-deep .ant-tree-treenode-switcher-close {
      .ant-tree-title {
        display: inline-block;
        width: calc(100% - 30px);
        > div {
          display: flex;
          justify-content: space-between;
          .icon-cancle {
            display: none;
            color: #666666;
            &:hover {
              color: black;
            }
          }
        }
      }
      &:hover {
        .icon-cancle {
          display: inline-block !important;
        }
      }
    }
    ::v-deep .ant-card-body {
      padding: 0;
    }
  }
  .j-super-query-history-card {
    ::v-deep .ant-card-body,
    ::v-deep.ant-card-head-title {
      padding: 0;
    }
  }

  /*VUEN-1087 【移动端】高级查询显示不全 */
  @media only screen and(max-width: 1050px) {
    ::v-deep .jee-super-query-form {
      .ant-space {
        flex-direction: column;
        gap: 0 !important;
        margin-bottom: 16px !important;
      }
      .ant-space-item {
        width: 100%;
      }
      .ant-form-item {
        width: 100% !important;
      }
    }
  }
</style>
