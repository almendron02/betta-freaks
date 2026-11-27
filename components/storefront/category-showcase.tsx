"use client";

import Image from "next/image";
import Link from "next/link";
import { Snail } from "lucide-react";
import { useState } from "react";

const categories = [
  { label: "Betta", text: "Discover marbled patterns, bright solids, and long, flowing fins.", image: "/media/catalog-red-blue-betta-cutout.png", href: "/collection?category=Bettas" },
  { label: "Aquariums", text: "Take a closer look at glass tanks and planted setups.", image: "/media/catalog/aquarium-1.png", href: "/collection?category=Aquariums" },
  { label: "Food", text: "Browse pellets and treats for your betta’s feeding routine.", image: "/media/catalog/food-1.png", href: "/collection?category=Food" },
  { label: "Snails", text: "Curious about snails for your aquarium? Ask us about availability.", image: "", href: "/contact" },
];

export function CategoryShowcase() {
  const [selected, setSelected] = useState(0);
  const current = categories[selected];
  return <section className="chapter showcase"><h2>A closer look<br/>at every fin.</h2><p>Meet the fish, then explore the little world around it.</p>
    <div className="explorer"><div className="choices" role="group" aria-label="Explore by category">{categories.map((category, i) =>
      <button key={category.label} aria-pressed={i === selected} aria-controls="category-preview" onClick={() => setSelected(i)}>
        <strong>{category.label}</strong>{i === selected && <span>{category.text}</span>}
      </button>)}</div>
      <div className="preview-pane" id="category-preview"><div key={current.label} className="preview-content">
        {current.image ? <Image src={current.image} alt={current.label} width={560} height={360}/> : <Snail size={130} strokeWidth={1} aria-hidden="true"/>}
        <Link className="pill" href={current.href}>{current.image ? 'Explore '+current.label : 'Ask about snails'} ↗︎</Link>
      </div></div>
    </div></section>;
}
