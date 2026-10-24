"use client";

import Link from "next/link";
import { inView } from "motion";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export type StoryStep = {
  key: string;
  title: string;
  body: React.ReactNode;
  cta?: { href: string; label: string };
  media: React.ReactNode;
  /** Optional fragment id, so links like /platform#monitor land on this step. */
  anchor?: string;
};

/**
 * Text column that stays put while the media column scrolls; the step whose media is on screen
 * opens. Sticky positioning only (no scroll hijacking). Below lg it is a plain stack.
 */
export function PinnedStory({ steps, headingLevel = "h3", tone = "light" }: { steps: StoryStep[]; headingLevel?: "h2" | "h3"; tone?: "light" | "dark" }) {
  const [active, setActive] = useState(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const H = headingLevel;
  const dark = tone === "dark";

  useEffect(() => {
    const stops = panels.current.map((el, i) => (el ? inView(el, () => setActive(i), { amount: 0.55 }) : () => {}));
    return () => stops.forEach((stop) => stop());
  }, [steps.length]);

  const go = (i: number) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panels.current[i]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="hidden lg:col-span-5 lg:block">
        <ol className="sticky top-28 grid">
          {steps.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.key} className={clsx("border-b", dark ? "border-command-border" : "border-border")}>
                <H className="m-0">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={on ? "step" : undefined}
                    className={clsx(
                      "flex w-full items-center gap-4 py-5 text-left font-display text-[1.375rem] font-medium tracking-[-0.015em] transition-colors duration-200",
                      on ? (dark ? "text-command-text" : "text-ink") : dark ? "text-command-muted hover:text-command-text" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    <span
                      aria-hidden
                      className={clsx(
                        "tnum flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.875rem] font-semibold transition-colors duration-200",
                        on ? "border-signal-deep bg-signal text-ink" : dark ? "border-command-border" : "border-border",
                      )}
                    >
                      {i + 1}
                    </span>
                    {s.title}
                  </button>
                </H>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", bounce: 0, visualDuration: 0.35 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className={clsx("pb-6 pl-12 text-lg", dark ? "text-command-muted" : "text-ink-muted")}>
                        {s.body}
                        {s.cta && (
                          <Link href={s.cta.href} className="btn btn-navy btn-arrow btn-sm mt-5">
                            {s.cta.label}
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid gap-12 lg:col-span-7 lg:gap-6">
        {steps.map((s, i) => (
          <div
            key={s.key}
            id={s.anchor}
            ref={(el) => {
              panels.current[i] = el;
            }}
            className="scroll-mt-28 lg:flex lg:min-h-[78vh] lg:items-center"
          >
            <div className="w-full">
              <div className="mb-5 lg:hidden">
                <p className={clsx("tnum text-[0.9375rem] font-semibold", dark ? "text-signal" : "text-brand-600")}>Step {i + 1}</p>
                <H className="mt-1 text-[1.625rem] font-medium leading-tight tracking-[-0.02em]">{s.title}</H>
                <div className={clsx("mt-3 text-lg", dark ? "text-command-muted" : "text-ink-muted")}>{s.body}</div>
                {s.cta && (
                  <Link href={s.cta.href} className="btn btn-navy btn-arrow btn-sm mt-5">
                    {s.cta.label}
                  </Link>
                )}
              </div>
              {s.media}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
