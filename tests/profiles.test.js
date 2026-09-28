import assert from "node:assert/strict";
import test from "node:test";
import { fitWithin, hydrateProfiles, normalizePhotos, normalizeProfile, normalizeTags, profileInitials, PROFILE_LIMITS, validatePhoto } from "../dist/profiles.js";

const tinyJpeg = "data:image/jpeg;base64,AA==";

test("normalizes comma-separated tags with trimming and deduplication", () => {
  assert.deepEqual(normalizeTags(" Hiking, cooking, hiking, , live music "), ["Hiking", "cooking", "live music"]);
});

test("normalizes array tags and enforces the requested maximum", () => {
  assert.deepEqual(normalizeTags(["one", "two", "three"], 2), ["one", "two"]);
  assert.equal(normalizeTags("x".repeat(50))[0].length, 36);
});

test("photo normalization keeps supported data URLs within limits", () => {
  assert.deepEqual(normalizePhotos([tinyJpeg, "https://example.com/photo.jpg", 1, "data:text/plain;base64,AA=="], 3), [tinyJpeg]);
  assert.equal(normalizePhotos(Array(10).fill(tinyJpeg), 3).length, 3);
  assert.deepEqual(normalizePhotos(null, 3), []);
});

test("renter profiles keep personal details but never listing photos", () => {
  const profile = normalizeProfile("renter", { displayName: "  Ali  ", about: "  A calm renter  ", hobbies: "Hiking", passions: ["Community"], personalPhotos: [tinyJpeg], listingPhotos: [tinyJpeg] });
  assert.equal(profile.displayName, "Ali");
  assert.equal(profile.about, "A calm renter");
  assert.deepEqual(profile.hobbies, ["Hiking"]);
  assert.deepEqual(profile.personalPhotos, [tinyJpeg]);
  assert.deepEqual(profile.listingPhotos, []);
});

test("landlord profiles support both personal and property photos", () => {
  const profile = normalizeProfile("landlord", { displayName: "Maya", personalPhotos: [tinyJpeg], listingPhotos: Array(9).fill(tinyJpeg) });
  assert.equal(profile.personalPhotos.length, 1);
  assert.equal(profile.listingPhotos.length, PROFILE_LIMITS.listingPhotos);
});

test("profile normalization validates roles and falls back to labels", () => {
  assert.equal(normalizeProfile("renter", { displayName: "" }).displayName, "Your renter profile");
  assert.throws(() => normalizeProfile("guest"), /renter or landlord/);
});

test("hydrateProfiles safely builds both sides", () => {
  const profiles = hydrateProfiles({ renter: { displayName: "Rae" }, landlord: { displayName: "Lee" } });
  assert.equal(profiles.renter.displayName, "Rae");
  assert.equal(profiles.landlord.displayName, "Lee");
  assert.deepEqual(hydrateProfiles().renter.hobbies, []);
});

test("photo validation accepts supported images within the source limit", () => {
  assert.deepEqual(validatePhoto({ type: "image/jpeg", size: 1000 }), { valid: true, reason: "" });
  assert.equal(validatePhoto({ type: "image/gif", size: 1000 }).valid, false);
  assert.match(validatePhoto({ type: "image/png", size: PROFILE_LIMITS.sourceBytes + 1 }).reason, /8 MB/);
  assert.equal(validatePhoto(null).valid, false);
});

test("fitWithin preserves aspect ratio and avoids upscaling", () => {
  assert.deepEqual(fitWithin(2000, 1000, 1000, 1000), { width: 1000, height: 500 });
  assert.deepEqual(fitWithin(400, 300, 1000, 1000), { width: 400, height: 300 });
  assert.deepEqual(fitWithin(1000, 2000, 900, 900), { width: 450, height: 900 });
  assert.throws(() => fitWithin(0, 100, 100, 100), /positive numbers/);
});

test("profile initials use up to two words and a safe fallback", () => {
  assert.equal(profileInitials("Muhammad Ali Salman"), "MA");
  assert.equal(profileInitials("maya"), "M");
  assert.equal(profileInitials(""), "YU");
});
