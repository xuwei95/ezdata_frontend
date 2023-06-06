<template>
  <div class="p-2">
    <div class="bg-white mb-2 p-4">
      <BasicForm @register="registerForm" />
    </div>
    <a-spin :spinning="spinning">
      <div class="bg-white p-2">
        <slot name="cardTitle"></slot>
        <List :grid="{ gutter: 5, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: grid }" size="small" :data-source="data" :pagination="paginationProp">
          <template #header>
            <div class="flex justify-start space-x-2">
              <slot name="header"></slot>
              <Tooltip>
                <template #title>
                  <div class="w-50">每行显示数量</div>
                  <Slider id="slider" v-bind="sliderProp" v-model:value="grid" @change="sliderChange" />
                </template>
                <a-button type="primary" style="min-width: 80px">
                  <TableOutlined />
                </a-button>
              </Tooltip>
              <Tooltip>
                <template #title>刷新</template>
                <a-button @click="fetch">
                  <RedoOutlined />
                </a-button>
              </Tooltip>
            </div>
          </template>
          <template #renderItem="{ item, index }">
            <ListItem style="margin-top: 10px">
              <Card
                class="cardItem"
                size="small"
                :headStyle="{ textAlign: 'left', fontWeight: '500', background: '#efefef', minHeight: '20px' }"
                :bodyStyle="{ display: 'none' }"
              >
                <template #title>
                  <em class="aui-tag"><div class="aui-tag-re"></div><div class="aui-tag-ye"></div><div class="aui-tag-bl"></div></em>
                  <span class="lock-to-right" v-if="item.protectionCode">
                    <Icon icon="ant-design:lock-filled" :size="15" style="margin: 5px;"/>
                  </span>
                </template>
                <!--<template #extra>-->
                <!--<Dropdown :trigger="['hover']" :dropMenuList="getDropDownAction(item)" popconfirm>-->
                <!--<SettingOutlined />-->
                <!--</Dropdown>-->
                <!--</template>-->
                <template #cover>
                  <div class="title-div ellipsis">{{ item.name }}</div>
                  <div class="image-div" @click="handleDesign(item)">
                    <img :src="getCover(item.coverUrl)" />
                    <div class="image-mask">
                      <Icon icon="ant-design:eye-outlined" v-if="params.izTemplate === '1' && !hasAuth()" :size="60" />
                      <Icon icon="ri:drag-drop-fill" v-else :size="60" />
                    </div>
                  </div>
                </template>
                <template class="ant-card-actions" #actions>
                  <Tooltip>
                    <template #title>预览</template>
                    <EyeOutlined key="view" style="font-size: 20px" @click="handleView(item.id)" />
                  </Tooltip>
                  <Dropdown :trigger="['hover']" :dropMenuList="getDropDownAction(item)" popconfirm>
                    <SettingOutlined key="set" style="font-size: 20px" />
                  </Dropdown>
                </template>
              </Card>
            </ListItem>
          </template>
        </List>
      </div>
    </a-spin>
  </div>
