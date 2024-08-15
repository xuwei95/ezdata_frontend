<template>
  <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
    <a-form-item label="启用知识库">
      <a-switch v-model:checked="formState.rag.enable" />
    </a-form-item>
    <template v-if="formState.rag.enable">
      <a-form-item label="数据集">
        <ApiSelect v-model:value="formState.rag.dataset_id" :api="allDataSetList" mode="multiple" :params="{}" labelField="name" valueField="id" />
      </a-form-item>
      <a-form-item label="召回数量">
        <a-input-number v-model:value="formState.rag.k" :min="1" />
      </a-form-item>
      <a-form-item label="检索模式">
        <JSelectInput v-model:value="formState.rag.retrieval_type" :options="retrievalTypeOptions" />
      </a-form-item>
      <a-form-item label="分数过滤">
        <a-input-number v-model:value="formState.rag.score_threshold" :min="0" :precision="2" :step="0.1" />
      </a-form-item>
      <a-form-item label="结果重排">
        <JSwitch v-model:value="formState.rag.rerank" :options="['1', '0']" />
      </a-form-item>
      <a-form-item label="结果重排分数过滤" v-if="formState.rag.rerank == '1'">
        <a-input-number v-model:value="formState.rag.rerank_score_threshold" :min="0" :precision="2" :step="0.1" />
      </a-form-item>
    </template>
  </a-form>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import ApiSelect from '@/components/Form/src/components/ApiSelect.vue';
  import JSelectInput from '@/components/Form/src/jeecg/components/JSelectInput.vue';
  import JSwitch from '@/components/Form/src/jeecg/components/JSwitch.vue';
  import { allList as allDataSetList } from '@/views/rag/dataset/dataset.api';
  import { defaultChatConfig } from '@/components/jeecg/AiChat/data';

  const props = defineProps<{
    modelValue: {
      rag: {
        enable: boolean;
        dataset_id: string[];
        k: number;
        retrieval_type: string;
        score_threshold: number;
        rerank: string;
        rerank_score_threshold: number;
      };
    };
  }>();

  const emit = defineEmits(['update:modelValue']);

  const formState = ref({
    rag: {
      ...defaultChatConfig.rag,
      ...props.modelValue.rag,
    },
  });

  const retrievalTypeOptions = [
    { label: '语义', value: 'vector' },
    { label: '全文', value: 'keyword' },
    { label: '混合', value: 'all' },
  ];

  watch(
    formState,
    (newVal) => {
      emit('update:modelValue', newVal);
    },
    { deep: true }
  );
</script>
