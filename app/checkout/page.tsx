"use client";
import Link from "next/link";
import {useCart} from "@/components/cart/cart-provider";
import {formatUsd} from "@/lib/commerce/money";
export default function Checkout(){
  const {items,hydrated,removeProduct}=useCart();
  return <section className="chapter narrow"><h1>Checkout.</h1>{!hydrated?<p>Loading your bag…</p>:items.length?<><div className="receipt">{items.map(item=><div key={item.productId}><strong>{item.name}</strong><span>{formatUsd(item.priceCents*item.quantity)}</span><button onClick={()=>removeProduct(item.productId)} aria-label={'Remove '+item.name}>Remove</button></div>)}</div><h2>Subtotal {formatUsd(items.reduce((sum,item)=>sum+item.quantity*item.priceCents,0))}</h2><p>Online payment is coming soon. Contact us about the items in your bag.</p><Link className="pill" href="/contact">Contact Betta Freaks</Link></>:<><p>Your bag is empty. Explore the collection to find your first fish.</p><Link className="pill" href="/collection">Explore collection ↗︎</Link></>}</section>;
}
