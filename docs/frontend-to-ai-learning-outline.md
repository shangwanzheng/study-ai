# 前端工程师转 AI 赛道：可落地学习大纲

面向有前端工程经验（HTML/CSS/JS/TS、React 等）、AI 基础从零或很浅的同学。目标不是变成研究员，而是尽快具备「能交付 AI 功能 / AI 产品」的工程能力。

## 总览：合理路径是什么

前端转 AI，最划算的路径是：**先做「会用模型的工程师」，再做「会把模型装进产品的工程师」**，最后按兴趣加深 RAG / Agent / 评测。你已经会组件、状态、网络、鉴权、体验——这些恰好是 AI 应用里最稀缺的部分：流式交互、失败兜底、配额与成本、可观测性。不必先啃纯数学或从零训大模型；先把 Prompt、结构化输出、工具调用、RAG、Agent 工作流跑通，再按岗位目标分流。数学与训练细节，等你真要进 ML 工程再补。

---

## 阶段 0：建立 AI 产品与能力地图（约 1 周）

**目标**：能听懂产品讨论里的 LLM / 多模态 / Agent / RAG，并判断「该不该上 AI、上哪一类能力」。

**核心主题**
- 生成式 AI 产品形态：聊天助手、Copilot、搜索增强、工作流自动化、多模态（图文音）
- 能力边界：幻觉、上下文窗口、延迟、成本、隐私；「能演示」≠「能上线」
- 选型直觉：直接调 API vs RAG vs Agent vs 微调；何时用规则/检索代替模型

**实践项目**
- 写一页「能力地图笔记」：选 3 个你熟悉的业务场景，各标一种 AI 方案与不建议 AI 的理由

**检验标准**
- 能向同事用 5 分钟讲清：LLM、embedding、RAG、工具调用、Agent 各自解决什么问题
- 面对需求能提出「最小可行 AI 方案」，而不是默认「接个 ChatGPT」

