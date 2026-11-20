# 阶段 1 Demo：Prompt → JSON 校验 → 工具调用消息序列

零 API Key。用假模型演示：

1. 自然语言 → 结构化任务卡（手写校验，生产换 Zod）  
2. 问天气 → `assistant.tool_calls` → 执行工具 → `role: tool` 回填 → 最终回复  

## 运行

```bash
cd demos/prompt-tools-mini
node index.mjs
node index.mjs "帮我建一个高优先级工单：登录页按钮点不了"
node index.mjs "上海今天天气怎么样"
```

## 接下来接真模型

1. 把 `mockModel` 换成 OpenAI / Anthropic SDK 一次请求  
2. Structured Outputs 或 tool_calls 用官方字段  
3. 校验仍用 Zod；失败把 error 当新消息重试  

阅读材料见：`docs/stage-1-prompt-structured-tools.md`