</template>
<script lang="ts" setup>
  import { computed, onMounted, ref, unref } from 'vue';
  import { EyeOutlined, DeleteOutlined, EditOutlined, RedoOutlined, TableOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons-vue';
  import { Dropdown } from '/@/components/Dropdown';
  import { List, Card, Image, Tooltip, Slider, Popconfirm } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { propTypes } from '/@/utils/propTypes';
  import { isFunction } from '/@/utils/is';
  import { useSlider } from '/@/components/CardList/src/data';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getFileAccessHttpUrl } from '/@/utils/common/compUtils';
  import { usePermission } from '/@/hooks/web/usePermission';
  
  const { hasPermission } = usePermission();
  const ListItem = List.Item;
  const defCover = 'https://jeecgdev.oss-cn-beijing.aliyuncs.com/temp/designCover_1655434422024.png';
  const { createMessage } = useMessage();
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const spinning = ref<boolean>(false);
  const grid = ref(5);
  // 获取slider属性
  const sliderProp = computed(() => useSlider(4, 7));
  // 组件接收参数
  const props = defineProps({
    // 请求API的参数
    params: propTypes.object.def({}),
    //api
    api: propTypes.func,
    searchFormSchema: propTypes.object.def([]),
  });
  //暴露内部方法
  const emit = defineEmits(['getMethod', 'delete', 'edit', 'view', 'design', 'add', 'copy']);
  //数据
  const data = ref([]);
  // 切换每行个数
  // cover图片自适应高度
  //修改pageSize并重新请求数据
  const height = computed(() => {
    return `${200 - grid.value * 8}px`;
  });
  const width = computed(() => {
    let rowNum = grid.value;
    let width = rowNum==4?"360px":rowNum==6?"230px":rowNum==7?"190px":"280px";
    return width;
  });
  //表单
  const [registerForm, { validate }] = useForm({
    schemas: props.searchFormSchema,
    labelWidth: 80,
    // 操作按钮配置
    baseColProps: { span: 6 },
    actionColOptions: {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 8,
      xl: 8,
      xxl: 6,
      style: { textAlign: 'left' },
    },
    autoSubmitOnEnter: true,
    submitFunc: handleSubmit,
    resetFunc: handleReset,
  });

  //表单提交
  async function handleSubmit() {
    const data = await validate();
    //查询时设置首页
    pageNo.value = 1;
    await fetch(data);
  }

  //表单重置
  async function handleReset() {
    await fetch();
  }

  async function sliderChange(n) {
    pageSize.value = n * 3;
    const data = await validate();
    fetch(data);
  }

  // 自动请求并暴露内部方法
  onMounted(() => {
    fetch();
    emit('getMethod', fetch);
  });

  async function fetch(p = {}) {
    spinning.value = true;
    const { api, params } = props;
    if (api && isFunction(api)) {
      const res = await api({ ...params, pageNo: pageNo.value, pageSize: pageSize.value, ...p });
      data.value = res.records;
      total.value = res.total;
    }
    spinning.value = false;
  }

  //分页相关
  const pageNo = ref(1);
  const pageSize = ref(15);
  const total = ref(0);
  const paginationProp = ref({
    showSizeChanger: false,
    showQuickJumper: true,
    pageSize,
    pageNo,
    total,
    showTotal: (total) => `总 ${total} 条`,
    onChange: pageChange,
    onShowSizeChange: pageSizeChange,
  });

  async function pageChange(p, pz) {
    pageNo.value = p;
    pageSize.value = pz;
    const data = await validate();
    fetch(data);
  }

  async function pageSizeChange(current, size) {
    pageSize.value = size;
    const data = await validate();
    fetch(data);
  }

  /**
   * 获取封面图
   */
  function getCover(url) {
    return url ? getFileAccessHttpUrl(url) : defCover;
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    //1.如果是模板案例
    if(props.params.izTemplate === '1'){
      let commonAction = [];
      //1.1有权限的用户操作
      if(hasAuth()){
         commonAction = [
          {
            text: '编辑',
            event: '1',
            onClick: handleEdit.bind(null, record),
          },
          {
            text: '复制面板',
            event: '2',
            onClick: handleCopy.bind(null, record.id),
          },{
             text: '取消模板',
             event: '6',
             onClick: handleTemplate.bind(null, record,'0'),
           }
        ];
      }else{
        ///1.2没有权限的用户只能复制和预览
         commonAction = [
          {
            text: '复制面板',
            event: '2',
            onClick: handleCopy.bind(null, record.id),
          }
        ];
      }
      return commonAction;
    }else{
      //非模板案例的tab下的按钮显示
      let commonAction = [
        {
          text: '编辑',
          event: '1',
          onClick: handleEdit.bind(null, record),
        },
        {
          text: '复制面板',
          event: '2',
          onClick: handleCopy.bind(null, record.id),
        },
        {
          text: '复制路由',
          event: '3',
          onClick: handleCopyUrl.bind(null, record.path),
        },
      ];
      //模板按钮的显隐逻辑判断
      if(hasAuth()){
        if(record.izTemplate == '1'){
          commonAction.push({
            text: '取消模板',
            event: '6',
            onClick: handleTemplate.bind(null, record,'0'),
          })
        }else{
          commonAction.push({
            text: '收藏模板',
            event: '5',
            onClick: handleTemplate.bind(null, record,'1'),
          })
        }
      }

      //删除按钮的逻辑判断
      if(!hasPassword(record)){
        commonAction.push({
          text: '删除',
          event: '4',
          popConfirm: {
            title: '是否确认删除',
            confirm: handleDelete.bind(null, record),
          }
        })
      }else {
        commonAction.push({
          text: '删除',
          event: '4',
          onClick: handleDelete.bind(null, record),
        })
      }
      return commonAction;
    }
  }
  /**
   * 判断是否有模板操作权限
   */
  function hasAuth(){
    return hasPermission('drag:template:edit')
  }
  /**
   * 是否包含保护码
   **/
  function hasPassword(record){
    return record.protectionCode && record.protectionCode.length > 0;
  }
  /**
   * 复制面板
   * @param id
   */
  function handleCopy(id) {
    emit('copy', id);
  }

  /**
   * 复制路由地址
   * @param value
   */
  async function handleCopyUrl(value) {
    if (value) {
      clipboardRef.value = value;
      if (unref(copiedRef)) {
        createMessage.success('复制成功！');
      }
    } else {
      createMessage.warning('复制失败，请检查路径！');
    }
  }

  async function handleCreate() {
    emit('add');
  }

  async function handleEdit(record) {
    emit('edit', record);
  }

  async function handleDelete(record) {
    emit('delete', record);
  }

  async function handleView(id) {
    emit('view', id);
  }

  async function handleDesign(record) {
    if(props.params.izTemplate === '1' && !hasAuth()){
      //模板案例tab下并且没有操作权限时,只能预览
      emit('view', record.id);
    }else{
      emit('design', record);
    }
  }
  
  async function handleTemplate(record,izTemplate) {
    emit('template', record.id,izTemplate);
  }
