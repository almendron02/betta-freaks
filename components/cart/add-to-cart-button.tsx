"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import type { Product } from "@/lib/commerce/types";

export function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { addProduct, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.some((item) => item.productId === product.id);
  const unavailable = product.status !== "active" || product.stockOnHand < 1;

  return (
    <button
      type="button"
      className={compact ? "button button-small button-dark" : "button button-dark"}
      disabled={unavailable || inCart}
      onClick={() => {
        addProduct(product);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1800);
      }}
    >
      {inCart || justAdded ? <Check size={16} /> : null}
      {unavailable ? "Unavailable" : inCart || justAdded ? "In bag" : "Add to bag"}
    </button>
  );
}
