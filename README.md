# study-ai

基于 Node.js 的自学实验台。第一课不调用任何云 API：把一段中文问题变成向量，在内存知识库里找最相近的资料，再拼出要交给模型的上下文。

需要 Node.js 22。

## 命令

```bash
npm ci
npm test
npm run typecheck
npm start
npm start -- "积分能不能换成现金"
npm run dev
```

`npm start` 默认问题是「买的东西什么时候能把钱退回来？」。多出来的参数会换成你自己的问题。

## 目录

| 路径 | 说明 |
|------|------|
| `src/retrieve.ts` | 分词、向量、余弦相似度、检索 |
| `src/index.ts` | 命令行入口 |
| `test/retrieve.test.ts` | 用 Node 自带测试跑检索 |

向量是教学用的哈希向量，只用来看清「文本 → 向量 → 近邻 → 上下文」这条链路。换成正式 embedding 模型时，`search` 的调用方式不用改。
