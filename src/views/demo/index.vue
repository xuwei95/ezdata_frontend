<template>
    <PageWrapper title="示例组件" contentFullHeight>
        <CollapseContainer title="表单相关">
            <BasicForm autoFocusFirstItem :labelWidth="200" :schemas="schemas" :actionColOptions="{ span: 24 }" @submit="handleSubmit" @reset="handleReset">
                <template #jAreaLinkage="{model, field }">
                    <JAreaLinkage v-model:value="model[field]" :showArea="true" :showAll="false" />
                </template>
            </BasicForm>
        </CollapseContainer>
    </PageWrapper>
</template>
<script lang="ts">
    import {computed, defineComponent, unref, ref} from 'vue';
    import {BasicForm, FormSchema, ApiSelect, JAreaLinkage} from '/@/components/Form/index';
    import {CollapseContainer} from '/@/components/Container';
    import {useMessage} from '/@/hooks/web/useMessage';
    import {PageWrapper} from '/@/components/Page';

    import {optionsListApi} from '/@/api/demo/select';
    import {useDebounceFn} from '@vueuse/core';



    const schemas: FormSchema[] = [

        {
            field: 'field311',
            component: 'JAreaLinkage',
            label: '省市区选择',
            helpMessage: ['JAreaLinkage组件', '省市区选择'],
            required: true,
            slot: 'jAreaLinkage',
            colProps: {
                span: 8,
            },
            defaultValue: ["130000","130200"],
        }
    ];

    export default defineComponent({
        components: {BasicForm, CollapseContainer, PageWrapper, ApiSelect, JAreaLinkage},
        setup() {
            const check = ref(null);
            const {createMessage} = useMessage();
            const keyword = ref<string>('');
            const searchParams = computed<Recordable>(() => {
                return {keyword: unref(keyword)};
            });

            function onSearch(value: string) {
                keyword.value = value;
            }

            return {
                schemas,
                optionsListApi,
                onSearch: useDebounceFn(onSearch, 300),
                searchParams,
                handleReset: () => {
                    keyword.value = '';
                },
                handleSubmit: (values: any) => {
                    createMessage.success('click search,values:' + JSON.stringify(values));
                },
                check,
            };
        },
    });
</script>
