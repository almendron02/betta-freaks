import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { updateOwnerProduct } from "@/app/owner/products/actions";
import { OwnerProductForm } from "@/components/owner/product-form";
import { getOwnerAccess } from "@/lib/auth/owner";
import { getManagedProduct } from "@/lib/owner/products";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Edit Product",
  robots: { index: false, follow: false },
};

export default async function EditOwnerProductPage({ params }: Props) {
  const access = await getOwnerAccess();
  if (access.state === "signed_out") redirect("/auth/sign-in");
  if (access.state !== "authorized") redirect("/owner");

  const product = await getManagedProduct((await params).id);
  if (!product) notFound();
  const action = updateOwnerProduct.bind(null, product.id);

  return (
    <section className="owner-shell page-shell">
      <OwnerProductForm product={product} productAction={action} />
    </section>
  );
}
