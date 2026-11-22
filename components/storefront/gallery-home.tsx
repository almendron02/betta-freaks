"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sampleProducts } from "@/lib/catalog/sample-products";
import "./gallery-home.css";

const pictures = [
  ...sampleProducts.map((p) => ({ src: p.image, alt: p.imageAlt, name: p.shortName })),
  { src: "/media/figma/about-betta.png", alt: "Blue and orange betta in profile", name: "Color in motion" },
  { src: "/media/figma/hero-betta-v2.png", alt: "Multicolor betta fish", name: "One of a kind" },
  { src: "/media/red-betta-showcase.jpg", alt: "Red betta with flowing fins", name: "The art of the betta" },
];
const step = 360 / pictures.length;

export function GalleryHome() {
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const target = useRef(0);
  const rotation = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastIndex = 0;
    let previousY = 0;
    let previousX = 0;
    let dragging = false;
    const pointer = { x: 0, y: 0 };
    const easedPointer = { x: 0, y: 0 };
    const draw = () => {
      easedPointer.x += (pointer.x - easedPointer.x) * 0.11;
      easedPointer.y += (pointer.y - easedPointer.y) * 0.11;
      element.style.setProperty("--portrait-x", `${-easedPointer.y * 12}deg`);
      element.style.setProperty("--portrait-y", `${easedPointer.x * 15}deg`);
      element.style.setProperty("--reel-y", `${easedPointer.y * 80}px`);
      rotation.current += (target.current - rotation.current) * (reduced.matches ? 1 : 0.085);
      if (Math.abs(target.current - rotation.current) < 0.01) rotation.current = target.current;
      ring.current?.style.setProperty("--rotation", `${rotation.current}deg`);
      const index = ((Math.round(-rotation.current / step) % pictures.length) + pictures.length) % pictures.length;
      if (index !== lastIndex) { lastIndex = index; setActive(index); }
      const moving = Math.abs(target.current - rotation.current) > 0.01
        || Math.abs(pointer.x - easedPointer.x) > 0.001
        || Math.abs(pointer.y - easedPointer.y) > 0.001;
      frame = moving ? requestAnimationFrame(draw) : 0;
    };
    const move = (amount: number) => {
      target.current += amount;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const followPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduced.matches) return;
      pointer.x = Math.max(-1, Math.min(1, event.clientX / window.innerWidth * 2 - 1));
      pointer.y = Math.max(-1, Math.min(1, event.clientY / window.innerHeight * 2 - 1));
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const resetPointer = () => {
      pointer.x = 0; pointer.y = 0;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    window.addEventListener("pointermove", followPointer);
    document.documentElement.addEventListener("pointerleave", resetPointer);
    window.addEventListener("blur", resetPointer);
    reduced.addEventListener("change", resetPointer);
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || (event.target as HTMLElement).closest(".gallery-menu")) return;
      event.preventDefault();
      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      move(-Math.max(-160, Math.min(160, delta * (event.deltaMode === 1 ? 16 : 1))) * 0.12);
    };
    const down = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest("a, button")) return;
      event.preventDefault();
      element.focus({ preventScroll: true });
      dragging = true; previousY = event.clientY; previousX = event.clientX;
      element.setPointerCapture(event.pointerId);
    };
    const drag = (event: PointerEvent) => {
      if (!dragging) return;
      const x = event.clientX - previousX;
      const y = event.clientY - previousY;
      move((Math.abs(x) > Math.abs(y) ? x : y) * 0.3);
      previousY = event.clientY; previousX = event.clientX;
    };
    const up = () => { dragging = false; target.current = Math.round(target.current / step) * step; if (!frame) frame = requestAnimationFrame(draw); };
    window.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", drag);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    const key = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest("a, button, input, textarea")) return;
      if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) {
        event.preventDefault(); move(["ArrowRight", "ArrowDown", "PageDown"].includes(event.key) ? -step : step);
      }
    };
    element.addEventListener("keydown", key);
    const select = (event: Event) => { target.current = Math.round(target.current / step) * step + (event as CustomEvent<number>).detail; if (!frame) frame = requestAnimationFrame(draw); };
    element.addEventListener("gallery-step", select);
    return () => {
      cancelAnimationFrame(frame);
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

  const advance = (direction: number) => stage.current?.dispatchEvent(new CustomEvent("gallery-step", { detail: direction * step }));
  return (
    <section className="gallery-home" aria-label="Betta Freaks photo gallery">
      <div className="gallery-stage" ref={stage} tabIndex={0} aria-roledescription="carousel" aria-label="Fish gallery. Scroll, swipe, or use arrow keys to rotate.">
        <div className="gallery-perspective">
          <div className="gallery-feature">
        <div className="gallery-backdrop" aria-hidden="true">
          {pictures.map((picture, i) => <Image key={picture.src} src={picture.src} alt="" fill sizes="100vw" priority={i === 0} className={i === active ? "is-active" : ""} />)}
        </div>
        <div className="gallery-caption"><span>{pictures[active].name}</span><Link href="/new-arrivals">View collection ↗</Link></div>
          </div>
          <div className="gallery-ring" ref={ring} aria-hidden="true">
            {pictures.map((picture, i) => <div className="gallery-panel" key={picture.src} style={{ transform: `rotateY(${i * step}deg) translateZ(var(--radius))` }}><Image src={picture.src} alt="" fill sizes="240px" /></div>)}
          </div>
        </div>
        <div className="gallery-controls">
          <button onClick={() => advance(1)} aria-label="Previous photo">←</button>
          <span aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, "0")} / {String(pictures.length).padStart(2, "0")}</span>
          <button onClick={() => advance(-1)} aria-label="Next photo">→</button>
        </div>
      </div>
      <div className="gallery-bottom-note"><span>Selected with intention.</span><span>Scroll to explore ↕</span></div>
      <h1 className="gallery-sr-only">Betta Freaks — individually selected betta fish</h1>
    </section>
  );
}
