import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/storefront/page-hero";
export const metadata: Metadata = { title: "Our Story" };
export default function AboutPage() {
  return <>
    <PageHero eyebrow="Our story / 01" title="A fascination with fins." description="A U.S.-based betta shop and specialist breeder. Remarkable varieties, individual character, and a shared love of Betta splendens." image="/media/figma/about-betta.png" imageAlt="Blue and orange betta fish in profile" />
    <section className="story-grid page-shell">
      <article className="story-card" data-tilt><div className="card-label"><span>01 / The individual</span><span>↗</span></div><div className="story-image"><Image src="/media/figma/nemo-galaxy.png" alt="Multicolor Nemo Galaxy betta" fill sizes="(max-width:720px) 90vw, 40vw" /></div><h2>One fish. Entirely its own.</h2><p>We breed, import, and select standout fish. Every live exact-fish listing shows the individual available to take home.</p></article>
      <article className="story-card" data-tilt><div className="card-label"><span>02 / The hobby</span><span>↗</span></div><div className="story-image"><Image src="/media/figma/super-red.png" alt="Crimson red betta fish" fill sizes="(max-width:720px) 90vw, 40vw" /></div><h2>Selected with intention.</h2><p>Selective breeding, distinctive colors, and clear specimen details bring the diversity of this hobby into focus.</p><Link className="text-link" href="/new-arrivals">Explore the collection ↗</Link></article>
    </section>
  </>;
}
