# Real-listing dashboard (October 2026)

Production now loads the free Mi Casa Rentals public API directly in the browser (CORS, no keys, no fees). Initial source coverage is Pensacola, Florida, not nationwide. `dist/rental-feed.js` validates the source identity, explicit attribution license, schema, timestamps, costs, duplicate IDs and outbound URL allowlist. Source text is rendered with textContent. No third-party photos are copied or requested; each card links to its original listing for photos, inquiries and applications. Costs exclude conditional fees. Unknown full-stay availability is never assumed confirmed. Failed, old or invalid feeds fail closed without sample substitution. The source receives normal connection metadata but no saved preferences or notes.

The provider caches responses for five minutes. Reload retrieves current source data; no paid service, background job, or credential is required. Source terms: https://www.micasa.rentals/api.php (read 2026-10-15; explicitly allows use, caching, republication with attribution). This permission does not extend to Zillow, Airbnb, Vrbo or Craigslist.

`/?demo=1` retains the fictional LA inventory and old shortlist storage. Real saves use `nestmatch-live-shortlist-v1`; no existing demo saves are erased. Source removals disappear on reload. Notes remain private browser data, not actual contact or applications.

# NestMatch

NestMatch is a free **rental-shortlist prototype**, not a live marketplace. The current homepage lets renters filter eight fictional Los Angeles homes, swipe or use accessible buttons to save/pass, undo decisions, and compare saved costs. Private notes and progress labels persist in the current browser.

## Current shortlist experience

- Python and SQLite generate deterministic sample data: `analysis/build_shortlist.py`, `analysis/shortlist.sql`.
- `dist/shortlist.js` validates inventory, applies must-have filters, ranks preferences, and manages save/pass/undo state.
- `dist/shortlist-app.js` renders discovery, saved dashboard, cost comparison, and optional neighborhood maps.
- Unknown utilities and deposits are explicit, not zero. Must-have unknowns can be excluded.
- Commute and personal notes are notes only. Progress labels do not send messages or applications.
- Map pins show sample neighborhoods, never real property addresses. Maps contact OpenStreetMap only on request.
- Sample application buttons are disabled. There are no Airbnb, Zillow, Vrbo, Furnished Finder, or Craigslist integrations.
- Data is device-local, not synchronized. No accounts, shared listing submission, screening, payments, ads, or live inventory.
- Existing guides remain available. The previous reciprocal demo and its local profiles/photos are preserved at `/legacy-demo.html` under their original storage keys.

Run `npm run build:shortlist` after editing the Python/SQL fixtures. Run `npm run check` to verify generated output and the new and legacy suites.

### Before a real pilot

Recruit property owners who grant display permission; verify each source URL, listing provenance, current availability, and rights to photos. Add a durable consented backend and listing moderation before collecting public submissions. Do not describe samples as live inventory or claim coverage of all platforms.

The rest of this README documents the retained **legacy reciprocal-matching demo**, not the active shortlist ranking model.

**Live demo:** https://nestmatch-rentals.pages.dev

The legacy experience implements the four workflows described in the portfolio project:

1. candidate discovery;
2. ranked renter and property feeds;
3. preference capture; and
4. reciprocal match creation.

## Ranking model

Every candidate receives an inspectable weighted score across four feature groups:

- price or income fit: 35%;
- location or move timing: 25%;
- housing or profile fit: 25%; and
- mutual-interest signal: 15%.

The Python engine produces deterministic reference rankings across renter and landlord scenarios. The browser mirrors the same scoring contract so the public interface can update immediately as preferences change. Decisions, saved candidates, and matches stay in browser storage. No account or server is required for the public demo.

## Profiles and photos

Renters and landlords can each build a separate profile with a display name, introduction, hobbies, passions, and up to three personal photos. Landlords can also add up to six photos of their place. Images are validated, resized, and compressed in the browser before being saved.

Profile details and photos are device-private: they remain in the current browser and are never uploaded to a server or shared with other people. This keeps the public demo safe to try without creating an account. Clearing the site data or using the reset control removes them.

## Discovery and sharing

The free rental-planning section is useful nationwide even though the matching demonstration still uses sample Los Angeles inventory. It includes `/rental-guides`, `/short-term-vs-long-term-rentals`, `/rental-listing-checklist`, and `/rental-cost-calculator`. The calculator processes quotes locally, separates deposits from costs, and shows base-rent commitments beyond the planned stay. It does not provide market prices, legal liability, or affordability decisions.

Run `npm run build:search` after editing `scripts/build_search_pages.py`. The Python generator builds static HTML (readable without JavaScript) and the seven-page canonical sitemap. Tests check metadata, internal links, structured data, calculator edge cases, and generated-output parity. A dedicated `404.html` prevents unknown URLs from falling back to a successful demo page on Cloudflare Pages. The home page includes the owner's Search Console verification tag; keep it across deployments.

The public site includes search metadata, structured application data, a sitemap, crawl rules, a web-app manifest, indexable product and privacy pages, and a legacy-demo invite control. Shared links include campaign labels without uploading personal profile or matching data.

Third-party ads are not active. A verified publisher account, eligible domain, consent setup, and ad-network approval are required before real advertising can be enabled safely.

## Hosting

The current public demo runs on Cloudflare Pages under the free project `nestmatch-rentals`. Deploy the contents of `dist/` as the root of a Pages Direct Upload archive; do not upload repository metadata or private configuration. The previous Sites deployment remains a separate copy.

`dist/ads.txt` declares the owner's AdSense publisher account for ownership verification and authorized selling. It does not load ads, cookies, or tracking scripts. The intended ad format is a small in-page banner without interrupting the matching flow; publisher approval and applicable consent setup must precede activation.

## Run locally

```bash
npm start
```

Open `http://127.0.0.1:4180`.

## Test

```bash
npm run build:rankings
npm run check
npm run test:coverage
```

GitHub Actions checks the current shortlist, the retained legacy model, Python/JavaScript parity, generated fixtures, search pages, and JavaScript coverage on every push.

## Architecture

- `analysis/recommender.py` is the Python-first scoring and ranking engine.
- `analysis/output/reference_rankings.json` records six reproducible renter and landlord scenarios.
- `dist/marketplace.js` mirrors the Python scoring contract for real-time browser interaction, preference validation, swipe storage, and match generation.
- `dist/profiles.js` validates and normalizes renter and landlord profile content.
- `dist/profile-ui.js` handles private, device-local profile and photo editing.
- `dist/app.js` uses the same functions for the visible renter and landlord journeys.
- `dist/webmcp.js` exposes those journeys to compatible browser agents.
- `docs/schema.sql` documents 12 relational entities and the integrity rules for a production implementation.

## Scope and privacy

This is a public portfolio implementation with representative demo profiles and listings. It does not publish real addresses, upload profile photos, run background checks, accept payments, or contact anyone. All decisions, profile fields, and photos remain on the current device unless the user clears browser storage.

The property triptych is original synthetic imagery generated specifically for this public demo; it does not depict actual listings.

## License

MIT
