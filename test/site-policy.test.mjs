import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "../next.config.ts";
import { CONTENT_SECURITY_POLICY, SECURITY_HEADERS } from "../lib/site-policy.mjs";

test("security policy is enforced across every route", async () => {
  assert.equal(typeof nextConfig.headers, "function");
  const routes = await nextConfig.headers();

  assert.equal(routes.length, 1);
  assert.equal(routes[0]?.source, "/(.*)");
  assert.deepEqual(routes[0]?.headers, [...SECURITY_HEADERS]);
});

test("content security policy keeps a narrow production allowlist", () => {
  const directives = new Map(
    CONTENT_SECURITY_POLICY.split("; ").map((directive) => {
      const [name, ...values] = directive.split(" ");
      return [name, values];
    })
  );

  assert.deepEqual(directives.get("default-src"), ["'self'"]);
  assert.deepEqual(directives.get("connect-src"), ["'self'"]);
  assert.deepEqual(directives.get("object-src"), ["'none'"]);
  assert.deepEqual(directives.get("frame-ancestors"), ["'none'"]);
  assert.deepEqual(directives.get("form-action"), ["'self'"]);
  assert.equal(CONTENT_SECURITY_POLICY.includes("*"), false);
  assert.equal(CONTENT_SECURITY_POLICY.includes("http:"), false);
});

test("deployment headers include MIME sniffing and privacy protections", () => {
  const headers = Object.fromEntries(SECURITY_HEADERS.map(({ key, value }) => [key, value]));

  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["X-Frame-Options"], "DENY");
  assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.equal(headers["Content-Security-Policy"], CONTENT_SECURITY_POLICY);
});
