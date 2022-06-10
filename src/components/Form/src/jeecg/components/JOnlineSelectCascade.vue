<template>
  <!-- 级联下拉框 form组件 暂且只在online使用 不对外提供api -->
  <a-select :placeholder="placeholder" :value="selectedValue" @change="handleChange" allowClear style="width: 100%">
    <a-select-option v-for="(item, index) in dictOptions" :key="index" :value="item.store">
      <span style="display: inline-block; width: 100%" :title="item.label">{{ item.label }}</span>
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
  import { defineComponent, watch, ref } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { useMessage } from '/@/hooks/web/useMessage';

  /**获取下拉选项*/
  const SELECT_OPTIONS_URL = '/online/cgform/api/querySelectOptions';

  export default defineComponent({
    name: 'JOnlineSelectCascade',
    props: {
      table: { type: String, default: '' },
      txt: { type: String, default: '' },
      store: { type: String, default: '' },
      idField: { type: String, default: '' },
      pidField: { type: String, default: '' },
      pidValue: { type: String, default: '-1' },
      origin: { type: Boolean, default: false },
      condition: { type: String, default: '' },
      value: { type: String, default: '' },
      isNumber: { type: Boolean, default: false },
      placeholder: { type: String, default: '请选择' },
    },
    emits: ['change', 'next'],
    setup(props, { emit }) {
      const { createMessage: $message } = useMessage();
      // 选中值
      const selectedValue = ref<any>('');
      // 选项数组
      const dictOptions = ref<any[]>([]);
      const optionsLoad = ref(true);
      // 选项改变事件
      function handleChange(value) {
        console.log('handleChange', value);
        // 这个value是 存储的值 实际还需要获取id值
        let temp = value || '';
        emit('change', temp);
        valueChangeThenEmitNext(temp);
      }

      // 第一个节点 选项加载走condition
      watch(
        () => props.condition,
        (val) => {
          optionsLoad.value = true;
          if (val) {
            loadOptions();
          }
        },
        { immediate: true }
      );

      // 被联动节点 选项加载走pidValue
      watch(
        () => props.pidValue,
        (val) => {
          if (val === '-1') {
            dictOptions.value = [];
          } else {
            loadOptions();
          }
        }
      );

      // 值回显
      watch(
        () => props.value,
        (newVal, oldVal) => {
          console.log('值改变事件', newVal, oldVal);
          if (!newVal) {
            // value不存在的时候--
            selectedValue.value = [];
            if (oldVal) {
              // 如果oldVal存在， 需要往上抛事件
              emit('change', '');
              emit('next', '-1');
            }
          } else {
            // value存在的时候
            selectedValue.value = newVal;
          }
          if (newVal && !oldVal) {
            // 有新值没有旧值 表单第一次加载赋值 需要往外抛一个事件 触发下级options的加载
            handleFirstValueSetting(newVal);
          }
        },
        { immediate: true }
      );

      /**
       * 第一次加载赋值
       */
      async function handleFirstValueSetting(value) {
        if (props.idField === props.store) {
          // 如果id字段就是存储字段 那么可以不用调用请求
          emit('next', value);
        } else {
          if (props.origin === true) {
            // 如果是联动组件的第一个组件，等待options加载完后从options中取值
            await getSelfOptions();
            valueChangeThenEmitNext(value);
          } else {
            // 如果是联动组件的后续组件，根据选中的value加载一遍数据
            let arr = await loadValueText();
            valueChangeThenEmitNext(value, arr);
          }
        }
      }

      function loadOptions() {
        let params = getQueryParams();
        if (props.origin === true) {
          params['condition'] = props.condition;
        } else {
          params['pidValue'] = props.pidValue;
        }
        console.log('请求参数', params);
        dictOptions.value = [];
        defHttp.get({ url: SELECT_OPTIONS_URL, params }, { isTransformResponse: false }).then((res) => {
          if (res.success) {
            dictOptions.value = [...res.result];
            console.log('请求结果', res.result, dictOptions);
          } else {
            $message.warning('联动组件数据加载失败,请检查配置!');
          }
        });
      }

      function getQueryParams() {
        let params = {
          table: props.table,
          txt: props.txt,
          key: props.store,
          idField: props.idField,
          pidField: props.pidField,
        };
        return params;
      }

      function loadValueText() {
        return new Promise((resolve) => {
          if (!props.value) {
            selectedValue.value = [];
            resolve([]);
          } else {
            let params = getQueryParams();
            if (props.isNumber === true) {
              params['condition'] = `${props.store} = ${props.value}`;
            } else {
              params['condition'] = `${props.store} = '${props.value}'`;
            }
            defHttp.get({ url: SELECT_OPTIONS_URL, params }, { isTransformResponse: false }).then((res) => {
              if (res.success) {
                resolve(res.result);
              } else {
                $message.warning('联动组件数据加载失败,请检查配置!');
                resolve([]);
              }
            });
          }
        });
      }

      /**
       * 获取下拉选项
       */
      function getSelfOptions() {
        return new Promise((resolve) => {
          let index = 0;
          (function next(index) {
            if (index > 10) {
              resolve([]);
            }
            let arr = dictOptions.value;
            if (arr && arr.length > 0) {
              resolve(arr);
            } else {
              setTimeout(() => {
                next(index++);
              }, 300);
            }
          })(index);
        });
      }

      /**
       * 值改变后 需要往外抛事件 触发下级节点的选项改变
       */
      function valueChangeThenEmitNext(value, arr: any = []) {
        if (value && value.length > 0) {
          if (!arr || arr.length == 0) {
            arr = dictOptions.value;
          }
          let selected = arr.filter((item) => item.store === value);
          if (selected && selected.length > 0) {
            let id = selected[0].id;
            emit('next', id);
          }
        }
      }

      return {
        selectedValue,
        dictOptions,
        handleChange,
      };
    },
  });
</script>

<style scoped></style>
