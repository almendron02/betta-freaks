import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";
import { PageHero } from "@/components/storefront/page-hero";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <>
      <PageHero eyebrow="Secure checkout" title="Your cart" description="Review your selected fish before inventory and shipping are verified at checkout." compact />
    <section className="cart-page showroom-cart-page">
      <CartView />
    </section>
    </>
  );
}
