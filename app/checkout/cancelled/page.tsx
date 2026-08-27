import Link from "next/link";

export default function CheckoutCancelledPage() {
  return <section className="auth-section page-shell"><div className="auth-card"><span className="eyebrow">Checkout cancelled</span><h1>No payment was made.</h1><p>Your local cart is still available. Live inventory will be rechecked before another checkout attempt.</p><Link href="/cart" className="button button-outline">Return to cart</Link></div></section>;
}
