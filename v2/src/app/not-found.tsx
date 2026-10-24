import Link from "next/link";
import { Container } from "@/components/layout/Section";

export default function NotFound() {
  return (
    <div className="panel mt-3">
      <Container className="max-w-2xl py-28 text-center" stagger="enter">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-display font-light tracking-[-0.035em]">We couldn&apos;t find that page.</h1>
        <p className="mt-4 text-lg text-ink-muted">It may have moved when we rebuilt the site.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">Go home</Link>
          <Link href="/contact" className="btn btn-ghost">Contact us</Link>
        </div>
      </Container>
    </div>
  );
}
