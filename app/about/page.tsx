import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/storefront/page-hero";

export const metadata: Metadata = { title: "Our Story" };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our story" title="About Betta Freaks" description="A U.S.-based betta shop focused on remarkable varieties and individually presented Betta splendens." image="/media/figma/about-betta.png" imageAlt="Blue and orange betta fish in profile" />
    <section className="about-project page-shell editorial-about">
      <div className="about-project-title">
        <span>ABOUT</span>
        <span>BETTA FREAKS</span>
      </div>
      <p className="about-project-copy">
        A U.S.-based betta shop and specialist breeder focused on selective
        breeding, remarkable varieties, and show-quality Betta splendens.
      </p>
      <div className="about-project-detail">
        <span>(OUR FOCUS)</span>
        <p>
          We breed, import, and select standout fish so every keeper can see the
          diversity of this hobby up close. Every live listing represents one
          exact fish.
        </p>
      </div>
      <nav className="project-roadmap" aria-label="Site roadmap">
        <Link href="/"><span>(01)</span><strong>Main page</strong></Link>
        <Link href="/new-arrivals"><span>(02)</span><strong>New fish</strong></Link>
        <Link href="/shipping"><span>(03)</span><strong>Shipping</strong></Link>
        <Link href="/cart"><span>(04)</span><strong>Bag</strong></Link>
      </nav>
    </section>
    </>
  );
}
