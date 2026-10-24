import Link from "next/link";
import clsx from "clsx";
import { BRANCH_TIERS, STAFF_PER_BRANCH, formatGHS } from "@/lib/pricing";

export function TierCards() {
  return (
    <ul data-reveal-stagger className="grid gap-5 md:grid-cols-3">
      {BRANCH_TIERS.map((t) => {
        const featured = t.key === "growth";
        return (
          <li key={t.key} className={clsx("card relative flex flex-col p-7", featured && "border-brand-400 shadow-xl shadow-brand-600/10")}>
            {featured && (
              <span className="absolute -top-3 left-7 rounded-full bg-brand-600 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-white">Most popular</span>
            )}
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">Tier {t.tier} · {t.range}</p>
            <h3 className="mt-2 text-2xl">{t.name}</h3>
            <p className="text-[0.9375rem] text-ink-muted">{t.legacyName}</p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="font-mono text-4xl font-medium tracking-tight text-brand-600">{formatGHS(t.rate)}</span>
            </p>
            <p className="text-[0.9375rem] text-ink-muted">per branch / month · {STAFF_PER_BRANCH} staff included per branch</p>
            <Link
              href={`/pricing?branches=${t.minBranches}#estimator`}
              className={clsx("btn mt-7", featured ? "btn-primary" : "btn-ghost")}
            >
              Estimate {t.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
