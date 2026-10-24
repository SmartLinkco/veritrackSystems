"use client";

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

/**
 * Cross-fades the page body when the route changes. Keyed by pathname so query-string and hash
 * updates (the estimator, the contact wizard) never trigger a page-wide transition.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