**推荐资源**
- [OpenAI Platform 概览](https://platform.openai.com/docs/overview)
- [Anthropic 文档：Claude 能力与限制](https://docs.anthropic.com/)
- 文章类型：Andrej Karpathy《Software 2.0》思路类综述；各厂商「Cookbook / Guides」首页（先扫目录建立地图）

---

## 阶段 1：Prompt、结构化输出与工具调用（约 2 周）

**目标**：把模型当「可编程组件」用：可控输入、可控输出、可调用工具。与前端 JSON、表单校验、API 契约思维直接对齐。

**核心主题**
- Prompt 结构：角色、任务、约束、示例、输出格式；少样本与任务拆解
- 结构化输出：JSON Schema / 强制 JSON；校验失败重试；与 TypeScript 类型对齐
- 工具调用（Function Calling / Tools）：声明工具、参数 schema、执行结果回填模型
- 温度、系统提示、多轮上下文；常见失败模式（跑题、漏字段、胡编 ID）

**实践项目**
- 做一个「需求 → 结构化任务卡」小工具：输入自然语言，输出严格 JSON（含字段校验）
- 再加一个工具：根据任务卡调假 API（查天气/建工单），完成一轮 tool-use 闭环

**检验标准**
- 输出能稳定通过 Zod / JSON Schema 校验（成功率可量化）
- 能独立写清：系统提示、用户消息、tools 定义、tool result 回传的消息序列

**推荐资源**
- [OpenAI Prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [OpenAI Function calling](https://platform.openai.com/docs/guides/function-calling)
- [Anthropic Prompt engineering / Tool use](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- 书/文：OpenAI Cookbook 中 structured outputs、tool calling 示例条目

---

## 阶段 2：前端侧 AI 工程（约 3 周）——你的主战场

**目标**：把模型能力做成可用产品：流式 UI、鉴权、配额、边缘部署、错误与中断体验。

**核心主题**
- 流式：SSE / fetch stream；token 级渲染；停止生成；断线重连与取消（AbortController）
- SDK：OpenAI / Anthropic 官方 SDK；Vercel AI SDK 等前端友好封装（按栈选型，不必全学）
- 后端薄层：Next.js Route Handlers / Cloudflare Workers / 边缘函数；**密钥绝不能进浏览器**
- 鉴权与配额：用户身份、速率限制、按用户计费感知、滥用防护
- 体验工程：骨架屏、部分结果、引用/来源展示、敏感操作二次确认、降级文案

**实践项目**
- 全栈小应用：登录用户 → 调模型流式聊天 → 服务端持有 API Key → 简单配额（如每日 N 次）
- 可选：加「停止生成」、消息编辑重试、工具调用结果在 UI 中可视化

**检验标准**
- 浏览器 Network 中看不到厂商 API Key；流式输出流畅可取消
- 能说明：前端、边缘/API、模型提供商三层职责与失败时各自怎么表现

**推荐资源**
- [Vercel AI SDK 文档](https://sdk.vercel.ai/docs)
- [OpenAI Streaming](https://platform.openai.com/docs/guides/streaming-responses)
- [MDN：Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- Anthropic / OpenAI 官方 SDK README 与「production best practices」类指南

**前端优势怎么用**
- 交互与状态机、无障碍与性能、组件化交付、观测用户真实用法——这些比「再写一个 Prompt」更难替代。先把 AI 嵌进你已有的产品手感里，比追论文更有职业杠杆。

---

## 阶段 3：RAG / 知识库入门（工程视角，约 2–3 周）

**目标**：让模型「查得到你们的文档」，理解向量、embedding、检索、chunking 的工程取舍，而不是推导公式。

**核心主题**
- Embedding：文本 → 向量；相似度检索；维度与成本直觉
- Chunking：按标题/段落/重叠切分；切太碎丢上下文、太粗噪声大
- 检索管线：ingest → store → query → rerank（可选）→ 拼上下文 → 生成
- 工程坑：过期文档、权限隔离、引用溯源、空检索时的兜底

**实践项目**
- 把一份产品文档（或本仓库 README）做成简易知识库：上传/切分 → 检索 → 带引用的问答页
- 对比两种 chunk 策略，用 10 个固定问题测「答对率 / 胡编率」

**检验标准**
- 能画出数据流，并解释为何某次答错（检索错 vs 生成编）
- 回答能附上来源片段；无命中时不瞎编业务事实

**推荐资源**
- [LangChain RAG 教程](https://js.langchain.com/docs/tutorials/rag/)（JS 版更贴前端栈）
- [LlamaIndex 入门](https://docs.llamaindex.ai/)（理解索引概念即可）
- OpenAI Cookbook：embeddings + retrieval 类示例
- 文章类型：「chunking strategies」「RAG evaluation」工程博客（选带评测数字的）

---

## 阶段 4：Agent / 工作流入门（约 2 周）

**目标**：理解「多步任务 + 工具」何时值得上 Agent，能搭最小可用工作流，知道框架大概在解决什么。

**核心主题**
- Agent 本质：规划 → 选工具 → 执行 → 观察 → 再决策；与单次 tool-call 的差别
- 模式：ReAct 式循环、固定 DAG 工作流、人在回路（审批节点）
- 框架概览（知其名、能选型即可）：LangGraph、Vercel AI SDK tools/agents、OpenAI Assistants / Responses 生态——选 1 个深用，别同时啃完
- 可靠性：步数上限、超时、幂等、日志与轨迹回放

**实践项目**
- 「研究助手」：给定主题 → 搜索/读页面（可用假工具）→ 汇总成大纲 → 可选人工确认后再生成终稿
- 或：「前端改版助手」：读组件文件摘要 → 提改动清单 → 生成补丁说明（不必真改仓库）

**检验标准**
- 能说明何时用单次 LLM、何时用 RAG、何时上 Agent，并各举业务例子
- 工作流有明确终止条件与失败路径，而不是无限循环

**推荐资源**
- [LangGraph 文档](https://langchain-ai.github.io/langgraph/)
- Anthropic / OpenAI 关于 agents、computer use / tool use 的官方指南
- 课程类型：DeepLearning.AI 上「LangChain / Agents」短课（选与你 SDK 一致的那门）

---

## 阶段 5（可选加深）：微调感知、评测、成本延迟、安全合规（约 2 周起，按需）

**目标**：具备上线后的「工程成熟度」语言，能参与评审，不必亲自训模型。

**核心主题**
- 微调感知：何时微调不如好 Prompt + RAG；LoRA 等概念到「听懂会议」即可
- 评测：黄金集、人工抽检、自动评分（LLM-as-judge 的局限）；回归防止改 Prompt 翻车
- 成本与延迟：token 计价、缓存、模型路由（小模型做分类、大模型做生成）、流式感知延迟
- 安全合规：Prompt 注入、数据外泄、PII、内容安全、日志脱敏、供应商 DPA

**实践项目**
- 为自己的聊天/RAG 应用建 20 条黄金问答 + 简单评分表；加一次成本看板（按请求估 token）

**检验标准**
- 能在方案评审里讲清：质量怎么测、钱怎么控、数据怎么不漏

**推荐资源**
- OpenAI / Anthropic 官方「safety / usage policies / evals」文档
- 书/文：《Building LLM Apps》类工程书选章节；厂商定价页 + tokenizer 工具动手算一笔账

---

## 明确边界：优势用在哪，什么先别深挖

**前端优势请刻意放大**
- 产品交互、流式与中断、信息架构、权限 UI、可访问性、性能与埋点——AI 功能的「最后一公里」
- TypeScript 契约、表单/Schema、状态机：天然适合结构化输出与工具参数
- 全栈前端习惯（BFF、边缘函数）：正好承接密钥、配额、编排

**暂时可以不深挖**
- 从零训练大模型、CUDA/分布式训练、推导 Transformer 论文级数学
- 重数学统计博士路径、自己实现反向传播框架
- 同时精通所有 Agent 框架与向量库；先一条链路端到端打穿

---

## 按目标分流：迷你路径

| 目标 | 建议走的阶段 | 备注 |
|------|----------------|------|
| **AI 应用前端**（Copilot UI、对话体验、嵌入业务页） | 0 → 1 → **2**（主深）→ 略知 3、4 | 把流式、鉴权、体验做到可上线；RAG/Agent 会对接即可 |
| **AI 全栈应用**（自己拼检索、工具、上线） | 0 → 1 → 2 → **3** → **4** → 按需 5 | 端到端交付一个带知识库或工作流的产品 |
| **偏 ML 工程**（评测、管线、微调协作） | 0 → 1 → 3 → **5**，补 Python 数据/评测栈；2、4 够用即可 | 再补经典 ML 基础与实验管理；仍不必从零训 LLM |

**建议总周期（业余可持续）**：阶段 0–2 约 6 周可形成「能做 AI 功能」的作品；加上 3–4 约再 4–5 周形成「能做 AI 应用」；阶段 5 贯穿工作持续补。

---

## 学习节奏建议

1. 每周至少 1 个可演示的小交付（比记笔记重要）。
2. 同一阶段只选一套主栈（例如 Next.js + 一家模型 API + 一个 SDK），打穿再换。
3. 作品优先放进简历：流式聊天 + 配额、带引用的 RAG、带审批的 Agent 三选二即可证明赛道迁移。
