import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatUsd } from "@/lib/commerce/money";
import Image from "next/image";
import Link from "next/link";
import { aquariumImages, foodImages, displayItemProduct } from "@/lib/catalog/display-items";
import type { Metadata } from "next";

import { ProductGrid } from "@/components/storefront/product-grid";
import { PageHero } from "@/components/storefront/page-hero";
import { getStorefrontProducts, isUsingDemoCatalog } from "@/lib/catalog/storefront-products";

export const metadata: Metadata = { title: "Collection" };

export default async function NewArrivalsPage({ searchParams }: PageProps<"/new-arrivals">) {
  const params = await searchParams;
  const category = ["bettas", "aquariums", "food"].includes(String(params.category)) ? String(params.category) : "all";
  const products = await getStorefrontProducts({ type: "fish", newestFirst: true });
  const demoCatalog = isUsingDemoCatalog();

  return (
    <>
      <PageHero eyebrow="The collection" title="The collection." description="Explore bettas, aquariums, and food." compact />
      <section className="catalog-page page-shell">
        {demoCatalog ? <div className="demo-notice"><strong>Preview</strong><span>Sample listings are shown until live inventory is connected.</span></div> : null}
        <nav className="collection-filters" aria-label="Collection category">{["all", "bettas", "aquariums", "food"].map(value => <Link href={`/new-arrivals?category=${value}`} key={value} aria-current={category === value ? "page" : undefined}>{value[0].toUpperCase() + value.slice(1)}</Link>)}</nav>
        {(category === "all" || category === "bettas") && <ProductGrid products={products} />}
        {(category === "all" || category === "aquariums" || category === "food") && <div className="product-grid display-products">{[...(category !== "food" ? aquariumImages : []), ...(category !== "aquariums" ? foodImages : [])].map(item => <article className="product-card" key={item.src}><div className="card-label"><span>{item.name}</span><span>Preview</span></div><div className="product-image-frame"><Image src={item.src} alt={item.alt} fill sizes="(max-width:720px) 100vw, 33vw" style={{objectFit:"contain"}} /></div><div className="product-card-body"><div className="card-facts"><span>Sample price</span><span>{formatUsd(item.priceCents)}</span></div><AddToCartButton product={displayItemProduct(item)} compact /></div></article>)}</div>}
      </section>
    </>
  );
}
