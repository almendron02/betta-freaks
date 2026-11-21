import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createOwnerProduct } from "@/app/owner/products/actions";
import { OwnerProductForm } from "@/components/owner/product-form";
import { getOwnerAccess } from "@/lib/auth/owner";

export const metadata: Metadata = {
  title: "Add Product",
  robots: { index: false, follow: false },
};

export default async function NewOwnerProductPage() {
  const access = await getOwnerAccess();
  if (access.state === "signed_out") redirect("/auth/sign-in?next=/owner/products/new");
  if (access.state !== "authorized") redirect("/owner");

  return (
    <section className="owner-shell page-shell">
      <OwnerProductForm productAction={createOwnerProduct} />
    </section>
  );
}
