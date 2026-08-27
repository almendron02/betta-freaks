import type { Metadata } from "next";

import { ProductGrid } from "@/components/storefront/product-grid";
import { getStorefrontProducts, isUsingDemoCatalog } from "@/lib/catalog/storefront-products";

export const metadata: Metadata = { title: "New Arrivals" };

export default async function NewArrivalsPage() {
  const products = await getStorefrontProducts({ type: "fish", newestFirst: true });
  const demoCatalog = isUsingDemoCatalog();

  return (
    <>
      <section className="page-hero">
        <div className="page-shell page-hero-grid">
          <div><span className="eyebrow">Recently listed</span><h1>NEW FISH</h1></div>
          <p>Fresh exact-fish listings, ordered from newest to oldest.</p>
        </div>
      </section>
      <section className="catalog-page page-shell">
        {demoCatalog ? <div className="demo-notice"><strong>Preview</strong><span>Sample listings are shown until live inventory is connected.</span></div> : null}
        <ProductGrid products={products} />
      </section>
    </>
  );
}
