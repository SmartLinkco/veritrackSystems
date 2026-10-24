"use client";

import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { BRANCH_TIERS, SETUP_FEE_GHS, STAFF_PER_BRANCH, TRIAL_DAYS, estimate, formatGHS, getBranchTier } from "@/lib/pricing";

const includes: Record<string, string> = {
  starter: "The full platform for one to three branches: photo liveness, geofencing, the admin dashboard and automated reports.",
  growth: "The same platform at a lower rate per branch once you run four to nine locations, with every branch on one dashboard.",
  enterprise: "The lowest rate per branch, from ten locations up, for networks run from a head office.",
};

/** "Plan names, one live figure": the tier names are the heading; the stage shows the selected tier and a live monthly total. */
export function PlanIndex() {
  const [branches, setBranches] = useState(4);
  const tier = getBranchTier(branches);
  const e = estimate({ branches, staff: branches * STAFF_PER_BRANCH });

  function choose(minBranches: number, maxBranches: number | null) {
    if (branches < minBranches || (maxBranches !== null && branches > maxBranches)) setBranches(minBranches);
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
      <div className="lg:col-span-6">
        <h2 id="pricing-heading" className="sr-only">Pricing</h2>
        <ul className="grid">
          {BRANCH_TIERS.map((t) => {
            const on = t.key === tier.key;
            return (
              <li key={t.key}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(t.minBranches, t.maxBranches)}
                  className={clsx(
                    "flex items-center gap-[0.3em] py-1 text-left font-display text-display-xl font-semibold leading-[1.08] tracking-[-0.035em] transition-colors duration-200",
                    on ? "text-ink" : "text-ink-muted hover:text-ink",
                  )}
                >
                  <span aria-hidden className={clsx("h-[0.3em] w-[0.3em] shrink-0 rounded-full bg-signal-deep transition-transform duration-200", on ? "scale-100 opacity-100" : "scale-50 opacity-0")} />
                  {t.name}
                  <span className="sr-only">, {t.range}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="lg:col-span-5 lg:col-start-8 lg:sticky lg:top-28" aria-live="polite">
        <p className="flex flex-wrap items-baseline gap-x-3">
          <span key={tier.key} className="animate-rise tnum font-display text-display-xl font-semibold leading-none tracking-[-0.035em]">
            {formatGHS(tier.rate)}
          </span>
          <span className="text-lg text-ink-muted">per branch, per month, for {tier.range}</span>
        </p>
        <p className="mt-6 max-w-[44ch] text-lg">
          {includes[tier.key]} {STAFF_PER_BRANCH} staff per branch included.
        </p>

        <div data-ui className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 rounded-[1.25rem] bg-surface-elevated p-5">
          <label htmlFor="plan-branches" className="text-base font-semibold">Your branches</label>
          <div className="flex items-center gap-2">
            <Step label="One branch fewer" onClick={() => setBranches((b) => Math.max(1, b - 1))} disabled={branches <= 1}>−</Step>
            <input
              id="plan-branches"
              type="number"
              inputMode="numeric"
              min={1}
              max={500}
              value={branches}
              onChange={(ev) => {
                const n = parseInt(ev.target.value, 10);
                if (!Number.isNaN(n)) setBranches(Math.max(1, Math.min(500, n)));
              }}
              className="tnum h-11 w-16 rounded-xl border border-border bg-white text-center text-lg font-semibold"
            />
            <Step label="One branch more" onClick={() => setBranches((b) => Math.min(500, b + 1))}>+</Step>
          </div>
          <p className="tnum basis-full text-lg">
            {branches} × {formatGHS(tier.rate)} = <strong className="font-semibold">{formatGHS(e.monthlyGhs)} a month</strong>, {e.coveredStaff} staff covered.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link href={`/contact?intent=deploy&branches=${branches}&staff=${branches * STAFF_PER_BRANCH}&billing=monthly`} className="btn btn-primary">
            Start on {tier.name}
          </Link>
          <Link href={`/pricing?branches=${branches}&staff=${branches * STAFF_PER_BRANCH}#estimator`} className="text-link">Add staff and modules</Link>
        </div>
        <p className="mt-6 text-[0.9375rem] text-ink-muted">
          One-time setup {formatGHS(SETUP_FEE_GHS)}, then a {TRIAL_DAYS}-day trial. Annual billing pays 11 months for 12.
        </p>
      </div>
    </div>
  );
}

function Step({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-semibold text-brand-700 transition-[background-color,transform] hover:bg-brand-100 active:scale-95 disabled:opacity-40"
    >
      {children}
    </button>
  );
}
