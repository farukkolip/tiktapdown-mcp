// Daily contract test against PRODUCTION (not a mock).
// Fails if any site-backed tool serves its fallback text, or if the country
// enum drifts from the countries tiktapdown.com actually publishes.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const SITE = "https://tiktapdown.com";
const failures = [];

// 1) Country enum vs. site sitemap (/trends/XX pages are the source of truth)
const sitemap = await fetch(`${SITE}/sitemap.xml`).then(r => r.text());
const siteCountries = [...new Set([...sitemap.matchAll(/\/trends\/([A-Z]{2})</g)].map(m => m[1]))].sort();
const src = await import("node:fs").then(fs => fs.readFileSync(new URL("../src/index.ts", import.meta.url), "utf8"));
const enumMatch = src.match(/TRENDS_COUNTRIES = \[([^\]]+)\]/);
const mcpCountries = [...enumMatch[1].matchAll(/"([A-Z]{2})"/g)].map(m => m[1]).sort();
if (JSON.stringify(siteCountries) !== JSON.stringify(mcpCountries)) {
  failures.push(`country drift — site: ${siteCountries.join(",")} | mcp: ${mcpCountries.join(",")}`);
}

// 2) Call the site-backed tool for every country; fallback text = failure
const t = new StdioClientTransport({ command: "node", args: ["dist/index.js"] });
const c = new Client({ name: "contract-test", version: "0" }, { capabilities: {} });
await c.connect(t);
for (const country of mcpCountries) {
  const r = await c.callTool({ name: "get_tiktok_trends_by_country", arguments: { country } });
  const text = r.content?.[0]?.text ?? "";
  if (r.isError || text.includes("did not return data")) failures.push(`trends ${country}: fallback served`);
}
await c.close();

if (failures.length) { console.error("CONTRACT TEST FAILED\n- " + failures.join("\n- ")); process.exit(1); }
console.log(`ok — ${mcpCountries.length} countries, enum matches site`);
