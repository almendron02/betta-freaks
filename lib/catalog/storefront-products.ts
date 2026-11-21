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
import { cache } from "react";

type CatalogFilters = {
  sex?: ProductSex | "all";
  type?: ProductType | "all";
  featured?: boolean;
  limit?: number;
  newestFirst?: boolean;
};

export const isUsingDemoCatalog = () => !hasSupabaseEnvironment();

const isCatalogNetworkError = (message: string) => {
  const normalized = message.toLowerCase();
  return normalized.includes("fetch failed") || normalized.includes("network error") || normalized.includes("abort");
};

const catalogRequestSignal = () => AbortSignal.timeout(1200);

const getFallbackProducts = ({
  sex,
  type,
  featured,
  limit,
  newestFirst,
}: Required<Pick<CatalogFilters, "sex" | "type" | "newestFirst">> & Pick<CatalogFilters, "featured" | "limit">) => {
  let products = getSampleProducts({ sex, type });
  if (featured !== undefined) products = products.filter((product) => product.featured === featured);
  if (newestFirst) products = products.slice().reverse();
  return typeof limit === "number" ? products.slice(0, limit) : products;
};

export const getStorefrontProducts = async ({
  sex = "all",
  type = "all",
  featured,
  limit,
  newestFirst = true,
}: CatalogFilters = {}): Promise<Product[]> => {
  const supabase = await createServerSupabaseClient();

  if (!supabase) return getFallbackProducts({ sex, type, featured, limit, newestFirst });

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

  let response: Awaited<typeof query>;
  try {
    response = await query.retry(false).abortSignal(catalogRequestSignal());
  } catch (error) {
    if (error instanceof Error && isCatalogNetworkError(error.message)) {
      return getFallbackProducts({ sex, type, featured, limit, newestFirst });
    }
    throw error;
  }
  const { data, error } = response;
  if (error) {
    if (isCatalogNetworkError(error.message)) {
      return getFallbackProducts({ sex, type, featured, limit, newestFirst });
    }
    throw new Error(`Unable to load the live catalog: ${error.message}`);
  }

  return ((data ?? []) as unknown as ProductRecord[]).map((record) =>
    mapProductRecord(record, (path) =>
      supabase.storage.from("product-media").getPublicUrl(path).data.publicUrl,
    ),
  );
};

export const getStorefrontProductBySlug = cache(async (
  slug: string,
): Promise<Product | undefined> => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return getSampleProductBySlug(slug);

  let response;
  try {
    response = await supabase
      .from("products")
      .select(productSelect)
      .eq("slug", slug)
      .eq("status", "active")
      .gt("stock_on_hand", 0)
      .abortSignal(catalogRequestSignal())
      .retry(false)
      .maybeSingle();
  } catch (error) {
    if (error instanceof Error && isCatalogNetworkError(error.message)) return getSampleProductBySlug(slug);
    throw error;
  }

  const { data, error } = response;

  if (error) {
    if (isCatalogNetworkError(error.message)) return getSampleProductBySlug(slug);
    throw new Error(`Unable to load this product: ${error.message}`);
  }
  if (!data) return undefined;

  return mapProductRecord(data as unknown as ProductRecord, (path) =>
    supabase.storage.from("product-media").getPublicUrl(path).data.publicUrl,
  );
});
