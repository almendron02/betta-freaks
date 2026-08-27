import { ArrowUpRight, ImageOff, Pencil } from "lucide-react";
import Link from "next/link";

import type { ManagedProduct } from "@/lib/catalog/product-record";
import { formatUsd } from "@/lib/commerce/money";

export function OwnerProductList({
  products,
  preview = false,
}: {
  products: ManagedProduct[];
  preview?: boolean;
}) {
  const basePath = preview ? "/preview/owner/products" : "/owner/products";

  if (products.length === 0) {
    return (
      <div className="empty-state owner-empty-state">
        <span className="eyebrow">Inventory is empty</span>
        <h2>Add the first Betta Freaks listing.</h2>
        <p>Start as a draft, attach the exact product image, then publish when stock is ready.</p>
        <Link className="button button-coral" href={`${basePath}/new`}>Add a product</Link>
      </div>
    );
  }

  return (
    <div className="owner-product-list">
      {products.map((product) => (
        <article className="owner-product-row" key={product.id}>
          {product.mediaCount > 0 || product.isDemo ? (
            // Owner media can use a runtime Supabase hostname, so this view avoids a fixed image allow-list.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.imageAlt} />
          ) : (
            <span className="owner-row-placeholder"><ImageOff size={20} /></span>
          )}
          <div className="owner-row-name">
            <strong>{product.shortName}</strong>
            <span>{product.sku} · {product.sex ?? product.type.replace("_", " ")}</span>
          </div>
          <div className="owner-row-price">
            <strong>{formatUsd(product.priceCents)}</strong>
            <span>{product.stockOnHand} in stock</span>
          </div>
          <span className={`status-chip status-${product.status}`}>{preview ? "Preview" : product.status}</span>
          <div className="owner-row-links">
            {product.status === "active" ? (
              <Link href={`/bettas/${product.slug}`} aria-label={`View ${product.name} in store`}><ArrowUpRight size={17} /></Link>
            ) : null}
            <Link href={preview ? `${basePath}/new` : `${basePath}/${product.id}`} aria-label={`Edit ${product.name}`}><Pencil size={16} /></Link>
          </div>
        </article>
      ))}
    </div>
  );
}
