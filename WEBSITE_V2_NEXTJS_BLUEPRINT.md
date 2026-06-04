# VeriTrack Systems — Website V2 Blueprint (Greenfield)

**Document purpose:** Complete product, design, and engineering plan for a **new** VeriTrack marketing website—built from zero on a modern stack. This blueprint is **independent** of the legacy static site (`index.html`, Bootstrap, Colorlib). It inherits **positioning and facts** from `WEBSITE_CONTENT_STRATEGY.md` only; layout, UX, visual language, and technology are net-new.

**Codename:** **VeriTrack Proof** (internal project name; public brand remains VeriTrack Systems)

**Target domain:** `veritrack.cloud` (replace legacy after cutover)  
**Product surface:** `portals.veritrack.cloud` (unchanged; linked, not embedded)

**Version:** 1.0 · May 2026

---

## 1. Vision — why this site must feel outstanding

### 1.1 The problem with “another B2B SaaS landing page”

Competitors and template sites all show: blue gradient, phone mockup, bullet features, pricing cards. VeriTrack’s **real** differentiator is operational proof—live photo, GPS, dashboards, network performance scoring, and **VGBA**. The V2 site must *feel* like that product: precise, data-backed, calm under pressure, with moments of drama only where the story earns it (VGBA, live metrics, product reveal).

### 1.2 Experience north star

> **A visitor should understand in 8 seconds that VeriTrack is infrastructure—not an app—and leave believing the product already measures excellence across Ghana’s workforce.**

### 1.3 Three memorable moments (non-negotiable in MVP+)

| Moment | What the user feels | Implementation sketch |
|--------|---------------------|------------------------|
| **The Proof Reveal** | “This is a real command centre.” | Scroll-synced journey: field check-in → branch dashboard → network super-admin |
| **The Score** | “They already rank performance.” | Animated Performance Score (0–100) with methodology tooltip—mirrors super-admin logic |
| **The Awards** | “Winning means something measurable.” | VGBA page as a distinct, cinematic chapter—not a footer badge |

### 1.4 Positioning (unchanged, execution upgraded)

**Headline territory:** Workforce attendance you can prove—in real time, at every location.

**Brand line:** Trusted workforce intelligence for organisations that need proof, not paperwork.

---

## 2. Creative direction — “Proof & Presence”

### 2.1 Design metaphor

**Presence** = who is on site, now. **Proof** = photo + GPS + audit trail. The site visualises a signal travelling from phone → branch → network—never decorative noise.

### 2.2 Aesthetic keywords

Authoritative · Geometric · Luminous data · Ghana-grounded global · Restrained motion

**Not:** Startup neon chaos, stock “diverse handshake”, consumer app-store playfulness, emoji promos.

### 2.3 Visual evolution (intentional break from legacy)

| Dimension | Legacy site | Website V2 |
|-----------|-------------|------------|
| Typography | Rubik 300 everywhere | **Display:** Sora or Outfit · **Body:** Source Sans 3 · **Data:** JetBrains Mono |
| Layout | Long single-page scroll | **Modular routes** + focused homepage narrative |
| Hero | Rotating multilingual paragraphs | Single proof statement + **interactive product stage** |
| Product proof | Static images | **Scroll-driven stage** + optional WebGL depth on hero |
| Colour | Blue gradient only | **Daylight** (marketing) + **Command** (product) themes |
| VGBA | Missing | **Dedicated immersive route** `/awards` |
| Pricing | HTML calculator page | **Integrated estimator** with shareable quote URL |

### 2.4 Colour system — refined tokens

Implement as CSS variables + Tailwind theme extension.

#### Daylight (marketing pages, default)

