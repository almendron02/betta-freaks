"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";

const navigation = [
  { href: "/new-arrivals", label: "New fish" },
  { href: "/about", label: "About" },
  { href: "/shipping", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { itemCount, hydrated } = useCart();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="Betta Freaks home">
          <span>BETTA FREAKS</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link href="/cart" className="header-text-link" aria-label="View bag">
            Bag ({hydrated ? itemCount : 0})
          </Link>
          <Link href="/auth/sign-in" className="header-text-link">
            Sign in
          </Link>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-nav${open ? " mobile-nav-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        {navigation.map((item, index) => (
          <Link
            href={item.href}
            key={item.href}
            tabIndex={open ? undefined : -1}
            onClick={() => setOpen(false)}
          >
            <span>0{index + 1}</span>
            {item.label}
          </Link>
        ))}
        <Link
          href="/cart"
          tabIndex={open ? undefined : -1}
          onClick={() => setOpen(false)}
        >
          <span>04</span>
          Bag ({hydrated ? itemCount : 0})
        </Link>
        <Link
          href="/auth/sign-in"
          tabIndex={open ? undefined : -1}
          onClick={() => setOpen(false)}
        >
          <span>05</span>
          Sign in
        </Link>
      </nav>
    </header>
  );
}
