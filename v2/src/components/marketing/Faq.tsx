import Link from "next/link";

/** Native <details> accordion: keyboard and screen-reader friendly with no JS. */
export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
            {f.q}
            <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-brand-500 transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="max-w-3xl pb-5 text-ink-muted">
            {f.a}
            {f.q === "Is data secure?" && (
              <>
                {" "}
                <Link href="/legal/privacy#dpc-certification" className="text-brand-500 underline underline-offset-2">Read the privacy policy</Link>.
              </>
            )}
          </p>
        </details>
      ))}
    </div>
  );
}
