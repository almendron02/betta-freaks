import Link from "next/link";

export default function CheckoutSuccessPage() {
  return <section className="auth-section page-shell"><div className="auth-card"><span className="eyebrow">Order received</span><h1>Thank you.</h1><p>A production order will appear here only after Stripe confirms payment through the signed webhook.</p><Link href="/new-arrivals" className="button button-coral">Continue shopping</Link></div></section>;
}
