import { ProductCard } from "@/components/storefront/product-card";
import type { Product } from "@/lib/commerce/types";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <span className="eyebrow">No matches</span>
        <h2>No fish match this filter yet.</h2>
        <p>Try another category or check back when new stock is published.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}
