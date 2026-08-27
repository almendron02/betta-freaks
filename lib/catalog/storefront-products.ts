import { hasSupabaseEnvironment } from "@/lib/env";
import {
  mapProductRecord,
  productSelect,
  type ProductRecord,
} from "@/lib/catalog/product-record";
import {
  getCatalogProducts as getSampleProducts,
  getProductBySlug as getSampleProductBySlug,
} from "@/lib/catalog/sample-products";
import type { Product, ProductSex, ProductType } from "@/lib/commerce/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type CatalogFilters = {
  sex?: ProductSex | "all";
  type?: ProductType | "all";
  featured?: boolean;
  limit?: number;
  newestFirst?: boolean;
};

export const isUsingDemoCatalog = () => !hasSupabaseEnvironment();

export const getStorefrontProducts = async ({
  sex = "all",
  type = "all",
  featured,
  limit,
  newestFirst = true,
}: CatalogFilters = {}): Promise<Product[]> => {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    let products = getSampleProducts({ sex, type });
    if (featured !== undefined) {
      products = products.filter((product) => product.featured === featured);
    }
    if (newestFirst) products = products.slice().reverse();
    return typeof limit === "number" ? products.slice(0, limit) : products;
  }

  let query = supabase
    .from("products")
    .select(productSelect)
    .eq("status", "active")
    .gt("stock_on_hand", 0)
    .order("created_at", { ascending: !newestFirst });

  if (sex !== "all") query = query.eq("sex", sex);
  if (type !== "all") query = query.eq("product_type", type);
  if (featured !== undefined) query = query.eq("featured", featured);
  if (typeof limit === "number") query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(`Unable to load the live catalog: ${error.message}`);

  return ((data ?? []) as unknown as ProductRecord[]).map((record) =>
    mapProductRecord(record, (path) =>
      supabase.storage.from("product-media").getPublicUrl(path).data.publicUrl,
    ),
  );
};

export const getStorefrontProductBySlug = async (
  slug: string,
): Promise<Product | undefined> => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return getSampleProductBySlug(slug);

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("slug", slug)
    .eq("status", "active")
    .gt("stock_on_hand", 0)
    .maybeSingle();

  if (error) throw new Error(`Unable to load this product: ${error.message}`);
  if (!data) return undefined;

  return mapProductRecord(data as unknown as ProductRecord, (path) =>
    supabase.storage.from("product-media").getPublicUrl(path).data.publicUrl,
  );
};
