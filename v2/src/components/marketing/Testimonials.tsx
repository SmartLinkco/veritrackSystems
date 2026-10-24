"use client";

import { useState } from "react";
import clsx from "clsx";
import type { Testimonial } from "@/lib/content";

export function Testimonials({ items }: { items: Testimonial[] }) {
  const filters = ["All", ...Array.from(new Set(items.map((t) => t.sector)))];
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? items : items.filter((t) => t.sector === filter);

  return (
    <div>
      <div role="group" aria-label="Filter testimonials by sector" className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={clsx(
              "rounded-full border px-4 py-1.5 text-[0.9375rem] font-medium transition-colors",
              filter === f ? "border-brand-600 bg-brand-600 text-white" : "border-border bg-white text-ink hover:border-brand-400",
            )}
          >
            {f}
          </button>
        ))}
      </div>
      <ul className="grid gap-5 md:grid-cols-3">
        {shown.map((t) => (
          <li key={t.name} className="card flex flex-col p-6">
            <blockquote className="flex-1 text-[1.0625rem] leading-relaxed">“{t.quote}”</blockquote>
            <p className="mt-6 font-semibold">{t.name}</p>
            <p className="text-[0.9375rem] text-ink-muted">{t.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