| Token | Hex | Role |
|-------|-----|------|
| `ink` | `#0B1220` | Primary text |
| `ink-muted` | `#5C6678` | Body |
| `surface` | `#FFFFFF` | Cards |
| `surface-elevated` | `#F4F7FC` | Section alt |
| `brand-600` | `#1B4D8C` | Headings, nav active |
| `brand-500` | `#2563B8` | Links |
| `brand-400` | `#3B82E8` | Accents |
| `brand-gradient` | `#1B4D8C → #2F6FD6` | CTAs (subtle, not loud) |
| `border` | `#E2E8F0` | Dividers |

#### Command (product tour, VGBA, metrics)

| Token | Hex | Role |
|-------|-----|------|
| `command-bg` | `#070B12` | Section background |
| `command-surface` | `#111827` | Panels |
| `command-border` | `#1F2937` | Frames |
| `signal` | `#00E676` | KPI, score ring, live pulse (evolved from `#00ff88`, slightly softer) |
| `signal-dim` | `#00E67633` | Glows, charts |
| `command-text` | `#F1F5F9` | Headlines on dark |
| `command-muted` | `#94A3B8` | Labels |

#### VGBA (ceremonial accent — use sparingly)

| Token | Hex | Role |
|-------|-----|------|
| `award-gold` | `#C9A227` | Winner tier, trophy details |
| `award-platinum` | `#E8EEF7` | Typography on dark hero |

**Rule:** `signal` never used for primary button fill on white backgrounds.

### 2.5 Typography scale

| Style | Font | Size (desktop) | Weight |
|-------|------|----------------|--------|
| Display XL | Sora | 56–72px | 600 |
| Display | Sora | 40–48px | 600 |
| H2 | Sora | 32–36px | 600 |
| H3 | Source Sans 3 | 24px | 600 |
| Body | Source Sans 3 | 18px | 400 |
| Caption | Source Sans 3 | 14px | 400 |
| Data / score | JetBrains Mono | 14–48px | 500 |

**Fluid type:** `clamp()` for Display XL and hero subheads.

### 2.6 Motion principles

- **Purposeful:** Motion explains hierarchy (check-in → dashboard), not decoration.
- **Reduced motion:** All hero/scrollytelling degrades to static steps when `prefers-reduced-motion: reduce`.
- **Performance budget:** LCP target < 2.0s on 4G; no full-page canvas on mobile.

### 2.7 Sound (optional Phase 3)

Muted UI ticks on VGBA countdown only—off by default. Skip for MVP.

---

## 3. Information architecture

### 3.1 Route map (App Router)

```
/                           Home — narrative + proof moments
/platform                   Three layers: Verify · Monitor · Improve
/solutions                  Solutions hub
/solutions/pharmacy
/solutions/education
/solutions/logistics
/solutions/corporate
/solutions/events
/awards                     VGBA (VeriTrack Global Business Awards)
/awards/methodology         Scoring weights, eligibility, opt-out
/customers                  Logo wall + case studies
/pricing                    Tiers + embedded estimator
/pricing/estimate/[id]      Shareable quote (optional Phase 2)
/partners                   Agent programme
/company                    Team, story, Ghana presence
/security                   Trust centre
/resources                  Guides, updates (MDX)
/resources/[slug]
/demo                       Product theatre
/contact                    Forms + Cal.com
/legal/privacy
/legal/terms
/legal/partner-terms
```

**Redirects from legacy (at cutover):**

| Legacy | V2 |
|--------|-----|
| `index.html` | `/` |
| `agent.html` | `/partners` |
| `pricing-calculator.html` | `/pricing#estimator` |
| `demo.html` | `/demo` |
| `privacyPolicy.html` | `/legal/privacy` |
| `vgba.html` (future) | `/awards` |

### 3.2 Primary navigation

```
[Logo]  Solutions ▾  Platform  Awards  Customers  Pricing  Partners     [Demo]  [Get started]
```

- **Solutions ▾:** Mega panel—5 sectors with icon, one-liner, deep link.
- **Get started:** Primary CTA → `/contact?intent=deploy`
- **Demo:** Secondary → `/demo` or Cal.com modal
- **Sticky header:** Glass blur `backdrop-filter`, shrinks from 80px → 64px on scroll.

