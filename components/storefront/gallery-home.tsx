"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { sampleProducts } from "@/lib/catalog/sample-products";
import "./gallery-home.css";

const pictures = [
  ...sampleProducts.map((p) => ({ src: p.image, alt: p.imageAlt, name: p.shortName })),
  { src: "/media/figma/about-betta.png", alt: "Blue and orange betta in profile", name: "Color in motion" },
  { src: "/media/figma/hero-betta-v2.png", alt: "Multicolor betta fish", name: "One of a kind" },
  { src: "/media/red-betta-showcase.jpg", alt: "Red betta with flowing fins", name: "The art of the betta" },
];
const wrap = (value: number, length: number) => ((value % length) + length) % length;

export function GalleryHome() {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let target = 0;
    let position = 0;
    let lastIndex = 0;
    let pitch = 400;
    let dragging = false;
    let previousX = 0;
    let previousY = 0;
    const pointer = { x: 0, y: 0, presence: 0 };
    const eased = { x: 0, y: 0, presence: 0 };

    const draw = () => {
      const smoothing = reduced.matches ? 1 : 0.1;
      position += (target - position) * smoothing;
      if (Math.abs(target - position) < 0.0001) position = target;
      for (const axis of ["x", "y", "presence"] as const) eased[axis] += (pointer[axis] - eased[axis]) * smoothing;
      const viewport = element.clientWidth;
      const lift = reduced.matches ? 0 : eased.y * 65;
      cards.current.forEach((card, index) => {
        if (!card) return;
        // Recycle each card beyond the viewport; the track has no beginning or end.
        const distance = wrap(index - position + pictures.length / 2, pictures.length) - pictures.length / 2;
        const x = distance * pitch;
        const proximity = Math.max(0, 1 - Math.abs(x) / (viewport * 0.7));
        const scale = 0.87 + 0.13 * proximity;
        const tiltY = reduced.matches ? 0 : Math.max(-1, Math.min(1, (eased.x * viewport / 2 - x) / pitch)) * 14 * eased.presence;
        const tiltX = reduced.matches ? 0 : -eased.y * 11;
        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${lift}px, 0) perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
        card.style.zIndex = String(Math.round(proximity * 10));
      });
      const index = wrap(Math.round(position), pictures.length);
      if (index !== lastIndex) { lastIndex = index; setActive(index); }
      const moving = Math.abs(target - position) > 0.0001 || (["x", "y", "presence"] as const).some(axis => Math.abs(pointer[axis] - eased[axis]) > 0.001);
      frame = moving ? requestAnimationFrame(draw) : 0;
      // Keep values bounded even after many trips around the carousel.
      if (!moving) { const loops = Math.trunc(position / pictures.length) * pictures.length; position -= loops; target -= loops; }
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const resize = () => {
      const card = cards.current[0];
      if (card) pitch = card.offsetWidth + parseFloat(getComputedStyle(element).getPropertyValue("--carousel-gap"));
      wake();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    const move = (amount: number) => { target += amount; wake(); };
    const followPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduced.matches) return;
      pointer.x = Math.max(-1, Math.min(1, event.clientX / window.innerWidth * 2 - 1));
      pointer.y = Math.max(-1, Math.min(1, event.clientY / window.innerHeight * 2 - 1));
      pointer.presence = 1;
      wake();
    };
    const resetPointer = () => { pointer.x = 0; pointer.y = 0; pointer.presence = 0; wake(); };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || (event.target as HTMLElement).closest(".gallery-menu")) return;
      event.preventDefault();
      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1;
      move(Math.max(-240, Math.min(240, delta * multiplier)) / pitch);
    };
    const down = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest("a, button")) return;
      event.preventDefault();
      element.focus({ preventScroll: true });
      dragging = true; previousX = event.clientX; previousY = event.clientY;
      element.setPointerCapture(event.pointerId);
    };
    const drag = (event: PointerEvent) => {
      if (!dragging) return;
      const x = event.clientX - previousX;
      const y = event.clientY - previousY;
      move(-(Math.abs(x) > Math.abs(y) ? x : y) / pitch);
      previousX = event.clientX; previousY = event.clientY;
    };
    const up = () => { if (!dragging) return; dragging = false; target = Math.round(target); wake(); };
    const key = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest("a, button, input, textarea")) return;
      if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) {
        event.preventDefault(); move(["ArrowRight", "ArrowDown", "PageDown"].includes(event.key) ? 1 : -1);
      }
    };
    const select = (event: Event) => { target = Math.round(target) + (event as CustomEvent<number>).detail; wake(); };
    window.addEventListener("pointermove", followPointer);
    document.documentElement.addEventListener("pointerleave", resetPointer);
    window.addEventListener("blur", resetPointer);
    reduced.addEventListener("change", resetPointer);
    window.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", drag);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("keydown", key);
    element.addEventListener("gallery-step", select);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener("pointermove", followPointer);
      document.documentElement.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("blur", resetPointer);
      reduced.removeEventListener("change", resetPointer);
      window.removeEventListener("wheel", wheel);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", drag);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      element.removeEventListener("keydown", key);
      element.removeEventListener("gallery-step", select);
    };
  }, []);

  const advance = (direction: number) => stage.current?.dispatchEvent(new CustomEvent("gallery-step", { detail: direction }));
  return (
    <section className="gallery-home" aria-label="Betta Freaks photo gallery">
      <div className="gallery-stage" ref={stage} tabIndex={0} aria-roledescription="carousel" aria-label="Fish gallery. Scroll, swipe, or use arrow keys to explore.">
        {pictures.map((picture, i) => (
          <article className="carousel-card" key={picture.src} ref={node => { cards.current[i] = node; }}
            style={{ "--slot": i < pictures.length / 2 ? i : i - pictures.length } as CSSProperties}
            aria-roledescription="slide" aria-label={`${i + 1} of ${pictures.length}: ${picture.name}`}>
            <div className="carousel-caption"><span>{picture.name}</span><Link href="/new-arrivals" tabIndex={active === i ? 0 : -1} aria-label={`View collection — ${picture.name}`}>View collection ↗</Link></div>
            <div className="carousel-image"><Image src={picture.src} alt={picture.alt} fill sizes="(max-width: 600px) 70vw, 380px" priority={i === 0} draggable={false} /></div>
          </article>
        ))}
        <div className="gallery-controls">
          <button onClick={() => advance(-1)} aria-label="Previous photo">←</button>
          <span aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, "0")} / {String(pictures.length).padStart(2, "0")}</span>
          <button onClick={() => advance(1)} aria-label="Next photo">→</button>
        </div>
      </div>
      <div className="gallery-bottom-note"><span>Selected with intention.</span><span>Scroll or drag to explore ↔</span></div>
      <h1 className="gallery-sr-only">Betta Freaks — individually selected betta fish</h1>
    </section>
  );
}
