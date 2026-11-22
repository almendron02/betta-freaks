"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Delegation also covers cards rendered after a client-side navigation or data load.
const cards = "[data-tilt], .product-card, .auth-card, .metric-card, .account-panel, .owner-panel, .order-summary, .product-detail-media, .category-card";

export function CardMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active: HTMLElement | null = null;
    let bounds: DOMRect | null = null;
    let frame = 0;
    let x = 0;
    let y = 0;
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0;
      active?.style.removeProperty("--card-x");
      active?.style.removeProperty("--card-y");
      active = null; bounds = null;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduced.matches) { reset(); return; }
      const target = event.target instanceof Element ? event.target : null;
      const card = target?.closest<HTMLElement>(cards) ?? null;
      // Keep fields steady while the customer enters details.
      if (!card || card.contains(document.activeElement) || target?.closest("input, textarea, select")) { reset(); return; }
      if (active !== card) { reset(); active = card; bounds = card.getBoundingClientRect(); }
      if (!bounds) return;
      x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      if (!frame) frame = requestAnimationFrame(() => {
        active?.style.setProperty("--card-x", `${-y * 7}deg`);
        active?.style.setProperty("--card-y", `${x * 9}deg`);
        frame = 0;
      });
    };
    document.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", reset);
    document.addEventListener("focusin", reset);
    window.addEventListener("scroll", reset, true);
    window.addEventListener("blur", reset);
    reduced.addEventListener("change", reset);
    return () => {
      reset();
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      document.removeEventListener("focusin", reset);
      window.removeEventListener("scroll", reset, true);
      window.removeEventListener("blur", reset);
      reduced.removeEventListener("change", reset);
    };
  }, [pathname]);
  return null;
}
