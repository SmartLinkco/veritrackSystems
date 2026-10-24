"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import clsx from "clsx";
import { Logo } from "./Logo";
import { sectors } from "@/lib/content";

// Only things that really float cast a shadow: the bar once it lifts off the page, and the open menu.
const BAR_SHADOW = "shadow-[0_12px_32px_-14px_rgb(7_11_18/0.45)]"; // taste-skill-ignore
const MENU_SHADOW = "shadow-[0_24px_48px_-16px_rgb(11_18_32/0.28)]"; // taste-skill-ignore

const links = [
  { href: "/platform", label: "Platform" },
  { href: "/awards", label: "Awards" },
  { href: "/pricing", label: "Pricing" },
  { href: "/company", label: "Company" },
];

const POP: Transition = { type: "spring", bounce: 0, visualDuration: 0.2 };
const INDICATOR: Transition = { type: "spring", bounce: 0.15, visualDuration: 0.35 };

/** The active-page mark. One shared layoutId, so it slides from the old link to the new one. */
function ActiveMark() {
  return (
    <motion.span
      layoutId="nav-active"
      transition={INDICATOR}
      aria-hidden
      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-signal"
    />
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Close menus on navigation.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSolutionsOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!solutionsOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!solutionsRef.current?.contains(e.target as Node)) setSolutionsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSolutionsOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [solutionsOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    // The header keeps a fixed 4.5rem slot in the flow; only the absolutely placed bar inside it moves,
    // so lifting it into a floating card never shifts the page.
    <header className="sticky top-0 z-50 h-18 text-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-ink">
        Skip to main content
      </a>
      <div
        aria-hidden
        className={clsx(
          "absolute inset-x-0 top-0 h-18 transition-[inset,height,border-radius,background-color,box-shadow] duration-300 ease-out",
          scrolled || menuOpen
            ? clsx("bg-frame-deep/85 backdrop-blur-xl", !menuOpen && clsx("lg:inset-x-6 lg:top-2.5 lg:h-15 lg:rounded-2xl", BAR_SHADOW))
            : "bg-transparent",
        )}
      />
      <div className="relative mx-auto flex h-18 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo inverted />

        <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 lg:flex">
          <div ref={solutionsRef} className="relative">
            <button
              type="button"
              aria-expanded={solutionsOpen}
              aria-controls="solutions-menu"
              onClick={() => setSolutionsOpen((o) => !o)}
              className={clsx(
                "relative flex items-center gap-1 rounded-md px-3 py-2 text-[0.9375rem] font-medium transition-colors duration-150 hover:text-white",
                isActive("/solutions") ? "text-white" : "text-white/80",
              )}
            >
              Solutions
              <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" className={clsx("transition-transform duration-200", solutionsOpen && "rotate-180")}>
                <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {isActive("/solutions") && <ActiveMark />}
            </button>
            <AnimatePresence>
              {solutionsOpen && (
                <motion.div
                  key="solutions-menu"
                  id="solutions-menu"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }}
                  transition={POP}
                  style={{ transformOrigin: "top left" }}
                  className={clsx("absolute left-0 top-full mt-2 w-[34rem] rounded-2xl bg-white p-3 text-ink", MENU_SHADOW)}
                >
                  <ul className="grid grid-cols-2 gap-1">
                    {sectors.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/solutions/${s.slug}`} className="block rounded-xl p-3 transition-colors duration-150 hover:bg-surface-elevated">
                          <span className="block text-[0.9375rem] font-semibold text-ink">{s.name}</span>
                          <span className="mt-0.5 block text-[0.9375rem] text-ink-muted">{s.short}</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href="/solutions" className="flex h-full items-center rounded-xl p-3 text-[0.9375rem] font-semibold text-brand-500 transition-colors duration-150 hover:bg-surface-elevated">
                        All solutions
                      </Link>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={clsx(
                "relative rounded-md px-3 py-2 text-[0.9375rem] font-medium transition-colors duration-150 hover:text-white",
                isActive(l.href) ? "text-white" : "text-white/80",
              )}
            >
              {l.label}
              {isActive(l.href) && <ActiveMark />}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden lg:block">
          <Link href="/contact?intent=deploy" className="btn btn-primary btn-arrow btn-sm">Request a portal</Link>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg aria-hidden width="20" height="20" viewBox="0 0 20 20">
            {menuOpen ? (
              <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="mobile-menu"
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={POP}
            className="absolute inset-x-0 top-full h-[calc(100dvh-4.5rem)] overflow-y-auto bg-white px-4 pb-10 pt-4 text-ink lg:hidden"
          >
            <p className="mb-2 px-2 text-[0.9375rem] font-semibold text-ink-muted">Solutions</p>
            <ul className="mb-6 grid gap-1">
              {sectors.map((s) => (
                <li key={s.slug}>
                  <Link href={`/solutions/${s.slug}`} className="block rounded-lg px-2 py-2.5 font-medium">{s.name}</Link>
                </li>
              ))}
            </ul>
            <ul className="grid gap-1 rounded-2xl bg-surface-elevated p-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block rounded-lg px-2 py-2.5 text-lg font-semibold">{l.label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3">
              <Link href="/contact?intent=deploy" className="btn btn-primary">Request a portal</Link>
              <Link href="/demo#book" className="btn btn-ghost">Book a walkthrough</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
