# study-ai

前端转 AI 的学习笔记仓库：按阶段沉淀大纲与知识点，并用定时任务每天自动打卡。

## 目录

| 路径 | 说明 |
|------|------|
| [`docs/frontend-to-ai-learning-outline.md`](docs/frontend-to-ai-learning-outline.md) | 前端工程师转 AI 赛道：可落地学习大纲 |
| [`docs/stage-0-ai-capability-map.md`](docs/stage-0-ai-capability-map.md) | 阶段 0：AI 产品与能力地图 |
| [`demos/embedding-mini/`](demos/embedding-mini/) | 本地 embedding + 内存向量检索教学 demo（零 API Key） |
| [`journal/`](journal/) | 每日自动打卡记录（`YYYY-MM-DD.md`） |
| [`.github/workflows/daily-commit.yml`](.github/workflows/daily-commit.yml) | 每天 0 点（Asia/Shanghai）自动提交 |

## 学习阶段

| 阶段 | 主题 | 材料 |
|------|------|------|
| **0** | 建立 AI 产品与能力地图 | [大纲 §阶段 0](docs/frontend-to-ai-learning-outline.md) · [能力地图详解](docs/stage-0-ai-capability-map.md) |
| **1** | Prompt、结构化输出与工具调用 | [大纲 §阶段 1](docs/frontend-to-ai-learning-outline.md) |
| **2** | 前端侧 AI 工程（流式、鉴权、配额） | [大纲 §阶段 2](docs/frontend-to-ai-learning-outline.md) |
| **3** | RAG / 知识库入门 | [大纲 §阶段 3](docs/frontend-to-ai-learning-outline.md) |
| **4** | Agent / 工作流入门 | [大纲 §阶段 4](docs/frontend-to-ai-learning-outline.md) |
| **5**（可选） | 微调感知、评测、成本、安全合规 | [大纲 §阶段 5](docs/frontend-to-ai-learning-outline.md) |

建议路径：先做「会用模型的工程师」，再做「会把模型装进产品的工程师」，最后按兴趣加深 RAG / Agent / 评测。详见大纲总览。

## 每日打卡

GitHub Actions 按 **Asia/Shanghai 每天 00:00**（cron：`0 16 * * *` UTC）运行：创建或更新当日 `journal/YYYY-MM-DD.md`（含日期与「自动打卡」一行），有变更则提交并推送到 `main`。