### 3.3 Footer architecture

Four columns + bottom bar:

1. **Platform** — Portal, Dashboard, Super Admin, Security  
2. **Solutions** — Sector links  
3. **Company** — About, Team, Partners, Awards, Resources  
4. **Access** — Client portals (external), Renewal (external), Contact  

Bottom: © VeriTrack · Accra, Ghana · Social icons · Language note (static badges, not i18n toggle in MVP)

---

## 4. Homepage — section-by-section (V2 exclusive)

The homepage is a **directed story**, not a dump of every section from the legacy page.

### 4.1 Section 0 — Global header

Transparent over hero → solid `surface` on scroll. Keyboard-accessible mega-menu.

### 4.2 Section 1 — Hero: “Proof Engine”

**Layout:** Full viewport (min-height 90vh). Split asymmetric grid.

**Left**

- Eyebrow (mono): `WORKFORCE INTELLIGENCE PLATFORM`
- H1: Workforce attendance you can prove—in real time, at every location.
- Subhead (max 2 lines)
- CTAs: `Book a live walkthrough` (primary) · `Estimate your plan` (ghost)
- Trust micro-row: sector pills (Pharmacy · Education · Logistics · Corporate · Events)

**Right — Product Stage (signature component)**

Layered composition inside Command frame:

1. **Foreground:** Phone frame — portal check-in UI (real screenshot)
2. **Mid:** Floating card — “Live check-in verified” with pulse dot `signal`
3. **Background:** Dashboard viewport (parallax 0.15 on scroll)

**Interaction:** Subtle idle animation (pulse on signal dot); on scroll, stage translates up and scales down to hand off to Section 3.

**Background:** Radial gradient `brand-600` at 8% opacity top-right; grain overlay at 3% (CSS noise SVG)—adds premium texture without heaviness.

### 4.3 Section 2 — Live proof strip

Horizontal band, `surface-elevated`.

- **Left:** “Trusted across Ghana’s operations economy” + short copy
- **Right:** 4 metrics from API or static until API ready:
  - Organisations onboarded
  - Branches geofenced
  - Verified check-ins (formatted `1.2M+`)
  - Sectors served

**Outstanding detail:** Numbers **count up** on first viewport entry (once). Mono font. If API unavailable, show skeleton then fallback static with `data-source="registry"` attribute for transparency.

### 4.4 Section 3 — The Proof Journey (scroll-synced)

**Full-width Command theme section.** Pin scroll for ~300vh (desktop); mobile = swipeable step carousel (3 steps).

| Step | Title | Visual | Copy focus |
|------|-------|--------|------------|
| 1 Verify | Edge capture | Portal PWA | Photo liveness, GPS, offline queue |
| 2 Monitor | Branch truth | Admin dashboard | Maps, missing check-ins, reports |
| 3 Improve | Network intelligence | Super Admin | Performance Score, benchmarks, VGBA path |

**Progress indicator:** Vertical dots + step labels; active step glows `signal`.

**Tech:** GSAP ScrollTrigger or Framer Motion `useScroll` + `sticky` container. No scroll-jacking of entire page beyond this section.

### 4.5 Section 4 — Platform pillars (compact)

Three cards linking to `/platform#verify` etc. Not duplicate of Journey—this is **link-out summary**.

### 4.6 Section 5 — Solutions constellation

**Visual concept:** Central VeriTrack mark; five sector nodes orbit on hover (desktop) or horizontal scroll (mobile). Each node expands to 2-sentence pitch + “Explore →”.

Sectors: Pharmacy, Education, Logistics, Corporate, Events.

### 4.7 Section 6 — Performance Score spotlight

Dark card. Interactive ring chart 0–100.

- Default animates to example `87` with breakdown tooltip:
  - Attendance 50% · Punctuality 30% · Checkout 15% · Sync 5%
- CTA: “How VGBA uses this score →” `/awards`

