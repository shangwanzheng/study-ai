export interface Chunk {
  id: string;
  text: string;
  doc: string;
}

export interface Hit {
  id: string;
  text: string;
  doc: string;
  score: number;
}

const DIM = 128;

/** 英文按词，中文按字和相邻二字，方便没有空格的句子也能比较。 */
export function tokenize(text: string): string[] {
  const cleaned = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
  const tokens: string[] = [];

  for (const piece of cleaned.split(/\s+/).filter(Boolean)) {
    if (/[\u4e00-\u9fff]/.test(piece)) {
      const chars = [...piece];
      tokens.push(...chars);
      for (let i = 0; i < chars.length - 1; i += 1) {
        const current = chars[i];
        const next = chars[i + 1];
        if (current !== undefined && next !== undefined) {
          tokens.push(current + next);
        }
      }
    } else {
      tokens.push(piece);
    }
  }

  return tokens;
}

/** 教学用向量：把词元哈希进固定维度，再做 L2 归一化。不是正式 embedding 模型。 */
export function embed(text: string): number[] {
  const vec = new Float64Array(DIM);

  for (const token of tokenize(text)) {
    let hash = 2166136261;
    for (let i = 0; i < token.length; i += 1) {
      hash ^= token.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const index = Math.abs(hash) % DIM;
    const sign = hash & 1 ? 1 : -1;
    const slot = vec[index] ?? 0;
    const neighbor = vec[(index + 1) % DIM] ?? 0;
    vec[index] = slot + sign;
    vec[(index + 1) % DIM] = neighbor + 0.35 * sign;
  }

  let norm = 0;
  for (const value of vec) norm += value * value;
  norm = Math.sqrt(norm) || 1;

  return Array.from(vec, (value) => value / norm);
}

export function cosine(left: readonly number[], right: readonly number[]): number {
  const length = Math.min(left.length, right.length);
  let sum = 0;
  for (let i = 0; i < length; i += 1) {
    sum += (left[i] ?? 0) * (right[i] ?? 0);
  }
  return sum;
}

export const knowledge: Chunk[] = [
  {
    id: "refund-1",
    text: "退款一般在审核通过后 3 到 7 个工作日原路退回，节假日可能延迟。",
    doc: "退款政策",
  },
  {
    id: "refund-2",
    text: "若订单已发货，需先拒收或签收后申请退货，退款在仓库收货质检后发起。",
    doc: "退款政策",
  },
  {
    id: "ship-1",
    text: "下单后普通快递 48 小时内发货出库；偏远地区物流时效以承运商轨迹为准。",
    doc: "物流说明",
  },
  {
    id: "vip-1",
    text: "会员积分不可兑换现金，可在结算页抵扣部分订单金额，规则以活动页为准。",
    doc: "会员规则",
  },
];

export function search(query: string, k = 2, chunks: readonly Chunk[] = knowledge): Hit[] {
  const queryVector = embed(query);
  return chunks
    .map((chunk) => ({
      id: chunk.id,
      text: chunk.text,
      doc: chunk.doc,
      score: cosine(queryVector, embed(chunk.text)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

export function buildPrompt(query: string, hits: readonly Hit[]): string {
  const context = hits.map((hit, index) => `[${index + 1}] ${hit.text}`).join("\n");
  return [
    "你是客服助手。只根据下列资料回答；资料没有的就说不知道。",
    "",
    "资料:",
    context,
    "",
    `用户问题: ${query}`,
  ].join("\n");
}
