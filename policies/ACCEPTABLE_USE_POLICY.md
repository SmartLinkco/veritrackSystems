# Acceptable Use Policy (AUP)

**VeriTrack Systems** · Effective: 11 June 2026  
**Applies to:** All personnel and contractors with access to VeriTrack systems  
**Owner:** Chief Technology Officer · **Contact:** info@veritrack.cloud

---

## 1. Purpose

This Acceptable Use Policy defines permitted and prohibited use of VeriTrack information systems, including company accounts, source code, infrastructure, **Super Admin** tools, **Client Organisation** tenant environments, and communications platforms. VeriTrack operates a **remote-first SaaS** business handling sensitive workforce attendance data; misuse creates legal, security, and reputational risk.

## 2. Scope

This AUP covers:

- Company email, chat, video, and scheduling tools (e.g. Google Workspace, Calendly)
- Source repositories, deployment pipelines, and production/staging environments
- `portals.veritrack.cloud` and all client-branded tenant portals and dashboards
- Marketing site (`veritrack.cloud`), support inboxes, and partner onboarding systems
- Company-issued or **BYOD** devices used to access VeriTrack systems
- Third-party services authorised for VeriTrack work (see Section 4)

This AUP applies **24/7** whenever you access VeriTrack systems, including from home, co-working spaces, or while travelling.

## 3. General principles

You must:

- Use systems only for **legitimate VeriTrack business** purposes
- Protect credentials; use **unique strong passwords** and **multi-factor authentication (MFA)** where offered
- Lock screens when stepping away; do not leave sessions open on shared devices
- Report suspected security incidents, lost devices, or credential compromise **immediately** to info@veritrack.cloud and your line manager
- Follow the **least-privilege** principle—request only the access you need
- Comply with Ghana **Data Protection Act, 2012 (Act 843)**, our DPC registration obligations, client contracts, and our [Privacy Policy](../privacyPolicy.html)

You must **not**:

- Share passwords, API keys, OAuth tokens, or recovery codes
- Use another person’s account or allow others to use yours
- Circumvent authentication, logging, monitoring, or access controls
- Store client or employee **Personal Data** on personal cloud accounts, USB drives, or unapproved apps unless explicitly approved in writing

## 4. Approved systems & software

| Category | Approved approach |
|----------|-------------------|
| Email & files | Company Google Workspace accounts only for client/work data |
| Code | Authorised Git repositories; no public forks of private repos |
| Payments / billing | Paystack and approved finance tools only |
| Scheduling | Company Calendly or designated booking links |
| AI assistants | Per [AI Policy](./AI_POLICY.md)—no client PII in consumer/free-tier tools |
| Messaging | Approved team channels; not personal WhatsApp for client data |

**Unapproved software** (pirated tools, unknown browser extensions, personal file-sync on work machines) requires written approval from the CTO.

## 5. Client data & tenant access

VeriTrack processes attendance records, live photos, GPS coordinates, and HR-related data on behalf of Client Organisations. When you access a client tenant (deployment, support, or Super Admin):

1. **Access only** tenants and records required for your assigned task
2. **Do not browse** staff profiles, photos, or attendance history out of curiosity
3. **Do not export, screenshot, or copy** client data to personal devices unless the task requires it and is logged
4. **Do not discuss** identifiable client or end-user data in public channels, social media, or with unauthorised persons
5. **Super Admin** access is for platform health, support tickets, VGBA analytics (where permitted), and agreed benchmarking—never for personal advantage or unofficial reporting
6. Honour **client opt-outs** from public recognition, VGBA, or network benchmarking

Production changes require **change control**: peer review, staging where available, and rollback awareness. Emergency fixes must be documented after the fact.

## 6. Prohibited activities

The following are **strictly prohibited** and may result in immediate access revocation and disciplinary action:

- **Buddy punching or falsifying** attendance in any system (including demo tenants), except documented QA scenarios
- **Spoofing GPS**, bypassing liveness checks, or assisting clients/end users to defeat verification controls
- **Reverse engineering** client misuse into exploitable tools; unauthorised penetration testing without written scope
- Introducing **malware**, crypto miners, or unvetted dependencies into code or infrastructure
- **Scraping** client portals or exporting bulk data without authorisation
- Using VeriTrack systems for **unlawful surveillance**, harassment, or unrelated commercial activity
- Sending **unsolicited bulk email** (spam) from company domains
- Hosting or accessing **illegal content** via company networks
- Misrepresenting VeriTrack or making **binding commitments** to clients without authority

## 7. Communications & marketing

- Use approved templates and pricing from [pricing-calculator.html](../pricing-calculator.html) and current commercial guidance
- Do not promise features, SLAs, or discounts not documented in writing
- Partner and referral claims must align with [Partner Terms](../agentsTCs.html)
- Social posts about clients require **client consent** unless referring to public VGBA results

## 8. Monitoring & enforcement

VeriTrack may log access to systems, audit Super Admin actions, and review communications where legally permitted and necessary for security, quality assurance, or incident investigation. You should have no expectation of privacy when using company systems for work purposes.

**Violations** may result in: warning, mandatory retraining, suspension of access, termination of employment/contract, notification to affected clients or regulators, and civil or criminal referral where warranted.

## 9. Reporting

Report concerns to:

- **Security / access:** info@veritrack.cloud (subject: SECURITY)
- **Ethics / conduct:** CEO or designated lead (see [Code of Conduct](./CODE_OF_CONDUCT.md))
- **Data protection:** info@veritrack.cloud (subject: PRIVACY)

## 10. Acknowledgement & updates

Personnel with system access must acknowledge this AUP at onboarding and annually. Material updates will be communicated via email or internal notice with a revised effective date.

**Related documents:** [Code of Conduct](./CODE_OF_CONDUCT.md) · [Remote Work Policy](./REMOTE_WORK_POLICY.md) · [AI Policy](./AI_POLICY.md) · [Privacy Policy](../privacyPolicy.html) · [Terms of Service](../termsAndConditions.html)
