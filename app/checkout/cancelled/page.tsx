import Link from "next/link";
import { PageHero } from "@/components/storefront/page-hero";

export default function CheckoutCancelledPage() {
  return <><PageHero eyebrow="Checkout status" title="No payment was made" description="Your selections remain available locally so you can review the cart again." compact /><section className="auth-section page-shell form-section"><div className="auth-card"><span className="eyebrow">Checkout cancelled</span><h2>Your cart is still here</h2><p>Your local cart is still available. Live inventory will be rechecked before another checkout attempt.</p><Link href="/cart" className="button button-outline">Return to cart</Link></div></section></>;
}
