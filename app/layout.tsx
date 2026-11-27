import type { ReactNode } from "react";
import Link from "next/link";
import { CartProvider } from "@/components/cart/cart-provider";
import "./globals.css";

export const metadata = { title: "Betta Freaks", description: "Discover bettas, explore their colors, and find the essentials for their tanks." };
export default function Layout({children}:{children:ReactNode}) {
  return <html lang="en"><body><CartProvider>
    <header className="top"><Link className="brand" href="/" aria-label="Betta Freaks home">Betta Freaks</Link><nav aria-label="Main"><Link href="/collection">Collection</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></nav><Link className="pill" href="/checkout">Checkout ↗︎</Link></header>
    <main>{children}</main>
    <footer className="site-end"><div className="end-links"><Link href="/" className="brand">Betta Freaks</Link>
      <div><strong>Collection</strong><Link href="/collection?category=Bettas">Bettas</Link><Link href="/collection?category=Aquariums">Aquariums</Link><Link href="/collection?category=Food">Food</Link></div>
      <div><strong>Resources</strong><Link href="/#faq">Frequently asked questions</Link><Link href="/checkout">Checkout</Link></div>
      <div><strong>Company</strong><Link href="/about">About us</Link><Link href="/contact">Contact</Link></div></div>
      <div className="end-base"><span>© {new Date().getFullYear()} Betta Freaks</span><a href="https://www.youtube.com/@bettafreaks">YouTube ↗︎</a></div>
    </footer>
  </CartProvider></body></html>;
}