**Outstanding detail:** This is the **only** marketing widget that exposes real methodology weights—builds trust.

### 4.8 Section 7 — VGBA teaser

Split: cinematic still (ceremony mock or abstract trophy geometry) + copy + countdown (if date confirmed) + “Explore awards”.

### 4.9 Section 8 — Social proof

- Filter chips: All · Pharmacy · Logistics · Education
- Testimonial cards (3 visible, carousel on mobile)
- Named clients only; NDA clients labelled honestly

### 4.10 Section 9 — Pricing snapshot

Three tier cards (Starter · Growth · Enterprise) + prominent “Open full estimator”.

No fire-sale promo on homepage.

### 4.11 Section 10 — Deploy CTA band

Gradient border (1px `signal` on Command bg). “Deploy your VeriTrack portal” + 4-step mini timeline + link to contact wizard.

### 4.12 Section 11 — FAQ (top 5)

Accordion. Link “View all questions” → `/contact#faq` or expand inline.

### 4.13 Section 12 — Footer

As §3.3.

---

## 5. Flagship pages (deep specs)

### 5.1 `/platform` — Platform depth

**Hero:** H1 “Three layers. One source of truth.”

**Tabs (persistent URL hash `#verify|monitor|improve`):**

Each tab: 50/50 split—copy + capability list + full-width screenshot in Command frame.

**Additional blocks:**

- Comparison table: Manual register vs VeriTrack (checkmarks, no competitor naming)
- Security summary card → `/security`
- Integration strip: Reports (included) · Payroll (optional) · Events (optional)

**Closing CTA:** Dual—Demo + Contact.

### 5.2 `/solutions/[sector]` — Sector landing pages

**Template variables:** `sector`, `heroImage`, `painPoints[]`, `features[]`, `testimonial`, `relatedCustomers[]`.

**Unique per sector:**

| Sector | Hero angle | Exclusive block |
|--------|------------|-----------------|
| Pharmacy | Multi-branch audit trails | Compliance / subscription alerts callout |
| Education | Class + staff attendance | Campus analytics screenshot |
| Logistics | Offline field capture | Geofence map animation |
| Corporate | Executive roll-up | HQ multi-entity mention |
| Events | Delegate check-in | Beyond daily staff attendance |

**SEO:** Unique title/description per sector; JSON-LD `WebPage` + `Service`.

### 5.3 `/awards` — VGBA immersive experience

**Theme:** Command + Award gold. This page should feel like a **product launch**, not a blog post.

**Sections:**

1. **Hero video or WebGL ribbon** (abstract, lightweight)—“Measured excellence. Celebrated annually.”
2. **How it works** — 4-step horizontal timeline with scroll progress
3. **Categories grid** — 6 award cards with eligibility microcopy
4. **Methodology** — Interactive weight sliders (read-only display of fixed weights) + FAQ
5. **Safeguards** — Opt-out, minimum data window, demo tenant exclusion
6. **Hall of fame** — Masonry grid; empty state: “First ceremony — 2028” with email notify CTA
7. **Partner / press** — Download kit (ZIP) when assets exist

**Micro-interaction:** Hover category card → badge preview rotates 15° in 3D (CSS `perspective`).

### 5.4 `/customers`

- Filterable logo wall (SVG logos, lazy load)
- Case study cards → MDX detail or modal
- Metric callouts per case (branches, check-ins/day) when permitted

### 5.5 `/pricing`

**Layout:**

- Hero: “Resource-based subscription” explainer
- Tier cards with feature matrix (sticky header on scroll comparison table)
- **Estimator module** (client component):
  - Inputs: branches, staff count, sector, add-ons (college, events, payroll export)
  - Live total in GHS
  - “Email me this estimate” → API route → Resend
  - Optional: `?quote=` shareable ID (Phase 2)

### 5.6 `/demo` — Product theatre

