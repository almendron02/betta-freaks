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
  const sidebar = useRef<HTMLDivElement>(null);
  const previews = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panels = Array.from(previews.current?.querySelectorAll("article") ?? []);
    if (!panels.length) return;
    let frame = 0;

    function updateCategory() {
      frame = 0;
      const anchorOffset = Number.parseFloat(getComputedStyle(panels[0]).scrollMarginTop);
      const viewportBottom = document.documentElement.clientHeight;
      const viewportTop = Math.min(anchorOffset, viewportBottom * 0.8);
      let active = 0;
      let mostVisible = 0;

      for (const [index, panel] of panels.entries()) {
        const { top, bottom } = panel.getBoundingClientRect();
        const visible = Math.min(bottom, viewportBottom) - Math.max(top, viewportTop);
        if (visible > mostVisible) {
          mostVisible = visible;
          active = index;
        } else if (mostVisible === 0 && bottom <= viewportTop) {
          active = index;
        }
      }

      setSelected(active);
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(updateCategory);
    }

    const column = sidebar.current;
    const observer = new ResizeObserver(() => {
      if (column) column.parentElement?.style.setProperty("--sidebar-height", `${column.offsetHeight}px`);
      scheduleUpdate();
    });
    if (column) observer.observe(column);

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      observer.disconnect();
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
        <div className="showcase-sidebar" ref={sidebar}>
          <h2>40+ Items to explore in our store. Expand your collection today.</h2>
          <nav className="choices" aria-label="Explore by category">
            {categories.map(({ label, text }, index) => (
              <div className="category-choice" key={label}>
                <a href={`#showcase-${label.toLowerCase()}`} aria-current={index === selected ? "location" : undefined}>
                  {label}
                </a>
                {index === selected && <p>{text}</p>}
              </div>
            ))}
          </nav>
        </div>
        <div className="category-previews" ref={previews}>
          {categories.map(({ label, image, href }) => (
            <article key={label} id={`showcase-${label.toLowerCase()}`} className="preview-pane" aria-label={label}>
              {image ? (
                <Image src={image} alt={label} width={560} height={360} />
              ) : (
                <Snail size={130} strokeWidth={1} aria-hidden="true" />
              )}
              <Link className="pill" href={href}>{image ? `Explore ${label}` : "Ask about snails"} ↗︎</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
