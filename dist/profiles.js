export const PROFILE_LIMITS = Object.freeze({ personalPhotos: 3, listingPhotos: 6, sourceBytes: 8 * 1024 * 1024, tags: 8 });

export const DEFAULT_PROFILES = Object.freeze({
  renter: Object.freeze({ displayName: "Your renter profile", about: "", hobbies: [], passions: [], personalPhotos: [], listingPhotos: [] }),
  landlord: Object.freeze({ displayName: "Your landlord profile", about: "", hobbies: [], passions: [], personalPhotos: [], listingPhotos: [] }),
});

function cleanText(value, maximum) { return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, maximum); }

export function normalizeTags(value, maximum = PROFILE_LIMITS.tags) {
  const source = Array.isArray(value) ? value : String(value ?? "").split(",");
  const seen = new Set();
  const tags = [];
  for (const raw of source) {
    const tag = cleanText(raw, 36);
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key); tags.push(tag);
    if (tags.length >= maximum) break;
  }
  return tags;
}

export function normalizePhotos(value, maximum) {
  if (!Array.isArray(value)) return [];
  return value.filter((photo) => typeof photo === "string" && /^data:image\/(?:jpeg|png|webp);base64,/i.test(photo)).slice(0, maximum);
}

export function normalizeProfile(role, value = {}) {
  if (!Object.hasOwn(DEFAULT_PROFILES, role)) throw new Error("Role must be renter or landlord.");
  const fallback = DEFAULT_PROFILES[role];
  return {
    displayName: cleanText(value.displayName, 50) || fallback.displayName,
    about: cleanText(value.about, 300),
    hobbies: normalizeTags(value.hobbies),
    passions: normalizeTags(value.passions),
    personalPhotos: normalizePhotos(value.personalPhotos, PROFILE_LIMITS.personalPhotos),
    listingPhotos: role === "landlord" ? normalizePhotos(value.listingPhotos, PROFILE_LIMITS.listingPhotos) : [],
  };
}

export function hydrateProfiles(value) {
  return { renter: normalizeProfile("renter", value?.renter), landlord: normalizeProfile("landlord", value?.landlord) };
}

export function validatePhoto(file) {
  if (!file || typeof file.type !== "string" || typeof file.size !== "number") return { valid: false, reason: "Choose an image file." };
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return { valid: false, reason: "Use a JPG, PNG or WebP image." };
  if (file.size > PROFILE_LIMITS.sourceBytes) return { valid: false, reason: "Each source photo must be 8 MB or smaller." };
  return { valid: true, reason: "" };
}

export function fitWithin(width, height, maximumWidth, maximumHeight) {
  if (![width, height, maximumWidth, maximumHeight].every((value) => Number.isFinite(value) && value > 0)) throw new Error("Photo dimensions must be positive numbers.");
  const scale = Math.min(1, maximumWidth / width, maximumHeight / height);
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export function profileInitials(name) {
  const words = cleanText(name, 50).split(" ").filter(Boolean);
  return (words.slice(0, 2).map((word) => word[0]).join("") || "YU").toUpperCase();
}
