import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPrompt, search, tokenize } from "../src/retrieve.ts";

describe("tokenize", () => {
  it("splits Chinese into characters and bigrams", () => {
    assert.deepEqual(tokenize("退款"), ["退", "款", "退款"]);
  });
});

describe("search", () => {
  it("ranks the refund policy first for a refund question", () => {
    const [top] = search("买的东西什么时候能把钱退回来？", 2);
    assert.ok(top);
    assert.equal(top.doc, "退款政策");
    assert.ok(top.score > 0);
  });

  it("ranks the membership rule first for a points question", () => {
    const [top] = search("积分能不能换成现金", 1);
    assert.ok(top);
    assert.equal(top.id, "vip-1");
  });
});

describe("buildPrompt", () => {
  it("includes the question and the retrieved text", () => {
    const hits = search("积分能不能换成现金", 1);
    const prompt = buildPrompt("积分能不能换成现金", hits);
    assert.match(prompt, /积分能不能换成现金/);
    assert.match(prompt, /会员积分不可兑换现金/);
  });
});
