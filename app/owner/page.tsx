import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardPreview } from "@/components/owner/dashboard-preview";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getOwnerAccess } from "@/lib/auth/owner";
import { getManagedProducts } from "@/lib/owner/products";

export const metadata: Metadata = { title: "Owner Dashboard", robots: { index: false, follow: false } };

export default async function OwnerPage() {
  const access = await getOwnerAccess();
  if (access.state === "signed_out") redirect("/auth/sign-in?next=/owner");
  if (access.state === "authorized") {
    const products = await getManagedProducts();
    return <DashboardPreview authenticatedEmail={access.email} products={products} />;
  }

  return (
    <section className="auth-section page-shell">
      <div className="auth-card">
        <span className="eyebrow">Protected workspace</span>
        <h1>{access.state === "forbidden" ? "Owner access required" : "Connect Supabase"}</h1>
        <p>{access.state === "forbidden" ? `The signed-in account ${access.email ?? ""} does not have an active staff record.` : "Authentication and owner authorization are ready in the codebase, but project credentials have not been added yet."}</p>
        <div className="auth-card-actions">
          <Link className="button button-primary" href="/preview/owner">View safe dashboard preview</Link>
          {access.state === "forbidden" ? <SignOutButton /> : null}
        </div>
      </div>
    </section>
  );
}
