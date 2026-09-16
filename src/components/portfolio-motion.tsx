"use client";

import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

function useMotionEnabled() {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  // Keep the server and first client render identical before reading device preferences.
  useEffect(() => setMounted(true), []);
  return mounted && reducedMotion === false;
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const motionEnabled = useMotionEnabled();

  return (
    <motion.div ref={ref} className={className} initial={false}
      animate={{ y: inView || !motionEnabled ? 0 : 20 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function Parallax({ children, className, distance = 40 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div className="parallax-layer" style={{ y: motionEnabled ? y : 0 }}>{children}</motion.div>
    </div>
  );
}
