import type { Metadata } from "next";
import { PolicyPage } from "@/components/policies/policy-page";

export const metadata: Metadata = { title: "Shipping" };
export default function ShippingPage() {
  return <PolicyPage eyebrow="Customer care" title="Shipping policy" intro="Live-animal shipping needs weather, carrier, timing, and customer-readiness rules that protect the fish."><h2>To be finalized</h2><p>The owner will confirm eligible destinations, shipping days, carrier service, weather holds, packaging, combined orders, and pickup options before launch.</p><h2>Before checkout</h2><p>The final shipping charge and any live-animal conditions will be shown before payment. Orders will not be silently shipped when conditions are unsafe.</p></PolicyPage>;
}
