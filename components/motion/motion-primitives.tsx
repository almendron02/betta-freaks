"use client";

import {
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

import { motionTokens } from "@/lib/motion-tokens";

const subscribeViewport = () => () => undefined;

const getLimitedSnapshot = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  return navigator.hardwareConcurrency <= 4;
};

const getServerLimitedSnapshot = () => false;
const PARALLAX_SCROLL_RANGE = 1000;

function useMotionCapability() {
  const prefersReduced = useReducedMotion();
  const limited = useSyncExternalStore(subscribeViewport, getLimitedSnapshot, getServerLimitedSnapshot);

  return { prefersReduced: Boolean(prefersReduced), limited };
}

export function Reveal({
  children,
  className,
  delay = 0,
  distance = "lg",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: keyof typeof motionTokens.distance;
}) {
  const { prefersReduced, limited } = useMotionCapability();
  const disabled = prefersReduced || limited;

  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={disabled ? undefined : { opacity: [0.72, 1], y: [motionTokens.distance[distance], 0] }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{
        duration: disabled ? motionTokens.duration.instant : motionTokens.duration.slow,
        delay: disabled ? 0 : delay,
        ease: motionTokens.easing.smooth,
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={false}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={prefersReduced ? undefined : { opacity: [0.78, 1], y: [motionTokens.distance.md, 0] }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
      whileTap={prefersReduced ? undefined : { scale: motionTokens.scale.press }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedHeading({
  text,
  id,
  className,
  as = "h1",
  inView = false,
}: {
  text: string;
  id?: string;
  className?: string;
  as?: "h1" | "h2";
  inView?: boolean;
}) {
  const { prefersReduced, limited } = useMotionCapability();
  const disabled = prefersReduced || limited;
  const words = text.split(" ");
  const MotionHeading = as === "h2" ? motion.h2 : motion.h1;

  return (
    <MotionHeading
      id={id}
      className={className}
      aria-label={text}
      initial={false}
    >
      {words.map((word, index) => (
        <span className="motion-word-mask" aria-hidden="true" key={`${word}-${index}`}>
          <motion.span
            className="motion-word"
            initial={false}
            animate={!inView && !disabled ? { opacity: [0.58, 1], y: ["52%", "0%"], filter: ["blur(7px)", "blur(0px)"] } : undefined}
            whileInView={inView && !disabled ? { opacity: [0.58, 1], y: ["52%", "0%"], filter: ["blur(7px)", "blur(0px)"] } : undefined}
            viewport={inView ? { once: true, amount: 0.5 } : undefined}
            transition={{ duration: motionTokens.duration.slow, delay: index * motionTokens.stagger.tight, ease: motionTokens.easing.smooth }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? <span aria-hidden="true">&nbsp;</span> : null}
        </span>
      ))}
    </MotionHeading>
  );
}

export function ParallaxMedia({
  children,
  className,
  distance = 24,
  mobileDistance = 7,
  rotation = 0,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  mobileDistance?: number;
  rotation?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { prefersReduced } = useMotionCapability();
  const narrow = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => undefined;
      const query = window.matchMedia("(max-width: 720px)");
      query.addEventListener("change", callback);
      return () => query.removeEventListener("change", callback);
    },
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches,
    () => false,
  );
  const travel = narrow ? mobileDistance : distance;

  useEffect(() => {
    if (prefersReduced) {
      if (ref.current) ref.current.style.transform = "none";
      return;
    }

    const updatePosition = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / PARALLAX_SCROLL_RANGE));
      const offset = -travel + (travel * 2 * progress);
      if (ref.current) ref.current.style.transform = `translate3d(0, ${offset}px, 0) rotate(${rotation}deg)`;
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => window.removeEventListener("scroll", updatePosition);
  }, [prefersReduced, rotation, travel]);

  return <motion.div ref={ref} className={className}>{children}</motion.div>;
}
