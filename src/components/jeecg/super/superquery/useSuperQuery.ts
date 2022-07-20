import { useModalInner } from '/@/components/Modal';
import { randomString } from '/@/utils/common/compUtils';
import { reactive, ref, toRaw, watch } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { Modal } from 'ant-design-vue';
import { createLocalStorage } from '/@/utils/cache';
import { useRoute } from 'vue-router';

/**
 * 表单类型转换成查询类型
 * 普通查询和高级查询组件区别 ：高级查询不支持联动组件
 */
const FORM_VIEW_TO_QUERY_VIEW = {
  password: 'text',
  file: 'text',
  image: 'text',
  textarea: 'text',
  umeditor: 'text',
  markdown: 'text',
  checkbox: 'list_multi',
  radio: 'list',
};

// 查询条件存储编码前缀
const SAVE_CODE_PRE = 'JSuperQuerySaved_';

/**
 * 查询项
 * */
interface SuperQueryItem {
  field: string | undefined;
  rule: string | undefined;
  val: string | number;
  key: string;
}
/**
 * 查询项-第一个控件树model
 * */
interface TreeModel {
  title: string;
  value: string;
  isLeaf?: boolean;
  disabled?: boolean;
  children?: TreeModel[];
  order?: number;
}

/**
 * 查询信息保存结构
 * */
interface SaveModel {
  title: string;
  content: string;
  type: string;
}

