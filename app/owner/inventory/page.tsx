import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { InventoryWorkspace } from "@/components/owner/inventory-workspace";
import { getOwnerAccess } from "@/lib/auth/owner";
import { getInventoryMovements } from "@/lib/owner/inventory";
import { getManagedProducts } from "@/lib/owner/products";

export const metadata: Metadata = {
  title: "Inventory",
  robots: { index: false, follow: false },
};

export default async function OwnerInventoryPage() {
  const access = await getOwnerAccess();
  if (access.state === "signed_out") redirect("/auth/sign-in?next=/owner/inventory");
  if (access.state !== "authorized") redirect("/owner");

  const [products, movements] = await Promise.all([
    getManagedProducts(),
    getInventoryMovements(),
  ]);

  return <InventoryWorkspace products={products} movements={movements} />;
}
