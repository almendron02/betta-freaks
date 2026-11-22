import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatUsd } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";

export function ProductCard({ product, showcase = false }: { product: Product; showcase?: boolean }) {
  return <article className="product-card">
    <Link href={`/bettas/${product.slug}`} className="product-media">
      <div className="card-label"><span>{product.shortName}</span><span>↗</span></div>
      <div className="product-image-frame"><Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 720px) 100vw, 33vw" style={{ objectPosition: product.imagePosition ?? "50% 50%" }} /></div>
    </Link>
    <div className="product-card-body">
      <div className="card-facts"><span>{product.sex ?? product.type} · {product.isDemo ? "Preview" : product.isExactFish ? "Exact fish" : "Collection"}</span><span>{formatUsd(product.priceCents)}</span></div>
      {!showcase && <AddToCartButton product={product} compact label="Add to bag" />}
    </div>
  </article>;
}
