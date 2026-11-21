"use client";

import { Menu, ShoppingCart, UserRound, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { motionTokens, springs } from "@/lib/motion-tokens";

const navigation = [
  { href: "/new-arrivals", label: "Shop" },
  { href: "/about", label: "About us" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, hydrated } = useCart();
  const isHome = pathname === "/";
  const prefersReduced = useReducedMotion();

  return (
    <motion.header
      className={`site-header${isHome ? " site-header-home" : ""}`}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
    >
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="Betta Freaks home">
          BETTA FREAKS
        </Link>

        {!isHome ? (
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navigation.map((item) => (
              <Link href={item.href} key={item.href}>{item.label}</Link>
            ))}
          </nav>
        ) : <span aria-hidden="true" />}

        <div className="header-actions">
          {isHome ? <Link href="/new-arrivals" className="home-shop-cta">Shop now</Link> : (
            <>
              <Link href="/account" className="header-account" aria-label="View account">
                <UserRound size={17} />
                <span>Account</span>
              </Link>
              <Link href="/cart" className="header-cart" aria-label="View cart">
                <ShoppingCart size={16} />
                <span>Cart</span>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.strong
                    key={hydrated ? itemCount : 0}
                    initial={prefersReduced ? false : { opacity: 0, scale: motionTokens.scale.subtle }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: motionTokens.scale.subtle }}
                    transition={springs.snappy}
                  >
                    {hydrated ? itemCount : 0}
                  </motion.strong>
                </AnimatePresence>
              </Link>
            </>
          )}
          <button
            className={`mobile-menu-button${isHome ? " menu-grid-button" : ""}`}
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X /> : isHome ? <span className="menu-grid" aria-hidden="true" /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.nav
            key="mobile-navigation"
            id="mobile-navigation"
            className="mobile-nav mobile-nav-open"
            aria-label="Menu navigation"
            initial={prefersReduced ? false : { opacity: 0, y: -motionTokens.distance.md }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -motionTokens.distance.sm }}
            transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
          >
            {navigation.map((item, index) => (
              <motion.div key={item.href} initial={prefersReduced ? false : { opacity: 0, x: -motionTokens.distance.md }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ ...springs.gentle, delay: prefersReduced ? 0 : index * motionTokens.stagger.tight }}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  <span>0{index + 1}</span>{item.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={prefersReduced ? false : { opacity: 0, x: -motionTokens.distance.md }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ ...springs.gentle, delay: prefersReduced ? 0 : 3 * motionTokens.stagger.tight }}>
              <Link href="/cart" onClick={() => setOpen(false)}><span>04</span>Cart ({hydrated ? itemCount : 0})</Link>
            </motion.div>
            <motion.div initial={prefersReduced ? false : { opacity: 0, x: -motionTokens.distance.md }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ ...springs.gentle, delay: prefersReduced ? 0 : 4 * motionTokens.stagger.tight }}>
              <Link href="/account" onClick={() => setOpen(false)}><span>05</span>Account</Link>
            </motion.div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
