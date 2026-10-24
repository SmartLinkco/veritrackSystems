import Image from "next/image";
import clsx from "clsx";

type CommandFrameProps = {
  children?: React.ReactNode;
  title?: string;
  glow?: boolean;
  image?: { src: string; alt: string; width: number; height: number };
  priority?: boolean;
  className?: string;
  sizes?: string;
};

/** Dark product chrome around screenshots (blueprint §6.2 / §14.1). */
export function CommandFrame({ children, title, glow, image, priority, className, sizes = "(min-width: 1024px) 50vw, 100vw" }: CommandFrameProps) {
  return (
    <figure
      className={clsx(
        "overflow-hidden rounded-2xl border border-command-border bg-command-surface shadow-2xl shadow-ink/20",
        glow && "ring-1 ring-signal/40 shadow-[0_0_0_1px_var(--color-signal-dim),0_30px_80px_-20px_rgb(0_230_118/0.25)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-command-border px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-command-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-command-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-command-border" />
        {title && <figcaption className="ml-2 truncate font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-command-muted">{title}</figcaption>}
      </div>
      {image && (
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} priority={priority} className="block h-auto w-full" />
      )}
      {children}
    </figure>
  );
}

export function PhoneFrame({ image, className, priority }: { image: { src: string; alt: string; width: number; height: number }; className?: string; priority?: boolean }) {
  return (
    <div className={clsx("rounded-[2.25rem] border border-command-border bg-command-bg p-2 shadow-2xl shadow-ink/30", className)}>
      <div className="overflow-hidden rounded-[1.75rem]">
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="240px" priority={priority} className="block h-auto w-full" />
      </div>
    </div>
  );
}
