"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getOwnerAccess } from "@/lib/auth/owner";
import {
  parseProductForm,
  parseProductImage,
  productValuesToRow,
  type ProductActionState,
  type ProductFormField,
} from "@/lib/commerce/product-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const productIdSchema = z.string().uuid();

const validationError = (
  message: string,
  fieldErrors?: Partial<Record<ProductFormField, string[]>>,
): ProductActionState => ({ state: "error", message, fieldErrors });

const databaseMessage = (message: string, code?: string) => {
  if (code === "23505") {
    return "That SKU or URL slug is already in use. Choose a unique value.";
  }
  return `The product could not be saved. ${message}`;
};

const revalidateStorefront = (slug?: string) => {
  revalidatePath("/");
  revalidatePath("/new-arrivals");
  revalidatePath("/owner");
  revalidatePath("/owner/products");
  revalidatePath("/owner/inventory");
  if (slug) revalidatePath(`/bettas/${slug}`);
};

const authorizeMutation = async () => {
  const access = await getOwnerAccess();
  if (access.state !== "authorized") return null;
  return createServerSupabaseClient();
};

const uploadProductImage = async (
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  productId: string,
  file: File,
) => {
  const extension =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${productId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("product-media").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  return error ? { path: null, error } : { path, error: null };
};

export async function createOwnerProduct(
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const supabase = await authorizeMutation();
  if (!supabase) return validationError("Your owner session is no longer authorized. Sign in again.");

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return validationError(
      "Review the highlighted product details.",
      parsed.error.flatten().fieldErrors as Partial<Record<ProductFormField, string[]>>,
    );
  }

  const image = parseProductImage(formData.get("image"));
  if (!image.success) return validationError(image.message, { image: [image.message] });
  if (parsed.data.status === "active" && !image.file) {
    return validationError("Add a product image before publishing this listing.", {
      image: ["A product image is required for an active listing."],
    });
  }

  const requestedStatus = parsed.data.status;
  const initialStock = parsed.data.stockOnHand;
  const { data: product, error: insertError } = await supabase
    .from("products")
    .insert({ ...productValuesToRow(parsed.data), stock_on_hand: 0, status: "draft" })
    .select("id")
    .single();

  if (insertError || !product) {
    return validationError(databaseMessage(insertError?.message ?? "No row was returned.", insertError?.code));
  }

  let uploadedPath: string | null = null;
  if (image.file) {
    const upload = await uploadProductImage(supabase, product.id, image.file);
    if (upload.error || !upload.path) {
      await supabase.from("products").delete().eq("id", product.id);
      return validationError(`Image upload failed. ${upload.error?.message ?? "Try again."}`, {
        image: ["The image could not be uploaded."],
      });
    }
    uploadedPath = upload.path;

    const { error: mediaError } = await supabase.from("product_media").insert({
      product_id: product.id,
      storage_path: upload.path,
      alt_text: parsed.data.name,
      position: 0,
    });

    if (mediaError) {
      await supabase.storage.from("product-media").remove([upload.path]);
      await supabase.from("products").delete().eq("id", product.id);
      return validationError(`The product image record could not be saved. ${mediaError.message}`);
    }
  }

  if (initialStock > 0) {
    const { error: inventoryError } = await supabase.rpc("adjust_inventory", {
      p_product_id: product.id,
      p_quantity_delta: initialStock,
      p_reason: "stock_received",
      p_note: "Initial stock recorded when the product was created.",
    });

    if (inventoryError) {
      if (uploadedPath) await supabase.storage.from("product-media").remove([uploadedPath]);
      await supabase.from("products").delete().eq("id", product.id);
      return validationError(`The product could not be created because its opening stock was not recorded. ${inventoryError.message}`);
    }
  }

  if (requestedStatus !== "draft") {
    const { error: statusError } = await supabase
      .from("products")
      .update({ status: requestedStatus })
      .eq("id", product.id);
    if (statusError) {
      return validationError(
        `The product was created as a draft, but its status could not be changed. ${statusError.message}`,
      );
    }
  }

  revalidateStorefront(parsed.data.slug);
  return {
    state: "success",
    message: requestedStatus === "active" ? "Product published successfully." : "Product saved successfully.",
    productId: product.id,
  };
}

