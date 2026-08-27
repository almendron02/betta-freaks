"use client";

import { ImagePlus, Save } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import {
  initialProductActionState,
  type ProductActionState,
  type ProductFormField,
} from "@/lib/commerce/product-form";
import type { ManagedProduct } from "@/lib/catalog/product-record";

type ProductAction = (
  state: ProductActionState,
  formData: FormData,
) => Promise<ProductActionState>;

const previewAction: ProductAction = async () => ({
  state: "idle",
  message: "Preview forms do not save data.",
});

export function OwnerProductForm({
  productAction,
  product,
  preview = false,
}: {
  productAction?: ProductAction;
  product?: ManagedProduct;
  preview?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    productAction ?? previewAction,
    initialProductActionState,
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form
      action={formAction}
      className="owner-product-form"
      onSubmit={preview ? (event) => event.preventDefault() : undefined}
    >
      <div className="owner-form-intro">
        <div>
          <span className="eyebrow">Catalog editor</span>
          <h1>{product ? `Edit ${product.shortName}` : "Add a product"}</h1>
          <p>
            Save incomplete work as a draft. Active products need available stock and a clear product image.
          </p>
        </div>
        <div className="owner-form-actions">
          <Link className="button button-outline" href={preview ? "/preview/owner/products" : "/owner/products"}>
            Cancel
          </Link>
          <button className="button button-dark" type="submit" disabled={pending || preview}>
            <Save size={16} /> {pending ? "Saving…" : preview ? "Preview only" : "Save product"}
          </button>
        </div>
      </div>

      {preview ? (
        <div className="form-message">This is a safe UI preview. Connect Supabase and sign in as staff to save inventory.</div>
      ) : null}
      {state.message ? (
        <div className={`form-message${state.state === "error" ? " form-message-error" : " form-message-success"}`} aria-live="polite">
          {state.message}
          {state.state === "success" && state.productId ? (
            <> <Link href={`/owner/products/${state.productId}`}>Open saved product</Link></>
          ) : null}
        </div>
      ) : null}

      <div className="owner-form-layout">
        <section className="owner-panel owner-form-panel">
          <div className="panel-heading"><div><span className="owner-step">01</span><h2>Listing details</h2></div></div>
          <div className="owner-field-grid">
            <Field label="Full name" name="name" error={firstError(errors, "name")} wide>
              <input id="name" name="name" required defaultValue={product?.name} placeholder="Crimson Rosetail Male" />
            </Field>
            <Field label="Short card name" name="shortName" error={firstError(errors, "shortName")}>
              <input id="shortName" name="shortName" required defaultValue={product?.shortName} placeholder="Crimson Rosetail" />
            </Field>
            <Field label="SKU" name="sku" error={firstError(errors, "sku")}>
              <input id="sku" name="sku" required defaultValue={product?.sku} placeholder="BF-2026-001" autoCapitalize="characters" />
            </Field>
            <Field label="URL slug" name="slug" error={firstError(errors, "slug")} wide hint="Spaces are converted to hyphens automatically.">
              <input id="slug" name="slug" required defaultValue={product?.slug} placeholder="crimson-rosetail-male" />
            </Field>
            <Field label="Description" name="description" error={firstError(errors, "description")} wide>
              <textarea id="description" name="description" required rows={6} defaultValue={product?.description} placeholder="Describe the exact specimen, its form, color, and notable qualities." />
            </Field>
          </div>
        </section>

        <aside className="owner-panel owner-form-panel owner-media-panel">
          <div className="panel-heading"><div><span className="owner-step">02</span><h2>Primary image</h2></div></div>
          {product?.mediaCount ? (
            // A native img is intentional here: owner uploads can point at any Supabase project host.
            // eslint-disable-next-line @next/next/no-img-element
            <img className="owner-product-image" src={product.image} alt={product.imageAlt} />
          ) : (
            <div className="owner-image-placeholder"><ImagePlus size={30} /><span>Image required to publish</span></div>
          )}
          <Field label={product?.mediaCount ? "Replace image" : "Product image"} name="image" error={firstError(errors, "image")} hint="JPG, PNG, or WebP. Maximum 5 MB.">
            <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" />
          </Field>
        </aside>

        <section className="owner-panel owner-form-panel">
          <div className="panel-heading"><div><span className="owner-step">03</span><h2>Fish and product data</h2></div></div>
          <div className="owner-field-grid">
            <Field label="Product type" name="productType" error={firstError(errors, "productType")}>
              <select id="productType" name="productType" defaultValue={product?.type ?? "fish"}>
                <option value="fish">Betta fish</option>
                <option value="accessory">Accessory</option>
                <option value="live_food">Live food</option>
              </select>
            </Field>
            <Field label="Sex" name="sex" error={firstError(errors, "sex")}>
              <select id="sex" name="sex" defaultValue={product?.sex ?? ""}>
                <option value="">Not applicable</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </Field>
            <Field label="Variety" name="variety" error={firstError(errors, "variety")}>
              <input id="variety" name="variety" defaultValue={product?.variety} placeholder="Rosetail" />
            </Field>
            <Field label="Color" name="color" error={firstError(errors, "color")}>
              <input id="color" name="color" defaultValue={product?.color} placeholder="Crimson red" />
            </Field>
            <Field label="Tail type" name="tailType" error={firstError(errors, "tailType")} wide>
              <input id="tailType" name="tailType" defaultValue={product?.tailType} placeholder="Halfmoon" />
            </Field>
          </div>
        </section>

        <section className="owner-panel owner-form-panel">
          <div className="panel-heading"><div><span className="owner-step">04</span><h2>Price and availability</h2></div></div>
          <div className="owner-field-grid">
            <Field label="Price (USD)" name="price" error={firstError(errors, "price")}>
              <input id="price" name="price" inputMode="decimal" required defaultValue={product ? (product.priceCents / 100).toFixed(2) : ""} placeholder="85.00" />
            </Field>
            <Field
              label="Stock on hand"
              name="stockOnHand"
              error={firstError(errors, "stockOnHand")}
              hint={product ? "Use the inventory workspace to keep an audit record." : "Opening stock is recorded as the first movement."}
            >
              <input
                id="stockOnHand"
                name="stockOnHand"
                type="number"
                min="0"
                max="10000"
                required
                readOnly={Boolean(product)}
                defaultValue={product?.stockOnHand ?? 1}
              />
              {product ? <Link className="field-inline-link" href="/owner/inventory">Adjust stock →</Link> : null}
            </Field>
            <Field label="Status" name="status" error={firstError(errors, "status")} wide>
              <select id="status" name="status" defaultValue={product?.status ?? "draft"}>
                <option value="draft">Draft</option>
                <option value="active">Active — visible in store</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <label className="owner-checkbox">
              <input name="isExactFish" type="checkbox" defaultChecked={product?.isExactFish ?? true} />
              <span><strong>Exact fish</strong><small>Limit inventory to one photographed specimen.</small></span>
            </label>
            <label className="owner-checkbox">
              <input name="featured" type="checkbox" defaultChecked={product?.featured ?? false} />
              <span><strong>Featured</strong><small>Prioritize this listing in storefront selections.</small></span>
            </label>
          </div>
        </section>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  hint,
  wide = false,
  children,
}: {
  label: string;
  name: ProductFormField;
  error?: string;
  hint?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`field${wide ? " owner-field-wide" : ""}`}>
      <label htmlFor={name}>{label}</label>
      {children}
      {error ? <small className="field-error">{error}</small> : hint ? <small className="field-hint">{hint}</small> : null}
    </div>
  );
}

const firstError = (
  errors: Partial<Record<ProductFormField, string[]>>,
  field: ProductFormField,
) => errors[field]?.[0];
