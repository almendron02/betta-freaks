"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import "./gallery-home.css";

export function GalleryMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { itemCount, hydrated } = useCart();
  useEffect(() => {
    if (!open) return;
    root.current?.querySelector("a")?.focus();
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); button.current?.focus(); } };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, [open]);
  return <>
    <header className="gallery-header">
    <Link href="/" className="gallery-brand"><Image src="/media/betta-header-logo.png" alt="" width={32} height={32} /><span>Betta Freaks</span></Link>
    {pathname === "/" ? <nav className="gallery-quick-links" aria-label="Store information">
      <Link href="/faq">FAQ ↗︎</Link><Link href="/shipping">Shipping ↗︎</Link>
      <Link href="/live-arrival-guarantee">Live arrival ↗︎</Link><Link href="/store-credit-policy">Store credit ↗︎</Link>
      <Link href="/accessories">Aquarium care ↗︎</Link><Link href="/live-foods">Live foods ↗︎</Link>
      <Link href="/auth/sign-in?next=/owner">Owner sign in ↗︎</Link>
    </nav> : <span className="gallery-edition">Living color. Individual character.</span>}
    </header>
    <div className="gallery-menu" ref={root}>
      {open && <nav className="gallery-menu-links" id="gallery-navigation" aria-label="Main navigation">
        {[["/", "Gallery"], ["/new-arrivals", "Collection"], ["/about", "About"], ["/contact", "Contact"], ["/account", "Account"], ["/cart", `Bag (${hydrated ? itemCount : 0})`]].map(([href, label], i) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? "page" : undefined}><span>{label}</span><small>0{i + 1} ↗︎</small></Link>)}
      </nav>}
      <button ref={button} className="gallery-menu-toggle" aria-expanded={open} aria-controls="gallery-navigation" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}<span aria-hidden="true">{open ? "−" : "+"}</span></button>
      <Link href="/cart" className="gallery-bag-button" aria-label={`View bag, ${hydrated ? itemCount : 0} items`} onClick={() => setOpen(false)}>
        <ShoppingBag size={19} strokeWidth={1.5} aria-hidden="true" />
        {hydrated && itemCount > 0 && <span className="gallery-bag-count" aria-hidden="true">{itemCount}</span>}
      </Link>
    </div>
  </>;
}
