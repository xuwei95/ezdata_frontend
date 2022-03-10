<template>
    <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" width="30%" @ok="handleSubmit" destroyOnClose showFooter>
        <a-form ref="formRef" :label-col="labelCol" :wrapper-col="wrapperCol" :model="router" :rules="validatorRules">
            <a-form-item label="路由ID" name="routerId">
                <a-input v-model:value="router.routerId" placeholder="路由唯一ID"/>
            </a-form-item>
            <a-form-item label="路由名称" name="name">
                <a-input v-model:value="router.name" placeholder="路由名称"/>
            </a-form-item>
            <a-form-item label="路由URI" name="uri">
                <a-input v-model:value="router.uri" placeholder="路由URL"/>
            </a-form-item>
            <a-form-item label="路由状态" name="status">
                <a-switch default-checked :checked-value="1" :un-checked-value="0" v-model:checked="router.status"/>
            </a-form-item>

            <a-form-item name="predicates" label="路由条件">
                <div v-for="(item,index) in router.predicates">
                    <a-divider>{{item.name}}
                        <Icon preIcon="mdi:access-point-remove" size="22" @click="removePredicate(router,index)"/>
                    </a-divider>
                    <div>
                        <template v-for="(tag, tagIndx) in item.args">
                            <a-input ref="inputRef2" v-if="tagIndx==currentTagIndex"  type="text" size="small" :style="{ width: '190px' }" v-model:value="state.inputValue" @change="handleInputChange" @blur="handleInputEditConfirm(item,tag,tagIndx)" @keyup.enter="handleInputEditConfirm(item,tag,tagIndx)"/>
                            <a-tag v-else :key="tag" style="margin-bottom:2px" :closable="true" @close="() => removeTag(item,tag)" @click="editTag(tag,tagIndx)">
                                {{ tag }}
                            </a-tag>
                        </template>
                        <a-input ref="inputRef" v-if="state.inputVisible&&index==currentNameIndex" type="text" size="small" :style="{ width: '100px' }" v-model:value="state.inputValue" @change="handleInputChange" @blur="handleInputConfirm(item)" @keyup.enter="handleInputConfirm(item)"/>
                        <a-tag v-else style="background: #fff; borderStyle: dashed;margin-bottom:2px" @click="showInput(item,index)">
                            <Icon type="plus"/>
                            新建{{item.name}}
                        </a-tag>
                    </div>
                </div>
                <p class="btn" style="padding-top: 10px">
                    <a-dropdown>
                        <template #overlay>
                            <a-menu @click="predicatesHandleMenuClick">
                                <a-menu-item :key="item" v-for="item in tagArray">{{item}}</a-menu-item>
                            </a-menu>
                        </template>
                        <a-button type="dashed" style="margin-left: 8px;width:100%"> 添加路由条件
                            <Icon type="down"/>
                        </a-button>
                    </a-dropdown>
                </p>
            </a-form-item>
            <a-form-item name="predicates" label="过滤器">
                <div v-for="(item,index) in router.filters">
                    <a-divider>{{item.name}}
                        <Icon type="delete" size="22" @click="removeFilter(router,index)"/>
                    </a-divider>
                    <div v-for="(tag, index) in item.args" :key="tag.key">
                        <a-input v-model:value="tag.key" placeholder="参数键" style="width: 45%; margin-right: 8px"/>
                        <a-input v-model:value="tag.value" placeholder="参数值" style="width: 40%; margin-right: 8px;margin-top: 3px"/>
                        <Icon class="dynamic-delete-button" type="minus-circle-o" @click="removeFilterParams(item,index)"/>
                    </div>
                    <a-button type="dashed" style="margin-left:28%;width: 37%;margin-top:5px" size="small" @click="addFilterParams(item)">
                        <Icon type="plus"/>
                        添加参数
                    </a-button>
                </div>
                <p class="btn" style="padding-top: 10px">
                    <a-dropdown>
                        <template #overlay>
                            <a-menu @click="filterHandleMenuClick">
                                <a-menu-item :key="item.key" :name="item.name" v-for="item in filterArray">{{item.name}}</a-menu-item>
                            </a-menu>
                        </template>
                        <a-button type="dashed" style="margin-left: 8px;width:100%"> 添加过滤器
                            <Icon type="down"/>
                        </a-button>
                    </a-dropdown>
                </p>
            </a-form-item>
        </a-form>

    </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, useAttrs, reactive,nextTick } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/src/components/Drawer';
  import { saveOrUpdateRoute } from './route.api';
  import { saveOrUpdateTenant } from '../../system/tenant/tenant.api';
  // 声明Emits
  const emit = defineEmits(['register', 'success']);
  const labelCol = reactive({
    xs: { span: 24 },
    sm: { span: 5 },
  });
  const wrapperCol = reactive({
    xs: { span: 24 },
    sm: { span: 16 },
  });
  const attrs = useAttrs();
  const isUpdate = ref(true);
  const inputRef = ref();
  const inputRef2 = ref();
  let state = reactive({
    inputVisible: false,
    inputValue: '',
  });
  const currentNameIndex = ref(0);
  const currentTagIndex = ref(-1);
  const validatorRules = {
    routerId: [
      { required: true, message: 'routerId不能为空', trigger: 'blur' },
    ],
    name: [
      { required: true, message: '路由名称不能为空', trigger: 'blur' },
    ],
    uri: [
      { required: true, message: 'uri不能为空', trigger: 'blur' },
    ],
  };
  const filterArray = [{ key: 0, name: '熔断器' }, { key: 1, name: '限流过滤器' }];
  const tagArray = ref(['Path', 'Host', 'Cookie', 'Header', 'Method', 'Query', 'After', 'Before', 'Between', 'RemoteAddr']);
  const formRef = ref();
  let router = reactive({});

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    isUpdate.value = !!data?.isUpdate;
    setDrawerProps({ confirmLoading: false });
    initRouter();
    if (unref(isUpdate)) {
      router = Object.assign(router, data.record);
    }
  });
  /**
   * 标题
   */
  const getTitle = computed(() => (!unref(isUpdate) ? '新增路由' : '编辑路由'));


  //删除路由条件配置项
  function removeTag(item, removedTag) {
    let tags = item.args.filter(tag => tag !== removedTag);
    item.args = tags;
  }

  //初始化参数
  function initRouter() {
    router = Object.assign(router, {
      id: '',
      routerId: '',
      name: '',
      uri: '',
      status: 1,
      predicates: [],
      filters: [],
    });
  }

  //添加路由选项
  function predicatesHandleMenuClick(e) {
    router.predicates.push({
      args: [],
      name: e.key,
    });
  }

  function editTag(tag, index) {
    currentTagIndex.value = index;
    state.inputValue=tag;
    nextTick(() => {
      inputRef2.value.focus();
    });
  }

  //显示输入框
  function showInput(item, index) {
    state.inputValue='';
    state.inputVisible = true;
    currentNameIndex.value = index;
    nextTick(() => {
      inputRef.value.focus();
    });
  }

  //路由选项输入框改变事件
  function handleInputChange(e) {
    console.info("change",e)
    console.info("change",e.target.value)
    //state.value = e.target.value;
    //state.tag=true;

  }

  //删除路由条件
  function removePredicate(item, index) {
    item.predicates.splice(index, 1);
  }

  //删除过滤器参数
  function removeFilterParams(item, index) {
    item.args.splice(index, 1);
  }

  //删除过滤器
  function removeFilter(item, index) {
    item.filters.splice(index, 1);
  }

  //添加过滤器参数
  function addFilterParams(item) {
    item.args.push({
      key: 'key' + item.args.length + 1,
      value: '',
    });
  }

  //过滤器添加事件
  function filterHandleMenuClick(e) {
    if (e.key == 0) {
      router.filters.push({
        args: [{
          key: 'name',
          value: 'default',
        }, {
          key: 'fallbackUri',
          value: 'forward:/fallback',
        }],
        name: 'Hystrix',
        title: filterArray[0].name,
      });
    }
    console.info('test', router);
    if (e.key == 1) {
      router.filters.push({
        args: [{
          key: 'key-resolver',
          value: '#{@ipKeyResolver}',
        }, {
          key: 'redis-rate-limiter.replenishRate',
          value: 20,
        }, {
          key: 'redis-rate-limiter.burstCapacity',
          value: 20,
        }],
        name: 'RequestRateLimiter',
        title: filterArray[1].name,
      });
    }
  }

  //输入框确认
  function handleInputConfirm(item) {
    let tags = item.args;
    const inputValue = state.inputValue;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      item.args = [...tags, state.inputValue];
    }
    state.inputVisible=false;
    state.inputValue='';
    currentTagIndex.value = -1;
    currentNameIndex.value = -1;
  }

  //输入框确认
  function handleInputEditConfirm(item, tag, index) {
    const inputValue = state.inputValue;
    if (inputValue) {
      item.args[index] = state.inputValue;
    }
    currentTagIndex.value = -1;
    currentNameIndex.value = -1;

  }

  //关闭弹窗
  function handleCancel() {

  }

  /**
   * 提交
   */
  async function handleSubmit() {
    await formRef.value.validate().then(() => {
      try {
        setDrawerProps({ confirmLoading: true });
        console.log('formData', JSON.stringify(router));
        router.predicates = JSON.stringify(router.predicates);
        router.filters = JSON.stringify(router.filters);
        //提交表单
        saveOrUpdateRoute({ router: router }).then(() => {
          //刷新列表
          emit('success');
          closeDrawer();
        });

      } finally {
        setDrawerProps({ confirmLoading: false });
      }
    });
  }
</script>
