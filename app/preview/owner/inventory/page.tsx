import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InventoryWorkspace } from "@/components/owner/inventory-workspace";
import { previewManagedProducts } from "@/lib/owner/preview-products";

export const metadata: Metadata = {
  title: "Inventory Manager Preview",
  robots: { index: false, follow: false },
};

export default function OwnerInventoryPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <InventoryWorkspace products={previewManagedProducts} movements={[]} preview />;
}
