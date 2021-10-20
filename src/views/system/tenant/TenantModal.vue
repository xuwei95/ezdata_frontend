<template>
    <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" width="40%">
        <BasicForm @register="registerForm"/>
    </BasicModal>
</template>
<script lang="ts" setup>
    import {ref, computed, unref} from 'vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {formSchema} from './tenant.data';
    import {saveOrUpdateTenant, getTenantById} from './tenant.api';
    import {useMessage} from "/@/hooks/web/useMessage";
    import {defineEmits} from 'vue'
    // 获取emit
    const emit = defineEmits(['success']);
    const isUpdate = ref(true);
    //表单配置
    const [registerForm, {resetFields, setFieldsValue, validate}] = useForm({
        labelWidth: 150,
        schemas: formSchema,
        showActionButtonGroup: false,
    });
    //表单赋值
    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
        //重置表单
        await resetFields();
        setModalProps({confirmLoading: false});
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
            //获取详情
            data.record = await getTenantById({id: data.record.id});
            //表单赋值
            await setFieldsValue({
                ...data.record,
            });
        }
    });
    //设置标题
    const getTitle = computed(() => (!unref(isUpdate) ? '新增租户' : '编辑租户'));
    //表单提交事件
    async function handleSubmit() {
        try {
            const values = await validate();
            setModalProps({confirmLoading: true});
            //提交表单
            await saveOrUpdateTenant(values, isUpdate.value);
            //关闭弹窗
            closeModal();
            //刷新列表
            emit('success');
        } finally {
            setModalProps({confirmLoading: false});
        }
    }
</script>
