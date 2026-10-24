"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

type Metric = { value: number; suffix: string; label: string };

function CountUp({ value, suffix, run }: { value: number; suffix: string; run: boolean }) {
  const count = useMotionValue(value);
  const text = useTransform(() => Math.round(count.get()).toLocaleString("en-GH") + suffix);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!run || reduce) return;
    const controls = animate(count, [0, value], { duration: 1.2, ease: [0.33, 1, 0.68, 1] });
    return () => controls.stop();
  }, [run, reduce, value, count]);

  return <motion.span>{text}</motion.span>;
}

/** Counts up once on first view. Server render shows the final figures, so no-JS and crawlers see real numbers. */
export function MetricStrip({ metrics }: { metrics: readonly Metric[] }) {
  const ref = useRef<HTMLDListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <dl ref={ref} className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3" data-source="static">
      {metrics.map((m) => (
        <div key={m.label}>
          <dt className="text-[0.9375rem] text-ink-muted">{m.label}</dt>
          <dd className="order-first font-mono text-3xl font-medium tracking-tight text-brand-600 sm:text-4xl">
            <CountUp value={m.value} suffix={m.suffix} run={inView} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
