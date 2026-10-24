"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  ADDONS,
  MAX_BRANCHES,
  STAFF_PER_BRANCH,
  estimate,
  formatGHS,
  type AddonKey,
  type BillingPeriod,
} from "@/lib/pricing";

const addonKeys = Object.keys(ADDONS) as AddonKey[];

function clampInt(raw: string | null, min: number, max: number, fallback: number) {
  const n = parseInt(raw ?? "", 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** Estimator (blueprint §5.5). State mirrors the query string so an estimate can be shared by URL. */
export function EstimateCalculator() {
  const params = useSearchParams();
  const [branches, setBranches] = useState(() => clampInt(params.get("branches"), 1, MAX_BRANCHES, 4));
  const [staff, setStaff] = useState(() => clampInt(params.get("staff"), 1, 100000, Math.max(1, clampInt(params.get("branches"), 1, MAX_BRANCHES, 4) * STAFF_PER_BRANCH)));
  const [billing, setBilling] = useState<BillingPeriod>(() => (params.get("billing") === "annual" ? "annual" : "monthly"));
  const [addons, setAddons] = useState<Partial<Record<AddonKey, boolean>>>(() => {
    const list = (params.get("addons") ?? "").split(",");
    return Object.fromEntries(addonKeys.map((k) => [k, list.includes(k)]));
  });
  const [copied, setCopied] = useState(false);

  const e = useMemo(() => estimate({ branches, staff, addons, billing }), [branches, staff, addons, billing]);

  const query = useMemo(() => {
    const q = new URLSearchParams({ branches: String(branches), staff: String(staff), billing });
    const on = addonKeys.filter((k) => addons[k]);
    if (on.length) q.set("addons", on.join(","));
    return q.toString();
  }, [branches, staff, billing, addons]);

  useEffect(() => {
    window.history.replaceState(null, "", `${window.location.pathname}?${query}#estimator`);
  }, [query]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the URL bar already holds the link */
    }
  }

  const contactHref = `/contact?intent=deploy&${query}&estimate=${e.billing.amountDue}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <form className="card grid gap-7 p-6 sm:p-8" onSubmit={(ev) => ev.preventDefault()} aria-label="Plan estimator">
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberField
            id="branches"
            label="Branches / locations"
            hint="One tier applies to all branches."
            value={branches}
            min={1}
            max={MAX_BRANCHES}
            onChange={setBranches}
          />
          <NumberField
            id="staff"
            label="Total staff"
            hint={`${STAFF_PER_BRANCH} per branch included (${e.coveredStaff} for ${branches}).`}
            value={staff}
            min={1}
            max={100000}
            onChange={setStaff}
          />
        </div>

        <fieldset>
          <legend className="field-label">Optional modules</legend>
          <div className="mt-2 grid gap-2">
            {addonKeys.map((k) => {
              const a = ADDONS[k];
              return (
                <label key={k} className={clsx("flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors", addons[k] ? "border-brand-400 bg-brand-100/40" : "border-border hover:border-brand-400")}>
                  <input
                    type="checkbox"
                    checked={!!addons[k]}
                    onChange={(ev) => setAddons((s) => ({ ...s, [k]: ev.target.checked }))}
                    className="h-4 w-4 accent-brand-600"
                  />
                  <span className="flex-1 text-[0.9375rem]">{a.label}</span>
                  <span className="font-mono text-sm text-ink-muted">
                    {formatGHS(a.monthly)}
                    {a.perStaff ? "/staff" : ""}/mo
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="field-label">Billing</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["monthly", "annual"] as const).map((p) => (
              <label key={p} className={clsx("cursor-pointer rounded-xl border p-3.5 transition-colors", billing === p ? "border-brand-400 bg-brand-100/40" : "border-border hover:border-brand-400")}>
                <input type="radio" name="billing" value={p} checked={billing === p} onChange={() => setBilling(p)} className="sr-only" />
                <span className="block font-semibold capitalize">{p}</span>
                <span className="block text-sm text-ink-muted">{p === "monthly" ? "Standard monthly rate" : "Pay 11 months, get 12"}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <section aria-live="polite" aria-label="Estimate" className="theme-command overflow-hidden rounded-2xl border border-command-border">
          <div className="border-b border-command-border p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-command-muted">
              {e.branchTier.name} · {billing === "annual" ? "Amount due (annual)" : "Amount due (monthly)"}
            </p>
            <p className="mt-2 font-mono text-5xl font-medium tracking-tight text-command-text">{formatGHS(e.billing.amountDue)}</p>
            {e.billing.savings > 0 ? (
              <p className="mt-2 text-sm text-signal">Save {formatGHS(e.billing.savings)} vs paying month by month · {formatGHS(e.billing.effectiveMonthly)}/mo effective</p>
            ) : (
              <p className="mt-2 text-sm text-command-muted">Switch to annual to save one month.</p>
            )}
          </div>
          <dl className="grid gap-4 p-6 text-[0.9375rem] sm:p-8">
            <Line label="Branches" detail={`${branches} × ${formatGHS(e.branchTier.rate)} (${e.branchTier.name}, ${e.branchTier.range})`} value={e.baseBranchCost} />
            <Line
              label="Extra staff"
              detail={e.extraStaff > 0 ? `${e.extraStaff} × ${formatGHS(e.extraStaffTier.rate)} (${e.extraStaffTier.range})` : `Within the ${e.coveredStaff} included`}
              value={e.extraStaffCost}
            />
            <Line label="Modules" detail={e.addonLines.length ? e.addonLines.map((l) => l.label).join(" · ") : "None selected"} value={e.addonsMonthly} />
            <div className="border-t border-command-border pt-4">
              <Line label="Monthly subscription" detail="Before any annual saving" value={e.monthlyGhs} strong />
            </div>
            <Line label="One-time setup" detail="30-day trial on subscription" value={e.setupGhs} />
          </dl>
          <div className="grid gap-3 border-t border-command-border p-6 sm:grid-cols-2 sm:p-8">
            <Link href={contactHref} className="btn btn-primary">Send to our team</Link>
            <button type="button" onClick={copyLink} className="btn btn-ghost">{copied ? "Link copied" : "Copy shareable link"}</button>
            <button type="button" onClick={() => window.print()} className="btn btn-ghost sm:col-span-2">Print or save as PDF</button>
          </div>
        </section>
        <p className="mt-4 text-sm text-ink-muted">Estimates are indicative. Your quote is confirmed after the discovery call. Prices in Ghana cedis.</p>
      </div>
    </div>
  );
}

function NumberField({ id, label, hint, value, min, max, onChange }: { id: string; label: string; hint: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const [text, setText] = useState(String(value));
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    if (parseInt(text, 10) !== value) setText(String(value));
  }
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={text}
        onChange={(ev) => {
          setText(ev.target.value);
          const n = parseInt(ev.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
        onBlur={() => setText(String(value))}
        className="field font-mono"
        aria-describedby={`${id}-hint`}
      />
      <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-muted">{hint}</p>
    </div>
  );
}

function Line({ label, detail, value, strong }: { label: string; detail: string; value: number; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <dt className={clsx(strong && "font-semibold")}>{label}</dt>
        <dd className="text-sm text-command-muted">{detail}</dd>
      </div>
      <dd className={clsx("shrink-0 font-mono", strong ? "text-signal" : "text-command-text")}>{formatGHS(value)}</dd>
    </div>
  );
}
