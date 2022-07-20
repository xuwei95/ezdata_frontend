import { FormSchema, RenderCallbackParams } from '/@/components/Form';
import { computed, ref, watch } from 'vue';
import { getDictItemsByCode } from '/@/utils/dict';
import { filterMultiDictText } from '/@/utils/dict/JDictSelectUtil';
import { initDictOptions } from '/@/utils/dict/index';
import { loadDictItem, queryDepartTreeSync, getUserList } from '/@/api/common/api';
import { defHttp } from '/@/utils/http/axios';
import { FieldExtends } from '/@/views/super/online/cgform/types/onlineRender';
import { getAreaTextByCode } from '/@/components/Form/src/utils/Area';
import { JVxeTableInstance } from '/@/components/jeecg/JVxeTable/types';
import { handleLinkDown, LINK_DOWN, OnlSubTab, useOnlineVxeTableColumns } from '/@/views/super/online/cgform/hooks/auto/useAutoForm';
import { pick } from 'lodash-es';
import { getFileAccessHttpUrl } from '/@/utils/common/compUtils';
import { createImgPreview } from '/@/components/Preview/index';
import { useMessage } from '/@/hooks/web/useMessage';

export interface DetailFormSchema {
  field: string;
  label: string;
  span?: number;
  view?: string;
  isHtml?: boolean;
  isImage?: boolean;
  isFile?: boolean;
  order?: any;
  dictTable?: string;
  dictText?: string;
  dictCode?: string;
  dict?: string;
  fieldExtendJson?: string;
  ifShow?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);
}

/*interface DetailFormProps {
  span?: number;
  schemas?: DetailFormSchema[];
  data?: any;
  containerClass?: string;
}*/

