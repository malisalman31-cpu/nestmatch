import assert from "node:assert/strict";
import test from "node:test";
import { buildSharePayload, CANONICAL_URL, shareNestMatch } from "../dist/sharing.js";

test("share payload uses the canonical public site and campaign labels", () => {
  const payload = buildSharePayload();
  const url = new URL(payload.url);
  assert.equal(url.origin + url.pathname, CANONICAL_URL);
  assert.equal(url.searchParams.get("utm_source"), "referral");
  assert.equal(url.searchParams.get("utm_medium"), "share");
  assert.equal(url.searchParams.get("utm_campaign"), "nestmatch_invite");
  assert.match(payload.text, /renters and landlords/i);
});

test("uses the native share menu when available", async () => {
  let received;
  const result = await shareNestMatch({ share: async (payload) => { received = payload; } });
  assert.equal(result, "shared");
  assert.equal(received.title, buildSharePayload().title);
});

test("copies the referral link when native sharing is unavailable", async () => {
  let copied;
  const result = await shareNestMatch({ clipboard: { writeText: async (value) => { copied = value; } } });
  assert.equal(result, "copied");
  assert.equal(copied, buildSharePayload().url);
});

test("reports when neither sharing method is available", async () => {
  assert.equal(await shareNestMatch({}), "unavailable");
});
