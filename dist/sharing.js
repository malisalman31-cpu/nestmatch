export const CANONICAL_URL = "https://nestmatch-rentals.pages.dev/";

export function buildSharePayload() {
  const url = new URL(CANONICAL_URL);
  url.searchParams.set("utm_source", "referral");
  url.searchParams.set("utm_medium", "share");
  url.searchParams.set("utm_campaign", "nestmatch_invite");
  return {
    title: "NestMatch — mutual rental matching",
    text: "Explore NestMatch’s free rental planning tools and local-only matching demo for renters and landlords. Demo profiles are not real listings.",
    url: url.toString(),
  };
}

export async function shareNestMatch(navigatorObject = globalThis.navigator) {
  const payload = buildSharePayload();
  if (typeof navigatorObject?.share === "function") {
    await navigatorObject.share(payload);
    return "shared";
  }
  if (typeof navigatorObject?.clipboard?.writeText === "function") {
    await navigatorObject.clipboard.writeText(payload.url);
    return "copied";
  }
  return "unavailable";
}
