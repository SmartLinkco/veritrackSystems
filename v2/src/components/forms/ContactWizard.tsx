"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { siteConfig } from "@/lib/site-config";
import { estimate, formatGHS, getBranchTier } from "@/lib/pricing";
import { postForm } from "./submit";

const intents = [
  { key: "deploy", title: "Deploy a portal", body: "Get VeriTrack configured for your organisation." },
  { key: "demo", title: "Book a demo", body: "A live walkthrough with our team." },
  { key: "partner", title: "Become a partner", body: "Refer organisations and earn commissions." },
  { key: "support", title: "Get support", body: "Existing customers and renewals." },
] as const;
type Intent = (typeof intents)[number]["key"];

// Option values match the legacy get-started.html form so the Apps Script receives identical strings.
const industries = ["Agriculture", "Automotive", "Banking & Finance", "Construction", "Consulting", "Corporate", "Education", "Energy & Utilities", "Engineering", "Events", "Government", "Healthcare", "Hospitality", "IT & Software", "Legal", "Logistics & Transportation", "Manufacturing", "Media & Entertainment", "Mining", "NGO / Non-Profit", "Pharmaceuticals", "Real Estate", "Retail & E-commerce", "Security", "Sports & Recreation", "Telecommunications", "Travel & Tourism", "Other"];
const useCases = ["Staff Attendance", "Student/Class Tracking", "Event Check-In", "Remote Workforce", "Visitor Management"];
const branchScales = ["1–3 branches (GHS 450 / branch / mo)", "4–9 branches (GHS 350 / branch / mo)", "10+ branches (GHS 300 / branch / mo)", "Not sure — discuss with team"];
const billingPrefs = ["Usage-based — monthly billing (see price calculator)", "Usage-based — annual prepay (11× monthly)", "I used the price calculator — amount in follow-up"];
const timelines = ["Immediate", "1–3 Months", "Flexible"];
const keyFeatures = ["QR Code Scanning", "Liveliness Check", "GPS/Geofencing", "Automated Reports", "Multi-location Support"];

const sectorDefaults: Record<string, { industry: string; useCase: string }> = {
  pharmacy: { industry: "Pharmaceuticals", useCase: "Staff Attendance" },
  education: { industry: "Education", useCase: "Student/Class Tracking" },
  logistics: { industry: "Logistics & Transportation", useCase: "Remote Workforce" },
  corporate: { industry: "Corporate", useCase: "Staff Attendance" },
  security: { industry: "Security", useCase: "Remote Workforce" },
  events: { industry: "Events", useCase: "Event Check-In" },
};

type DeployFields = {
  "full-name": string;
  "company-name": string;
  email: string;
  phone: string;
  industry: string;
  "agent-id": string;
  "use-case": string;
  "number-of-users": string;
  "deployment-timeline": string;
  "budget-range": string;
  "integration-needs": string;
  "additional-requests": string;
};

const fieldLabels: Record<keyof DeployFields, string> = {
  "full-name": "Full name",
  "company-name": "Company / organisation",
  email: "Work email",
  phone: "Phone",
  industry: "Industry",
  "agent-id": "Partner ID (optional)",
  "use-case": "Main use case",
  "number-of-users": "Branch scale",
  "deployment-timeline": "Timeline",
  "budget-range": "Billing preference",
  "integration-needs": "Integrations (optional)",
  "additional-requests": "Branding or other requests (optional)",
};

