import Link from "next/link";
import { PageHero } from "@/components/storefront/page-hero";

export default function CheckoutSuccessPage() {
  return <><PageHero eyebrow="Order status" title="Thank you" description="Payment status is verified securely before an order is confirmed." compact /><section className="auth-section page-shell editorial-form-section"><div className="auth-card"><span className="eyebrow">Order received</span><h2>Confirmation pending</h2><p>A production order will appear here only after Stripe confirms payment through the signed webhook.</p><Link href="/new-arrivals" className="button button-coral">Continue shopping</Link></div></section></>;
}
