# Artificial Intelligence (AI) Policy

**VeriTrack Systems** · Effective: 11 June 2026  
**Applies to:** All personnel using AI tools in VeriTrack work; product teams shipping AI-enabled features  
**Owner:** Chief Technology Officer · **Contact:** info@veritrack.cloud

---

## 1. Purpose

VeriTrack uses and may offer **AI-related capabilities**—internally for engineering, support, and operations, and externally through optional modules such as **AI Productivity Tips** and analytics described in our [Privacy Policy](../privacyPolicy.html). This policy sets rules for **responsible, lawful, and secure** AI use in a remote SaaS environment handling sensitive workforce data.

## 2. Scope

| Area | Examples |
|------|----------|
| **Internal use** | Coding assistants, drafting emails, summarising meetings, research |
| **Client-facing product** | Role-based tips, predictive digests, future ML features on attendance data |
| **Operations** | Support reply drafts, documentation generation, test data synthesis |

This policy does **not** replace client contracts. Client Organisations remain responsible for lawful basis when enabling optional AI modules for their end users.

## 3. Principles

1. **Human accountability** — AI outputs are reviewed by a qualified person before client impact, production deploy, or legal commitment
2. **Privacy by design** — Minimise personal data in AI prompts; prefer anonymised or synthetic data
3. **Transparency** — Client-facing AI features must be disclosed in product copy and privacy materials
4. **Security** — No credentials, secrets, or production keys in AI tools
5. **Quality & fairness** — Monitor for errors, bias, and hallucinations; attendance and HR contexts are high-stakes

## 4. Approved & restricted tools

### 4.1 Internal use classification

| Tier | Description | Examples | Rules |
|------|-------------|----------|-------|
| **Tier A — Approved enterprise** | Company-contracted tools with DPA, no training on our data | Google Workspace AI (if enabled under Workspace terms), approved IDE assistants under enterprise licence | Default for work involving **any** client or employee data |
| **Tier B — Approved limited** | Public tools for **non-sensitive** tasks only | General-purpose chatbots for marketing copy drafts, public documentation, learning | **No** PII, attendance records, photos, GPS, credentials, or unreleased roadmap |
| **Tier C — Prohibited** | Tools that cannot meet our security bar | Unvetted browser extensions, unapproved “paste your logs here” services, consumer apps with client data | Do not use |

The CTO maintains an **approved tools list**. Request additions via info@veritrack.cloud (subject: AI TOOL REQUEST).

### 4.2 Never input into Tier B or unapproved tools

- Client or end-user **names, IDs, photos, attendance logs, GPS coordinates**
- **Super Admin** exports, VGBA draft rankings, or tenant credentials
- **Source code** containing API keys, OAuth secrets, or environment URLs with tokens
- **Paystack** or billing identifiers tied to individuals
- Unreleased **security vulnerabilities** or incident details

If unsure, **redact** or use synthetic examples.

## 5. Engineering & product development

### 5.1 Code assistance

- AI-generated code requires **human review** and normal PR checks before merge
- Do not accept suggestions that disable security controls (auth, geofence validation, liveness checks)
- License compatibility: ensure AI suggestions do not introduce **copyleft** or incompatible dependencies without review
- Test attendance-critical paths manually; AI does not replace QA on verification flows

### 5.2 Client-facing AI features

When building or configuring modules (e.g. AI Productivity Tips, predictive digests):

- Process data **only** as described in the Privacy Policy and client configuration
- Log processing for support and audit where feasible
- Provide **opt-out** or admin toggle where marketed as optional
- Do not use client data to train **global models** shared across tenants without explicit written agreement
- Document model/provider changes in release notes for material behaviour shifts

### 5.3 Demos & sales

- Demo tenants must use **synthetic or anonymised** data unless a client has authorised live data for demos
- Do not claim AI features provide legal, medical, or employment **decisions**—they are informational aids only

## 6. Support, marketing & communications

- AI may draft support replies; **staff must verify** facts against tickets and documentation before sending
- Do not send AI-generated responses containing **specific attendance allegations** about named individuals without human review
- Marketing claims about “AI-powered” features must be **accurate** and match shipped functionality
- Translate/localise with care—verify Ghana English and client-facing terminology

## 7. Data protection & cross-border processing

Many AI providers process data outside Ghana. Before sending any **Tier A** data to an AI subprocessors:

- Confirm contractual safeguards (DPA, SCCs, or equivalent)
- Align with our DPC obligations under **Act 843**
- Document in subprocessor list if processing client Personal Data

Default: **do not** route client Personal Data through consumer AI APIs.

## 8. Intellectual property

- VeriTrack retains ownership of product code and documentation created in the course of employment, including AI-assisted work, per employment contracts
- Respect **third-party** and **open-source** licences when AI reproduces known code patterns
- Personnel must not use AI to generate content that **infringes** trademarks or copyrights (e.g. client logos, licensed fonts)

## 9. Incident response

If you accidentally submit sensitive data to an unapproved AI tool:

1. **Stop** further submissions
2. **Notify** info@veritrack.cloud immediately (subject: AI INCIDENT)
3. **Document** what was sent, when, and to which service
4. Cooperate with breach assessment per [Privacy Policy](../privacyPolicy.html) Section 16

## 10. Training & acknowledgement

- New hires with system access receive AI policy orientation at onboarding
- Product and engineering leads review this policy when shipping new AI features
- Acknowledgement required annually alongside the [AUP](./ACCEPTABLE_USE_POLICY.md)

## 11. Governance & updates

The CTO reviews this policy **at least annually** and after major provider or regulatory changes. Material updates are communicated to all personnel.

**Related documents:** [Acceptable Use Policy](./ACCEPTABLE_USE_POLICY.md) · [Code of Conduct](./CODE_OF_CONDUCT.md) · [Remote Work Policy](./REMOTE_WORK_POLICY.md) · [Privacy Policy](../privacyPolicy.html)

---

### Appendix A — Quick reference card

| ✅ OK | ❌ Not OK |
|-------|----------|
| Draft generic FAQ text (no client names) | Paste live attendance export into ChatGPT |
| Enterprise IDE assistant on non-prod code with secrets removed | Share production `.env` for debugging help |
| Internal summary of a **redacted** incident timeline | Upload check-in photos for “analysis” |
| Ship AI tips module per privacy disclosure | Train cross-client model on identifiable data without consent |
