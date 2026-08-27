import type { Metadata } from "next";
import { ComingSoonCategory } from "@/components/storefront/coming-soon-category";

export const metadata: Metadata = { title: "Aquarium Accessories" };
export default function AccessoriesPage() {
  return <ComingSoonCategory eyebrow="Aquarium care" title="Accessories" description="A focused collection of products selected to support healthy betta habitats." />;
}
