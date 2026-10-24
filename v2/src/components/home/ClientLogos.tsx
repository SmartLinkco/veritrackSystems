import clsx from "clsx";
import { clientLogos } from "@/lib/content";

function LogoGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className={clsx("logo-marquee-group flex shrink-0 items-center gap-14 pr-14 sm:gap-20 sm:pr-20", hidden && "logo-marquee-copy")}>
      {clientLogos.map((l) => (
        <li key={l.name} className="shrink-0">
          {/* Cloudinary already resizes and picks the format, so a plain img avoids a second optimisation pass. Not lazy: logos waiting
              off-screen inside the clipped track would only start loading as they slid in. All sixteen come to under 100 KB. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l.src} alt={hidden ? "" : l.name} width={l.width} height={l.height} fetchPriority="low" decoding="async" className="h-12 w-auto max-w-[10rem] object-contain sm:h-14" />
        </li>
      ))}
    </ul>
  );
}

/** Client logos drifting in an endless loop: two identical groups slide by one group's width, then repeat. Pauses on hover. */
export function ClientLogos({ className }: { className?: string }) {
  return (
    <div className={clsx("logo-marquee overflow-hidden", className)}>
      <div className="logo-marquee-track flex w-max">
        <LogoGroup />
        <LogoGroup hidden />
      </div>
    </div>
  );
}
