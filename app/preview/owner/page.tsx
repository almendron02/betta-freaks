import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardPreview } from "@/components/owner/dashboard-preview";

export const metadata: Metadata = { title: "Owner Preview", robots: { index: false, follow: false } };

export default function OwnerPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <DashboardPreview preview />;
}
