import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() {
  return (
    <section className="auth-section page-shell">
      <div className="auth-card">
        <span className="eyebrow">Betta Freaks</span><h1>Contact</h1>
        <p>The production contact destination will be added before launch. For now, visit the Betta Freaks YouTube channel and follow the Instagram link listed there.</p>
        <a className="button button-coral" href="https://youtube.com/@bettafreaks?si=5lZ2vU-DYELaxqvs" target="_blank" rel="noreferrer">Open YouTube</a>
      </div>
    </section>
  );
}
