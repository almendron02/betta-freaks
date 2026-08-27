import { z } from "zod";

export const checkoutRequestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.uuid(),
        quantity: z.int().min(1).max(10),
      }),
    )
    .min(1)
    .max(20),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