export function useDetailForm(props: any) {
  console.log(props);
  const dictOptionsMap = {};
  const currentLinkFields: string[] = [];
  const detailFormData = ref({});
  const { createMessage } = useMessage();

  const formContainerClass = computed(() => {
    if (props.containerClass) {
      return `jeecg-detail-form ${props.containerClass}`;
    } else {
      return 'jeecg-detail-form';
    }
  });

  watch(
    () => props.data,
    async (formData) => {
      if (formData) {
        let arr = props.schemas;
        let temp = {};
        if (arr && arr.length > 0) {
          for (let item of arr) {
            let field = item.field;
            try {
              temp[field] = await getItemContent(item);
            } catch (e) {
              console.error('字段【' + field + '】文本获取失败', e);
            }
          }
        }
        detailFormData.value = temp;
        console.log('23345', detailFormData.value);
      }
    },
    { deep: true, immediate: true }
  );

  async function getItemContent(item) {
    let formData = props.data;
    if (formData) {
      let value = formData[item.field];
      if (!value && value !== '0' && value !== 0) {
        return '';
      }
      let str = value;
      let view = item.view;
      if (view == 'list' || view == 'radio' || view == 'checkbox' || view == 'list_multi') {
        str = await getSelectText(item, formData);
      } else if (view == 'sel_search') {
        str = await getTableDataText(item, formData);
      } else if (view == 'cat_tree') {
        //分类字典树
        str = await getCategoryDataText(item, formData);
      } else if (view == 'sel_depart') {
        //部门选择
        str = await getDepartDataText(item, formData);
      } else if (view == 'sel_user') {
        // 用户选择
        str = await getUserDataText(item, formData);
      } else if (view == 'pca') {
        //省市区
        str = getAreaTextByCode(value);
      } else if (view == 'link_down') {
        //联动组件
        str = await getLinkDownDataText(item, formData);
      } else if (view == 'sel_tree') {
        //自定义树控件
        str = await getTreeDataText(item, formData);
      } else if (view == 'switch') {
        //开关组件
        str = await getSwitchDataText(item, formData);
      } else if (view == 'image' || view == 'file') {
        str = getFileList(item, formData);
      } else {
        if (currentLinkFields.indexOf(item.field) >= 0) {
          let arr = dictOptionsMap[item.field];
          if (arr && arr.length > 0) {
            str = filterMultiDictText(arr, value);
          }
        }
      }
      return str;
    }
    return '';
  }

  // 数据字典/表字典
  async function getSelectText(item, formData) {
    // 先从缓存取
    let dictCode = getRequestDictCode(item);
    let value = formData[item.field];
    if (!dictCode) {
      return value;
    }
    let options = getDictItemsByCode(dictCode);
    if (options && options.length > 0) {
      return filterMultiDictText(options, value);
    } else {
      let dictRes = [];
      if (dictOptionsMap[dictCode]) {
        dictRes = dictOptionsMap[dictCode];
      } else {
        //取不到再请求
        dictRes = (await initDictOptions(dictCode)) || [];
      }
      if (dictRes && dictRes.length > 0) {
        dictOptionsMap[dictCode] = dictRes;
        return filterMultiDictText(dictRes, value);
      }
    }
    return '';
  }

  function getRequestDictCode(item) {
    let temp = '';
    let { dictCode, dictTable, dictText } = item;
    if (!dictTable) {
      temp = dictCode;
    } else {
      temp = `${dictTable},${dictText},${dictCode}`;
    }
    return temp;
  }

  // 表字典-下拉搜索
  async function getTableDataText(item, formData) {
    let dictCode = getRequestDictCode(item);
    let value = formData[item.field];
    if (!value) {
      return '';
    }

    let arr: any[] = [];
    if (dictOptionsMap[dictCode + value]) {
      arr = dictOptionsMap[dictCode + value];
    } else {
      //取不到再请求
      arr = (await defHttp.get({ url: `/sys/dict/loadDictItem/${dictCode}`, params: { key: value } })) || [];
    }
    if (arr && arr.length > 0) {
      dictOptionsMap[dictCode + value] = arr;
      return arr.join(',');
      //return filterMultiDictText(arr, value);
    }
    return '';
  }

  // 分类字典
  async function getCategoryDataText(item, formData) {
    let value = formData[item.field];
    if (!value) {
      return '';
    }
    let arr = (await loadDictItem({ ids: value })) || [];
    if (arr && arr.length > 0) {
      return arr.join(',');
    }
    return '';
  }

  // 部门数据
  async function getDepartDataText(item, formData) {
    let value = formData[item.field];
    if (!value) {
      return '';
    }
    let extend = getExtendConfig(item);
    let storeField = extend.store || 'id';
    let arr = (await queryDepartTreeSync({ ids: value, primaryKey: storeField })) || [];
    if (arr && arr.length > 0) {
      let temp: string[] = [];
      for (let item of arr) {
        temp.push(item.title);
      }
      return temp.join(',');
    }
    return '';
  }

  //用户数据
  async function getUserDataText(item, formData) {
    let value = formData[item.field];
    if (!value) {
      return '';
    }
    let extend = getExtendConfig(item);
    let storeField = extend.store || 'username';
    let params = {
      [storeField]: value,
    };
    let res = (await getUserList(params)) || {};
    let arr = res.records || [];
    if (arr && arr.length > 0) {
      let temp: string[] = [];
      console.log('getUserDataText', arr);
      let textField = extend.text || 'realname';
      for (let item of arr) {
        temp.push(item[textField]);
      }
      return temp.join(',');
    }
    return '';
  }

  function getExtendConfig(item) {
    let extend: FieldExtends = {};
    let { fieldExtendJson } = item;
    if (fieldExtendJson) {
      if (typeof fieldExtendJson == 'string') {
        try {
          let json = JSON.parse(fieldExtendJson);
          extend = { ...json };
        } catch (e) {
          console.error(e);
        }
      }
    }
    return extend;
  }

  // 联动组件
  async function getLinkDownDataText(item, formData) {
    let { dictTable, field } = item;
    let arr: any[] = [];
    if (dictOptionsMap[field]) {
      arr = dictOptionsMap[field];
    } else {
      if (dictTable) {
        let json = JSON.parse(dictTable);
        if (json) {
          let { table, txt, key, linkField } = json;
          let dictCode = `${table},${txt},${key}`;
          let temp: any[] = (await initDictOptions(dictCode)) || [];
          arr = [...temp];
          if (arr && arr.length > 0) {
            dictOptionsMap[field] = arr;
            if (linkField) {
              let fieldArray = linkField.split(',');
              for (let item of fieldArray) {
                dictOptionsMap[item] = arr;
                currentLinkFields.push(item);
              }
            }
          }
        }
      }
    }
    if (arr && arr.length > 0) {
      let value = formData[field];
      return filterMultiDictText(arr, value);
    }
    return '';
  }

  //自定义树
  async function getTreeDataText(item, formData) {
    let { dict, field } = item;
    let arr = [];
    if (dictOptionsMap[field]) {
      arr = dictOptionsMap[field];
    } else {
      if (dict) {
        arr = await initDictOptions(dict);
      }
    }
    if (arr && arr.length > 0) {
      let value = formData[field];
      return filterMultiDictText(arr, value);
    }
    return '';
  }

  //开关
  async function getSwitchDataText(item, formData) {
    let { fieldExtendJson, field } = item;
    let options = ['Y', 'N'];
    if (fieldExtendJson) {
      options = JSON.parse(fieldExtendJson);
    }
    let arr: any[] = [
      { value: options[0], text: '是' },
      { value: options[1], text: '否' },
    ];
    let value = formData[field];
    return filterMultiDictText(arr, value);
  }

  function getItemSpan(item) {
    if (item.span) {
      return item.span;
    }
    return props.span;
  }

  function getFileList(item, formData) {
    let str = formData[item.field];
    if (!str) {
      return [];
    }
    let arr = str.split(',');
    let result: string[] = [];
    for (let item of arr) {
      let src = getFileAccessHttpUrl(item) || '';
      if (src) {
        result.push(src);
      }
    }
    return result;
  }

  function handleDownloadFile(url) {
    if (url) {
      window.open(url);
    }
  }

  function handleViewImage(field) {
    let values = detailFormData.value[field];
    if (!values || values.length == 0) {
      createMessage.warning('无图片!');
      return;
    }
    createImgPreview({ imageList: values });
  }

  function getFilename(url) {
    if (!url) {
      return '';
    }
    return url.substring(url.lastIndexOf('/') + 1);
  }

  return {
    formContainerClass,
    detailFormData,
    getItemSpan,
    handleDownloadFile,
    handleViewImage,
    getFilename,
  };
}

