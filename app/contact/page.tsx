import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/storefront/page-hero";
export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() {
  return <>
    <PageHero eyebrow="Get in touch / 02" title="Let’s talk fish." description="Questions about a specimen, preparing for arrival, or your next aquarium inhabitant? Start here." compact />
    <section className="contact-grid page-shell">
      <article className="contact-card" data-tilt><div className="card-label"><span>01 / Follow along</span><span>↗︎</span></div><h2>Find us on YouTube.</h2><p>Visit the Betta Freaks channel, or use the Instagram link on our channel to connect.</p><a className="button" href="https://youtube.com/@bettafreaks?si=5lZ2vU-DYELaxqvs" target="_blank" rel="noreferrer">Open YouTube ↗︎</a><small>A direct store contact address is not available yet.</small></article>
      <article className="contact-card" data-tilt><div className="card-label"><span>02 / Before you order</span><span>↗︎</span></div><h2>A little clarity.</h2><p>Read the care guidance and store policies before choosing your fish.</p><nav className="contact-links"><Link href="/faq">Frequently asked questions ↗︎</Link><Link href="/shipping">Shipping details ↗︎</Link><Link href="/live-arrival-guarantee">Live arrival guarantee ↗︎</Link></nav></article>
    </section>
  </>;
}
