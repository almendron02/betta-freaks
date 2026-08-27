import Link from "next/link";
import type { ReactNode } from "react";

export function PolicyPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <section className="policy-section page-shell">
      <article className="policy-card">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
        <div className="policy-callout"><strong>Draft for owner review.</strong> These terms must be finalized before live checkout is enabled.</div>
        {children}
        <div className="policy-links"><Link className="button button-outline" href="/contact">Ask a question</Link><Link className="text-link" href="/#live-stock">Return to live stock</Link></div>
      </article>
    </section>
  );
}
