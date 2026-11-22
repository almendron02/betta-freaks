import Image from "next/image";
import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, description, image, imageAlt = "", actions, compact = false }: {
  eyebrow: string; title: string; description: string; image?: string; imageAlt?: string; actions?: ReactNode; compact?: boolean;
}) {
  return <section className={`page-intro page-shell${compact ? " page-intro-compact" : ""}`}>
    <div className="page-intro-copy">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      {actions && <div className="page-intro-actions">{actions}</div>}
    </div>
    {image && <figure className="intro-specimen" data-tilt>
      <figcaption><span>Betta splendens</span><span>↗</span></figcaption>
      <div><Image src={image} alt={imageAlt} fill loading="eager" sizes="(max-width: 720px) 70vw, 24vw" /></div>
    </figure>}
  </section>;
}
