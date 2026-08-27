import {
  mapProductRecord,
  productSelect,
  type ManagedProduct,
  type ProductRecord,
} from "@/lib/catalog/product-record";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const mapWithClient = (
  record: ProductRecord,
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
) =>
  mapProductRecord(record, (path) =>
    supabase.storage.from("product-media").getPublicUrl(path).data.publicUrl,
  );

export const getManagedProducts = async (): Promise<ManagedProduct[]> => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Unable to load owner inventory: ${error.message}`);
  return ((data ?? []) as unknown as ProductRecord[]).map((record) =>
    mapWithClient(record, supabase),
  );
};

export const getManagedProduct = async (
  id: string,
): Promise<ManagedProduct | undefined> => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Unable to load this inventory item: ${error.message}`);
  return data
    ? mapWithClient(data as unknown as ProductRecord, supabase)
    : undefined;
};
