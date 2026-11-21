import type { Metadata } from "next";
import { PageHero } from "@/components/storefront/page-hero";

export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Customer care" title="Contact" description="Questions about a fish, an order, or preparing for arrival can start here." compact />
    <section className="auth-section page-shell editorial-form-section">
      <div className="auth-card">
        <span className="eyebrow">Betta Freaks</span><h1>Contact</h1>
        <p>The production contact destination will be added before launch. For now, visit the Betta Freaks YouTube channel and follow the Instagram link listed there.</p>
        <a className="button button-coral" href="https://youtube.com/@bettafreaks?si=5lZ2vU-DYELaxqvs" target="_blank" rel="noreferrer">Open YouTube</a>
      </div>
    </section>
    </>
  );
}
