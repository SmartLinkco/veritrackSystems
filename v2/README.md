# VeriTrack website V2

Next.js rebuild of veritrack.cloud, following `../WEBSITE_V2_NEXTJS_BLUEPRINT.md` (Phase 0 + Phase 1).
Copy comes from `../WEBSITE_CONTENT_STRATEGY.md` and the live site.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # pricing parity tests against ../js/pricing-calculator.js
npm run lint && npm run build
```

## Where things live

| What | Where |
|------|-------|
| Facts used on many pages (contact, metrics, VGBA year, URLs) | `src/lib/site-config.ts` |
| Pricing rules (single source) | `src/lib/pricing.ts`, tested in `tests/pricing.test.ts` |
| Marketing copy (sectors, FAQ, testimonials, team, VGBA) | `src/lib/content.ts` |
| Design tokens (Daylight / Command / Award) | `src/app/globals.css` |
| Legal pages | `src/content/legal/*.html`, regenerated from the legacy pages with `npm run migrate:legal` |
| Form submissions | `src/app/api/forms/route.ts` → existing Google Apps Script (same payload as the legacy forms) |
| Legacy URL redirects | `next.config.ts` |

## Environment (all optional; defaults match the live site)

```
NEXT_PUBLIC_SITE_URL=https://veritrack.cloud
NEXT_PUBLIC_CAL_URL=https://calendly.com/info-veritrack/30min
FORMS_SCRIPT_URL=          # Apps Script exec URL for deploy + partner forms
```

## Pricing changes

Edit `src/lib/pricing.ts`. `npm test` compares it with the legacy calculator, so if you change prices in one place,
change `../js/pricing-calculator.js` too until the legacy site is retired, or the test will fail.
