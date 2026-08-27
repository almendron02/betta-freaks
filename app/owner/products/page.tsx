import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { OwnerProductList } from "@/components/owner/product-list";
import { getOwnerAccess } from "@/lib/auth/owner";
import { getManagedProducts } from "@/lib/owner/products";

export const metadata: Metadata = {
  title: "Manage Products",
  robots: { index: false, follow: false },
};

export default async function OwnerProductsPage() {
  const access = await getOwnerAccess();
  if (access.state === "signed_out") redirect("/auth/sign-in");
  if (access.state !== "authorized") redirect("/owner");

  const products = await getManagedProducts();
  return (
    <section className="owner-shell page-shell">
      <div className="owner-topbar">
        <div><span className="eyebrow">Owner workspace</span><h1>Products</h1><p className="owner-subtitle">Create drafts, control live stock, and publish exact-fish listings.</p></div>
        <div className="owner-topbar-actions">
          <Link className="button button-outline" href="/owner/inventory">Inventory</Link>
          <Link className="button button-coral" href="/owner/products/new">Add product</Link>
        </div>
      </div>
      <OwnerProductList products={products} />
    </section>
  );
}
