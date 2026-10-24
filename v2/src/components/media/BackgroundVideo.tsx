"use client";

import { inView } from "motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import { loop, type LoopKey } from "@/lib/media";

type Props = {
  clip: LoopKey;
  /** "frame" tints the footage brand blue (heroes, bands); "none" leaves it as shot. */
  scrim?: "frame" | "dark" | "none";
  /** Soft-focus the footage so type on top stays the subject. */
  blur?: boolean;
  priority?: boolean;
  className?: string;
  controlClassName?: string;
};

const REDUCE = "(prefers-reduced-motion: reduce)";

function subscribeStill(onChange: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function prefersStill() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia(REDUCE).matches || conn?.saveData === true;
}

/**
 * Muted, decorative footage. Plays only while on screen, never for reduced-motion or Save-Data
 * visitors (they get the poster), and always offers a Pause control.
 */
export function BackgroundVideo({ clip, scrim = "frame", blur = false, priority = false, className, controlClassName }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const still = useSyncExternalStore(subscribeStill, prefersStill, () => true);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const visible = useRef(false);
  const media = loop(clip);

  // One observer for the life of the element; the Pause control only changes what happens on entry.
  useEffect(() => {
    const el = ref.current;
    if (!el || still) return;
    return inView(
      el,
      () => {
        visible.current = true;
        if (!pausedRef.current) el.play().catch(() => {});
        return () => {
          visible.current = false;
          el.pause();
        };
      },
      { amount: 0.15 },
    );
  }, [still]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (next) el.pause();
    else if (visible.current) el.play().catch(() => {});
  };

  return (
    <div className={clsx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <video
        ref={ref}
        aria-hidden
        tabIndex={-1}
        muted
        loop
        playsInline
        preload={priority ? "metadata" : "none"}
        poster={media.poster}
        className={clsx("h-full w-full object-cover", blur && "scale-110 blur-[6px]")}
      >
        <source src={media.webm} type="video/webm" />
        <source src={media.mp4} type="video/mp4" />
      </video>
      {scrim === "frame" && (
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(20_63_115/0.55),rgb(29_86_152/0.72)_55%,rgb(20_63_115/0.88))] mix-blend-normal" />
      )}
      {scrim === "dark" && <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_11_18/0.25),rgb(7_11_18/0.7))]" />}
      {!still && (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={paused}
          aria-label={paused ? "Play background video" : "Pause background video"}
          className={clsx(
            "pointer-events-auto absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/25 py-1.5 pl-3 pr-1.5 text-[0.8125rem] font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/40",
            controlClassName,
          )}
        >
          {paused ? "Play" : "Pause"}
          <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
            {paused ? (
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2.5 1.5v7l6-3.5z" fill="currentColor" /></svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2.5 1.5v7M7.5 1.5v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            )}
          </span>
        </button>
      )}
    </div>
  );
}
