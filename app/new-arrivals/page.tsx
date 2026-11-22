import type { Metadata } from "next";

import { ProductGrid } from "@/components/storefront/product-grid";
import { PageHero } from "@/components/storefront/page-hero";
import { getStorefrontProducts, isUsingDemoCatalog } from "@/lib/catalog/storefront-products";

export const metadata: Metadata = { title: "Collection" };

export default async function NewArrivalsPage() {
  const products = await getStorefrontProducts({ type: "fish", newestFirst: true });
  const demoCatalog = isUsingDemoCatalog();

  return (
    <>
      <PageHero eyebrow="The collection" title="Find your fish." description="Fresh exact-fish listings, ordered from newest to oldest." image="/media/figma/nemo-galaxy.png" imageAlt="Nemo Galaxy HMPK betta" />
      <section className="catalog-page page-shell">
        {demoCatalog ? <div className="demo-notice"><strong>Preview</strong><span>Sample listings are shown until live inventory is connected.</span></div> : null}
        <ProductGrid products={products} />
      </section>
    </>
  );
}
