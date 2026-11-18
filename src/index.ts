import { buildPrompt, search } from "./retrieve.ts";

const query = process.argv[2] ?? "买的东西什么时候能把钱退回来？";
const hits = search(query, 2);

console.log(`问题: ${query}`);
console.log("");
console.log("检索到的近邻（score 越高越相似）:");
for (const hit of hits) {
  console.log(`- [${hit.score.toFixed(3)}] (${hit.doc}) ${hit.text}`);
}

console.log("");
console.log("—— 即将送给模型的上下文 ——");
console.log("");
console.log(buildPrompt(query, hits));
