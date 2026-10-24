"use client";

import { useState } from "react";
import clsx from "clsx";
import type { Testimonial } from "@/lib/content";

/** "Name block, quote block": the speakers are the switch, the quotation fills the colour. */
export function QuoteBlocks({ items }: { items: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const t = items[active];

  return (
    <div className="grid overflow-hidden rounded-[1.25rem] lg:min-h-[70svh] lg:grid-cols-[5fr_7fr]">
      <div className="order-2 flex flex-col justify-between gap-10 bg-command-bg p-6 text-command-text sm:p-8 lg:order-1">
        <h2 id="quotes-heading" className="text-[1.375rem] leading-snug">In their words</h2>
        <ul className="grid gap-4" role="tablist" aria-label="Customers">
          {items.map((item, i) => (
            <li key={item.name}>
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls="quote-panel"
                onClick={() => setActive(i)}
                className={clsx(
                  "group block text-left transition-colors duration-200",
                  i === active ? "text-command-text" : "text-command-muted hover:text-command-text",
                )}
              >
                <span className="flex items-center gap-3 text-[1.375rem] font-semibold">
                  <span aria-hidden className={clsx("h-3 w-3 rounded-full border-[3px] border-signal transition-colors", i === active && "bg-signal")} />
                  {item.name}
                </span>
                <span className="mt-0.5 block pl-6 text-[0.9375rem]">{item.role}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div id="quote-panel" role="tabpanel" className="order-1 bg-brand-600 p-6 pb-24 text-white sm:p-12 sm:pb-32 lg:order-2">
        <blockquote key={active} className="animate-rise max-w-[34ch] text-[clamp(1.375rem,2.1vw,1.875rem)] font-medium leading-[1.2] tracking-[-0.015em] [text-indent:-0.45em]">
          <p className="font-display">&ldquo;{t.quote}&rdquo;</p>
        </blockquote>
        <p className="mt-8 text-[0.9375rem] text-white/85">{t.sector} customer, Ghana</p>
      </div>
    </div>
  );
}
