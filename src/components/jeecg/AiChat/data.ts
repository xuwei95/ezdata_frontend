export const defaultChatConfig = {
  rag: {
    enable: true,
    dataset_id: ['1'],
    k: 3,
    retrieval_type: 'vector',
    score_threshold: 0.1,
    rerank: '0',
    rerank_score_threshold: 0,
  },
  agent: {
    enable: false,
    tools: [],
  },
};
