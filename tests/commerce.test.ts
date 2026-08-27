import { describe, expect, it } from "vitest";

import { checkoutRequestSchema } from "@/lib/commerce/checkout";
import { parseInventoryAdjustment } from "@/lib/commerce/inventory-adjustment";
import { calculateCartSubtotal, formatUsd } from "@/lib/commerce/money";
import { parseProductForm, parseProductImage } from "@/lib/commerce/product-form";
import {
  canTransitionFulfillment,
  canTransitionPayment,
  canTransitionProduct,
} from "@/lib/commerce/order-state";

describe("commerce money", () => {
  it("calculates cart totals in integer cents", () => {
    expect(
      calculateCartSubtotal([
        { priceCents: 8500, quantity: 1 },
        { priceCents: 700, quantity: 2 },
      ]),
    ).toBe(9900);
  });

  it("formats USD totals", () => {
    expect(formatUsd(8500)).toBe("$85.00");
  });
});

describe("commerce state transitions", () => {
  it("accepts valid Stripe-driven payment transitions", () => {
    expect(canTransitionPayment("processing", "paid")).toBe(true);
    expect(canTransitionPayment("paid", "failed")).toBe(false);
  });

  it("accepts valid fulfillment transitions", () => {
    expect(canTransitionFulfillment("unfulfilled", "processing")).toBe(true);
    expect(canTransitionFulfillment("shipped", "processing")).toBe(false);
  });

  it("allows a released reservation to return to active inventory", () => {
    expect(canTransitionProduct("reserved", "active")).toBe(true);
    expect(canTransitionProduct("sold", "active")).toBe(false);
  });
});

describe("checkout request boundary", () => {
  it("accepts identifiers and quantities without accepting browser prices", () => {
    expect(
      checkoutRequestSchema.safeParse({
        items: [
          {
            productId: "f2d1ae8e-267f-41c8-8ca5-5ef6724d0061",
            quantity: 1,
          },
        ],
      }).success,
    ).toBe(true);
  });

  it("rejects malformed cart lines", () => {
    expect(
      checkoutRequestSchema.safeParse({
        items: [{ productId: "not-a-product", quantity: 0, priceCents: 1 }],
      }).success,
    ).toBe(false);
  });
});

describe("owner product form boundary", () => {
  const validProductForm = () => {
    const form = new FormData();
    form.set("sku", "bf-2026-001");
    form.set("slug", "Crimson Rosetail Male");
    form.set("name", "Crimson Rosetail Male");
    form.set("shortName", "Crimson Rosetail");
    form.set("description", "An individually photographed show-quality crimson male betta.");
    form.set("productType", "fish");
    form.set("sex", "male");
    form.set("variety", "Rosetail");
    form.set("color", "Crimson red");
    form.set("tailType", "Halfmoon");
    form.set("price", "85.50");
    form.set("stockOnHand", "1");
    form.set("status", "draft");
    form.set("isExactFish", "on");
    return form;
  };

  it("normalizes SKU and slug and converts dollars to integer cents", () => {
    const result = parseProductForm(validProductForm());
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.sku).toBe("BF-2026-001");
    expect(result.data.slug).toBe("crimson-rosetail-male");
    expect(result.data.priceCents).toBe(8550);
  });

  it("rejects exact-fish stock above one", () => {
    const form = validProductForm();
    form.set("stockOnHand", "2");
    expect(parseProductForm(form).success).toBe(false);
  });

  it("requires available stock for active listings", () => {
    const form = validProductForm();
    form.set("status", "active");
    form.set("stockOnHand", "0");
    expect(parseProductForm(form).success).toBe(false);
  });

  it("rejects unsupported product image formats", () => {
    const file = new File(["not-an-image"], "fish.gif", { type: "image/gif" });
    expect(parseProductImage(file).success).toBe(false);
  });
});

describe("owner inventory adjustment boundary", () => {
  const inventoryForm = (quantityDelta: string) => {
    const form = new FormData();
    form.set("productId", "f2d1ae8e-267f-41c8-8ca5-5ef6724d0061");
    form.set("quantityDelta", quantityDelta);
    form.set("reason", "stock_correction");
    form.set("note", "Verified against the fish room count.");
    return form;
  };

  it("accepts a signed whole-number quantity change", () => {
    const result = parseInventoryAdjustment(inventoryForm("-1"));
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.quantityDelta).toBe(-1);
  });

  it("rejects zero and fractional adjustments", () => {
    expect(parseInventoryAdjustment(inventoryForm("0")).success).toBe(false);
    expect(parseInventoryAdjustment(inventoryForm("1.5")).success).toBe(false);
  });

  it("rejects unrecognized movement reasons", () => {
    const form = inventoryForm("1");
    form.set("reason", "sold");
    expect(parseInventoryAdjustment(form).success).toBe(false);
  });
});
