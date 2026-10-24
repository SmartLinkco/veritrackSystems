"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";

// Inside the data-ui form: the product's own segmented control keeps its raised thumb.
const SEGMENT_SHADOW = "shadow-[0_1px_3px_rgb(11_18_32/0.16)]"; // taste-skill-ignore

const choices = [
  { key: "deploy", label: "Set up my portal" },
  { key: "demo", label: "See a demo first" },
] as const;

/** The deployment request's first step, already open. It carries what was typed into /contact. */
export function FirstStep() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [branches, setBranches] = useState("3");
  const [intent, setIntent] = useState<(typeof choices)[number]["key"]>("deploy");

  const demo = intent === "demo";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // A walkthrough is booked by time slot; organisation and branches are asked on the call.
    if (demo) {
      router.push("/contact?intent=demo");
      return;
    }
    const q = new URLSearchParams({ intent });
    if (company.trim()) q.set("company", company.trim());
    const n = parseInt(branches, 10);
    if (n > 0) {
      q.set("branches", String(n));
      q.set("staff", String(n * 12));
    }
    router.push(`/contact?${q.toString()}`);
  }

  return (
    <form
      data-ui
      onSubmit={submit}
      aria-labelledby="first-step-title"
      className="w-full max-w-[28rem] rounded-[1.5rem] bg-white p-6 text-ink shadow-[0_30px_60px_-24px_rgb(7_11_18/0.55)] sm:p-7"
    >
      <p id="first-step-title" className="font-display text-[1.375rem] font-semibold tracking-[-0.02em]">{demo ? "Book a walkthrough" : "Request your portal"}</p>
      <div className="mt-5 grid gap-4">
        <div hidden={demo}>
          <label htmlFor="fs-company" className="field-label">Organisation</label>
          <input id="fs-company" className="field" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your organisation's name" autoComplete="organization" />
        </div>
        <div hidden={demo}>
          <label htmlFor="fs-branches" className="field-label">Branches</label>
          <input id="fs-branches" className="field tnum" type="number" min={1} inputMode="numeric" value={branches} onChange={(e) => setBranches(e.target.value)} />
        </div>
        <fieldset>
          <legend className="field-label">First</legend>
          <div className="grid grid-cols-2 gap-1 rounded-full bg-surface-elevated p-1">
            {choices.map((c) => (
              <label
                key={c.key}
                className={clsx(
                  "cursor-pointer rounded-full px-3 py-2.5 text-center text-[0.9375rem] font-semibold transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-400",
                  intent === c.key ? `bg-white text-ink ${SEGMENT_SHADOW}` : "text-ink-muted hover:text-ink",
                )}
              >
                <input type="radio" name="fs-intent" value={c.key} checked={intent === c.key} onChange={() => setIntent(c.key)} className="sr-only" />
                {c.label}
              </label>
            ))}
          </div>
        </fieldset>
        {demo && <p className="text-[0.9375rem] text-ink-muted">Thirty minutes with our team on the portal, the dashboard and the network view. We ask about your branches on the call.</p>}
        <button type="submit" className="btn btn-primary mt-1 h-13 w-full">{demo ? "Choose a walkthrough time" : "Continue to your request"}</button>
      </div>
    </form>
  );
}