- Full-bleed Command background
- Side-by-side: Portal flow (video or interactive hotspots) | Dashboard walkthrough
- Embedded Cal.com below
- No autoplay audio

### 5.7 `/contact` — Intent-based wizard

**Step 1:** I want to… Deploy portal · Book demo · Partner enquiry · Support  
**Step 2:** Dynamic fields per intent  
**Step 3:** Review + submit  

Server action → Google Sheets / CRM webhook / email (Resend). Success state with expected response time (honest, not “24/7” unless true).

### 5.8 `/security` — Trust centre

Document layout (max-width 720px prose + diagrams).

- Data flow diagram (SVG): Staff device → Portal → Workspace → Admin roles
- Role matrix table
- Link privacy policy

### 5.9 `/resources` — MDX content hub

Launch with 2–3 articles:

- “What photo liveness actually checks”
- “Geofencing for multi-branch pharmacies”
- “Understanding your Performance Score”

Enables SEO long-tail; positions VeriTrack as educator.

### 5.10 `/company`

Team grid, Ghana map pin (Accra), mission copy, careers placeholder optional.

---

## 6. Component system

### 6.1 Architecture layers

```
components/
  ui/              # shadcn primitives (Button, Dialog, Accordion…)
  layout/          # Header, Footer, Container, Section
  marketing/       # HeroStage, ProofJourney, MetricStrip, OrbitSolutions
  product/         # CommandFrame, ScreenshotTabs, ScoreRing
  awards/          # CategoryCard, Timeline, BadgePreview
  forms/           # ContactWizard, EstimateForm
  motion/          # FadeIn, ScrollReveal, ReducedMotionGuard
```

### 6.2 Signature components (build first)

| Component | Responsibility |
|-----------|----------------|
| `CommandFrame` | Dark chrome, optional `signal` border glow, lazy image |
| `ProofJourney` | Scroll-synced 3-step product story |
| `HeroStage` | Layered portal + dashboard composition |
| `PerformanceScoreRing` | Animated 0–100 with breakdown tooltip |
| `SectorOrbit` | Solutions constellation homepage |
| `MetricCounter` | Animated stat with API hook |
| `EstimateCalculator` | Pricing logic + form submit |
| `ContactWizard` | Multi-step intent form |
| `MegaMenu` | Solutions dropdown |

### 6.3 shadcn/ui usage

Use for: Dialog (Cal.com, video), Accordion (FAQ), Tabs (platform), Sheet (mobile nav), Form + Input, Toast (submit success).

Customize theme tokens to Daylight/Command palette—do not ship default zinc shadcn look.

---

## 7. Technology stack

### 7.1 Core (recommended)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 15** (App Router) | SSG/ISR, SEO, API routes, image optimization |
| Language | **TypeScript** strict | Scale, component contracts |
| Styling | **Tailwind CSS v4** | Design tokens, rapid iteration |
| Components | **shadcn/ui** + Radix | Accessible primitives, ownable code |
| Animation | **Framer Motion** + optional **GSAP ScrollTrigger** | Proof Journey; use one scroll lib to avoid conflicts |
| Content | **MDX** + `contentlayer2` or `@next/mdx` | Resources, case studies |
| Images | `next/image` + **Sharp** | WebP/AVIF, responsive |
| Fonts | `next/font` (Sora, Source Sans 3, JetBrains Mono) | No layout shift |
| Forms | React Hook Form + Zod | Wizard validation |
| Email | **Resend** | Estimate + contact notifications |
| Scheduling | **Cal.com** embed or Calendly React | Demo booking |
| Analytics | **Vercel Analytics** + optional Plausible | Privacy-friendly |
| Hosting | **Vercel** | Preview deploys, edge |
| CI | GitHub Actions | Lint, typecheck, build |

### 7.2 Optional enhancements (Phase 2+)

