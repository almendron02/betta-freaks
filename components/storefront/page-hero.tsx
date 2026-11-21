import Image from "next/image";
import type { ReactNode } from "react";

import { AnimatedHeading, ParallaxMedia } from "@/components/motion/motion-primitives";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  actions,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  actions?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`editorial-page-hero${compact ? " editorial-page-hero-compact" : ""}`}>
      <div className="page-shell editorial-page-hero-inner">
        <div className="editorial-page-hero-copy">
          <span className="showroom-eyebrow">{eyebrow}</span>
          <AnimatedHeading text={title} />
          <p>{description}</p>
          {actions ? <div className="editorial-page-hero-actions">{actions}</div> : null}
        </div>
        {image ? (
          <ParallaxMedia className="editorial-page-hero-specimen" distance={32} mobileDistance={7}>
            <span className="editorial-page-hero-image">
              <Image src={image} alt={imageAlt} fill sizes="(max-width: 720px) 62vw, 28vw" />
            </span>
            <span>Individually selected</span>
          </ParallaxMedia>
        ) : (
          <div>
            <div className="editorial-page-hero-mark" aria-hidden="true">
              <span>BF</span>
              <small>Est. for the hobby</small>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