</script>
<style scoped lang="less">
  .addItem {
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cardItem {
    width: v-bind('width');
    text-align: center;
    border-radius: 3px;
    box-shadow: 0 4px 5px rgb(0 0 0 / 20%);

    &:hover {
      box-shadow: 0 0 20px 0 #616161;
    }

    .title-div {
      height: 30px;
      line-height: 30px;
      background: #fff;
      font-weight: 500;
      font-size: 14px;
      border-bottom: 1px solid #efefef;
    }
    
    .ellipsis {
      display:block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .image-div {
      img {
        width: 100%;
        //object-fit: cover;
        height: v-bind('height');
      }

      &:hover {
        .image-mask {
          opacity: 1;
          cursor: default;
        }
      }

      .image-mask {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 100%;
        height: v-bind('height');
        bottom: 50px;
        background: rgba(101, 101, 101, 0.6);
        color: #fff;
        opacity: 0;
      }
    }

    .aui-tag {
      display: flex;

      div {
        width: 6px;
        height: 6px;
        background: #333;
        border-radius: 100px;
        margin: 0 2px;
      }

      .aui-tag-re {
        background: #ff5a52;
      }

      .aui-tag-ye {
        background: #e6c02a;
      }

      .aui-tag-bl {
        background: #53c22c;
      }
    }
  }
  /*右上角锁标记*/
  .lock-to-right{
      z-index: 0;
      color: #fff;
      position: absolute;
      right: 0;
      top: 0;
  }
  
  .lock-to-right::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    border-style: solid;
    border-width: 0 50px 40px 0;
    border-color: transparent #db2828 transparent transparent;
    z-index: -1
  }
</style>
