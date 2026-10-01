# NestMatch

NestMatch is a working, reciprocal rental-marketplace demo with a Python-first recommendation engine. Renters and landlords review independently ranked candidates, and a match forms only after both sides express interest.

**Live demo:** https://nestmatch-marketplace.workspace-016092.chatgpt.site

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

The public site includes search metadata, structured application data, a sitemap, crawl rules, an installable web-app manifest, indexable product and privacy pages, and a built-in invite control. Shared links include campaign labels without uploading personal profile or matching data.

Third-party ads are not active. A verified publisher account, eligible domain, consent setup, and ad-network approval are required before real advertising can be enabled safely.

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
