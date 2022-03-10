<template>
    <a-radio-group v-if="compType===CompTypeEnum.Radio" v-bind="attrs" v-model:value="state" @change="handleChange">
        <template v-for="item in dictOptions" :key="`${item.value}`">
            <a-radio :value="item.value">
                {{ item.label }}
            </a-radio>
        </template>
    </a-radio-group>

    <a-radio-group v-else-if="compType===CompTypeEnum.RadioButton" v-bind="attrs" v-model:value="state" buttonStyle="solid" @change="handleChange">
        <template v-for="item in dictOptions" :key="`${item.value}`">
            <a-radio-button :value="item.value">
                {{ item.label }}
            </a-radio-button>
        </template>
    </a-radio-group>

    <a-select v-else-if="compType===CompTypeEnum.Select" :placeholder="placeholder" v-bind="attrs" v-model:value="state" @change="handleChange">
        <a-select-option v-if="showChooseOption" :value="undefined">请选择</a-select-option>
        <template v-for="item in dictOptions" :key="`${item.value}`">
            <a-select-option :value="item.value">
          <span style="display: inline-block;width: 100%" :title=" item.label ">
            {{ item.label }}
          </span>
            </a-select-option>
        </template>
    </a-select>
</template>
<script lang="ts">
    import {defineComponent, PropType, ref, reactive, watchEffect, computed, unref, watch, onMounted} from 'vue';
    import {propTypes} from "/@/utils/propTypes";
    import {useAttrs} from "/@/hooks/core/useAttrs";
    import {initDictOptions} from "/@/utils/dict/index"
    import {get, omit} from 'lodash-es';
    import {useRuleFormItem} from '/@/hooks/component/useFormItem';
    import {CompTypeEnum} from '/@/enums/CompTypeEnum.ts';
    export default defineComponent({
        name: 'JDictSelectTag',
        inheritAttrs: false,
        props: {
            value: propTypes.oneOfType([
                propTypes.string,
                propTypes.number,
                propTypes.array,
            ]),
            dictCode: propTypes.string,
            type: propTypes.string,
            placeholder: propTypes.string,
            stringToNumber: propTypes.bool,
            getPopupContainer: {
                type: Function,
                default: (node) => node.parentNode
            },
          // 是否显示【请选择】选项
          showChooseOption: propTypes.bool.def(true),
        },
        emits: ['options-change', 'change'],
        setup(props, {emit, refs}) {
            const emitData = ref<any[]>([]);
            const dictOptions = ref<any[]>([]);
            const attrs = useAttrs();
            const [state] = useRuleFormItem(props, 'value', 'change', emitData);
            const getBindValue = Object.assign({}, unref(props), unref(attrs));
            //组件类型
            const compType = computed(() => {
                return (!props.type || props.type === "list") ? 'select' : props.type;
            });
            /**
             * 监听字典code
             */
            watchEffect(() => {
                props.dictCode && initDictData();
            });

            async function initDictData() {
                let {dictCode, stringToNumber} = props;
                //根据字典Code, 初始化字典数组
                const dictData = await initDictOptions(dictCode);
                dictOptions.value = dictData.reduce((prev, next) => {
                    if (next) {
                        const value = next['value'];
                        prev.push({
                            label: next['text'] || next['label'],
                            value: stringToNumber ? +value : value,
                            ...omit(next, ['text', 'value']),
                        });
                    }
                    return prev;
                }, []);
            }

          function handleChange(e) {
            emitData.value = [e?.target?.value || e];
          }

            return {
                state,
                compType,
                attrs,
                getBindValue,
                dictOptions,
                CompTypeEnum,
                handleChange
            };
        },
    });
</script>
