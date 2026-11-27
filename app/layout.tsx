import type { ReactNode } from "react";
import Link from "next/link";
import { CartProvider } from "@/components/cart/cart-provider";
import "./globals.css";

export const metadata = { title: "Betta Freaks", description: "Discover bettas, explore their colors, and find the essentials for their tanks." };
export default function Layout({children}:{children:ReactNode}) {
  return <html lang="en"><body><CartProvider>
    <header className="top"><Link className="brand" href="/" aria-label="Betta Freaks home">Betta Freaks</Link><nav aria-label="Main"><Link href="/collection">Collection</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></nav><Link className="pill" href="/checkout">Checkout ↗︎</Link></header>
    <main>{children}</main>
    <footer><Link href="/" className="brand">Betta Freaks</Link><nav aria-label="Footer">{["Home","About","Collection","Contact","Checkout"].map(label=><Link key={label} href={label==="Home"?"/":"/"+label.toLowerCase()}>{label}</Link>)}</nav></footer>
  </CartProvider></body></html>;
}
