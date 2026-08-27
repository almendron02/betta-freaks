import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <section className="cart-page page-shell">
      <div className="cart-heading">
        <div><span className="eyebrow">Your selection</span><h1>BAG</h1></div>
        <span className="catalog-count">Exact fish are limited to one per listing.</span>
      </div>
      <CartView />
    </section>
  );
}
