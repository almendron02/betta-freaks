import type { Metadata } from "next";
import { ComingSoonCategory } from "@/components/storefront/coming-soon-category";

export const metadata: Metadata = { title: "Live Foods" };
export default function LiveFoodsPage() {
  return <ComingSoonCategory eyebrow="Feeding" title="Live foods" description="Live-food products will be listed here with their availability and handling details." />;
}
