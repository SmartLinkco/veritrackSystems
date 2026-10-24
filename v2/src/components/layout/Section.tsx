import clsx from "clsx";

type Stagger = "enter" | "reveal";

/** `stagger` brings the children in one after another: "enter" on first paint (heroes), "reveal" on scroll. */
export function Container({ id, className, stagger, children }: { id?: string; className?: string; stagger?: Stagger; children: React.ReactNode }) {
  return (
    <div
      id={id}
      className={clsx("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      data-enter-stagger={stagger === "enter" ? "" : undefined}
      data-reveal-stagger={stagger === "reveal" ? "" : undefined}
    >
      {children}
    </div>
  );
}

type SectionProps = {
  id?: string;
  tone?: "default" | "elevated" | "command";
  /** "panel" is a rounded card on the blue frame; "bleed" sits straight on the frame. */
  variant?: "panel" | "bleed";
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function Section({ id, tone = "default", variant = "panel", className, containerClassName, children, ...rest }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={rest["aria-label"]}
      aria-labelledby={rest["aria-labelledby"]}
      className={clsx(
        "py-20 sm:py-24",
        variant === "panel" ? "panel" : "bleed on-frame",
        variant === "panel" && tone === "elevated" && "panel-elevated",
        tone === "command" && "theme-command",
        className,
      )}
    >
      <Container className={containerClassName} stagger="reveal">{children}</Container>
    </section>
  );
}

/** A panel without the Section padding or container, for layouts that manage their own. */
export function Panel({ id, tone = "default", className, children, ...rest }: Omit<SectionProps, "variant" | "containerClassName">) {
  return (
    <section
      id={id}
      aria-label={rest["aria-label"]}
      aria-labelledby={rest["aria-labelledby"]}
      className={clsx("panel", tone === "elevated" && "panel-elevated", tone === "command" && "theme-command", className)}
    >
      {children}
    </section>
  );
}

/** `eyebrow` is accepted for older call sites but no longer rendered: the heading carries the information. */
export function SectionHeading({
  id,
  title,
  lead,
  align = "left",
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={clsx("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <h2 id={id} className="text-3xl sm:text-4xl">
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg text-ink-muted [.theme-command_&]:text-command-muted">{lead}</p>}
    </div>
  );
}
