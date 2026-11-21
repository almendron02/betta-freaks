"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import type { Product } from "@/lib/commerce/types";
import { motionTokens, springs } from "@/lib/motion-tokens";

export function AddToCartButton({
  product,
  compact = false,
  label = "Add to bag",
}: {
  product: Product;
  compact?: boolean;
  label?: string;
}) {
  const { addProduct, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.some((item) => item.productId === product.id);
  const unavailable = product.status !== "active" || product.stockOnHand < 1;
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      className={compact ? "button button-small button-dark" : "button button-dark"}
      disabled={unavailable || inCart}
      whileHover={prefersReduced || unavailable || inCart ? undefined : { y: -motionTokens.distance.xs }}
      whileTap={prefersReduced || unavailable || inCart ? undefined : { scale: motionTokens.scale.press }}
      animate={justAdded && !prefersReduced ? { scale: [1, motionTokens.scale.pop, 1] } : { scale: 1 }}
      transition={springs.snappy}
      onClick={() => {
        addProduct(product);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1800);
      }}
    >
      {inCart || justAdded ? <Check size={16} /> : null}
      {unavailable ? "Unavailable" : inCart || justAdded ? "In bag" : label}
    </motion.button>
  );
}
