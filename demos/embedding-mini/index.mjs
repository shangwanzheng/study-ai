/**
 * 教学用：本地 embedding + 内存「向量库」+ 拼 RAG 上下文
 * 不调用任何云 API。向量质量远低于正式 embedding 模型，但链路相同。
 */

const DIM = 128;

/** 抽出教学用词元：英文按词，中文按字 + 二字组合（无空格也能比相似度） */
function tokenize(text) {
  const cleaned = String(text).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
  const tokens = [];
  for (const piece of cleaned.split(/\s+/).filter(Boolean)) {
    if (/[\u4e00-\u9fff]/.test(piece)) {
      const chars = [...piece];
      for (const ch of chars) tokens.push(ch);
      for (let i = 0; i < chars.length - 1; i++) tokens.push(chars[i] + chars[i + 1]);
    } else {
      tokens.push(piece);
    }
  }
  return tokens;
}

/** 极简 embedding：词元哈希到固定维度后 L2 归一化（仅供理解流程） */
function embed(text) {
  const vec = new Float64Array(DIM);
  for (const tok of tokenize(text)) {
    let h = 2166136261;
    for (let i = 0; i < tok.length; i++) {
      h ^= tok.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const idx = Math.abs(h) % DIM;
    const sign = h & 1 ? 1 : -1;
    vec[idx] += sign;
    vec[(idx + 1) % DIM] += 0.35 * sign;
  }

  let norm = 0;
  for (const x of vec) norm += x * x;
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < DIM; i++) vec[i] /= norm;
  return Array.from(vec);
}

function cosine(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

/** 内存向量库：[{ id, text, metadata, vector }] */
function createMemoryVectorStore() {
  const rows = [];
  return {
    add(id, text, metadata = {}) {
      rows.push({ id, text, metadata, vector: embed(text) });
    },
    search(query, k = 3) {
      const q = embed(query);
      return rows
        .map((r) => ({ ...r, score: cosine(q, r.vector) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k);
    },
  };
}

// —— 假知识库（像你们帮助中心切出来的 chunk）——
const chunks = [
  {
    id: "refund-1",
    text: "退款一般在审核通过后 3 到 7 个工作日原路退回，节假日可能延迟。",
    metadata: { doc: "退款政策" },
  },
  {
    id: "refund-2",
    text: "若订单已发货，需先拒收或签收后申请退货，退款在仓库收货质检后发起。",
    metadata: { doc: "退款政策" },
  },
  {
    id: "ship-1",
    text: "下单后普通快递 48 小时内发货出库；偏远地区物流时效以承运商轨迹为准。",
    metadata: { doc: "物流说明" },
  },
  {
    id: "vip-1",
    text: "会员积分不可兑换现金，可在结算页抵扣部分订单金额，规则以活动页为准。",
    metadata: { doc: "会员规则" },
  },
];

const store = createMemoryVectorStore();
for (const c of chunks) store.add(c.id, c.text, c.metadata);

const query = process.argv[2] || "买的东西什么时候能把钱退回来？";
const hits = store.search(query, 2);

console.log("问题:", query);
console.log("\n检索到的近邻（score 越高越相似）:");
for (const h of hits) {
  console.log(`- [${h.score.toFixed(3)}] (${h.metadata.doc}) ${h.text}`);
}

const context = hits.map((h, i) => `[${i + 1}] ${h.text}`).join("\n");
const prompt = `你是客服助手。只根据下列资料回答；资料没有的就说不知道。\n\n资料:\n${context}\n\n用户问题: ${query}`;

console.log("\n—— 即将送给 LLM 的上下文（RAG 拼好的 prompt）——\n");
console.log(prompt);
console.log("\n提示: node index.mjs \"积分能不能换成现金\"");
