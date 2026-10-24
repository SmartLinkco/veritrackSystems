"use client";

import Link from "next/link";
import { useState } from "react";
import { postForm } from "./submit";

// Mirrors agent.html (field names and option values) so the Apps Script receives the same payload.
const regionsByCountry: Record<string, string[]> = {
  Ghana: ["Greater Accra", "Ashanti", "Central", "Eastern", "Northern", "Western", "Volta", "Upper East", "Upper West", "Bono", "Bono East", "Ahafo", "Savannah", "North East", "Oti", "Western North"],
  Nigeria: ["Lagos", "Abuja (FCT)", "Kano", "Rivers", "Kaduna", "Oyo", "Enugu", "Anambra", "Ogun", "Delta", "Edo", "Akwa Ibom", "Cross River", "Benue", "Plateau", "Others"],
  Kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Machakos", "Kiambu", "Kajiado", "Others"],
  "South Africa": ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"],
  Other: ["Other"],
};
const industries = ["Corporate", "Education", "Healthcare", "IT & Software", "Government", "Other"];
const networks = ["MTN", "Vodafone", "AirtelTigo", "Other"];

export function PartnerForm() {
  const [country, setCountry] = useState("");
  const [method, setMethod] = useState<"" | "Mobile Money" | "Bank Transfer">("");
  const [invalid, setInvalid] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const website = String(fd.get("website") ?? "");
    fd.delete("website");
    const data: Record<string, string> = {};
    fd.forEach((v, k) => {
      if (typeof v === "string") data[k] = v.trim();
    });

    const missing = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[required]"))
      .filter((el) => (el.type === "checkbox" ? !(el as HTMLInputElement).checked : !el.value.trim()))
      .map((el) => el.name);
    if (missing.length) {
      setInvalid(missing);
      form.querySelector<HTMLElement>(`[name="${missing[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setError("");
    const res = await postForm("agent-registration", data, website);
    if (res.ok) {
      setStatus("done");
      return;
    }
    setStatus("idle");
    setError(res.error);
    if ("fields" in res && res.fields) setInvalid(res.fields);
  }

  if (status === "done") {
    return (
      <div className="card p-8 text-center sm:p-10" role="status">
        <span aria-hidden className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-2xl text-brand-600">✓</span>
        <h3 className="mt-5 text-2xl">Registration submitted</h3>
        <p className="mx-auto mt-3 max-w-md text-ink-muted">We&apos;ve sent a confirmation email with your registration details.</p>
        <ol className="mx-auto mt-6 grid max-w-md gap-2 text-left text-[0.9375rem]">
          <li>1. Check your email for the verification link.</li>
          <li>2. Your Partner ID is assigned within 24 hours of verification.</li>
          <li>3. Our team will contact you within 24 hours with onboarding details.</li>
        </ol>
      </div>
    );
  }

  const f = (name: string) => ({ name, id: `p-${name}`, className: "field", "aria-invalid": invalid.includes(name), onChange: () => setInvalid((l) => l.filter((x) => x !== name)) });

  return (
    <form onSubmit={onSubmit} noValidate className="card grid gap-8 p-7 sm:p-9">
      {invalid.length > 0 && <p role="alert" className="rounded-xl border border-orange-300 bg-orange-50 p-3 text-[0.9375rem] text-orange-900">Please complete the highlighted fields.</p>}

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-lg font-semibold">1. Personal details</legend>
        <Field label="Full name"><input {...f("agent-full-name")} required autoComplete="name" /></Field>
        <Field label="Email"><input {...f("agent-email")} type="email" required autoComplete="email" /></Field>
        <Field label="Phone"><input {...f("agent-phone")} type="tel" required autoComplete="tel" /></Field>
        <Field label="Residential address"><input {...f("agent-location")} required autoComplete="street-address" /></Field>
        <Field label="Country">
          <select {...f("agent-country")} required value={country} onChange={(e) => { setCountry(e.target.value); setInvalid((l) => l.filter((x) => x !== "agent-country")); }}>
            <option value="" disabled>Select…</option>
            {Object.keys(regionsByCountry).map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Region / state">
          <select {...f("agent-region")} required defaultValue="" key={country}>
            <option value="" disabled>{country ? "Select…" : "Choose a country first"}</option>
            {(regionsByCountry[country] ?? []).map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="City"><input {...f("agent-city")} required autoComplete="address-level2" /></Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-lg font-semibold">2. Professional details</legend>
        <Field label="Company / organisation"><input {...f("agent-company")} required autoComplete="organization" /></Field>
        <Field label="Industry">
          <select {...f("agent-industry")} required defaultValue="">
            <option value="" disabled>Select…</option>
            {industries.map((i) => <option key={i}>{i}</option>)}
          </select>
        </Field>
        <Field label="Position / role"><input {...f("agent-position")} required autoComplete="organization-title" /></Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-lg font-semibold">3. Commission payments</legend>
        <Field label="Preferred payment method">
          <select {...f("agent-payment-method")} required value={method} onChange={(e) => { setMethod(e.target.value as typeof method); setInvalid((l) => l.filter((x) => x !== "agent-payment-method")); }}>
            <option value="" disabled>Select…</option>
            <option>Mobile Money</option>
            <option>Bank Transfer</option>
          </select>
        </Field>
        {method === "Mobile Money" && (
          <>
            <Field label="Mobile money network">
              <select {...f("agent-mobile-money-network")} required defaultValue="">
                <option value="" disabled>Select…</option>
                {networks.map((n) => <option key={n}>{n}</option>)}
              </select>
            </Field>
            <Field label="Name on mobile money account"><input {...f("agent-mobile-money-name")} required /></Field>
            <Field label="Mobile money number"><input {...f("agent-payment-details")} type="tel" required /></Field>
          </>
        )}
        {method === "Bank Transfer" && (
          <>
            <Field label="Bank name"><input {...f("agent-bank-name")} required /></Field>
            <Field label="Name on bank account"><input {...f("agent-bank-account-name")} required /></Field>
            <Field label="Account number"><input {...f("agent-bank-account")} required inputMode="numeric" /></Field>
          </>
        )}
      </fieldset>

      <label className="flex items-start gap-3 text-[0.9375rem]">
        <input type="checkbox" name="agent-terms" required className="mt-1 h-4 w-4 accent-brand-600" aria-invalid={invalid.includes("agent-terms")} onChange={() => setInvalid((l) => l.filter((x) => x !== "agent-terms"))} />
        <span>
          I have read and agree to the <Link href="/legal/partner-terms" className="text-brand-500 underline underline-offset-2" target="_blank">Partner Terms &amp; Conditions</Link>.
        </span>
      </label>
      <div aria-hidden className="hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {error && <p role="alert" className="rounded-xl border border-orange-300 bg-orange-50 p-3 text-[0.9375rem] text-orange-900">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="btn btn-primary justify-self-start disabled:opacity-60">
        {status === "sending" ? "Submitting…" : "Register as partner"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactElement<{ id: string }> }) {
  return (
    <div>
      <label htmlFor={children.props.id} className="field-label">{label}</label>
      {children}
    </div>
  );
}
