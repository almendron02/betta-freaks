import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer page-shell">
    <div><span>Betta Freaks</span><p>Live bettas and aquarium supplies.</p></div>
    <nav aria-label="Store information">
      <Link href="/account">My account ↗︎</Link><Link href="/faq">FAQ ↗︎</Link><Link href="/shipping">Shipping ↗︎</Link>
      <Link href="/live-arrival-guarantee">Live arrival ↗︎</Link><Link href="/store-credit-policy">Store credit ↗︎</Link>
      <Link href="/accessories">Aquarium care ↗︎</Link><Link href="/live-foods">Live foods ↗︎</Link>
      <Link href="/auth/sign-in?next=/owner">Owner sign in ↗︎</Link>
    </nav>
    <small>© {new Date().getFullYear()} Betta Freaks</small>
  </footer>;
}
