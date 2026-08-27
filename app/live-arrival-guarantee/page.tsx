import type { Metadata } from "next";
import { PolicyPage } from "@/components/policies/policy-page";

export const metadata: Metadata = { title: "Live Arrival Guarantee" };
export default function LiveArrivalPage() {
  return <PolicyPage eyebrow="Customer care" title="Live arrival guarantee" intro="The guarantee will explain exactly what the customer must do if a fish does not arrive alive."><h2>To be finalized</h2><p>The owner will define the claim window, unboxing evidence, delivery-attempt requirements, weather exceptions, carrier delays, and resolution method.</p><h2>Planned resolution</h2><p>The working business direction is store credit rather than a cash refund, subject to the final written terms displayed at checkout.</p></PolicyPage>;
}
