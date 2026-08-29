import assert from "node:assert/strict";
import test from "node:test";
import { GET as getLlms } from "../app/llms.txt/route.ts";
import sitemap from "../app/sitemap.ts";

test("llms.txt identifies the site, useful pages, and unavailable agent surfaces", async () => {
  const response = getLlms();
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") || "", /^text\/plain/);
  assert.match(body, /^# Skill Market Cap/m);
  assert.match(body, /https:\/\/skillmarketcap\.com\/about/);
  assert.match(body, /no account, submission form, user database, public API, OpenAPI contract, or MCP server/i);
  assert.match(body, /Adam Pang operates Skill Market Cap/);
});

test("sitemap exposes every linked trust page", () => {
  const urls = sitemap().map(({ url }) => url);

  assert.deepEqual(urls, [
    "https://skillmarketcap.com",
    "https://skillmarketcap.com/about",
    "https://skillmarketcap.com/contact",
    "https://skillmarketcap.com/privacy",
  ]);
});
