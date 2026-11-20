# 阶段 1：Prompt、结构化输出与工具调用——知识点与阅读材料

> 对应大纲：[`frontend-to-ai-learning-outline.md`](./frontend-to-ai-learning-outline.md)「阶段 1」  
> 建议用时：约 2 周  
> 前置：阶段 0 能力地图（知道 LLM / RAG / Agent / 工具的分工）  
> 目标：把模型当「可编程组件」——可控输入、可控输出、可调用工具。

---

## 1. 阶段心智模型（先记住）

前端里你熟悉：**请求契约 → 校验 → 调下游 → 再校验**。  
阶段 1 就是同一套路套在 LLM 上：

| 前端直觉 | LLM 对应物 |
|----------|------------|
| API 的 path / body 约定 | **Prompt**（系统规则 + 用户输入 + 格式要求） |
| TypeScript 类型 / Zod | **结构化输出**（JSON Schema，不合格就重试） |
| 调后端微服务 | **工具调用**（模型只「点名」，你的代码执行） |
| 失败重试 / 降级 | 校验失败重问、缺字段补问、拒答 |

**一句话**：别把模型当聊天网页；当成「会说 JSON、会选工具的不可靠函数」，用 schema 和循环把它箍住。

---

## 2. 知识点清单

### 2.1 Prompt 结构（可复用模板）

一份好用的系统提示通常含：

1. **角色**：你是什么（客服 / 任务解析器 / 代码助手）  
2. **任务**：要完成什么  
3. **约束**：不能做什么、必须遵守什么  
4. **上下文**：业务规则、今日能用的字段含义  
5. **输出格式**：纯文本 / JSON / 分步骤  
6. **示例（few-shot）**：1–3 个「输入→输出」样例（难任务很管用）

**少样本（few-shot）**：给例子比空讲规则更稳。  
**任务拆解**：复杂需求先让模型「列步骤 / 抽字段」，再生成终稿，比一次问完更可控。

### 2.2 消息角色（调 API 时你会看到）

- **system**：产品规则，尽量稳定，少塞用户隐私  
- **user**：用户本轮输入  
- **assistant**：模型回复  
- **tool / function result**：工具执行结果，再喂回模型（工具调用时才有）

多轮对话 = 历史消息数组；越长越贵、越容易漂，要截断或摘要（阶段 2 再工程化）。

### 2.3 温度等参数（阶段 1 够用）

- **temperature 偏低（如 0–0.3）**：填表、抽 JSON、分类 → 要稳  
- **偏高**：头脑风暴、文案花样 → 要散  
- 结构化任务：**优先低温度 + schema**，别靠「请一定输出 JSON」口头约束 alone

### 2.4 结构化输出

目标：模型输出能被 `JSON.parse` + **Zod / JSON Schema** 一次校验通过。

常见做法（由松到紧）：

1. Prompt 里写清 JSON 字段（最弱）  
2. 官方 **JSON mode / Structured Outputs**（强约束，优先用）  
3. 校验失败 → 把错误信息当新一轮 user/tool 消息让模型改（重试 1–2 次）  
4. 与 TypeScript：`z.infer<typeof Schema>` 当前后端共享类型

**失败模式**：多写解释文字、漏字段、字段类型错、胡编枚举值、ID 瞎编。

### 2.5 工具调用（Function Calling / Tools）

流程（务必能默画）：

```
用户问题
  → 你带 tools 定义调模型
  → 模型返回：要调哪个工具 + 参数（还不真执行）
  → 你的代码执行工具（查 DB / HTTP）
  → 把 tool result 写回消息列表
  → 再调模型
  → 模型给出最终自然语言或结构化答案
```

要点：

- **副作用在你代码里**，不在模型里  
- 工具参数也要 schema（和表单一样）  
- 工具描述写清楚「什么时候用 / 不要什么时候用」  
- 一次可以建议多个工具；要设好允许列表与权限  

和 Agent 的差别（复习）：单次或短循环工具调用 ≠ 开放式多步 Agent；Agent 是阶段 4。

### 2.6 和前端直接相关的练习点

- 用 Zod 校验模型 JSON，和校验接口响应同一肌肉  
- UI：解析中 / 调用工具中 / 最终答案 三态（阶段 2 会做成流式）  
- 永远：**API Key 不进浏览器**（本阶段可用脚本或本地 server 试）

---

## 3. 实践项目（大纲规定）

### 项目 A：需求 → 结构化任务卡（第 1 周）

- 输入：一段自然语言需求  
- 输出：严格 JSON，例如：

