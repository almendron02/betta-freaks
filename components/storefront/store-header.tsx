"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export function StoreHeader() {
  const { itemCount, hydrated } = useCart();
  return <header className="store-header">
    <Link className="wordmark" href="/">Betta<span>Freaks</span></Link>
    <nav aria-label="Main navigation">
      <Link href="/new-arrivals">Shop</Link><Link href="/shipping">Delivery</Link><Link href="/about">Our story</Link><Link href="/contact">Contact</Link>
    </nav>
    <Link className="bag" href="/cart" aria-label={`Bag, ${hydrated ? itemCount : 0} items`}><ShoppingBag size={18}/> {hydrated ? itemCount : 0}</Link>
  </header>;
}