| Layer | Choice | When |
|-------|--------|------|
| CMS | Sanity.io or Keystatic | Marketing edits without deploy |
| 3D hero | React Three Fiber (lightweight scene) | Only if LCP budget passes |
| i18n | `next-intl` | When portal locales match site |
| Search | Pagefind or Algolia | Resources hub growth |
| Rate limiting | Upstash Redis | Public API routes |
| A/B testing | Vercel Flags | Hero CTA experiments |

### 7.3 Explicitly excluded

- Bootstrap, jQuery, Owl Carousel (legacy)
- WordPress
- Heavy page builders
- Autoplay hero video with sound

### 7.4 API routes (Next.js Route Handlers)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/contact` | POST | Validate + forward to Sheets/CRM/email |
| `/api/estimate` | POST | Save estimate + send email |
| `/api/metrics` | GET | Proxy super-admin aggregates (auth secret) — Phase 2 |
| `/api/revalidate` | POST | On-demand ISR webhook from CMS |

### 7.5 Environment variables

```
RESEND_API_KEY=
CONTACT_WEBHOOK_URL=          # or GOOGLE_SERVICE_ACCOUNT for Sheets
METRICS_API_URL=              # internal, Phase 2
METRICS_API_SECRET=
NEXT_PUBLIC_CAL_URL=
NEXT_PUBLIC_SITE_URL=https://veritrack.cloud
```

---

## 8. Repository structure