function initialFields(params: URLSearchParams): DeployFields {
  const sector = sectorDefaults[params.get("sector") ?? ""];
  const branches = parseInt(params.get("branches") ?? "", 10);
  const staff = parseInt(params.get("staff") ?? "", 10);
  const billing = params.get("billing");
  let note = "";
  if (branches > 0 && staff > 0) {
    const addons = Object.fromEntries((params.get("addons") ?? "").split(",").filter(Boolean).map((k) => [k, true]));
    const e = estimate({ branches, staff, addons, billing: billing === "annual" ? "annual" : "monthly" });
    note = `Estimate from pricing page: ${branches} branches, ${staff} staff, ${e.addonLines.map((l) => l.label).join(", ") || "no modules"}, ${e.billing.period} billing: ${formatGHS(e.billing.amountDue)}.`;
  }
  const tier = branches > 0 ? getBranchTier(branches).tier : 0;
  return {
    "full-name": "",
    "company-name": (params.get("company") ?? "").slice(0, 120),
    email: "",
    phone: "",
    industry: sector?.industry ?? "",
    "agent-id": params.get("ref") ?? "",
    "use-case": sector?.useCase ?? "",
    "number-of-users": tier ? branchScales[tier - 1] : "",
    "deployment-timeline": "",
    "budget-range": note ? billingPrefs[2] : billing === "annual" ? billingPrefs[1] : "",
    "integration-needs": "",
    "additional-requests": note,
  };
}

