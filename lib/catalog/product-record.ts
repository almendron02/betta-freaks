import type { Product, ProductSex, ProductStatus, ProductType } from "@/lib/commerce/types";

export type ProductMediaRecord = {
  id?: number;
  storage_path: string;
  alt_text: string;
  position: number;
};

export type ProductRecord = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  short_name: string;
  description: string;
  price_cents: number;
  currency: string;
  product_type: ProductType;
  sex: ProductSex | null;
  variety: string | null;
  color: string | null;
  tail_type: string | null;
  stock_on_hand: number;
  status: ProductStatus;
  featured: boolean;
  is_exact_fish: boolean;
  created_at: string;
  product_media: ProductMediaRecord[] | null;
};

export type ManagedProduct = Product & {
  createdAt: string;
  mediaCount: number;
  primaryMediaPath?: string;
};

export const productSelect = `
  id,
  slug,
  sku,
  name,
  short_name,
  description,
  price_cents,
  currency,
  product_type,
  sex,
  variety,
  color,
  tail_type,
  stock_on_hand,
  status,
  featured,
  is_exact_fish,
  created_at,
  product_media (id, storage_path, alt_text, position)
`;

export const mapProductRecord = (
  record: ProductRecord,
  getPublicUrl: (path: string) => string,
): ManagedProduct => {
  const media = [...(record.product_media ?? [])].sort(
    (left, right) => left.position - right.position,
  );
  const primary = media[0];

  return {
    id: record.id,
    slug: record.slug,
    sku: record.sku,
    name: record.name,
    shortName: record.short_name,
    description: record.description,
    priceCents: record.price_cents,
    currency: "usd",
    type: record.product_type,
    sex: record.sex ?? undefined,
    variety: record.variety ?? undefined,
    color: record.color ?? undefined,
    tailType: record.tail_type ?? undefined,
    stockOnHand: record.stock_on_hand,
    status: record.status,
    featured: record.featured,
    isExactFish: record.is_exact_fish,
    isDemo: false,
    image: primary
      ? getPublicUrl(primary.storage_path)
      : "/media/betta-freaks-logo.png",
    imageAlt: primary?.alt_text ?? `${record.name} image pending`,
    imageTone: "natural",
    createdAt: record.created_at,
    mediaCount: media.length,
    primaryMediaPath: primary?.storage_path,
  };
};
