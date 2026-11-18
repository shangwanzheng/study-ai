# Embedding +「向量库」最小 Demo（本地、零 API Key）

用纯 Node 演示 RAG 里检索那一段：**文本 → 向量 → 近邻搜索 → 拼进上下文**。  
这里的 embedding 是教学用简易实现（不是 OpenAI/BGE 那种质量），但数据流和生产一样。

## 怎么跑

```bash
cd /cursor/stores/self/demos/embedding-mini
node index.mjs
```

改底部 `query` 或知识库数组，再跑一次，看「邻居」是否跟着语义变。

## 开源里真正常用的是什么

| 角色 | 开源/可自建例子 |
|------|------------------|
| Embedding 模型 | [sentence-transformers](https://www.sbert.net/)、[Ollama embeddings](https://ollama.com/)、Hugging Face 上的 BGE/E5 等 |
| 向量库 | [Chroma](https://www.trychroma.com/)、[Qdrant](https://qdrant.tech/)、[Milvus](https://milvus.io/)、[FAISS](https://github.com/facebookresearch/faiss)、[LanceDB](https://lancedb.com/) |
| 编排（可选） | LangChain.js、LlamaIndex |

下一步若要「真模型」：本地 Ollama `nomic-embed-text` + Chroma，或云端 embedding API + 任一向量库。聊天回答仍交给 LLM；本 demo 只演示检索。
