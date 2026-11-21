import { ArrowLeft, PackageOpen } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/storefront/page-hero";

export function ComingSoonCategory({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} compact />
      <section className="catalog-page page-shell">
        <div className="empty-state">
          <PackageOpen size={30} />
          <h2>Inventory is being prepared.</h2>
          <p>This category is part of the store structure and will open when the owner publishes its first products.</p>
          <Link className="button button-outline" href="/new-arrivals"><ArrowLeft size={16} /> Browse new fish</Link>
        </div>
      </section>
    </>
  );
}
