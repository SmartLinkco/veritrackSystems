import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

/** On dark or blue grounds the navy mark sits on a white chip, since the artwork has no light version. */
export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link href="/" className={clsx("flex items-center gap-2.5", className)} aria-label="VeriTrack Systems home">
      <span className={clsx("flex shrink-0 items-center", inverted && "rounded-xl bg-white px-1.5 py-1")}>
        <Image src="/brand/logo.png" alt="" width={1399} height={965} className={inverted ? "h-7 w-auto" : "h-9 w-auto"} priority />
      </span>
      <span className="font-display text-[1.0625rem] font-semibold leading-none tracking-tight">
        VeriTrack<span className={clsx("ml-1 font-normal", inverted ? "text-white/70" : "text-ink-muted")}>Systems</span>
      </span>
    </Link>
  );
}