export function useSuperQuery() {
  const { createMessage: $message } = useMessage();
  /** 表单ref*/
  const formRef = ref<any>();

  /** 数据*/
  const dynamicRowValues = reactive<{ values: SuperQueryItem[] }>({
    values: [],
  });
  /** and/or */
  const matchType = ref('and');

  // 弹框显示
  const [registerModal, { setModalProps }] = useModalInner(() => {
    setModalProps({ confirmLoading: false });
  });

  // 高级查询类型不支持联动组件，需要额外设置联动组件的view为text
  const view2QueryViewMap = Object.assign({}, { link_down: 'text' }, FORM_VIEW_TO_QUERY_VIEW);

  /**
   * 确认按钮事件
   */
  function handleSubmit() {
    console.log('handleSubmit', dynamicRowValues.values);
  }

  /**
   * 关闭按钮事件
   */
  function handleCancel() {
    //closeModal();
  }

  /**
   * val组件赋值
   */
  function setFormModel(key: string, value: any, item: any) {
    console.log('setFormModel', key, value);
    // formModel[key] = value;
    item['val'] = value;
  }

  // 字段-Properties
  const fieldProperties = ref<any>({});
  // 字段-左侧查询项-树控件数据
  const fieldTreeData = ref<any>([]);

  /**
   * 初始化数据-最开始的方法
   * 1.获取 表名@字段名-->配置 这样的一个map
   * 2.获取树形结构的数据 显示:文本； 存储:表名@字段名
   * 当树改变时，及时获取配置更新表单
   * @param json
   */
  function init(json) {
    let { allFields, treeData } = getAllFields(json);
    fieldProperties.value = allFields;
    fieldTreeData.value = treeData;
  }

  /**
   * 左侧查询项 添加一行
   * @param index
   */
  function addOne(index) {
    let item = {
      field: undefined,
      rule: 'eq',
      val: '',
      key: randomString(16),
    };
    if (index === false) {
      // 重置后需要调用
      dynamicRowValues.values = [];
      dynamicRowValues.values.push(item);
    } else if (index === true) {
      // 打开弹框是需要调用
      if (dynamicRowValues.values.length == 0) {
        dynamicRowValues.values.push(item);
      }
    } else {
      // 其余就是 正常的点击加号增加行
      dynamicRowValues.values.splice(++index, 0, item);
    }
  }

  /**
   * 左侧查询项 删除一行
   */
  function removeOne(item: SuperQueryItem) {
    let arr = toRaw(dynamicRowValues.values);
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
      if (item.key == arr[i].key) {
        index = i;
        break;
      }
    }
    if (index != -1) {
      dynamicRowValues.values.splice(index, 1);
    }
  }

  // 默认的输入框
  const defaultInput = {
    field: 'val',
    label: '测试',
    component: 'Input',
  };

  /**
   * 左侧查询项 val组件 schema获取, 替代左侧字段树的change事件
   * @param item
   * @param index
   */
  function getSchema(item, index) {
    let map = fieldProperties.value;
    let prop = map[item.field];
    if (!prop) {
      return defaultInput;
    }
    if (view2QueryViewMap[prop.view]) {
      // 如果出现查询条件联动组件出来的场景，请跟踪此处
      prop.view = view2QueryViewMap[prop.view];
    }
    let temp;
    // temp.setFormRef(formRef)
    temp.noChange();
    // 查询条件中的 下拉框popContainer为parentNode
    temp.asSearchForm();
    temp.updateField(item.field + index);
    const setFieldValue = (values) => {
      item['val'] = values[item.field];
    };
    temp.setFunctionForFieldValue(setFieldValue);
    let schema = temp.getFormItemSchema();
    //schema['valueField'] = 'val'
    return schema;
  }

  /*-----------------------右侧保存信息相关-begin---------------------------*/

  /**
   * 右侧树 的 数据
   */
  const saveTreeData = ref<any>('');
  // 本地缓存
  const $ls = createLocalStorage();
  //需要保存的信息（一条）
  const saveInfo = reactive({
    visible: false,
    title: '',
    content: '',
    saveCode: '',
  });
  //按钮loading
  const loading = ref(false);

  // 当前页面路由
  const route = useRoute();
  // 监听路由信息，路由发生改变，则重新获取保存的查询信息-->currentPageSavedArray
  watch(
    () => route.fullPath,
    (val) => {
      console.log('fullpath', val);
      initSaveQueryInfoCode();
    }
  );

  // 当前页面存储的 查询信息
  const currentPageSavedArray = ref<SaveModel[]>([]);
  // 监听当前页面是否有新的数据保存了，然后更新右侧数据->saveTreeData
  watch(
    () => currentPageSavedArray.value,
    (val) => {
      let temp: any[] = [];
      if (val && val.length > 0) {
        val.map((item) => {
          let key = randomString(16);
          temp.push({
            title: item.title,
            slots: { icon: 'custom' },
            value: key,
          });
        });
      }
      saveTreeData.value = temp;
    },
    { immediate: true, deep: true }
  );

  // 重新获取保存的查询信息
  function initSaveQueryInfoCode() {
    let code = SAVE_CODE_PRE + route.fullPath;
    saveInfo.saveCode = code;
    let list = $ls.get(code);
    if (list && list instanceof Array) {
      currentPageSavedArray.value = list;
    }
  }

  // 执行一次 获取保存的查询信息
  initSaveQueryInfoCode();

  /**
   * 保存按钮事件
   */
  function handleSave() {
    // 获取实际数据转成字符串
    let fieldArray = getQueryInfo();
    if (!fieldArray) {
      $message.warning('空条件不能保存');
      return;
    }
    let content = JSON.stringify(fieldArray);
    openSaveInfoModal(content);
  }

  // 输入保存标题 弹框显示
  function openSaveInfoModal(content) {
    saveInfo.visible = true;
    saveInfo.title = '';
    saveInfo.content = content;
  }

  /**
   * 确认保存查询信息
   */
  function doSaveQueryInfo() {
    let { title, content, saveCode } = saveInfo;
    let index = getTitleIndex(title);
    if (index >= 0) {
      // 已存在是否覆盖
      Modal.confirm({
        title: '提示',
        content: `${title} 已存在，是否覆盖？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          currentPageSavedArray.value.splice(index, 1, {
            content,
            title,
            type: matchType.value,
          });
          $ls.set(saveCode, currentPageSavedArray.value);
          saveInfo.visible = false;
        },
      });
    } else {
      currentPageSavedArray.value.push({
        content,
        title,
        type: matchType.value,
      });
      $ls.set(saveCode, currentPageSavedArray.value);
      saveInfo.visible = false;
    }
  }

  // 根据填入的 title找本地存储的信息，如果有需要询问是否覆盖
  function getTitleIndex(title) {
    let savedArray = currentPageSavedArray.value;
    let index = -1;
    for (let i = 0; i < savedArray.length; i++) {
      if (savedArray[i].title == title) {
        index = i;
        break;
      }
    }
    return index;
  }

  /**
   * 获取左侧所有查询条件，如果没有/或者条件无效则返回false
   */
  function getQueryInfo(isEmit = false) {
    let arr = dynamicRowValues.values;
    if (!arr || arr.length == 0) {
      return false;
    }
    let fieldArray: any = [];
    let fieldProps = fieldProperties.value;
    for (let item of arr) {
      if (item.field && (item.val || item.val === 0) && item.rule) {
        let tempVal: any = toRaw(item.val);
        if (tempVal instanceof Array) {
          tempVal = tempVal.join(',');
        }
        let fieldName = getRealFieldName(item);
        let obj = {
          field: fieldName,
          rule: item.rule,
          val: tempVal,
        };
        if (isEmit === true) {
          //如果当前数据用于emit事件，需要设置dbtype和type
          let prop = fieldProps[item.field];
          if (prop) {
            obj['type'] = prop.view;
            obj['dbType'] = prop.type;
          }
        }
        fieldArray.push(obj);
      }
    }
    if (fieldArray.length == 0) {
      return false;
    }
    return fieldArray;
  }

  //update-begin-author:taoyan date:2022-5-31 for: VUEN-1148 主子联动下，高级查询查子表数据，无效
  /**
   * 高级查询参数 字段名
   * 获取后台需要的 字段名格式：表名,字段名
   * @param item
   */
  function getRealFieldName(item) {
    let fieldName = item.field;
    if (fieldName.indexOf('@') > 0) {
      fieldName = fieldName.replace('@', ',');
    }
    return fieldName;
  }
  //update-end-author:taoyan date:2022-5-31 for: VUEN-1148 主子联动下，高级查询查子表数据，无效

  /**
   * 右侧数据 点击事件，重新将数据显示到左侧
   * @param key
   * @param node
   */
  function handleTreeSelect(key, { node }) {
    console.log(key, node);
    let title = node.dataRef.title;
    let arr = currentPageSavedArray.value.filter((item) => item.title == title);
    if (arr && arr.length > 0) {
      // 拿到数据渲染
      let { content, type } = arr[0];
      let data = JSON.parse(content);
      let rowsValues: SuperQueryItem[] = [];
      for (let item of data) {
        rowsValues.push(Object.assign({}, { key: randomString(16) }, item));
      }
      dynamicRowValues.values = rowsValues;
      matchType.value = type;
    }
  }

  /**
   * 右侧数据 删除事件
   */
  function handleRemoveSaveInfo(title) {
    console.log(title);
    let index = getTitleIndex(title);
    if (index >= 0) {
      currentPageSavedArray.value.splice(index, 1);
      $ls.set(saveInfo.saveCode, currentPageSavedArray.value);
    }
  }

  /*-----------------------右侧保存信息相关-end---------------------------*/

  // 获取所有字段配置信息
  function getAllFields(properties) {
    // 获取所有配置 查询字段 是否联合查询
    // const {properties, table, title } = json;
    let allFields = {};
    let order = 1;
    let treeData: TreeModel[] = [];
    /*   let mainNode:TreeModel = {
      title,
      value: table,
      disabled: true,
      children: []
    };*/
    //treeData.push(mainNode)
    Object.keys(properties).map((field) => {
      let item = properties[field];
      if (item.view == 'table') {
        // 子表字段
        // 联合查询开启才需要子表字段作为查询条件
        let subProps = item['properties'] || item['fields'];
        let subTableOrder = order * 100;
        let subNode: TreeModel = {
          title: item.title,
          value: field,
          disabled: true,
          children: [],
          order: subTableOrder,
        };
        Object.keys(subProps).map((subField) => {
          let subItem = subProps[subField];
          // 保证排序统一
          subItem['order'] = subTableOrder + subItem['order'];
          let subFieldKey = field + '@' + subField;
          allFields[subFieldKey] = subItem;
          subNode.children!.push({
            title: subItem.title,
            value: subFieldKey,
            isLeaf: true,
            order: subItem['order'],
          });
        });
        orderField(subNode);
        treeData.push(subNode);
        order++;
      } else {
        // 主表字段
        //let fieldKey = table+'@'+field
        let fieldKey = field;
        allFields[fieldKey] = item;
        treeData.push({
          title: item.title,
          value: fieldKey,
          isLeaf: true,
          order: item.order,
        });
      }
    });
    orderField(treeData);
    return { allFields, treeData };
  }

  //根据字段的order重新排序
  function orderField(data) {
    let arr = data.children || data;
    arr.sort(function (a, b) {
      return a.order - b.order;
    });
  }

  function initDefaultValues(values) {
    const { params, matchType } = values;
    if (params) {
      let rowsValues: SuperQueryItem[] = [];
      for (let item of params) {
        rowsValues.push(Object.assign({}, { key: randomString(16) }, item));
      }
      dynamicRowValues.values = rowsValues;
      matchType.value = matchType;
    }
  }

  return {
    formRef,
    init,
    dynamicRowValues,
    matchType,
    registerModal,
    handleSubmit,
    handleCancel,
    handleSave,
    doSaveQueryInfo,
    saveInfo,
    saveTreeData,
    handleRemoveSaveInfo,
    handleTreeSelect,
    fieldTreeData,
    addOne,
    removeOne,
    setFormModel,
    getSchema,
    loading,
    getQueryInfo,
    initDefaultValues,
  };
}
