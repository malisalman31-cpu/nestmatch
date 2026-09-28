# NestMatch

NestMatch is a working, reciprocal rental-marketplace demo. Renters and landlords review independently ranked candidates, and a match forms only after both sides express interest.

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

The interface updates the ranking immediately as preferences change. Decisions, saved candidates, and matches stay in browser storage. No account or server is required for the public demo.

## Run locally

```bash
npm start
```

Open `http://127.0.0.1:4180`.

## Test

```bash
npm run check
npm run test:coverage
```

GitHub Actions is enabled and runs the syntax checks, 51 behavioral tests, and coverage suite on every push and pull request.

## Architecture

- `dist/marketplace.js` contains deterministic scoring, ranking, preference validation, swipe storage, and match generation.
- `dist/app.js` uses the same functions for the visible renter and landlord journeys.
- `dist/webmcp.js` exposes those journeys to compatible browser agents.
- `docs/schema.sql` documents 12 relational entities and the integrity rules for a production implementation.

## Scope and privacy

This is a public portfolio implementation with representative demo profiles and listings. It does not publish real addresses, run background checks, accept payments, or contact anyone. All decisions remain on the current device unless the user clears browser storage.

The property triptych is original synthetic imagery generated specifically for this public demo; it does not depict actual listings.

## License

MIT
