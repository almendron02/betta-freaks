import { z } from "zod";

export const inventoryReasonLabels = {
  stock_received: "Stock received",
  stock_correction: "Stock correction",
  damaged_or_lost: "Damaged or lost",
  returned_to_stock: "Returned to stock",
} as const;

export type InventoryReason = keyof typeof inventoryReasonLabels;
export type InventoryAdjustmentField =
  | "productId"
  | "quantityDelta"
  | "reason"
  | "note";

const inventoryAdjustmentSchema = z.object({
  productId: z.string().uuid("Choose a valid product."),
  quantityDelta: z.coerce
    .number()
    .int("Use a whole-number quantity.")
    .min(-1000, "The largest decrease is 1,000 units.")
    .max(1000, "The largest increase is 1,000 units.")
    .refine((value) => value !== 0, "Enter a positive or negative change."),
  reason: z.enum(Object.keys(inventoryReasonLabels) as [InventoryReason, ...InventoryReason[]]),
  note: z
    .string()
    .trim()
    .max(500, "Keep the note under 500 characters.")
    .transform((value) => value || null),
});

export type InventoryActionState = {
  state: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<InventoryAdjustmentField, string[]>>;
  newStock?: number;
};

export const initialInventoryActionState: InventoryActionState = {
  state: "idle",
  message: "",
};

export const parseInventoryAdjustment = (formData: FormData) =>
  inventoryAdjustmentSchema.safeParse({
    productId: formData.get("productId"),
    quantityDelta: formData.get("quantityDelta"),
    reason: formData.get("reason"),
    note: formData.get("note") ?? "",
  });
