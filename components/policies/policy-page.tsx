import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/storefront/page-hero";

export function PolicyPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={intro} compact />
      <section className="policy-section page-shell">
      <article className="policy-card editorial-content-card">
        <span className="eyebrow">{eyebrow}</span>
        <div className="policy-callout"><strong>Draft for owner review.</strong> These terms must be finalized before live checkout is enabled.</div>
        {children}
        <div className="policy-links"><Link className="button button-outline" href="/contact">Ask a question</Link><Link className="text-link" href="/#live-stock">Return to live stock</Link></div>
      </article>
      </section>
    </>
  );
}
