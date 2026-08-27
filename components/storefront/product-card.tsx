import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatUsd } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/bettas/${product.slug}`} className="product-media">
        <span className="media-badge">
          {product.sex ? `${product.sex} · ${product.variety ?? "Betta"}` : "Betta Freaks"}
        </span>
        <span className="product-heart" aria-hidden="true">♡</span>
        {product.isDemo ? <span className="demo-badge">Preview</span> : null}
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 25vw"
          className={`product-image product-image-${product.imageTone ?? "natural"}`}
        />
        <span className="product-view">View fish <span aria-hidden="true">→</span></span>
      </Link>
      <div className="product-card-body">
        <div>
          <Link href={`/bettas/${product.slug}`} className="product-title-link">
            <h3>{product.shortName}</h3>
          </Link>
          <p className="product-price">{formatUsd(product.priceCents)}</p>
        </div>
        <AddToCartButton product={product} compact />
      </div>
    </article>
  );
}
