import { z } from "zod";

import type { ProductStatus } from "@/lib/commerce/types";

const optionalText = z
  .string()
  .trim()
  .max(120, "Keep this field under 120 characters.")
  .transform((value) => value || null);

const productFormSchema = z
  .object({
    sku: z
      .string()
      .trim()
      .min(3, "SKU must be at least 3 characters.")
      .max(40, "SKU must be 40 characters or fewer.")
      .regex(/^[A-Z0-9_-]+$/, "Use only letters, numbers, hyphens, and underscores."),
    slug: z
      .string()
      .trim()
      .min(3, "Slug must be at least 3 characters.")
      .max(100, "Slug must be 100 characters or fewer.")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
    name: z.string().trim().min(3, "Enter the full product name.").max(140),
    shortName: z.string().trim().min(2, "Enter a short display name.").max(80),
    description: z.string().trim().min(20, "Add at least 20 characters of description.").max(2500),
    productType: z.enum(["fish", "accessory", "live_food"]),
    sex: z.enum(["male", "female"]).nullable(),
    variety: optionalText,
    color: optionalText,
    tailType: optionalText,
    price: z
      .string()
      .trim()
      .regex(/^\d+(?:\.\d{1,2})?$/, "Enter a valid price with no more than two decimals."),
    stockOnHand: z.coerce.number().int().min(0).max(10000),
    status: z.enum(["draft", "active", "reserved", "sold", "archived"]),
    featured: z.boolean(),
    isExactFish: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.productType === "fish" && !value.sex) {
      context.addIssue({ code: "custom", path: ["sex"], message: "Choose male or female for a fish." });
    }
    if (value.productType !== "fish" && value.sex) {
      context.addIssue({ code: "custom", path: ["sex"], message: "Sex applies only to fish." });
    }
    if (value.isExactFish && value.stockOnHand > 1) {
      context.addIssue({ code: "custom", path: ["stockOnHand"], message: "An exact fish can have stock of only 0 or 1." });
    }
    if (value.status === "active" && value.stockOnHand < 1) {
      context.addIssue({ code: "custom", path: ["stockOnHand"], message: "An active listing must have stock available." });
    }
  });

export type ProductFormValues = {
  sku: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  productType: "fish" | "accessory" | "live_food";
  sex: "male" | "female" | null;
  variety: string | null;
  color: string | null;
  tailType: string | null;
  priceCents: number;
  stockOnHand: number;
  status: ProductStatus;
  featured: boolean;
  isExactFish: boolean;
};

export type ProductFormField =
  | "sku"
  | "slug"
  | "name"
  | "shortName"
  | "description"
  | "productType"
  | "sex"
  | "variety"
  | "color"
  | "tailType"
  | "price"
  | "stockOnHand"
  | "status"
  | "featured"
  | "isExactFish"
  | "image";

export type ProductActionState = {
  state: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<ProductFormField, string[]>>;
  productId?: string;
};

export const initialProductActionState: ProductActionState = {
  state: "idle",
  message: "",
};

const normalizeSlug = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const parseProductForm = (formData: FormData) => {
  const result = productFormSchema.safeParse({
    sku: String(formData.get("sku") ?? "").trim().toUpperCase(),
    slug: normalizeSlug(formData.get("slug")),
    name: formData.get("name"),
    shortName: formData.get("shortName"),
    description: formData.get("description"),
    productType: formData.get("productType"),
    sex: formData.get("sex") || null,
    variety: formData.get("variety") ?? "",
    color: formData.get("color") ?? "",
    tailType: formData.get("tailType") ?? "",
    price: formData.get("price"),
    stockOnHand: formData.get("stockOnHand"),
    status: formData.get("status"),
    featured: formData.get("featured") === "on",
    isExactFish: formData.get("isExactFish") === "on",
  });

  if (!result.success) return result;

  const [dollars, cents = ""] = result.data.price.split(".");
  const priceCents = Number(dollars) * 100 + Number(cents.padEnd(2, "0"));
  return {
    success: true as const,
    data: { ...result.data, priceCents } satisfies ProductFormValues & { price: string },
  };
};

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;

export const parseProductImage = (entry: FormDataEntryValue | null) => {
  if (!(entry instanceof File) || entry.size === 0) {
    return { success: true as const, file: null };
  }
  if (!allowedImageTypes.has(entry.type)) {
    return { success: false as const, message: "Upload a JPG, PNG, or WebP image." };
  }
  if (entry.size > MAX_PRODUCT_IMAGE_BYTES) {
    return { success: false as const, message: "Product images must be 5 MB or smaller." };
  }
  return { success: true as const, file: entry };
};

export const productValuesToRow = (values: ProductFormValues) => ({
  slug: values.slug,
  sku: values.sku,
  name: values.name,
  short_name: values.shortName,
  description: values.description,
  product_type: values.productType,
  sex: values.productType === "fish" ? values.sex : null,
  variety: values.variety,
  color: values.color,
  tail_type: values.tailType,
  price_cents: values.priceCents,
  currency: "usd",
  stock_on_hand: values.stockOnHand,
  status: values.status,
  featured: values.featured,
  is_exact_fish: values.isExactFish,
});
