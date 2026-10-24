"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

declare global {
  interface Window {
    Supademo?: { open: (id: string) => void };
  }
}

let loader: Promise<void> | null = null;

function loadSupademo() {
  loader ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://script.supademo.com/supademo.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loader = null;
      reject(new Error("Supademo failed to load"));
    };
    document.body.appendChild(s);
  });
  return loader;
}

/** Opens the Supademo product tour; the script is fetched on first click, not on page load. */
export function TourButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function open() {
    setBusy(true);
    try {
      await loadSupademo();
      // The script defines window.Supademo shortly after load.
      for (let i = 0; i < 30 && !window.Supademo?.open; i++) await new Promise((r) => setTimeout(r, 100));
      if (window.Supademo?.open) window.Supademo.open(siteConfig.supademoId);
      else router.push("/demo#book");
    } catch {
      router.push("/demo#book");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={open} className={className} aria-busy={busy}>
      {children}
    </button>
  );
}
