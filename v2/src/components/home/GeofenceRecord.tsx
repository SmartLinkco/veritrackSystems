"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const FENCE_M = 50;
const MAP = 220; // px, square
const RING = 78; // px radius drawn for the 50 m fence
const PX_PER_M = RING / FENCE_M;
const START = { x: 22, y: -18 }; // ≈ 18 m north-east of the branch pin
const HALF = MAP / 2 - 26; // keeps the whole photo pin inside the rounded map
const MAX_M = Math.round(Math.hypot(HALF, HALF) / PX_PER_M);

function accraTime(d: Date) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Accra", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(d);
}

/**
 * A working copy of the staff check-in record. Drag the staff pin (or use the arrow keys) and the
 * record is accepted or refused against the branch's 50 m geofence, as the portal does.
 */
export function GeofenceRecord() {
  const [pin, setPin] = useState(START);
  const [time, setTime] = useState("15:02:37");
  const [dragging, setDragging] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => setTime(accraTime(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const meters = Math.round(Math.hypot(pin.x, pin.y) / PX_PER_M);
  const inside = meters <= FENCE_M;
  const clamp = (v: number) => Math.max(-HALF, Math.min(HALF, v));

  function moveTo(clientX: number, clientY: number) {
    const r = mapRef.current?.getBoundingClientRect();
    if (!r) return;
    setPin({ x: clamp(clientX - r.left - r.width / 2), y: clamp(clientY - r.top - r.height / 2) });
  }

  function onKey(e: React.KeyboardEvent) {
    const step = e.shiftKey ? 24 : 8;
    const d: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const m = d[e.key];
    if (!m) return;
    e.preventDefault();
    setPin((p) => ({ x: clamp(p.x + m[0]), y: clamp(p.y + m[1]) }));
  }

  return (
    <div data-ui className="w-full max-w-[35rem] rounded-[1.5rem] bg-white p-5 text-ink shadow-[0_30px_60px_-24px_rgb(7_11_18/0.55)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p
          aria-live="polite"
          className={clsx(
            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.9375rem] font-semibold transition-colors duration-200",
            inside ? "bg-[#d9fbe9] text-[#05603a]" : "bg-[#fdecd8] text-[#9a3412]",
          )}
        >
          <span className={clsx("h-2.5 w-2.5 rounded-full", inside ? "bg-signal-deep" : "bg-[#ea580c]")} />
          {inside ? "Check-in confirmed" : "Check-in refused"}
        </p>
        <p className="tnum text-[0.9375rem] text-ink-muted">
          Accra <span className="font-semibold text-ink">{time}</span>
        </p>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
        <div
          ref={mapRef}
          role="slider"
          tabIndex={0}
          aria-label="Staff position relative to the branch pin. Use the arrow keys to move it."
          aria-valuemin={0}
          aria-valuemax={MAX_M}
          aria-valuenow={meters}
          aria-valuetext={`${meters} metres from the branch pin, ${inside ? "inside" : "outside"} the 50 metre geofence`}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragging(true);
            moveTo(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => dragging && moveTo(e.clientX, e.clientY)}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          className="relative mx-auto touch-none select-none overflow-hidden rounded-2xl bg-[#e8eff8] sm:mx-0"
          style={{ width: MAP, height: MAP, cursor: dragging ? "grabbing" : "grab" }}
        >
          {/* The 50 m geofence around the branch pin. */}
          <span
            className={clsx("absolute rounded-full transition-colors duration-200", inside ? "bg-brand-600/15" : "bg-brand-600/8")}
            style={{ width: RING * 2, height: RING * 2, left: MAP / 2 - RING, top: MAP / 2 - RING, border: "3px solid var(--color-brand-600)" }}
          />
          <span className="absolute h-3 w-3 rounded-full bg-brand-600" style={{ left: MAP / 2 - 6, top: MAP / 2 - 6 }} />
          <span
            className={clsx("absolute h-9 w-9 overflow-hidden rounded-full transition-[box-shadow] duration-200", inside ? "ring-4 ring-signal" : "ring-4 ring-[#ea580c]")}
            style={{ left: MAP / 2 - 18 + pin.x, top: MAP / 2 - 18 + pin.y }}
          >
            <Image src="/team/stephen.jpg" alt="" width={72} height={72} className="h-full w-full object-cover" draggable={false} />
          </span>
          <span className="pointer-events-none absolute bottom-2 left-3 text-[0.8125rem] font-semibold text-brand-700">50 m</span>
        </div>

        <dl className="grid gap-3 text-[0.9375rem]">
          <Row label="Staff" value="Stephen Gyan · IT-0002" />
          <Row label="Branch" value="Demo Office, Accra" />
          <Row
            label="Distance"
            value={inside ? `${meters} m from the branch pin` : `${meters} m away, limit is ${FENCE_M} m`}
            tone={inside ? undefined : "warn"}
          />
          <Row label="Photo" value="Live capture, liveness passed" />
          <Row label="Record" value={inside ? "Saved and sent to the branch admin" : "Not saved. Staff is asked to move closer"} tone={inside ? "ok" : "warn"} />
        </dl>
      </div>
      <p className="mt-4 text-[0.9375rem] text-ink-muted">
        {inside ? "Drag the photo pin outside the ring to see a refusal." : "Drag it back inside the ring and the check-in goes through."}
      </p>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className={clsx("tnum font-semibold", tone === "ok" && "text-[#05603a]", tone === "warn" && "text-[#9a3412]")}>{value}</dd>
    </div>
  );
}
