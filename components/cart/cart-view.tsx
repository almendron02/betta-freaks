"use client";

import { ArrowLeft, ArrowRight, LockKeyhole, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { formatUsd } from "@/lib/commerce/money";

export function CartView() {
  const { items, hydrated, removeProduct } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const subtotal = items.reduce((total, item) => total + item.priceCents * item.quantity, 0);

  if (!hydrated) return <div className="empty-state"><p>Loading your cart…</p></div>;

  if (items.length === 0) {
    return (
      <div className="empty-state cart-empty-state">
        <ShoppingCart size={28} />
        <h2>Your cart is ready for a fish.</h2>
        <p>Browse the live listings and claim an exact specimen.</p>
        <Link href="/new-arrivals" className="button">Browse live fish</Link>
      </div>
    );
  }

  async function beginCheckout() {
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })) }),
      });
      const payload = await response.json() as { error?: string; url?: string };
      if (response.ok && payload.url) {
        window.location.assign(payload.url);
        return;
      }
      setMessage(payload.error ?? "Checkout is not available yet. No payment was attempted.");
    } catch {
      setMessage("Checkout could not be reached. No payment was attempted.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="cart-layout">
      <div className="cart-items-column">
        <div className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.productId}>
              <Link href={item.productId.startsWith("preview-aquarium-") ? "/new-arrivals?category=aquariums" : item.productId.startsWith("preview-food-") ? "/new-arrivals?category=food" : `/bettas/${item.slug}`} className="cart-item-image">
                <Image src={item.image} alt={item.imageAlt} fill sizes="110px" />
              </Link>
              <div className="cart-item-copy">
                <h2>{item.name}</h2>
                <p>{item.isExactFish ? "Show-quality · exact specimen" : `Quantity ${item.quantity}`}</p>
                {item.isExactFish ? <strong>Exact fish shown</strong> : null}
              </div>
              <div className="cart-item-price">
                <span>Unit price</span>
                <strong>{formatUsd(item.priceCents)}</strong>
              </div>
              <div className="cart-item-quantity" aria-label={`Quantity ${item.quantity}`}>− <strong>{item.quantity}</strong> +</div>
              <div className="cart-item-total"><span>Total</span><strong>{formatUsd(item.priceCents * item.quantity)}</strong></div>
              <button className="remove-button" type="button" aria-label={`Remove ${item.name}`} onClick={() => removeProduct(item.productId)}><Trash2 /></button>
            </article>
          ))}
        </div>
        <Link href="/new-arrivals" className="cart-continue"><ArrowLeft /> Continue shopping</Link>
      </div>

      <aside className="order-summary">
        <h2>Order summary</h2>
        <div className="summary-row"><span>Subtotal</span><strong>{formatUsd(subtotal)}</strong></div>
        <div className="summary-row"><span>Insured shipping</span><span>Calculated by Stripe</span></div>
        <div className="summary-row"><span>Tax</span><span>Calculated at checkout</span></div>
        <div className="summary-promo">
          <label htmlFor="promo-code">Promo code</label>
          <div><input id="promo-code" placeholder="Enter code" disabled /><button type="button" disabled>Apply</button></div>
        </div>
        <div className="summary-row summary-total"><span>Total</span><strong>{formatUsd(subtotal)}</strong></div>
        <button type="button" className="summary-checkout" onClick={beginCheckout} disabled={pending}>
          {pending ? "Checking inventory…" : "Proceed to checkout"} <ArrowRight />
        </button>
        {message ? <p className="form-message">{message}</p> : null}
        <p className="summary-secure"><LockKeyhole /> Payments are handled by Stripe</p>
        <div className="summary-cards" aria-label="Card payments"><span>VISA</span><span>MASTERCARD</span><span>AMEX</span></div>
      </aside>
    </div>
  );
}