/**
 * 获取 DetailFormSchema[online用]
 */
export function getDetailFormSchemas(props) {
  const detailFormSchemas = ref<DetailFormSchema[]>([]);
  const refMap = {};
  const hasSubTable = ref(false);
  const subTabInfo = ref<OnlSubTab[]>([]);
  const subDataSource = ref({});
  const formSpan = computed(() => {
    let temp = props.formTemplate;
    if (temp == '2') {
      return 12;
    } else if (temp == '3') {
      return 8;
    } else if (temp == '4') {
      return 6;
    } else {
      return 24;
    }
  });

  function createFormSchemas(properties: any[]) {
    //let properties:any[] = result.schema.properties
    let subInfo: OnlSubTab[] = [];
    console.log('111', properties);
    let arr: DetailFormSchema[] = [];
    let dataSourceObj = {};
    Object.keys(properties).map((key) => {
      const item = properties[key];
      // uiSchema 无用
      //const uiItem = this.uiSchema[key];// method、formTemplate、url
      if (item.view == 'tab') {
        hasSubTable.value = true;
        let temp: OnlSubTab = {
          key,
          // 这个foreignKey是主表的字段
          foreignKey: item['foreignKey'],
          describe: item.describe,
          relationType: item.relationType,
          requiredFields: item.required || [],
          order: item.order,
        };
        if (item.relationType == 1) {
          refMap[key] = ref(null);
          temp['properties'] = item.properties;
        } else {
          dealSubProerties(item);
          refMap[key] = ref<JVxeTableInstance>();
          temp['columns'] = item.columns;
          dataSourceObj[key] = [];
        }
        subInfo.push(temp);
      } else {
        if (item.view === LINK_DOWN) {
          let array = handleLinkDown(item, key);
          for (let linkDownItem of array) {
            let tempIndex = getFieldIndex(arr, linkDownItem.key);
            let temp = {
              field: linkDownItem.key,
              label: linkDownItem.title,
              view: linkDownItem.view,
              order: linkDownItem.order,
            };
            if (tempIndex == -1) {
              arr.push(temp);
            } else {
              arr[tempIndex] = temp;
            }
          }
        } else if (item.view == 'hidden') {
          //隐藏的不处理
        } else {
          let tempIndex = getFieldIndex(arr, key);
          if (tempIndex == -1) {
            let temp = Object.assign(
              {
                field: key,
                label: item.title,
              },
              pick(item, ['view', 'order', 'fieldExtendJson', 'dictTable', 'dictText', 'dictCode', 'dict'])
            );
            if (item.view == 'file') {
              temp['span'] = 24;
              temp['isFile'] = true;
            }
            if (item.view == 'image') {
              temp['span'] = 24;
              temp['isImage'] = true;
            }
            if (item.view == 'umeditor' || item.view == 'markdown') {
              temp['isHtml'] = true;
              temp['span'] = 24;
            }
            arr.push(temp);
          }
        }
      }
    });
    // 1.对arr排序
    arr.sort(function (a, b) {
      return a.order - b.order;
    });
    // 2.对子表排序
    subInfo.sort(function (a, b) {
      return a.order - b.order;
    });
    subTabInfo.value = subInfo;
    for (let i = 0; i < arr.length; i++) {
      let temp = arr[i];
      if (temp.isFile === true || temp.isImage === true || temp.isHtml === true) {
        if (i > 0) {
          let last = arr[i - 1];
          let span = last.span || formSpan.value;
          last.span = span;
        }
      }
    }
    detailFormSchemas.value = arr;
    subDataSource.value = dataSourceObj;
    console.log('adadad', arr);
  }

  function dealSubProerties(subInfo) {
    useOnlineVxeTableColumns(subInfo);
  }

  function getFieldIndex(arr: DetailFormSchema[], key: string) {
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (item.field === key) {
        index = i;
        break;
      }
    }
    return index;
  }

  return {
    detailFormSchemas,
    hasSubTable,
    subTabInfo,
    refMap,
    createFormSchemas,
    formSpan,
    subDataSource,
  };
}

/**
 * TODO 尚未实现
 * 获取 DetailFormSchema[自定义开发用]
 */
export function transDetailFormSchemas(formSchemas: FormSchema[]) {
  const detailFormSchemas = ref<DetailFormSchema[]>([]);
  console.log(formSchemas);
  return detailFormSchemas;
}
