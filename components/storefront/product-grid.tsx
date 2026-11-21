import { ProductCard } from "@/components/storefront/product-card";
import { Reveal, StaggerItem } from "@/components/motion/motion-primitives";
import type { Product } from "@/lib/commerce/types";

export function ProductGrid({ products, showcase = false }: { products: Product[]; showcase?: boolean }) {
  if (products.length === 0) {
    return (
      <Reveal className="empty-state">
        <span className="eyebrow">No matches</span>
        <h2>No fish match this filter yet.</h2>
        <p>Try another category or check back when new stock is published.</p>
      </Reveal>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <StaggerItem key={product.id}><ProductCard product={product} showcase={showcase} /></StaggerItem>
      ))}
    </div>
  );
}
