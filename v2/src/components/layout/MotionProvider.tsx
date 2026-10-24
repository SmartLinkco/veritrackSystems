"use client";

import { MotionConfig } from "motion/react";

/** One place to honour the visitor's reduced-motion setting for every Motion component. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
