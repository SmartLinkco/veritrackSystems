"use client";

import { inView } from "motion";
import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not(.is-in), [data-reveal-stagger]:not(.is-in)";

/**
 * Adds `.is-in` to each reveal target once it enters the viewport. Content is never left hidden.
 * Targets are picked up as they reach the DOM, so streamed sections and client navigations (which
 * commit after the URL changes, inside a view transition) are covered without a route hook.
 */
export function RevealObserver() {
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const stops: VoidFunction[] = [];
    const timers: number[] = [];

    const watch = () => {
      const targets = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter((el) => !seen.has(el));
      if (!targets.length) return;
      targets.forEach((el) => seen.add(el));
      stops.push(
        inView(
          targets,
          (el) => {
            el.classList.add("is-in");
          },
          { margin: "0px 0px -10% 0px", amount: 0.08 },
        ),
      );
      // Safety net: anything on screen that the observer missed is shown after a moment.
      timers.push(
        window.setTimeout(() => {
          targets.forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.top < innerHeight && r.bottom > 0) el.classList.add("is-in");
          });
        }, 2500),
      );
    };

    watch();
    let queued = 0;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        watch();
      });
    });
    mo.observe(document.getElementById("main") ?? document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      cancelAnimationFrame(queued);
      stops.forEach((stop) => stop());
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);
  return null;
}
