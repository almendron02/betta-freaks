import type { ManagedProduct } from "@/lib/catalog/product-record";
import { sampleProducts } from "@/lib/catalog/sample-products";

export const previewManagedProducts: ManagedProduct[] = sampleProducts.map(
  (product, index) => ({
    ...product,
    createdAt: new Date(Date.UTC(2026, 7, 24 - index)).toISOString(),
    mediaCount: 1,
    primaryMediaPath: undefined,
  }),
);
