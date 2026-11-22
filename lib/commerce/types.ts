export type ProductType = "fish" | "accessory" | "live_food";
export type ProductSex = "male" | "female";
export type ProductStatus =
  | "draft"
  | "active"
  | "reserved"
  | "sold"
  | "archived";

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortName: string;
  description: string;
  priceCents: number;
  currency: "usd";
  type: ProductType;
  sex?: ProductSex;
  variety?: string;
  color?: string;
  tailType?: string;
  stockOnHand: number;
  status: ProductStatus;
  featured: boolean;
  isExactFish: boolean;
  isDemo: boolean;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  imageTone?: "natural" | "warm" | "cool";
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  image: string;
  imageAlt: string;
  quantity: number;
  isExactFish: boolean;
};

export type PaymentStatus =
  | "unpaid"
  | "processing"
  | "paid"
  | "failed"
  | "partially_refunded"
  | "refunded";

export type FulfillmentStatus =
  | "unfulfilled"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "cancelled";
