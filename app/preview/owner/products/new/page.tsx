import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OwnerProductForm } from "@/components/owner/product-form";
import { previewManagedProducts } from "@/lib/owner/preview-products";

export const metadata: Metadata = {
  title: "Product Form Preview",
  robots: { index: false, follow: false },
};

export default function OwnerProductFormPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <section className="owner-shell page-shell">
      <OwnerProductForm product={previewManagedProducts[0]} preview />
    </section>
  );
}
