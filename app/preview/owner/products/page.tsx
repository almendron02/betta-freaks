import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OwnerProductList } from "@/components/owner/product-list";
import { previewManagedProducts } from "@/lib/owner/preview-products";

export const metadata: Metadata = {
  title: "Product Manager Preview",
  robots: { index: false, follow: false },
};

export default function OwnerProductsPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <section className="owner-shell page-shell">
      <div className="owner-topbar">
        <div><span className="eyebrow">Safe owner preview</span><h1>Products</h1><p className="owner-subtitle">This shows the planned management workflow without exposing or changing live data.</p></div>
        <Link className="button button-primary" href="/preview/owner/products/new">Preview product form</Link>
      </div>
      <OwnerProductList products={previewManagedProducts} preview />
    </section>
  );
}
