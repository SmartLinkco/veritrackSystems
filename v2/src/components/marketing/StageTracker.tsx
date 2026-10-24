import clsx from "clsx";

export type Stage = { label: string; detail?: string; done?: boolean };

/** Ticked boxes joined by a rail. The ticks draw in, one after another, when the tracker scrolls into view. */
export function StageTracker({ stages, className }: { stages: Stage[]; className?: string }) {
  return (
    <ol data-reveal className={clsx("stage-tracker grid gap-6 rounded-[1.25rem] bg-brand-100/60 p-6 sm:p-8 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:gap-0", className)} style={{ "--n": stages.length } as React.CSSProperties}>
      {stages.map((s, i) => {
        const done = s.done ?? true;
        return (
          <li key={s.label} className="relative flex gap-4 lg:flex-col lg:items-center lg:gap-0 lg:px-3 lg:text-center" style={{ "--i": i } as React.CSSProperties}>
            {i > 0 && <span aria-hidden className="stage-rail absolute hidden lg:block" />}
            <span
              aria-hidden
              className={clsx(
                "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-t-[3px] bg-white",
                done ? "border-brand-600" : "border-border bg-white/60",
              )}
            >
              {done && (
                <svg viewBox="0 0 24 24" className="h-7 w-7 text-brand-600">
                  <path className="stage-tick" d="M5 12.5 10 17.5 19.5 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
                </svg>
              )}
            </span>
            <div className="lg:mt-4">
              <p className={clsx("font-display text-[1.125rem] font-semibold tracking-[-0.01em]", done ? "text-ink" : "text-ink-muted")}>
                {s.label}
                <span className="sr-only">{done ? " (done)" : " (to come)"}</span>
              </p>
              {s.detail && <p className="mt-1 max-w-[26ch] text-[0.9375rem] text-ink-muted lg:mx-auto">{s.detail}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
