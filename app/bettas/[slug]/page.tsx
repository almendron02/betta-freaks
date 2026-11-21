import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { getStorefrontProductBySlug } from "@/lib/catalog/storefront-products";
import { formatUsd } from "@/lib/commerce/money";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getStorefrontProductBySlug((await params).slug);
  return product
    ? { title: product.name, description: product.description }
    : { title: "Fish not found" };
}

export default async function ProductPage({ params }: Props) {
  const product = await getStorefrontProductBySlug((await params).slug);
  if (!product) notFound();

  return (
    <>
      <article className="product-detail page-shell">
        <div className="product-gallery">
          <div className="product-thumbnails" aria-label="Product image">
            <div className="product-thumbnail product-thumbnail-active">
              <Image src={product.image} alt="" fill sizes="96px" />
            </div>
            <span>(01)</span>
          </div>
          <div className="product-detail-media">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              preload
              sizes="(max-width: 760px) 100vw, 52vw"
              style={{ objectPosition: product.imagePosition ?? "50% 50%" }}
            />
            <span className="media-badge">Exact fish</span>
            {product.isDemo ? <span className="demo-badge">Preview</span> : null}
          </div>
        </div>

        <div className="product-detail-copy">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/new-arrivals">New fish</Link><span>/</span><span>{product.shortName}</span>
          </nav>
          <p className="product-overline">{product.sex} · one available</p>
          <h1>{product.name}</h1>
          <p className="detail-description">{product.description}</p>
          <div className="product-purchase">
            <AddToCartButton product={product} />
            <strong>{formatUsd(product.priceCents)}</strong>
          </div>
          <div className="detail-accordions">
            <details open>
              <summary>Fish details <span aria-hidden="true">↘</span></summary>
              <dl className="detail-specs">
                <div><dt>Variety</dt><dd>{product.variety ?? "—"}</dd></div>
                <div><dt>Color</dt><dd>{product.color ?? "—"}</dd></div>
                <div><dt>Tail type</dt><dd>{product.tailType ?? "—"}</dd></div>
                <div><dt>SKU</dt><dd>{product.sku}</dd></div>
              </dl>
            </details>
            <details>
              <summary>Delivery <span aria-hidden="true">↘</span></summary>
              <p>Weather-aware shipping details are confirmed before dispatch.</p>
            </details>
            <details>
              <summary>Live arrival <span aria-hidden="true">↘</span></summary>
              <p>Review the live arrival guarantee before placing an order.</p>
            </details>
          </div>
          {product.isDemo ? (
            <p className="detail-note">Preview listing. Checkout is disabled for sample inventory.</p>
          ) : null}
        </div>
      </article>

      <section className="product-story page-shell">
        <span className="section-label">ABOUT</span>
        <div className="product-story-image">
          <Image src={product.image} alt="" fill sizes="(max-width: 760px) 100vw, 38vw" style={{ objectPosition: product.imagePosition ?? "50% 50%" }} />
        </div>
        <p>
          {product.shortName} is individually selected and photographed. What
          you see here is the exact fish reserved when it is added to your bag.
        </p>
      </section>
    </>
  );
}
