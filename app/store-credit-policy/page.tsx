import type { Metadata } from "next";
import { PolicyPage } from "@/components/policies/policy-page";

export const metadata: Metadata = { title: "Store Credit Policy" };
export default function StoreCreditPage() {
  return <PolicyPage eyebrow="Customer care" title="Store credit policy" intro="Approved live-arrival claims are intended to be resolved with store credit rather than a cash refund."><h2>To be finalized</h2><p>The final policy will state eligibility, credit value, expiration, exclusions, redemption, and whether shipping costs are included.</p><h2>No assumptions at checkout</h2><p>Live payment will remain disabled until the owner approves complete and consistent shipping, live-arrival, and credit language.</p></PolicyPage>;
}
