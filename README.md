# NestMatch

NestMatch is a working, reciprocal rental-marketplace demo with a Python-first recommendation engine. Renters and landlords review independently ranked candidates, and a match forms only after both sides express interest.

**Live demo:** https://nestmatch-rentals.pages.dev

The public experience implements the four workflows described in the portfolio project:

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

The public site includes search metadata, structured application data, a sitemap, crawl rules, a web-app manifest, indexable product and privacy pages, and a built-in invite control. Shared links include campaign labels without uploading personal profile or matching data.

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

GitHub Actions runs both implementations on every push: 65 browser-model tests, 12 Python recommendation tests, a cross-language parity test, deterministic reference-output validation, and JavaScript coverage.

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
