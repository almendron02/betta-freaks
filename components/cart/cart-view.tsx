"use client";

import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { formatUsd } from "@/lib/commerce/money";

export function CartView() {
  const { items, hydrated, removeProduct } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const subtotal = items.reduce((total, item) => total + item.priceCents * item.quantity, 0);

  if (!hydrated) return <div className="empty-state"><p>Loading your cart…</p></div>;

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <ShoppingBag size={28} />
        <h2>Your cart is ready for a fish.</h2>
        <p>Browse the live stock and add an exact-fish listing.</p>
        <Link href="/new-arrivals" className="button button-orange">Browse new fish</Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-items">
        {items.map((item, index) => (
          <article className="cart-item" key={item.productId}>
            <span className="cart-item-index">({String(index + 1).padStart(2, "0")})</span>
            <Link href={`/bettas/${item.slug}`} className="cart-item-image">
              <Image src={item.image} alt={item.imageAlt} fill sizes="118px" />
            </Link>
            <div>
              <h2>{item.name}</h2>
              <p>{item.isExactFish ? "Exact fish · quantity 1" : `Quantity ${item.quantity}`}</p>
              <p><strong>{formatUsd(item.priceCents)}</strong></p>
            </div>
            <button className="remove-button" type="button" onClick={() => removeProduct(item.productId)}>
              <Trash2 size={14} /> Remove
            </button>
          </article>
        ))}
      </div>
      <aside className="order-summary">
        <h2>Your bag <sup>({items.length})</sup></h2>
        <div className="summary-row"><span>Subtotal</span><strong>{formatUsd(subtotal)}</strong></div>
        <div className="summary-row"><span>Shipping</span><span>Calculated at checkout</span></div>
        <div className="summary-row summary-total"><span>Estimated total</span><strong>{formatUsd(subtotal)}</strong></div>
        <button
          type="button"
          className="button button-dark button-full"
          onClick={() => setMessage("Checkout will open after Supabase inventory and Stripe test keys are connected. No payment was attempted.")}
        >
          Secure checkout
        </button>
        {message ? <p className="form-message">{message}</p> : null}
        <p className="summary-note">Live inventory will be rechecked and temporarily reserved before Stripe Checkout opens.</p>
      </aside>
    </div>
  );
}
