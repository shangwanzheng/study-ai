/**
 * 阶段 1 教学 demo：结构化输出校验 + 工具调用消息序列
 * 默认「假模型」（无 API Key）；看懂链路后再换成真 SDK。
 *
 * 运行：
 *   node index.mjs
 *   node index.mjs "帮我建一个高优先级工单：登录页按钮点不了"
 */

import { createTicket, getWeather, TOOLS } from "./fake-tools.mjs";

// —— Zod 没有也能演示：手写最小校验（生产请用 zod）——
function parseTaskCard(raw) {
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  const priority = data.priority;
  if (!["low", "medium", "high"].includes(priority)) {
    throw new Error(`priority 非法: ${priority}`);
  }
  if (typeof data.title !== "string" || !data.title.trim()) {
    throw new Error("title 必须是非空字符串");
  }
  if (!Array.isArray(data.checklist)) {
    throw new Error("checklist 必须是数组");
  }
  return {
    title: data.title.trim(),
    priority,
    assigneeHint: data.assigneeHint ?? null,
    checklist: data.checklist.map(String),
  };
}

/** 假模型：根据用户话「决定」抽 JSON 或调工具（仅教学） */
function mockModel(messages, { tools } = {}) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = lastUser?.content ?? "";

  // 若上一条是 tool 结果 → 给最终回复
  const last = messages[messages.length - 1];
  if (last?.role === "tool") {
    return {
      type: "text",
      content: `已处理工具 ${last.name}：${last.content}`,
    };
  }

  // 天气意图 → 工具调用
  if (/天气|气温|下雨/.test(text) && tools?.some((t) => t.name === "getWeather")) {
    const city = /北京|上海|深圳|杭州/.exec(text)?.[0] ?? "上海";
    return {
      type: "tool_call",
      tool_call: { name: "getWeather", arguments: { city } },
    };
  }

  // 默认：抽任务卡 JSON
  const priority = /紧急|高优先|马上|点不了|挂了/.test(text) ? "high" : "medium";
  const title = text.replace(/^帮我|请|一下/g, "").trim().slice(0, 40) || "未命名任务";
  return {
    type: "text",
    content: JSON.stringify({
      title,
      priority,
      assigneeHint: priority === "high" ? "oncall" : null,
      checklist: ["复现问题", "确认影响面", "给出修复或降级"],
    }),
  };
}

function runTool(name, args) {
  if (name === "createTicket") return createTicket(args);
  if (name === "getWeather") return getWeather(args);
  throw new Error(`未知工具: ${name}`);
}

function printMessages(messages) {
  console.log("\n—— 消息序列（调真 API 时你传的就是类似数组）——\n");
  for (const m of messages) {
    console.log(JSON.stringify(m, null, 2));
    console.log("---");
  }
}

async function main() {
  const userText =
    process.argv[2] || "帮我建一个高优先级工单：登录页按钮点不了";

  const system = {
    role: "system",
    content:
      "你是任务解析器。若用户要建任务，只输出 JSON：" +
      '{"title","priority":"low|medium|high","assigneeHint","checklist":string[]}。' +
      "若问天气，调用 getWeather。不要编造工具结果。",
  };
  const messages = [system, { role: "user", content: userText }];

  console.log("用户:", userText);

  // 第 1 轮：模型回复
  const turn1 = mockModel(messages, { tools: TOOLS });
  if (turn1.type === "tool_call") {
    const { name, arguments: args } = turn1.tool_call;
    messages.push({
      role: "assistant",
      content: null,
      tool_calls: [{ name, arguments: args }],
    });
    const result = runTool(name, args);
    messages.push({
      role: "tool",
      name,
      content: JSON.stringify(result),
    });
    const turn2 = mockModel(messages, { tools: TOOLS });
    messages.push({ role: "assistant", content: turn2.content });
    printMessages(messages);
    console.log("\n最终回复:", turn2.content);
    return;
  }

  // 结构化输出路径
  messages.push({ role: "assistant", content: turn1.content });
  let card;
  try {
    card = parseTaskCard(turn1.content);
  } catch (e) {
    console.error("校验失败:", e.message);
    process.exitCode = 1;
    return;
  }
  printMessages(messages);
  console.log("\n校验后的任务卡:", card);

  // 演示：用任务卡再调 createTicket
  const ticket = createTicket({
    title: card.title,
    priority: card.priority,
  });
  console.log("假工具 createTicket 结果:", ticket);
}

main();