```json
{
  "title": "string",
  "priority": "low|medium|high",
  "assigneeHint": "string|null",
  "checklist": ["string"]
}
```

- 用 Zod 校验；失败则自动重试最多 2 次并统计成功率  

### 项目 B：任务卡 + 假工具闭环（第 2 周）

- 声明工具如 `createTicket({ title, priority })` / `getWeather({ city })`  
- 假实现（内存 Map 即可）  
- 跑通：自然语言 →（可选先出任务卡）→ tool call → tool result → 最终回复  
- 在日志里打印完整消息序列  

可参考本仓库配套 demo（可先看消息序列，再接真 API）：  
[`../demos/prompt-tools-mini/`](../demos/prompt-tools-mini/)

---

## 4. 阅读材料（按两周排）

### 第 1 周：Prompt + 结构化输出

| 材料 | 怎么读 | 读完应能 |
|------|--------|----------|
| [OpenAI Prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering) | 精读：清晰指令、示例、拆分任务 | 写出带角色/约束/格式的系统提示 |
| [OpenAI Structured model outputs](https://platform.openai.com/docs/guides/structured-outputs)（名称若变，文档内搜 Structured） | 精读：schema 怎么绑 | 说明 JSON mode 与 schema 强制的差别 |
| [Anthropic Prompt engineering 概览](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) | 对照读，记 3 条两家共通原则 | 不绑死一家厂商话术 |
| [OpenAI Cookbook](https://cookbook.openai.com/) 搜 `structured` / `json` | 跑通 1 个 notebook 或复制最小示例 | 本地跑出合法 JSON |
| Zod 文档：[Defining schemas](https://zod.dev/) | 会写 enum、array、nullable | 模型输出进 `schema.parse` |

### 第 2 周：工具调用

| 材料 | 怎么读 | 读完应能 |
|------|--------|----------|
| [OpenAI Function calling](https://platform.openai.com/docs/guides/function-calling) | 精读完整往返 | 默画「模型建议 → 你执行 → 回填」 |
| [Anthropic Tool use](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview) | 对照消息字段名差异 | 换厂商时知道改哪里 |
| Cookbook 搜 `function calling` / `tool` | 跟做一个官方示例 | 改成自己的假 API |
| （可选）[Vercel AI SDK Tools](https://sdk.vercel.ai/docs) | 扫 tools 章节 | 知道前端栈如何封装（深用放阶段 2） |

### 辅助（有英文压力时）

- 官方页可丢给翻译或浏览器翻译；**代码块以原文为准**  
- 阶段 0 已读过的能力地图：工具 ≠ Agent，需要时回看选型表  

---

## 5. 两周日程建议

| 天 | 任务 | 产出 |
|----|------|------|
| D1–D2 | Prompt engineering 两家文档 | 1 份「任务卡」系统提示 v1 |
| D3–D4 | Structured outputs + Zod | 脚本：自然语言 → 校验后 JSON |
| D5 | 统计 20 条样本通过率；改 prompt/schema | 通过率数字（目标 ≥ 90%） |
| D6–D7 | 缓冲 / 补笔记 | 失败案例 5 条与改法 |
| D8–D9 | Function calling / Tool use 文档 | 消息序列手绘图 |
| D10–D12 | 接假工具闭环 | 可演示的小脚本或 CLI |
| D13–D14 | 整理检验清单；预习阶段 2（流式/SSE 名词即可） | 阶段 1 打勾完成 |

---

## 6. 检验标准（对照大纲）

- [ ] 输出能稳定通过 Zod / JSON Schema（有量化成功率）  
- [ ] 能独立写清：系统提示、用户消息、tools 定义、tool result 回传的消息序列  
- [ ] 能解释：温度为何在抽 JSON 时要偏低  
- [ ] 能解释：工具由谁执行、模型胡编的参数为何必须校验  

通过后进入 **阶段 2：前端侧 AI 工程**（流式 UI、SSE、SDK、边缘函数、鉴权与配额）。

---

## 7. 暂时不必深挖

- 微调、训练、复杂 Agent 框架（LangGraph 深用）  
- 生产级可观测与配额（阶段 2）  
- RAG 向量库细节（阶段 3）——本阶段工具若「搜知识库」可先 mock  

---

## 8. 与阶段 0 / 2 的衔接

- 阶段 0：选对「要不要 AI / 要不要工具」  
- **阶段 1：把单次调用做可靠**（本阶段）  
- 阶段 2：做成用户能用的前端产品形态  
