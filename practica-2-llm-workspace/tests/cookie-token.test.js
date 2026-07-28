import test from "node:test";
import assert from "node:assert/strict";
import { FakeCookieDocument } from "./helpers.js";
import { CookieTokenAdapter } from "../src/adapters/auth/CookieTokenAdapter.js";

test("cookie usa nombre, formato y TTL exactos", () => {
  const now = 1_700_000_000_000;
  const documentRef = new FakeCookieDocument(() => now);
  const adapter = new CookieTokenAdapter({
    documentRef,
    cookieName: "llm_token",
    prefix: "tk_",
    clock: () => now
  });

  const token = adapter.issue(120);
  assert.equal(token.expiresAt, now + 120_000);
  assert.match(documentRef.cookie, /^llm_token=tk_1700000120000$/);
  assert.ok(documentRef.attributes.get("llm_token").includes("Max-Age=120"));
  assert.deepEqual(adapter.read(), {
    value: "tk_1700000120000",
    expiresAt: 1_700_000_120_000
  });
});

test("clear elimina exclusivamente la cookie propia", () => {
  const documentRef = new FakeCookieDocument();
  documentRef.cookie = "otra=abc; Max-Age=999";
  const adapter = new CookieTokenAdapter({ documentRef, cookieName: "llm_token", prefix: "tk_" });
  adapter.issue(120);
  adapter.clear();
  assert.equal(documentRef.cookie, "otra=abc");
});
