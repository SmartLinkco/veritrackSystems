# VeriTrack Systems — Website Design Specification

**Document purpose:** Full visual, structural, and interaction specification for rebuilding [veritrack.cloud](https://veritrack.cloud) as a multi-page B2B platform marketing site. Content and messaging are defined in `WEBSITE_CONTENT_STRATEGY.md`; this document defines *how* that content is presented.

**Prepared for:** Design, front-end implementation, and marketing  
**Primary domain:** `veritrack.cloud`  
**Related product surface:** `portals.veritrack.cloud`  
**Version:** 1.0  
**Date:** May 2026

---

## 1. Design goals

| Goal | Design implication |
|------|------------------|
| **Sell accountability at scale** | Lead with platform screenshots (portal + dashboard + super admin), not only phone mockups |
| **Earn enterprise trust** | Calm layout, restrained promo, named proof, honest FAQ styling |
| **Bridge marketing ↔ product** | Public site uses corporate blue; product tour uses dark “operations mode” frames matching super-admin UI |
| **Support VGBA launch** | Distinct awards visual language (badge, timeline, ceremony) without overpowering core product pages |
| **Ship incrementally** | Component-based HTML/CSS; Phase 1 can restyle existing `index.html` sections before new pages ship |

**Positioning line (design must reinforce):**  
*VeriTrack Systems — trusted workforce intelligence for organisations that need proof, not paperwork.*

---

## 2. Brand & visual identity

### 2.1 Dual-mode palette

VeriTrack operates in two visual contexts. The website intentionally uses both.

#### Marketing mode (default — all public pages)

Used for hero, pricing, partners, contact, and long-form content.

| Token | Hex | Usage |
|-------|-----|--------|
| `--vt-blue-deep` | `#1e3c72` | Hero gradients, footer, nav on scroll |
| `--vt-blue-mid` | `#2a5298` | Section accents, gradient stops |
| `--vt-blue-heading` | `#2c5aa0` | H2–H4, card titles |
| `--vt-blue-primary` | `#4a90e2` | Links, lead text, icons |
| `--vt-blue-cta` | `#3498db` → `#2980b9` | Primary buttons (122° gradient) |
| `--vt-blue-soft` | `#d9e5f3` | Secondary text on dark backgrounds |
| `--vt-surface` | `#f8fbff` | Alternating section backgrounds |
| `--vt-body` | `#959094` | Body copy |
| `--vt-white` | `#ffffff` | Cards, nav background |

**Gradient (hero / CTA bands):**  
`linear-gradient(135deg, #3498db 0%, #2980b9 50%, #1e3c72 100%)`  
Align with existing `style.css` hero; refine stops only if contrast audit requires it.

#### Operations mode (product tour, screenshots, VGBA data visuals)

Mirrors super-admin dashboard for recognition at login.

| Token | Hex | Usage |
|-------|-----|--------|
| `--vt-ops-bg` | `#0d1117` – `#121826` | Screenshot frames, dark sections |
| `--vt-ops-surface` | `#1a2332` | Cards on dark |
| `--vt-ops-accent` | `#00ff88` | KPI highlights, performance score, VGBA metrics |
| `--vt-ops-text` | `#e6edf3` | Primary text on dark |
| `--vt-ops-muted` | `#8b9cb3` | Labels, captions |

**Rule:** Never use `#00ff88` for primary CTAs on light backgrounds (fails contrast). Reserve for data accents inside dark frames or VGBA badge outlines.

### 2.2 Typography

| Role | Family | Weights | Notes |
|------|--------|---------|--------|
| **UI & marketing** | [Rubik](https://fonts.google.com/specimen/Rubik) | 300, 400, 500 | Keep for continuity with current site |
| **Optional upgrade** | Inter or DM Sans | 400, 500, 600 | Consider in Phase 3 if full rebrand; not required for Phase 1 |

| Element | Desktop | Mobile (≤767px) | Weight |
|---------|---------|-----------------|--------|
| H1 (hero) | 48–56px | 32–36px | 300–400 |
| H2 (section) | 40–45px | 28–32px | 300 |
| H3 (card group) | 28–33px | 24px | 500 |
| H4 (card title) | 20px | 18px | 500 |
| Body | 16–18px | 16px | 400 |
| Small / caption | 13–14px | 13px | 400 |
| Button | 12px uppercase | same | 400–500 |
| Nav links | 14px | 16px (drawer) | 500 |

**Letter-spacing:** H1/H2 use `-0.02em` (existing pattern).  
**Line-height:** Body `1.6`; headings `1.2–1.3`.

### 2.3 Iconography

- **Primary set:** Themify Icons (already in repo) for feature lists and UI chrome.
- **Sector / trust:** Simple line icons (pharmacy, education, logistics, corporate, events)—custom SVG or consistent icon font; one style only.
- **Flags (languages):** Small static badge row; no rotating hero text.
- **Avoid:** Emoji in enterprise-facing UI (homepage promos, section titles). Campaign LPs may use sparingly.

### 2.4 Photography & illustration

| Asset type | Direction |
|------------|-----------|
| **Hero** | Split layout: copy left; right shows layered device frames (portal PWA + dashboard) inside operations-mode chrome |
| **Screenshots** | Real product only; blur tenant names in super-admin views |
| **People** | Existing team photos; consistent crop (1:1 or 4:5), neutral backgrounds |
| **Stock** | Avoid generic “handshake” stock; prefer Ghana-relevant operations context if staged |
| **Client logos** | SVG or PNG @2x, monochrome or full-color per brand guidelines; min height 32px |

### 2.5 Logo usage

- Primary: `images/veritrack-logo.png` (or SVG if exported).
- Clear space: height of “V” mark on all sides.
- On dark (`--vt-ops-bg`): white or full-color logo with sufficient contrast.
- Favicon / PWA: `VT linkedin.jpg` → replace with square mark derived from logo when design assets ready.

---

## 3. Layout system

### 3.1 Grid & container

- **Framework:** Bootstrap 4 grid (existing dependency).
- **Max content width:** `1140px` (Bootstrap `container`).
- **Section vertical rhythm:** `80px` padding top/bottom desktop; `48px` mobile.
- **Alternating sections:** White ↔ `--vt-surface` for scanability.

### 3.2 Breakpoints

| Name | Min width | Behavior |
|------|-----------|----------|
| xs | default | Single column; stacked CTAs |
| sm | 576px | 2-column cards where noted |
| md | 768px | Nav collapse to hamburger |
| lg | 992px | Full horizontal nav; hero split |
| xl | 1200px | Optional wider screenshot galleries |

### 3.3 Spacing scale (8px base)

`4, 8, 16, 24, 32, 48, 64, 80` — use for margins between cards, icon gaps, and form fields.

### 3.4 Elevation

| Level | Shadow | Use |
|-------|--------|-----|
| 0 | none | Flat sections |
| 1 | `0 4px 16px rgba(30,60,114,0.08)` | Cards on light |
| 2 | `0 9px 32px rgba(0,0,0,0.12)` | Primary buttons (existing) |
| 3 | `0 12px 40px rgba(0,0,0,0.18)` | Modals, sticky mobile CTA bar |

---

## 4. Component library

### 4.1 Global header (navigation)

**Structure**

```
[Logo]     Home · Solutions ▾ · Platform · VGBA · Pricing · Partners     [Demo] [Request]
```

- **Solutions:** Mega-menu or dropdown linking to sector anchors on homepage (`#solutions-pharmacy`, etc.) and future `/solutions/*.html` pages.
- **Sticky:** On scroll > 80px, white background + `box-shadow` level 1; logo scales to 90%.
- **CTAs:** “Demo” = outline or ghost; “Request” = `btn-primary`.
- **Mobile:** Full-height drawer; Demo + Request pinned at bottom.

**States:** Default, scrolled, mobile open, active section (optional scroll-spy underline in `--vt-blue-primary`).

### 4.2 Hero

**Layout:** Two columns (lg+); single column (xs–md) with image below copy.

**Elements**

1. Eyebrow (optional): `Workforce intelligence platform`
2. H1: *Workforce attendance you can prove—in real time, at every location.*
3. Subhead: 2 lines max, `--vt-body` on light or white on gradient variant
4. **CTA group:** Primary “Book a demo” (Calendly); Secondary “Calculate your plan” → `pricing-calculator.html`
5. **Language badge row:** Static icons + “Portals available in multiple languages” (no carousel)
6. **Visual:** Device mockup stack in operations-mode frame

**Background options (pick one for implementation)**

- **A (evolution):** Retain blue gradient full-bleed (current site).
- **B (recommended):** White/light hero copy + gradient only on right visual panel or bottom CTA strip.

### 4.3 Trust strip

- Full-width band, `--vt-surface` or subtle border-top/bottom.
- **Label:** “Trusted across sectors”
- **Sector chips:** Pharmacy · Education · Logistics · Corporate · Events (pill components)
- **Metrics row:** 4 equal columns; large number (`--vt-blue-heading`, 36px) + label (14px muted)
- Placeholders until super-admin aggregates confirmed; use skeleton state in build

### 4.4 Three-pillar platform block

**Section title:** One platform. Three layers of control.

| Pillar | Icon | Color accent | Link |
|--------|------|--------------|------|
| Verify | phone / camera | `--vt-blue-primary` | `#platform-verify` |
| Monitor | chart / map | `--vt-blue-mid` | `#platform-monitor` |
| Improve | trophy / network | `--vt-ops-accent` on dark sub-card | `#platform-improve` |

**Card spec:** Equal height; icon 48px; title H4; 3-line body; optional “Learn more →”.

### 4.5 Solutions grid

**Section title:** Built for how your sector actually works

- **Layout:** 5 cards — 3 top + 2 centered bottom on desktop, or 2+2+1; 1 column mobile.
- **Card:** White, radius `12px`, elevation 1, hover lift `translateY(-4px)`.
- **Footer link:** “See example →” (demo or screenshot modal).

### 4.6 Product tour (screenshot carousel / tabs)

**Section title:** See VeriTrack in action

Three tabs or horizontal segments:

1. **Staff Portal (PWA)** — check-in UI
2. **Admin Dashboard** — branch map, live stats
3. **Super Admin** — network KPIs, performance score (operations-mode frame mandatory)

**Frame:** 16:10 aspect ratio; `border-radius: 8px`; ops-mode border `1px solid #2a3f5f`; optional `--vt-ops-accent` glow on active tab.

### 4.7 Feature cards (capabilities)

Replace consumer-tone blocks with **Platform capabilities** grid: 2×3 or 3×2 icons + short copy (see content strategy §6.5).

### 4.8 Deep-dive tabs

Retain tab pattern from current site; update labels:

- Real-time workforce attendance
- Reporting & payroll readiness
- Visitor & event attendance
- Workforce development

**Design:** Active tab `--vt-blue-primary` underline; panel min-height to prevent layout shift.

### 4.9 VGBA teaser (homepage)

Distinct sub-brand treatment:

- Dark band (`--vt-ops-bg`) or white with gold/neon accent border
- **Badge:** Circular VGBA mark (to be designed)
- **Headline:** Coming soon: VGBA 2027 (or current year)
- **Countdown** (optional): Days to ceremony — only if date confirmed
- **CTA:** “Learn about VGBA” → `/vgba.html`

### 4.10 Pricing

- Keep tier cards + link to calculator
- **Tier names:** Starter · Growth · Enterprise
- **Calculator CTA:** Prominent inline embed or button to `pricing-calculator.html`
- **Promo rule:** No 🔥 or “50% OFF” on homepage pricing block

### 4.11 Partners strip

- Short value prop + link to `agent.html`
- Optional: commission highlight as stat, not hype copy

### 4.12 Testimonials

- Carousel (Owl retained) or CSS grid of 3
- **Card:** Quote, name, role, company logo thumbnail
- **Heading:** What our customers say

### 4.13 Team

- Grid of headshots; name, title, optional LinkedIn icon
- Consistent card height

### 4.14 FAQ

- Accordion; plus icon rotates to ×
- **Honest tone:** No oversized “24/7” badges unless SLA page exists

### 4.15 Contact / Request / Demo

- **Request form:** Section title “Deploy your VeriTrack portal”
- **4-step timeline:** Horizontal desktop, vertical mobile; numbered circles `--vt-blue-primary`
- **Demo:** Embedded video or link to `demo.html` with dashboard preview callout

### 4.16 Footer

```
[Logo]
VeriTrack Systems · Accra, Ghana · Workforce attendance & analytics

Platform · Solutions · VGBA · Pricing · Partners · Demo · Request
Privacy · Terms · Partner programme · Renewal · (Status)

© {year} VeriTrack Systems. All rights reserved.
```

- **Renewal link:** `https://portals.veritrack.cloud/renewal` (not raw Apps Script URL)
- **Remove:** Colorlib / template attribution in HTML comments and visible footer

### 4.17 Floating elements

| Element | Spec |
|---------|------|
| Social sidebar | Keep; reduce motion on `prefers-reduced-motion` |
| Mobile sticky CTA | Optional bar: “Book demo” after scroll past hero |
| Calendly | Modal or new tab; brand color override to `--vt-blue-cta` |

### 4.18 Buttons

| Variant | Style |
|---------|--------|
| Primary | Blue gradient, pill `border-radius: 25px`, elevation 2 |
| Secondary | Outline `--vt-blue-primary` on white |
| Ghost (dark sections) | White outline |
| Text link | Arrow `→` with 4px translate on hover |

---

## 5. Information architecture

### 5.1 Site map

```
veritrack.cloud/
├── index.html              # Homepage (all anchor sections)
├── platform.html           # Portal · Dashboard · Super Admin · security overview
├── vgba.html               # Awards programme, methodology, timeline
├── customers.html          # Logo wall, sector filters, mini cases
├── security.html           # Data handling, roles, hosting
├── demo.html               # Live demo + dashboard tour
├── pricing-calculator.html # Resource-based calculator
├── agent.html              # Partner programme
├── agentsTCs.html
├── privacyPolicy.html
├── termsAndConditions.html
├── unsubscribe.html
└── solutions/              # Phase 2+
    ├── pharmacy.html
    ├── education.html
    ├── logistics.html
    ├── corporate.html
    └── events.html
```

Optional: `status.html` for uptime transparency.

### 5.2 URL & anchor convention

| Page | Anchors |
|------|---------|
| `index.html` | `#hero`, `#trust`, `#platform`, `#solutions`, `#product-tour`, `#vgba`, `#pricing`, `#partners`, `#testimonials`, `#team`, `#faq`, `#contact` |
| Cross-page | Nav “Platform” → `platform.html` or `index.html#platform` until page ships |

### 5.3 External links

| Label | Target |
|-------|--------|
| Client portals | `https://portals.veritrack.cloud` (generic; avoid listing every tenant on homepage) |
| Renewal | `https://portals.veritrack.cloud/renewal` |
| Book demo | Calendly URL (existing) |

---

## 6. Page specifications

### 6.1 Homepage (`index.html`)

**Scroll order (fixed):**

1. Hero  
2. Trust strip  
3. Platform — three pillars  
4. Solutions by industry  
5. Platform capabilities (feature grid)  
6. Deep-dive tabs  
7. Super Admin / command view (high priority — new section)  
8. Product tour (screenshots/video)  
9. VGBA teaser  
10. Pricing  
11. Partners  
12. Testimonials  
13. Team  
14. FAQ  
15. Contact + Request + Demo  
16. Footer  

**Meta (design-relevant)**

- `<title>`: `VeriTrack Systems | Workforce Attendance & Analytics Platform`
- `theme-color`: `#1e3c72`
- OG image: 1200×630 composite (logo + dashboard screenshot)

### 6.2 Platform (`platform.html`)

**Hero:** Shorter; H1 “The VeriTrack platform”  
**Sections:** Verify (PWA) · Monitor (Dashboard) · Improve (Network / VGBA) · Security summary · CTA  
**Visual weight:** 60% screenshots, 40% copy  
**CTA footer:** Request + Demo

### 6.3 VGBA (`vgba.html`)

**Hero:** Dark operations mode; VGBA badge; ceremony date if set  
**Sections:**

1. What is VGBA (lead copy from content strategy §7.2)  
2. How it works (4-step horizontal diagram)  
3. Categories table (cards per category)  
4. Methodology (weights: attendance 50%, punctuality 30%, checkout 15%, sync 5%)  
5. Trust safeguards (opt-out, eligibility)  
6. Timeline / countdown  
7. Past winners (grid; empty state “First ceremony — {year}”)  
8. FAQ (VGBA-specific)  
9. Press kit download (future)  

**VGBA badge system (design deliverable)**

- Master badge SVG
- Variants: Winner, Finalist, Eligible
- Colors: ops accent + white on dark; blue on light for web embeds

### 6.4 Solutions pages (template)

**Shared template**

- Hero: sector name + one-line outcome  
- Pain points (3 bullets)  
- How VeriTrack maps (portal + dashboard features)  
- Screenshot (sector-relevant tenant blurred)  
- Testimonial slot  
- CTA: Request + Calculator  

### 6.5 Customers (`customers.html`)

- Filter bar: All · Pharmacy · Education · Logistics · Corporate · Events  
- Logo grid: 4–6 columns desktop  
- Case study cards: logo, 2-line summary, “Read more” (expand or modal)

### 6.6 Security (`security.html`)

- Calm, document-style layout (wider text column, max 720px prose)  
- Diagram: Staff → Portal → Workspace data → Admin roles  
- Link to `privacyPolicy.html`

### 6.7 Demo (`demo.html`)

- Split: Portal check-in flow | Admin dashboard walkthrough  
- Embed or video; operations-mode frame for dashboard half

### 6.8 Partner (`agent.html`)

- Align visually with homepage Partners strip  
- Mention VGBA co-marketing for partners (content only; badge preview optional)

### 6.9 Pricing calculator (`pricing-calculator.html`)

- Tooltips → `platform.html` anchors  
- Same nav/footer as site shell

---

## 7. Homepage section wireframes (ASCII)

### 7.1 Hero (desktop)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [Logo]   Nav links ...                              [Demo] [Request]       │
├──────────────────────────────┬─────────────────────────────────────────────┤
│  H1 + subhead                │  ┌─────────────────────────────────────┐   │
│  [Book a demo] [Calculate]   │  │ ▓▓ operations frame ▓▓              │   │
│  🌐 EN · FR · ... (badges)   │  │  [portal] [dashboard] mockups       │   │
│                              │  └─────────────────────────────────────┘   │
└──────────────────────────────┴─────────────────────────────────────────────┘
```

### 7.2 Three pillars

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  ◉ Verify       │ │  ◉ Monitor      │ │  ◉ Improve      │
│  Staff Portal   │ │  Admin Dash     │ │  Network / VGBA │
│  copy...        │ │  copy...        │ │  copy...        │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 7.3 Super Admin section

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Command view for operators and leadership          (light section)      │
│  copy block (left 40%)  │  ┌──────────────────────────────────────┐    │
│                         │  │ dark frame: super-admin screenshot    │    │
│                         │  │ Performance Score ████████ 00ff88    │    │
│                         │  └──────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Motion & interaction

| Interaction | Spec |
|-------------|------|
| Scroll reveal | Fade-up 20px, 400ms ease, stagger 80ms; disable if `prefers-reduced-motion` |
| Tab switch | 200ms cross-fade; no auto-rotate |
| Carousel | 5s interval testimonials only; pause on hover/focus |
| Buttons | Scale 1.04 on hover (existing); focus ring 2px `--vt-blue-primary` |
| Mobile nav | Slide from right, 300ms |
| Social sidebar | Respect reduced motion; static position when preference set |

**Do not:** Auto-rotate hero taglines; parallax on heavy images (performance).

---

## 9. Accessibility

| Requirement | Target |
|-------------|--------|
| Contrast (text) | WCAG 2.1 AA minimum; body on light ≥ 4.5:1 |
| Contrast (UI) | Primary button text white on gradient — verify with axe |
| Focus | Visible on all interactive elements |
| Images | Meaningful `alt`; decorative screenshots `alt=""` with adjacent text |
| Forms | Labels, `aria-describedby` for errors |
| Skip link | “Skip to main content” first focusable element |
| Language | `<html lang="en">`; badge row does not change page lang |

---

## 10. Responsive behavior summary

| Component | Mobile adjustment |
|-----------|-------------------|
| Hero | Stack; CTAs full-width stacked with 8px gap |
| Metrics | 2×2 grid |
| Solutions | 1 column |
| Product tour tabs | Horizontal scroll or dropdown |
| Pricing tiers | Horizontal scroll snap or stack |
| Footer | Accordion groups optional |
| Super Admin screenshot | Full width; pinch-zoom allowed |

---

## 11. SEO & structured data (design + markup)

| Field | Value |
|-------|--------|
| `<title>` | VeriTrack Systems \| Workforce Attendance & Analytics |
| Meta description | Per content strategy §6.12 |
| `og:image` | 1200×630 branded composite |
| JSON-LD | `Organization` + `SoftwareApplication` (`applicationCategory: BusinessApplication`) |

**Heading hierarchy:** One H1 per page; sections H2; cards H3/H4. No skipped levels.

---

## 12. Asset checklist

| Asset | Dimensions / format | Owner |
|-------|---------------------|--------|
| OG image | 1200×630 PNG/JPG | Design |
| VGBA master badge | SVG | Design |
| Portal screenshot | 1440×900 WebP | Product |
| Dashboard screenshot | 1440×900 WebP | Product |
| Super Admin screenshot | 1440×900 WebP (sanitized) | Product |
| Client logos | SVG preferred | Marketing |
| Sector icons | 24×24 SVG | Design |
| Favicon set | 16, 32, 180, 512 | Design |

---

## 13. Technical implementation notes

| Topic | Decision |
|-------|----------|
| Stack | Static HTML + Bootstrap 4 + `css/style.css` + `js/script.js` (evolve, don’t rewrite framework unless planned) |
| CSS | Introduce CSS custom properties in `:root` for tokens in §2.1; migrate hard-coded hex gradually |
| New CSS file | Optional `css/vt-tokens.css` + `css/vt-components.css` to avoid bloating monolithic `style.css` |
| JS | Minimal; Owl carousel for testimonials; tab component existing |
| Forms | Google Apps Script or backend — style only in spec; success/error toasts consistent with buttons |
| Performance | Lazy-load below-fold screenshots; WebP with PNG fallback |
| Analytics | Preserve existing tags; document in implementation PR |

**HTML hygiene**

- Remove Colorlib author comment block from all pages
- Remove duplicate viewport meta
- Single canonical per page

---

## 14. Phased design rollout

Aligns with `WEBSITE_CONTENT_STRATEGY.md` §10.

### Phase 1 — Visual quick wins (1–2 weeks)

- [ ] Apply token variables; fix typography hierarchy (H1 hero, section H2s)
- [ ] New nav: Platform, Solutions, VGBA, Partners
- [ ] Hero redesign (layout B recommended); remove rotating multilingual hero
- [ ] Trust strip + Platform pillars (placeholders for metrics OK)
- [ ] VGBA teaser band (dark)
- [ ] Footer links + meta/OG refresh
- [ ] Remove homepage promo emoji block; relocate campaigns
- [ ] Grammar/heading fixes in testimonials and video section

### Phase 2 — Product depth (3–6 weeks)

- [ ] Super Admin section with operations-mode frame
- [ ] Product tour tabs (3 views)
- [ ] Solutions grid + sector icons
- [ ] `platform.html`, `vgba.html`, `security.html` shell pages
- [ ] `customers.html` logo grid
- [ ] `demo.html` dashboard split
- [ ] FAQ accordion restyle

### Phase 3 — Brand cohesion (ongoing)

- [ ] VGBA badge kit + winner pages
- [ ] Live metrics from registry API
- [ ] Optional font upgrade
- [ ] Full solutions subdirectory
- [ ] Press kit + status page
- [ ] Design system doc in Figma (optional)

---

## 15. Content ↔ design mapping

| Content strategy section | Design section |
|--------------------------|----------------|
| §5 Homepage structure | §6.1 scroll order |
| §6 Draft copy | Component copy blocks (implement verbatim where marked “recommended”) |
| §7 VGBA | §6.3, §4.9, VGBA badge system |
| §8 Additional pages | §5.1, §6.2–6.9 |
| §9 SEO | §11 |
| §4.4 Visual identity note | §2.1 dual-mode palette |

---

## 16. Open design decisions (requires leadership)

| # | Question | Default recommendation |
|---|----------|------------------------|
| 1 | Hero background A vs B? | B (light copy + visual panel) |
| 2 | Publish live metric placeholders before data verified? | Show strip with “—” or hide until Phase 3 |
| 3 | VGBA ceremony date for countdown? | Hide countdown until confirmed |
| 4 | Replace Rubik with Inter? | Defer to Phase 3 |
| 5 | Sticky mobile CTA bar? | Yes for Demo only |

---

## 17. Approval & handoff

| Role | Sign-off |
|------|----------|
| Leadership | Positioning, VGBA public narrative, promo policy |
| Marketing | Copy in components, client logo permissions |
| Product | Screenshot sanitization, methodology weights |
| Engineering | Phase 1 implementation estimate |

**Handoff package to engineering**

1. This spec  
2. `WEBSITE_CONTENT_STRATEGY.md`  
3. Approved screenshots (WebP)  
4. Logo SVG + VGBA badge (when ready)  
5. Verified metrics for trust strip  

---

## 18. Summary

The new VeriTrack website design sells **proof and operational intelligence**, not a consumer app download. Public pages stay in **marketing blue**; product proof uses **operations dark + neon accent** so buyers recognise the real platform. Components are specified for incremental delivery on the existing static stack, with clear page-level specs for homepage, platform, VGBA, and supporting pages.

*Next step: Leadership approval on open decisions (§16) → Phase 1 implementation in `index.html` + `css/vt-tokens.css` → design VGBA badge SVG.*
