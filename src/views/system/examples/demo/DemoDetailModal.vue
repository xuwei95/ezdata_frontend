<template>
  <BasicModal v-bind="$attrs" @register="registerModal" width="40%" title="详情" :showOkBtn="false" cancelText="关闭">
    <detail-form :schemas="detailFormSchemas" :data="formData" :span="12"></detail-form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getDemoById } from './demo.api';
  import DetailForm from '/@/components/Form/src/components/DetailForm.vue';

  // 声明Emits
  const emit = defineEmits(['register']);
  //表单数据
  const formData = ref({});
  //表单配置
  const detailFormSchemas = [
    {
      field: 'name',
      label: '名字',
    },
    {
      field: 'keyWord',
      label: '关键词',
    },
    {
      field: 'punchTime',
      label: '打卡时间',
    },
    {
      field: 'salaryMoney',
      label: '工资',
    },
    {
      field: 'sex',
      label: '性别',
      view: 'list',
      dictCode: 'sex',
    },
    {
      field: 'age',
      label: '年龄',
    },
    {
      field: 'birthday',
      label: '生日',
    },
    {
      field: 'email',
      label: '邮箱',
    },
    {
      field: 'content',
      label: '个人简介',
      span: 24,
    },
  ];

  //表单赋值
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });
    formData.value = await getDemoById({ id: data.record.id });
  });
</script>
