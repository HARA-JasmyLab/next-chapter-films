# NEXT CHAPTER FILMS

Production: https://studio.cpa-hara.com/

Static Japanese animation studio landing page. The original artwork, dark palette,
Mincho typography, orange accents and embedded images are retained.

## Edit and build

Requires Node.js 22 or newer; no packages, credentials or environment variables.

```sh
npm run check
npm run build
```

- `src/template.html`: original visual shell and embedded artwork, preserved verbatim.
- `src/sections.json`: current Japanese copy, offerings and section markup.
- `src/strategy.css`: responsive additions using the existing design tokens.
- `src/consultation.js`: optional consultation memo; no submission, storage or analytics.
- `scripts/build.mjs`: replaces named regions, validates image preservation, unique IDs,
  section anchors and existing contact/privacy links, then writes `dist/`.

Vercel runs the build and publishes `dist/`. GitHub `main` is production; use a
preview branch to verify changes before merging. `site-version.json` exposes only
non-sensitive build checks and an output checksum.

## Commercial and contact boundaries

Prices are tax-exclusive: production JPY 200,000; production/distribution from
JPY 600,000; continuing sponsorship from JPY 1,000,000/month. Paid media spend is
separate. Scope and terms are confirmed per quotation. No unqualified promise of
organic views, viral reach or inquiries. Never add invented campaign results.

The existing contact destination remains https://cpa-hara.com/contact/ . Plan,
purpose, budget and timing choices create an optional copyable memo. They are not
submitted or automatically transferred; visitors are explicitly told to paste the
memo into the existing form. The direct contact link works without JavaScript.

This refresh does not configure YouTube posting, advertising accounts, conversion
tracking or a new form backend. Those integrations require a separate setup.
