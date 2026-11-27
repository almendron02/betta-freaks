import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Shirt, Coffee, Package } from "lucide-react";
import { ProductGrid } from "./product-grid";
import { getStorefrontProducts } from "@/lib/catalog/storefront-products";
import { aquariumImages, foodImages, displayItemProduct } from "@/lib/catalog/display-items";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatUsd } from "@/lib/commerce/money";

const categories = [
  ["Live bettas", "/new-arrivals?category=bettas", "/media/catalog-red-blue-betta-cutout.png"],
  ["Aquariums", "/new-arrivals?category=aquariums", aquariumImages[0].src],
  ["Food & treats", "/new-arrivals?category=food", foodImages[0].src],
  ["Merch", "#merch", ""],
];

export async function StoreHome() {
  const fish = await getStorefrontProducts({type:"fish", newestFirst:true});
  return <div className="store-home">
    <section className="fish-hero">
      <div className="hero-copy"><small>BETTA FREAKS / LIVE COLLECTION</small>
        <h1><span>Small fish.</span><span>Big <em>fins.</em></span></h1>
        <p>Discover show-quality bettas and everything you need to build their world.</p>
        <Link className="shop-pill" href="/new-arrivals">Shop the collection <ArrowRight size={18}/></Link>
      </div>
      <Image className="hero-fish" src="/media/red-white-betta-cutout.png" alt="Red and white betta with its fins spread" width={1199} height={1312} preload sizes="(max-width:700px) 95vw, 55vw"/>
    </section>
    <nav className="category-strip" aria-label="Shop by category">{categories.map(([label,href,src])=><Link key={label} href={href}>{src ? <Image src={src} width={80} height={80} alt=""/> : <Shirt/>}<strong>{label}</strong><ArrowUpRight size={16}/></Link>)}</nav>
    <section className="shop-section"><header><h2>Live bettas</h2><Link href="/new-arrivals?category=bettas">View all fish ↗︎</Link></header><ProductGrid products={fish.slice(0,3)}/></section>
    <section className="shop-section"><header><h2>Tank essentials</h2><Link href="/new-arrivals">Shop supplies ↗︎</Link></header><div className="supply-grid">{[aquariumImages[0],foodImages[0],aquariumImages[2],foodImages[1]].map(item=><article key={item.src}><Image src={item.src} alt={item.alt} width={340} height={280}/><h3>{item.name}</h3><p>Preview · {formatUsd(item.priceCents)}</p><AddToCartButton product={displayItemProduct(item)} compact/></article>)}</div></section>
    <section className="merch-preview" id="merch"><div><small>MERCH / COMING SOON</small><h2>Off the tank.</h2><p>Apparel and gear for betta keepers.</p></div>{[{Icon:Shirt,label:"Graphic tee"},{Icon:Coffee,label:"Travel mug"}].map(({Icon,label})=><figure key={label}><Icon size={56} strokeWidth={1}/><figcaption>{label} · Concept</figcaption></figure>)}</section>
    <section className="delivery-band"><Package size={40}/><div><h2>From our tanks to yours.</h2><p>Plan for delivery and your betta’s first day at home.</p></div><Link className="shop-pill" href="/shipping">Shipping guide <ArrowRight size={16}/></Link></section>
  </div>;
}
