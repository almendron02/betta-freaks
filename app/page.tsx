import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ProductGrid } from "@/components/storefront/product-grid";
import { getStorefrontProducts, isUsingDemoCatalog } from "@/lib/catalog/storefront-products";

const routes = [
  { number: "01", label: "New fish", href: "/new-arrivals" },
  { number: "02", label: "Aquarium care", href: "/accessories" },
  { number: "03", label: "Live foods", href: "/live-foods" },
];

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { code, next } = await searchParams;

  if (typeof code === "string") {
    const destination =
      typeof next === "string" && next.startsWith("/") && !next.startsWith("//")
        ? next
        : "/owner";
    redirect(
      `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(destination)}`,
    );
  }

  const products = await getStorefrontProducts({ type: "fish", limit: 4 });
  const demoCatalog = isUsingDemoCatalog();

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-stage">
          <h1 aria-label="Betta Freaks">
            <span>BETTA</span>
            <span>FREAKS</span>
          </h1>
          <div className="hero-fish-frame">
            <Image
              src="/media/red-white-betta-cutout.png"
              alt="Red-and-white long-fin betta fish"
              fill
              loading="eager"
              sizes="(max-width: 720px) 92vw, 56vw"
              className="hero-fish-image"
            />
          </div>
          <p className="hero-description">
            Selectively bred and individually chosen Betta splendens. Every
            listing shows the exact fish you can take home.
          </p>
          <Link href="#live-stock" className="hero-shop-link">
            Shop live fish <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="stock-section" id="live-stock">
        <div className="page-shell stock-inner">
          <div className="section-heading">
            <div>
              <span className="section-kicker">LIVE STOCK</span>
              <h2>New fish</h2>
            </div>
            <Link href="/new-arrivals" className="inline-arrow">See all <span aria-hidden="true">→</span></Link>
          </div>
          {demoCatalog ? (
            <div className="demo-notice">
              <strong>Preview inventory</strong>
              <span>Sample listings demonstrate the store until real fish are published.</span>
            </div>
          ) : null}
          <ProductGrid products={products} />
        </div>
      </section>

      <section className="editorial-about page-shell">
        <div className="section-label">ABOUT</div>
        <div>
          <p className="editorial-lead">
            We are more than a store — we are a close look at the color, form,
            and character of Betta splendens.
          </p>
          <p className="editorial-body">
            Betta Freaks breeds, imports, and selects standout varieties with a
            focus on show-quality fish and the diversity of the hobby.
          </p>
        </div>
      </section>

      <section className="route-section page-shell">
        <div className="route-heading">
          <span>(START HERE)</span>
          <h2>FIND YOUR FISH</h2>
        </div>
        <div className="route-list">
          {routes.map((route) => (
            <Link href={route.href} key={route.number} className="route-row">
              <span>({route.number})</span>
              <strong>{route.label}</strong>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>

    </>
  );
}
