<template>
    <Cascader v-bind="attrs" v-model:value="state" :options="getOptions" @change="handleChange"/>
</template>
<script lang="ts">
    import {defineComponent, PropType, ref,reactive, watchEffect, computed, unref, watch, onMounted} from 'vue';
    import {Cascader} from 'ant-design-vue';
    import {provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode} from "../utils/areaDataUtil";
    import {useRuleFormItem} from "/@/hooks/component/useFormItem";
    import {propTypes} from "/@/utils/propTypes";
    import {useAttrs} from "/@/hooks/core/useAttrs";
    export default defineComponent({
        name: 'JAreaLinkage',
        components: {
            Cascader
        },
        inheritAttrs: false,
        props: {
            value: propTypes.oneOfType([
                propTypes.object,
                propTypes.array
            ]),
            //是否显示区县
            showArea:propTypes.bool.def(true),
            //是否是全部
            showAll:propTypes.bool.def(false)
        },
        emits: ['options-change', 'change'],
        setup(props, {emit,refs}) {
            const emitData = ref<any[]>([]);
            const attrs = useAttrs();
            const [state] = useRuleFormItem(props, 'value', 'change', emitData);
            const getOptions = computed(() => {
                if(props.showArea&&props.showAll){
                    return regionDataPlus
                }
                if(props.showArea&&!props.showAll){
                    return regionData
                }
                if(!props.showArea&&!props.showAll){
                    return provinceAndCityData
                }
                if(!props.showArea&&props.showAll){
                    return provinceAndCityDataPlus
                }
            });
            function handleChange(_, ...args) {
                emitData.value = args;
                console.info(emitData)
            }
            return {
                state,
                attrs,
                regionData,
                getOptions,
                handleChange
            };
        },
    });
</script>
