import Link from "next/link";

const routeLinks = [
  ["New fish", "/new-arrivals"],
  ["Aquarium care", "/accessories"],
  ["Live foods", "/live-foods"],
];

const helpLinks = [
  ["Shipping", "/shipping"],
  ["Live arrival", "/live-arrival-guarantee"],
  ["Store credit", "/store-credit-policy"],
  ["Contact", "/contact"],
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid page-shell">
        <div className="footer-intro">
          <p className="footer-kicker">U.S.-based · Show-quality fish</p>
          <h2>Find the one that stops you.</h2>
          <Link href="/new-arrivals" className="button button-dark">
            Shop live stock <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div>
          <h3>Explore</h3>
          {routeLinks.map(([label, href]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
        </div>
        <div>
          <h3>Information</h3>
          {helpLinks.map(([label, href]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
        </div>
        <div>
          <h3>Follow</h3>
          <a
            href="https://youtube.com/@bettafreaks?si=5lZ2vU-DYELaxqvs"
            target="_blank"
            rel="noreferrer"
          >
            YouTube ↗
          </a>
          <p className="footer-muted">Instagram is linked through YouTube.</p>
        </div>
      </div>
      <div className="footer-bottom page-shell">
        <span>© 2026 Betta Freaks</span>
        <span>One fish. One listing. One keeper.</span>
      </div>
    </footer>
  );
}