export async function updateOwnerProduct(
  productId: string,
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const id = productIdSchema.safeParse(productId);
  if (!id.success) return validationError("This product identifier is invalid.");

  const supabase = await authorizeMutation();
  if (!supabase) return validationError("Your owner session is no longer authorized. Sign in again.");

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return validationError(
      "Review the highlighted product details.",
      parsed.error.flatten().fieldErrors as Partial<Record<ProductFormField, string[]>>,
    );
  }

  const image = parseProductImage(formData.get("image"));
  if (!image.success) return validationError(image.message, { image: [image.message] });

  const { data: existing, error: existingError } = await supabase
    .from("products")
    .select("id, slug, stock_on_hand, product_media(id, storage_path, position)")
    .eq("id", id.data)
    .maybeSingle();

  if (existingError || !existing) {
    return validationError(existingError ? databaseMessage(existingError.message, existingError.code) : "Product not found.");
  }

  const media = [...(existing.product_media ?? [])].sort(
    (left, right) => left.position - right.position,
  );
  const primaryMedia = media[0];
  if (parsed.data.status === "active" && !primaryMedia && !image.file) {
    return validationError("Add a product image before publishing this listing.", {
      image: ["A product image is required for an active listing."],
    });
  }

  const requestedStatus = parsed.data.status;
  const deferPublishUntilMedia = requestedStatus === "active" && !primaryMedia;
  const nextRow = {
    ...productValuesToRow(parsed.data),
    stock_on_hand: existing.stock_on_hand,
  };
  const { error: updateError } = await supabase
    .from("products")
    .update(deferPublishUntilMedia ? { ...nextRow, status: "draft" } : nextRow)
    .eq("id", id.data);

  if (updateError) {
    return validationError(databaseMessage(updateError.message, updateError.code));
  }

  if (image.file) {
    const upload = await uploadProductImage(supabase, id.data, image.file);
    if (upload.error || !upload.path) {
      revalidateStorefront(existing.slug);
      return validationError(`Product details were saved, but the image upload failed. ${upload.error?.message ?? "Try again."}`, {
        image: ["The new image could not be uploaded."],
      });
    }

    const mediaMutation = primaryMedia
      ? supabase
          .from("product_media")
          .update({ storage_path: upload.path, alt_text: parsed.data.name })
          .eq("id", primaryMedia.id)
      : supabase.from("product_media").insert({
          product_id: id.data,
          storage_path: upload.path,
          alt_text: parsed.data.name,
          position: 0,
        });
    const { error: mediaError } = await mediaMutation;

    if (mediaError) {
      await supabase.storage.from("product-media").remove([upload.path]);
      revalidateStorefront(existing.slug);
      return validationError(`Product details were saved, but the new image could not be attached. ${mediaError.message}`, {
        image: ["The new image could not be attached."],
      });
    }
    if (primaryMedia) {
      await supabase.storage.from("product-media").remove([primaryMedia.storage_path]);
    }
  }

  if (deferPublishUntilMedia) {
    const { error: publishError } = await supabase
      .from("products")
      .update({ status: requestedStatus })
      .eq("id", id.data);
    if (publishError) {
      revalidateStorefront(existing.slug);
      return validationError(
        `The details and image were saved, but the listing remains a draft. ${publishError.message}`,
      );
    }
  }

  revalidateStorefront(existing.slug);
  if (existing.slug !== parsed.data.slug) revalidateStorefront(parsed.data.slug);
  revalidatePath(`/owner/products/${id.data}`);
  return { state: "success", message: "Product changes saved.", productId: id.data };
}
