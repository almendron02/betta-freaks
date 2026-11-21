import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatUsd } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";

const specimenBadges: Record<string, string> = {
  "nemo-galaxy-hmpk": "Rare gem",
  "butterfly-longfin-halfmoon": "Limited",
  "super-yellow-hmpk": "New in",
  "super-orange-hmpk": "Vivid",
  "super-red-hmpk": "Velvet",
};

export function ProductCard({ product, showcase = false }: { product: Product; showcase?: boolean }) {
  const badge = specimenBadges[product.slug] ?? (product.featured ? "Featured" : "Exact fish");

  return (
    <article className="product-card">
      <Link href={`/bettas/${product.slug}`} className="product-media">
        <span className="media-badge"><i aria-hidden="true" />{badge}</span>
        {product.isDemo ? <span className="demo-badge">Preview</span> : null}
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 33vw, 20vw"
          className="product-image"
          style={{ objectPosition: product.imagePosition ?? "50% 50%" }}
        />
        <span className="product-card-caption">
          <span className="product-card-identity">
            <strong>{product.shortName}</strong>
            <small>{product.sex ? `${product.sex} · ` : ""}{product.isExactFish ? "exact fish" : "representative photo"}</small>
          </span>
          <span>{formatUsd(product.priceCents)}</span>
        </span>
      </Link>
      {!showcase ? (
        <div className="product-card-body">
          <div>
            <Link href={`/bettas/${product.slug}`} className="product-title-link"><h3>{product.shortName}</h3></Link>
            <p className="product-price">{formatUsd(product.priceCents)}</p>
          </div>
          <p className="product-description">{product.description}</p>
          <AddToCartButton product={product} compact label="Claim this betta" />
        </div>
      ) : null}
    </article>
  );
}
