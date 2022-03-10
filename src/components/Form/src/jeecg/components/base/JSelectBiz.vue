<template>
    <div>
        <a-row class="j-select-row" type="flex" :gutter="8">
            <a-col class="left" :class="{'full': !showButton}">
                <a-select ref="select" v-model:value="selectValues.value" :placeholder="placeholder" :mode="multiple" :open="false" :disabled="disabled" :options="options" @change="handleChange" style="width: 100%;" @click="openModal(false)"></a-select>
            </a-col>
            <a-col v-if="showButton" class="right">
                <a-button type="primary" @click="openModal(true)" :disabled="disabled">选择</a-button>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
    import {defineComponent, ref, inject, reactive} from 'vue';
    import {propTypes} from "/@/utils/propTypes";
    import {useAttrs} from "/@/hooks/core/useAttrs";

    export default defineComponent({
        name: 'JSelectBiz',
        components: {},
        inheritAttrs: false,
        props: {
            showButton: propTypes.bool.def(true),
            disabled: propTypes.bool.def(false),
            placeholder:{
              type: String,
              default: '请选择',
            },
            // 是否支持多选，默认 true
            multiple: {
                type: String,
                default: 'multiple',
            }
        },
        emits: ['handleOpen','change'],
        setup(props, {emit, refs}) {
            //接收下拉框选项
            const options = inject('selectOptions') || ref([]);
            //接收选择的值
            const selectValues = inject('selectValues') || ref({});
            const attrs = useAttrs();

            /**
             * 打开弹出框
             */
            function openModal(isButton) {
               if(props.showButton&&isButton){
                 emit('handleOpen')
               }
              if(!props.showButton&&!isButton){
                emit('handleOpen')
              }
            }



          /**
             * 下拉框值改变事件
             */
            function handleChange(value) {
                selectValues.value = value;
                selectValues.change = true;
                emit('change',value)
            }

            return {
                attrs,
                selectValues,
                options,
                handleChange,
                openModal
            };
        },
    });
</script>
<style lang="less" scoped>
    .j-select-row {
        @width: 82px;

        .left {
            width: calc(100% - @width - 8px);
        }

        .right {
            width: @width;
        }

        .full {
            width: 100%;
        }

        ::v-deep(.ant-select-search__field) {
            display: none !important;
        }
    }
</style>
