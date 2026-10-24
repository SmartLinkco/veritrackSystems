"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { performanceWeights } from "@/lib/content";

type Breakdown = Record<(typeof performanceWeights)[number]["key"], number>;

// Example organisation: component rates (0–100) that produce a score of 87.
const exampleRates: Breakdown = { attendance: 92, punctuality: 78, checkout: 88, sync: 90 };

export function computeScore(rates: Breakdown) {
  return performanceWeights.reduce((sum, w) => sum + (rates[w.key] * w.weight) / 100, 0);
}

const r = 84;
const c = 2 * Math.PI * r;

/** Animated Performance Score ring with the published weights (blueprint §4.7, §14.2). */
export function ScoreRing({ rates = exampleRates }: { rates?: Breakdown }) {
  const score = Math.round(computeScore(rates));
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const shown = useMotionValue(score);
  const label = useTransform(() => Math.round(shown.get()));
  const offset = useTransform(shown, [0, 100], [c, 0]);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(shown, [0, score], { duration: 1.4, ease: [0.33, 1, 0.68, 1] });
    return () => controls.stop();
  }, [inView, reduce, score, shown]);

  return (
    <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
      <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64">
        <svg ref={ref} viewBox="0 0 200 200" className="h-full w-full -rotate-90" role="img" aria-label={`Example Performance Score: ${score} out of 100`}>
          <circle cx="100" cy="100" r={r} fill="none" stroke="var(--color-command-border)" strokeWidth="14" />
          <motion.circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={c}
            style={{ strokeDashoffset: offset, filter: "drop-shadow(0 0 10px var(--color-signal-dim))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden>
          <motion.span className="font-mono text-6xl font-medium text-command-text">{label}</motion.span>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-command-muted">of 100</span>
        </div>
      </div>

      <table className="w-full text-left text-[0.9375rem]">
        <caption className="sr-only">How the example score is calculated</caption>
        <thead>
          <tr className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-command-muted">
            <th className="pb-3 font-medium">Component</th>
            <th className="pb-3 text-right font-medium">Weight</th>
            <th className="pb-3 text-right font-medium">Rate</th>
            <th className="pb-3 text-right font-medium">Points</th>
          </tr>
        </thead>
        <tbody>
          {performanceWeights.map((w) => (
            <tr key={w.key} className="border-t border-command-border">
              <td className="py-3">
                {w.label}
                <span className="mt-1.5 block h-1 rounded-full bg-command-border">
                  <span className="block h-1 rounded-full bg-signal" style={{ width: `${rates[w.key]}%` }} />
                </span>
              </td>
              <td className="py-3 text-right font-mono text-command-muted">{w.weight}%</td>
              <td className="py-3 text-right font-mono text-command-muted">{rates[w.key]}%</td>
              <td className="py-3 text-right font-mono text-command-text">{((rates[w.key] * w.weight) / 100).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
