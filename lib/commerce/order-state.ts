import type {
  FulfillmentStatus,
  PaymentStatus,
  ProductStatus,
} from "@/lib/commerce/types";

const paymentTransitions: Record<PaymentStatus, PaymentStatus[]> = {
  unpaid: ["processing", "failed"],
  processing: ["paid", "failed"],
  paid: ["partially_refunded", "refunded"],
  failed: [],
  partially_refunded: ["refunded"],
  refunded: [],
};

const fulfillmentTransitions: Record<
  FulfillmentStatus,
  FulfillmentStatus[]
> = {
  unfulfilled: ["processing", "cancelled"],
  processing: ["ready_to_ship", "cancelled"],
  ready_to_ship: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const productTransitions: Record<ProductStatus, ProductStatus[]> = {
  draft: ["active", "archived"],
  active: ["reserved", "sold", "archived"],
  reserved: ["active", "sold", "archived"],
  sold: ["archived"],
  archived: ["draft"],
};

export const canTransitionPayment = (
  from: PaymentStatus,
  to: PaymentStatus,
) => paymentTransitions[from].includes(to);

export const canTransitionFulfillment = (
  from: FulfillmentStatus,
  to: FulfillmentStatus,
) => fulfillmentTransitions[from].includes(to);

export const canTransitionProduct = (
  from: ProductStatus,
  to: ProductStatus,
) => productTransitions[from].includes(to);
