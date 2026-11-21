import Link from "next/link";
import { Reveal } from "@/components/motion/motion-primitives";

function SocialIcon({ platform }: { platform: "instagram" | "facebook" | "x" | "youtube" }) {
  if (platform === "instagram") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.4" cy="6.7" r="1" fill="currentColor" /></svg>;
  }
  if (platform === "facebook") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.6 21v-8h2.8l.42-3.1H13.6v-2c0-.9.25-1.5 1.62-1.5H17V3.62c-.77-.1-1.55-.14-2.33-.12-2.3 0-3.88 1.4-3.88 4v2.4H8.2V13h2.59v8h2.81Z" /></svg>;
  }
  if (platform === "x") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.2 3h4.45l4.25 5.68L17.75 3H20l-6.06 7.1L20.5 21h-4.45l-4.67-6.24L6.05 21H3.8l6.54-7.66L4.2 3Zm3.34 1.7 9.36 14.6h1.98L9.52 4.7H7.54Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.4 7.2a2.7 2.7 0 0 0-1.9-1.9C17.82 4.85 12 4.85 12 4.85s-5.82 0-7.5.45a2.7 2.7 0 0 0-1.9 1.9A28 28 0 0 0 2.15 12c0 1.6.15 3.2.45 4.8a2.7 2.7 0 0 0 1.9 1.9c1.68.45 7.5.45 7.5.45s5.82 0 7.5-.45a2.7 2.7 0 0 0 1.9-1.9c.3-1.6.45-3.2.45-4.8s-.15-3.2-.45-4.8ZM10 15.1V8.9l5.35 3.1L10 15.1Z" /></svg>;
}

const shopLinks = [
  ["All fish", "/new-arrivals"],
  ["Male bettas", "/new-arrivals?sex=male"],
  ["Female bettas", "/new-arrivals?sex=female"],
  ["Aquarium care", "/accessories"],
  ["Live foods", "/live-foods"],
];

const supportLinks = [
  ["FAQ", "/faq"],
  ["Shipping details", "/shipping"],
  ["Live arrival", "/live-arrival-guarantee"],
  ["Store credit", "/store-credit-policy"],
  ["Contact support", "/contact"],
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Reveal className="footer-shell" distance="md">
        <div className="footer-columns">
          <div className="footer-brand-column">
            <h2>Betta Freaks</h2>
            <p>Selectively bred and individually chosen Betta splendens. Each exact-fish listing shows the individual available to take home.</p>
            <div className="footer-socials" aria-label="Social media">
              <span aria-label="Instagram link pending"><SocialIcon platform="instagram" /></span>
              <span aria-label="Facebook link pending"><SocialIcon platform="facebook" /></span>
              <span aria-label="X link pending"><SocialIcon platform="x" /></span>
              <a href="https://youtube.com/@bettafreaks?si=5lZ2vU-DYELaxqvs" target="_blank" rel="noreferrer" aria-label="Betta Freaks on YouTube"><SocialIcon platform="youtube" /></a>
            </div>
          </div>
          <div className="footer-link-column">
            <h3>Shop</h3>
            {shopLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </div>
          <div className="footer-link-column">
            <h3>Support</h3>
            {supportLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </div>
          <div className="footer-link-column footer-company-column">
            <h3>Company</h3>
            <Link href="/about">About us</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/auth/sign-in?next=/owner">Owner sign in</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Betta Freaks. All rights reserved.</span>
          <div>
            <Link href="/shipping">Shipping</Link>
            <Link href="/store-credit-policy">Store credit policy</Link>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
