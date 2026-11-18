# study-ai 学习包

给「前端转 AI」用的本地材料包。建议整夹复制到本机：`D:\study-ai`。

## 目录

```
study-ai/
  docs/
    frontend-to-ai-learning-outline.md   # 总学习大纲
    stage-0-ai-capability-map.md         # 阶段 0 知识点与阅读
  demos/
    embedding-mini/
      index.mjs                          # embedding + 内存向量检索 demo
      README.md
```

## 在你电脑上的位置（Cursor Agent Store 同步）

若尚未复制到 D 盘，可先在资源管理器打开（以你本机已同步到的子代理目录为准）：

`C:\Users\DELL\AppData\Local\Cursor\AgentStores\cursor_agent_stores\bc-3bbd61ea-f870-5c8e-a813-10dc770b1fd4\files\study-ai`

复制到 D 盘（PowerShell）：

```powershell
New-Item -ItemType Directory -Force -Path D:\study-ai | Out-Null
Copy-Item -Recurse -Force `
  "C:\Users\DELL\AppData\Local\Cursor\AgentStores\cursor_agent_stores\bc-3bbd61ea-f870-5c8e-a813-10dc770b1fd4\files\study-ai\*" `
  D:\study-ai\
```

## 跑 demo

```powershell
cd D:\study-ai\demos\embedding-mini
node .\index.mjs
node .\index.mjs "积分能不能换成现金"
```

需已安装 Node.js。
