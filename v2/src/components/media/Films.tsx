"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { filmEmbedUrl, films, type FilmId } from "@/lib/media";

function PlayDisc({ size = "lg" }: { size?: "sm" | "lg" }) {
  return (
    <span
      aria-hidden
      className={clsx(
        "flex items-center justify-center rounded-full bg-white text-brand-700 shadow-[0_10px_30px_-10px_rgb(11_18_32/0.6)] transition-transform duration-300 group-hover:scale-110", // taste-skill-ignore: play disc floats over footage
        size === "lg" ? "h-16 w-16 sm:h-20 sm:w-20" : "h-12 w-12",
      )}
    >
      <svg viewBox="0 0 20 20" className={size === "lg" ? "ml-1 h-6 w-6 sm:h-7 sm:w-7" : "ml-0.5 h-5 w-5"}>
        <path d="M5 3.5v13l11-6.5z" fill="currentColor" />
      </svg>
    </span>
  );
}

function Player({ id }: { id: FilmId }) {
  return (
    <iframe
      src={filmEmbedUrl(id)}
      title={`${films[id].title} (VeriTrack film)`}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      className="absolute inset-0 h-full w-full border-0"
    />
  );
}

/** Poster first; the YouTube player (privacy-enhanced domain) loads only after a click, in place. */
export function FilmFacade({ id, priority = false, className, sizes = "(min-width: 1024px) 60vw, 100vw" }: { id: FilmId; priority?: boolean; className?: string; sizes?: string }) {
  const film = films[id];
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playing) frame.current?.querySelector("iframe")?.focus();
  }, [playing]);

  return (
    <div ref={frame} className={clsx("relative aspect-video overflow-hidden rounded-[1.25rem] bg-command-bg", className)}>
      {playing ? (
        <Player id={id} />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`Play film: ${film.title}`} className="group absolute inset-0 block text-left">
          <Image src={film.poster} alt="" fill priority={priority} sizes={sizes} className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-[1.03]" />
          <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(7_11_18/0.75))]" />
          <span className="absolute inset-0 flex items-center justify-center">
            <PlayDisc />
          </span>
          <span className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
            <span className="block text-[0.9375rem] font-semibold text-white/80">{film.audience}</span>
            <span className="mt-1 block font-display text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium leading-tight tracking-[-0.02em]">{film.title}</span>
          </span>
        </button>
      )}
    </div>
  );
}

function Lightbox({ id, onClose }: { id: FilmId | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (id && el && !el.open) el.showModal();
  }, [id]);

  return (
    <dialog
      ref={dialog}
      aria-label={id ? films[id].title : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === dialog.current && onClose()}
      className="m-auto w-[min(72rem,calc(100vw-1.5rem))] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-[rgb(7_11_18/0.82)] backdrop:backdrop-blur-sm"
    >
      <AnimatePresence onExitComplete={() => dialog.current?.close()}>
        {id && (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ type: "spring", bounce: 0, visualDuration: 0.3 }}
          >
            <div className="mb-3 flex items-center justify-between gap-4 text-white">
              <p className="font-display text-lg font-medium tracking-[-0.01em]">{films[id].title}</p>
              <button type="button" onClick={onClose} className="inline-flex h-10 items-center gap-2 rounded-full bg-white/15 px-4 text-[0.9375rem] font-semibold hover:bg-white/25">
                Close
                <svg aria-hidden width="12" height="12" viewBox="0 0 12 12"><path d="M2 2l8 8M10 2 2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-[1.25rem] bg-black">
              <Player id={id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}

/** A grid of film cards; each opens the film in a modal player. */
export function FilmGallery({ ids, className }: { ids: FilmId[]; className?: string }) {
  const [open, setOpen] = useState<FilmId | null>(null);
  return (
    <>
      <ul data-reveal-stagger className={clsx("grid gap-4 sm:grid-cols-2", className)}>
        {ids.map((id) => {
          const film = films[id];
          return (
            <li key={id}>
              <button type="button" onClick={() => setOpen(id)} aria-label={`Play film: ${film.title}`} className="group block w-full text-left">
                <span className="relative block aspect-video overflow-hidden rounded-[1.25rem] bg-command-bg">
                  <Image src={film.poster} alt="" fill sizes="(min-width: 640px) 45vw, 100vw" className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-[1.04]" />
                  <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgb(7_11_18/0.55))]" />
                  <span className="absolute bottom-4 left-4">
                    <PlayDisc size="sm" />
                  </span>
                </span>
                <span className="mt-4 block text-[0.9375rem] font-semibold text-brand-600">{film.audience}</span>
                <span className="mt-1 block font-display text-[1.375rem] font-medium leading-snug tracking-[-0.015em]">{film.title}</span>
                <span className="mt-1 block text-[0.9375rem] text-ink-muted">{film.hook}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <Lightbox id={open} onClose={() => setOpen(null)} />
    </>
  );
}

/** An arrow pill that opens one film in the modal player. */
export function FilmButton({ id, children, className }: { id: FilmId; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={clsx("btn btn-arrow", className)}>
        {children}
      </button>
      <Lightbox id={open ? id : null} onClose={() => setOpen(false)} />
    </>
  );
}