/** Intent-based contact wizard (blueprint §5.7): choose intent → details → review & submit. */
export function ContactWizard() {
  const params = useSearchParams();
  const startIntent = intents.some((i) => i.key === params.get("intent")) ? (params.get("intent") as Intent) : null;
  const [intent, setIntent] = useState<Intent | null>(startIntent);
  const [step, setStep] = useState<1 | 2 | 3>(startIntent ? 2 : 1);
  const [fields, setFields] = useState<DeployFields>(() => initialFields(new URLSearchParams(params.toString())));
  const [honeypot, setHoneypot] = useState("");
  const [invalid, setInvalid] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const required = useMemo(
    () => (["full-name", "company-name", "email", "phone", "industry", "use-case", "number-of-users", "deployment-timeline", "budget-range"] as const),
    [],
  );

  function update<K extends keyof DeployFields>(k: K, v: string) {
    setFields((f) => ({ ...f, [k]: v }));
    setInvalid((list) => list.filter((x) => x !== k));
  }

  function toReview() {
    const missing: string[] = required.filter((k) => !fields[k].trim());
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) missing.push("email");
    setInvalid(missing);
    if (missing.length) {
      document.getElementById(`f-${missing[0]}`)?.focus();
      return;
    }
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    setStatus("sending");
    setError("");
    const res = await postForm(
      "company-request",
      { ...fields, "key-features": keyFeatures, platform: "Web-Based (Recommended)" },
      honeypot,
    );
    if (res.ok) {
      setStatus("done");
      return;
    }
    setStatus("idle");
    setError(res.error);
    if ("fields" in res && res.fields?.length) {
      setInvalid(res.fields);
      setStep(2);
    }
  }

  if (status === "done") {
    return (
      <div className="card p-8 text-center sm:p-12" role="status">
        <span aria-hidden className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-2xl text-brand-600">✓</span>
        <h2 className="mt-5 text-2xl">Request received</h2>
        <p className="mx-auto mt-3 max-w-lg text-ink-muted">
          Thanks, {fields["full-name"].split(" ")[0]}. We&apos;ve sent a confirmation to {fields.email}.
        </p>
        <ol className="mx-auto mt-6 grid max-w-md gap-2 text-left text-[0.9375rem]">
          <li>1. Check your email for the onboarding setup form link.</li>
          <li>2. Our team will contact you within 24 hours.</li>
          <li>3. Your system is ready within 48 hours of completing onboarding.</li>
        </ol>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={siteConfig.calUrl} target="_blank" rel="noopener" className="btn btn-primary">Pick a call time now ↗</a>
          <Link href="/demo" className="btn btn-ghost">Explore the live demo</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ol className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-muted" aria-label="Progress">
        {["Intent", "Details", "Review"].map((label, i) => (
          <li key={label} className={clsx("flex items-center gap-2", step === i + 1 && "text-brand-600")} aria-current={step === i + 1 ? "step" : undefined}>
            <span className={clsx("flex h-6 w-6 items-center justify-center rounded-full border", step >= i + 1 ? "border-brand-600" : "border-border")}>{i + 1}</span>
            {label}
            {i < 2 && <span aria-hidden className="ml-1 h-px w-6 bg-border" />}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <fieldset>
          <legend className="text-2xl font-display font-semibold">I want to…</legend>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {intents.map((i) => (
              <button
                key={i.key}
                type="button"
                onClick={() => {
                  setIntent(i.key);
                  setStep(2);
                }}
                className={clsx("card p-5 text-left transition-colors hover:border-brand-400", intent === i.key && "border-brand-400")}
              >
                <span className="block text-lg font-semibold">{i.title}</span>
                <span className="mt-1 block text-[0.9375rem] text-ink-muted">{i.body}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step >= 2 && intent !== "deploy" && intent && (
        <div className="card p-7 sm:p-9">
          <BackButton onClick={() => setStep(1)} />
          {intent === "demo" && (
            <>
              <h2 className="text-2xl">Book a live walkthrough</h2>
              <p className="mt-3 text-ink-muted">Thirty minutes with our team: the staff portal, your admin dashboard, and the network view, using the sector you choose.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={siteConfig.calUrl} target="_blank" rel="noopener" className="btn btn-primary">Choose a time ↗</a>
                <Link href="/demo" className="btn btn-ghost">Try the self-serve demo</Link>
              </div>
            </>
          )}
          {intent === "partner" && (
            <>
              <h2 className="text-2xl">Join the partner programme</h2>
              <p className="mt-3 text-ink-muted">Register to receive a Partner ID, onboarding support, and recurring commissions on every referral.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/partners#register" className="btn btn-primary">Register as a partner</Link>
                <Link href="/legal/partner-terms" className="btn btn-ghost">Read partner terms</Link>
              </div>
            </>
          )}
          {intent === "support" && (
            <>
              <h2 className="text-2xl">Support for existing customers</h2>
              <p className="mt-3 text-ink-muted">{siteConfig.support}</p>
              <ul className="mt-6 grid gap-3">
                <li>Email: <a className="text-brand-500 underline underline-offset-2" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></li>
                <li>Phone: <a className="text-brand-500 underline underline-offset-2" href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a></li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={siteConfig.renewalUrl} className="btn btn-primary">Renew subscription ↗</a>
                <a href={siteConfig.portalsUrl} className="btn btn-ghost">Client portals ↗</a>
              </div>
            </>
          )}
        </div>
      )}

      {step === 2 && intent === "deploy" && (
        <form
          className="card grid gap-6 p-7 sm:p-9"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            toReview();
          }}
        >
          <BackButton onClick={() => setStep(1)} />
          <div>
            <h2 className="text-2xl">Deploy your VeriTrack portal</h2>
            <p className="mt-2 text-ink-muted">Tell us your branches, headcount, and sector. Fields marked * are required.</p>
          </div>
          {invalid.length > 0 && (
            <p role="alert" className="rounded-xl border border-orange-300 bg-orange-50 p-3 text-[0.9375rem] text-orange-900">Please complete the highlighted fields.</p>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <Input k="full-name" fields={fields} invalid={invalid} update={update} required autoComplete="name" />
            <Input k="company-name" fields={fields} invalid={invalid} update={update} required autoComplete="organization" />
            <Input k="email" fields={fields} invalid={invalid} update={update} required type="email" autoComplete="email" />
            <Input k="phone" fields={fields} invalid={invalid} update={update} required type="tel" autoComplete="tel" placeholder="+233 XX XXX XXXX" />
            <Select k="industry" options={industries} fields={fields} invalid={invalid} update={update} />
            <Select k="use-case" options={useCases} fields={fields} invalid={invalid} update={update} />
            <Select k="number-of-users" options={branchScales} fields={fields} invalid={invalid} update={update} />
            <Select k="budget-range" options={billingPrefs} fields={fields} invalid={invalid} update={update} />
          </div>
          <fieldset>
            <legend className="field-label">{fieldLabels["deployment-timeline"]} *</legend>
            <div className="mt-1 flex flex-wrap gap-2" id="f-deployment-timeline" tabIndex={-1} role="radiogroup" aria-invalid={invalid.includes("deployment-timeline")}>
              {timelines.map((t) => (
                <label key={t} className={clsx("cursor-pointer rounded-full border px-4 py-2 text-[0.9375rem]", fields["deployment-timeline"] === t ? "border-brand-600 bg-brand-600 text-white" : invalid.includes("deployment-timeline") ? "border-orange-400" : "border-border")}>
                  <input type="radio" name="deployment-timeline" className="sr-only" checked={fields["deployment-timeline"] === t} onChange={() => update("deployment-timeline", t)} />
                  {t}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input k="agent-id" fields={fields} invalid={invalid} update={update} />
            <Input k="integration-needs" fields={fields} invalid={invalid} update={update} placeholder="e.g. payroll system, HR tools" />
          </div>
          <div>
            <label htmlFor="f-additional-requests" className="field-label">{fieldLabels["additional-requests"]}</label>
            <textarea id="f-additional-requests" rows={3} className="field" value={fields["additional-requests"]} onChange={(e) => update("additional-requests", e.target.value)} />
          </div>
          <div aria-hidden className="hidden">
            <label>Website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">Review request →</button>
          </div>
        </form>
      )}

      {step === 3 && intent === "deploy" && (
        <div className="card grid gap-6 p-7 sm:p-9">
          <BackButton onClick={() => setStep(2)} label="Edit details" />
          <h2 className="text-2xl">Review your request</h2>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {(Object.keys(fieldLabels) as (keyof DeployFields)[]).filter((k) => fields[k]).map((k) => (
              <div key={k} className={k === "additional-requests" ? "sm:col-span-2" : undefined}>
                <dt className="text-sm text-ink-muted">{fieldLabels[k]}</dt>
                <dd className="break-words">{fields[k]}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-ink-muted">
            Setup is a one-time configuration fee plus a 30-day trial on subscription. By submitting you agree to our{" "}
            <Link href="/legal/terms" className="underline underline-offset-2">terms</Link> and{" "}
            <Link href="/legal/privacy" className="underline underline-offset-2">privacy policy</Link>.
          </p>
          {error && <p role="alert" className="rounded-xl border border-orange-300 bg-orange-50 p-3 text-[0.9375rem] text-orange-900">{error}</p>}
          <div className="flex justify-end">
            <button type="button" onClick={submit} disabled={status === "sending"} className="btn btn-primary disabled:opacity-60">
              {status === "sending" ? "Submitting…" : "Submit request"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BackButton({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} className="-mt-2 mb-2 justify-self-start text-[0.9375rem] font-semibold text-brand-500 hover:underline">
      ← {label}
    </button>
  );
}

type FieldProps = {
  k: keyof DeployFields;
  fields: DeployFields;
  invalid: string[];
  update: (k: keyof DeployFields, v: string) => void;
};

function Input({ k, fields, invalid, update, required, ...rest }: FieldProps & { required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={`f-${k}`} className="field-label">{fieldLabels[k]}{required && " *"}</label>
      <input id={`f-${k}`} className="field" value={fields[k]} aria-invalid={invalid.includes(k)} required={required} onChange={(e) => update(k, e.target.value)} {...rest} />
    </div>
  );
}

function Select({ k, options, fields, invalid, update }: FieldProps & { options: string[] }) {
  return (
    <div>
      <label htmlFor={`f-${k}`} className="field-label">{fieldLabels[k]} *</label>
      <select id={`f-${k}`} className="field" value={fields[k]} aria-invalid={invalid.includes(k)} onChange={(e) => update(k, e.target.value)}>
        <option value="" disabled>Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
