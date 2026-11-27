"use client";

import Image from "next/image";
import Link from "next/link";
import { Snail } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const categories = [
  { label: "Betta", text: "Discover marbled patterns, bright solids, and long, flowing fins.", image: "/media/catalog-red-blue-betta-cutout.png", href: "/collection?category=Bettas" },
  { label: "Aquariums", text: "Take a closer look at glass tanks and planted setups.", image: "/media/catalog/aquarium-1.png", href: "/collection?category=Aquariums" },
  { label: "Food", text: "Browse pellets and treats for your betta’s feeding routine.", image: "/media/catalog/food-1.png", href: "/collection?category=Food" },
  { label: "Snails", text: "Curious about snails for your aquarium? Ask us about availability.", image: "", href: "/contact" },
];

export function CategoryShowcase() {
  const [selected, setSelected] = useState(0);
  const previews = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panels = Array.from(previews.current?.querySelectorAll("article") ?? []);
    if (!panels.length) return;
    let frame = 0;

    function updateCategory() {
      frame = 0;
      const anchorOffset = Number.parseFloat(getComputedStyle(panels[0]).scrollMarginTop);
      const readingLine = Math.max(window.innerHeight * 0.5, anchorOffset + 2);
      let active = 0;
      for (const [index, panel] of panels.entries()) {
        if (panel.getBoundingClientRect().top <= readingLine) active = index;
      }
      setSelected(active);
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(updateCategory);
    }

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <section className="chapter showcase">
      <h2>A closer look<br />at every fin.</h2>
      <p>Meet the fish, then explore the little world around it.</p>
      <div className="explorer">
        <nav className="choices" aria-label="Explore by category">
          {categories.map(({ label }, index) => (
            <a key={label} href={`#showcase-${label.toLowerCase()}`} aria-current={index === selected ? "location" : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <div className="category-previews" ref={previews}>
          {categories.map(({ label, text, image, href }) => (
            <article key={label} id={`showcase-${label.toLowerCase()}`} className="preview-pane" aria-label={label}>
              {image ? (
                <Image src={image} alt={label} width={560} height={360} />
              ) : (
                <Snail size={130} strokeWidth={1} aria-hidden="true" />
              )}
              <p>{text}</p>
              <Link className="pill" href={href}>{image ? `Explore ${label}` : "Ask about snails"} ↗︎</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
