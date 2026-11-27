import Link from "next/link";
import Image from "next/image";
import {getStorefrontProducts} from "@/lib/catalog/storefront-products";
import {aquariumImages,foodImages,displayItemProduct} from "@/lib/catalog/display-items";
import {AddToCartButton} from "@/components/cart/add-to-cart-button";
import {formatUsd} from "@/lib/commerce/money";
export default async function Collection({searchParams}:PageProps<"/collection">){
  const {category}=await searchParams;
  const groups={Bettas:await getStorefrontProducts({type:"fish",newestFirst:true}),Aquariums:aquariumImages.map(displayItemProduct),Food:foodImages.map(displayItemProduct)};
  const active=typeof category==="string" && Object.hasOwn(groups,category)?category:"All";
  const products=Object.entries(groups).filter(([key])=>active==="All"||key===active).flatMap(([,items])=>items);
  return <section className="chapter"><h1>The collection.</h1><nav className="filters" aria-label="Product categories">{["All",...Object.keys(groups)].map(label=><Link className={'pill '+(active===label?'':'soft')} aria-current={active===label?'page':undefined} key={label} href={'/collection?category='+label}>{label}</Link>)}</nav><div className="tiles">{products.map(p=><article key={p.id}><Image src={p.image} alt={p.imageAlt} width={400} height={320}/><h3>{p.name}</h3><p>{formatUsd(p.priceCents)}{p.isDemo?" · Preview":""}</p><AddToCartButton product={p}/></article>)}</div>{products.length===0&&<p>More fish are on the way. Check back for new listings.</p>}</section>;
}