```
veritrack-website-v2/
├── app/
│   ├── (marketing)/           # Shared layout: header/footer
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Home
│   │   ├── platform/
│   │   ├── solutions/
│   │   │   ├── page.tsx
│   │   │   └── [sector]/page.tsx
│   │   ├── awards/
│   │   │   ├── page.tsx
│   │   │   └── methodology/page.tsx
│   │   ├── customers/
│   │   ├── pricing/
│   │   ├── partners/
│   │   ├── company/
│   │   ├── security/
│   │   ├── resources/
│   │   │   └── [slug]/page.tsx
│   │   ├── demo/
│   │   └── contact/
│   ├── (legal)/
│   │   └── legal/[doc]/page.tsx
│   ├── api/
│   │   ├── contact/route.ts
│   │   └── estimate/route.ts
│   ├── layout.tsx             # Root: fonts, metadata, analytics
│   ├── globals.css            # Tailwind + CSS variables
│   ├── sitemap.ts
│   └── robots.ts
├── components/                # See §6.1
├── content/
│   ├── resources/*.mdx
│   └── customers/*.mdx
├── lib/
│   ├── pricing.ts             # Tier + calculator logic (port from pricing-calculator.js)
│   ├── metadata.ts
│   └── sectors.ts
├── public/
│   ├── images/screenshots/
│   ├── logos/clients/
│   └── awards/
├── styles/
├── types/
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 9. Content model

### 9.1 Central config (`lib/site-config.ts`)

```typescript
export const siteConfig = {
  name: "VeriTrack Systems",
  tagline: "Trusted workforce intelligence…",
  url: "https://veritrack.cloud",
  portalsUrl: "https://portals.veritrack.cloud",
  renewalUrl: "https://portals.veritrack.cloud/renewal",
  contact: { email, phone, address: "Accra, Ghana" },
  social: { linkedin, … },
  metrics: { orgs, branches, checkIns, sectors }, // override via API
  vgba: { ceremonyDate, editionYear, countdownEnabled },
};
```

### 9.2 MDX frontmatter (resources & cases)

```yaml
title: string
description: string
publishedAt: ISO date
sector: pharmacy | education | …
featured: boolean
```

### 9.3 Copy source of truth

- Marketing copy blocks: port from `WEBSITE_CONTENT_STRATEGY.md` §6
- Legal: migrate existing `privacyPolicy.html`, `termsAndConditions.html` into MDX or static JSX
- **Do not** copy legacy HTML structure—rewrite as React components

---

## 10. SEO, performance, accessibility

### 10.1 Metadata strategy

- `generateMetadata()` per route
- Default title template: `%s | VeriTrack Systems`
- OG images: dynamic `opengraph-image.tsx` per major route (sector, awards, platform)

### 10.2 Structured data

| Page | Schema |
|------|--------|
| Global | `Organization`, `WebSite` |
| Home | `SoftwareApplication` (BusinessApplication) |
| Pricing | `Offer` nested where applicable |
| Resources | `Article` |
| FAQ sections | `FAQPage` |

### 10.3 Performance budgets

| Metric | Target |
|--------|--------|
| LCP | < 2.0s |
| INP | < 200ms |
| CLS | < 0.05 |
| JS (home) | < 180kb gzip first load (exclude lazy chunks) |

**Tactics:** Static generation for marketing routes; dynamic only for estimator API; lazy-load Proof Journey GSAP chunk; `priority` on hero image only.

### 10.4 Accessibility

- WCAG 2.2 AA
- Skip link, focus rings visible on Command theme
- Proof Journey: keyboard alternative (tab through steps)
- All form errors announced via `aria-live`

---

## 11. Outstanding UX patterns (competitive moat)

### 11.1 “Client portal” gateway

Header utility: **Sign in to portal** → `portals.veritrack.cloud` (external). Reinforces scale without exposing tenant URLs.

### 11.2 Estimate → meeting loop

After estimate email sent: “Book a walkthrough with these numbers pre-filled” → Cal.com with query params in notes field.

### 11.3 Sector-aware contact

Contact wizard pre-fills sector if user arrived from `/solutions/pharmacy`.

### 11.4 Awards eligibility checker (Phase 2)

Simple form: company name + email → “We’ll confirm VGBA eligibility against active subscription” (manual or automated).

### 11.5 Comparison mode on `/platform`

Toggle: **Show manual process** vs **Show VeriTrack**—animated transition between two columns.

### 11.6 Resources ↔ Product linking

Inline MDX components: `<Screenshot name="dashboard-pharmacy" />`, `<ScoreDemo value={87} />`.

---

## 12. Design deliverables checklist (before build)

| # | Deliverable | Format |
|---|-------------|--------|
| 1 | Figma design system (Daylight + Command + VGBA) | Figma |
| 2 | Homepage hi-fi (1440 + 390) | Figma |
| 3 | Proof Journey storyboard (3 frames) | Figma / FigJam |
| 4 | VGBA hero + badge SVG system | SVG |
| 5 | Screenshot pack (sanitized) | WebP 2x |
| 6 | Client logo pack | SVG |
| 7 | OG template | Figma → dynamic OG code |
| 8 | Icon set (sectors, platform) | 24px SVG sprite |

---

## 13. Implementation roadmap

### Phase 0 — Foundation (Week 1–2)

- [ ] Init Next.js 15 + TS + Tailwind + shadcn
- [ ] Design tokens in `globals.css`
- [ ] Layout: Header, Footer, Container, Section
- [ ] `site-config.ts` + metadata helpers
- [ ] Deploy preview on Vercel

**Exit:** Empty routes shell with correct nav/footer.

### Phase 1 — MVP launch (Week 3–6)

- [ ] Homepage §4 (Hero, metrics, pillars, solutions orbit, pricing snapshot, CTA, FAQ)
- [ ] `/platform` (tabs + screenshots)
- [ ] `/pricing` + port calculator logic to `lib/pricing.ts`
- [ ] `/contact` wizard + API route
- [ ] `/legal/*` migrated
- [ ] `/demo` + Cal embed
- [ ] SEO defaults + sitemap

**Exit:** Replace legacy for core conversion paths. Proof Journey can ship as static 3-column on mobile-first if scroll build slips.

### Phase 2 — Differentiation (Week 7–10)

- [ ] Proof Journey scroll-synced
- [ ] Performance Score ring + `/awards` full page
- [ ] All `/solutions/[sector]` pages
- [ ] `/customers` + 2 MDX case studies
- [ ] `/security`
- [ ] `/resources` with 3 MDX articles
- [ ] Live metrics API integration (if registry endpoint ready)

**Exit:** Site feels undeniably “platform”; VGBA story live.

### Phase 3 — Polish & growth (Week 11+)

- [ ] HeroStage WebGL or enhanced parallax
- [ ] Shareable estimate URLs
- [ ] CMS hookup
- [ ] Hall of fame when VGBA runs
- [ ] i18n assessment
- [ ] Press kit downloads
- [ ] `status` subdomain or `/status`

### Cutover plan

1. Run V2 on `preview.veritrack.cloud` or Vercel preview  
2. QA redirects, forms, analytics  
3. DNS swap `veritrack.cloud` → Vercel  
4. Keep legacy repo archived 90 days; 301 map in `next.config.ts`

---

## 14. Sample code contracts

### 14.1 `CommandFrame`

```tsx
type CommandFrameProps = {
  children: React.ReactNode;
  title?: string;
  glow?: boolean;      // signal border pulse
  aspect?: "16/10" | "4/3" | "phone";
};
```

### 14.2 `PerformanceScoreRing`

```tsx
type ScoreBreakdown = {
  attendance: number;   // 0-50 points display
  punctuality: number;  // 0-30
  checkout: number;     // 0-15
  sync: number;         // 0-5
};
```

### 14.3 Pricing estimator output

```typescript
type EstimateResult = {
  monthlyGhs: number;
  setupGhs: number;
  tier: "starter" | "growth" | "enterprise";
  addons: string[];
};
```

---

## 15. Quality bar — “outstanding” acceptance criteria

Before calling V2 production-ready:

| # | Criterion |
|---|-----------|
| 1 | First-time visitor can articulate Verify · Monitor · Improve without scrolling back |
| 2 | Super Admin screenshot visible above fold on at least one page |
| 3 | VGBA methodology weights visible and understandable in < 30 seconds |
| 4 | Pricing estimator matches legacy calculator totals for same inputs |
| 5 | Lighthouse Performance ≥ 90 on desktop home |
| 6 | No emoji promos on homepage |
| 7 | All client logos named or honestly labelled NDA |
| 8 | Renewal + portals links work from footer |
| 9 | Contact form success state states real response expectations |
| 10 | Design passes internal review: “Does not look like Colorlib” |

---

## 16. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Scroll animations hurt mobile perf | Mobile carousel fallback; lazy chunk |
| Metrics not ready for launch | Static verified numbers + skeleton API |
| Scope creep on WebGL | Phase 3 only; LCP gate |
| Copy drift from product reality | Engineering review against `portals/` |
| Long build timeline | Phase 1 cutover without Proof Journey scroll |

---

## 17. Relationship to other documents

| Document | Relationship |
|----------|--------------|
| `WEBSITE_CONTENT_STRATEGY.md` | **Copy & facts** source—reuse messaging, not HTML |
| `WEBSITE_DESIGN_SPEC.md` | **Legacy static site** spec—ignore for V2 implementation |
| Legacy `index.html` | **Reference only** for calculator logic and assets to extract |

---

## 18. Summary

Website V2 (**VeriTrack Proof**) is a greenfield **Next.js** experience built around three unforgettable moments: the **Proof Journey**, the **Performance Score**, and **VGBA**. It abandons template-era patterns for a dual-theme design system (Daylight + Command), modular routes, signature components, and honest enterprise tone. The stack is modern (Next 15, Tailwind, shadcn, Framer Motion, MDX, Resend, Vercel) with a phased roadmap that can launch a credible MVP in six weeks and layer scroll storytelling and awards immersion immediately after.

**Recommended next step:** Approve creative direction (§2) → produce Figma for Homepage + Awards → scaffold `veritrack-website-v2` repo Phase 0.

---

*This blueprint is independent of the current website codebase. Implementation should live in a new repository or `apps/website` monorepo path—not as incremental edits to `index.html`.*
