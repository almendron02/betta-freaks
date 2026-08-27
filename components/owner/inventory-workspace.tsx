import { ArrowLeft, ImageOff, Pencil } from "lucide-react";
import Link from "next/link";

import { InventoryAdjustmentForm } from "@/components/owner/inventory-adjustment-form";
import type { ManagedProduct } from "@/lib/catalog/product-record";
import {
  inventoryReasonLabels,
  type InventoryReason,
} from "@/lib/commerce/inventory-adjustment";
import type { InventoryMovement } from "@/lib/owner/inventory";

const movementDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function InventoryWorkspace({
  products,
  movements,
  preview = false,
}: {
  products: ManagedProduct[];
  movements: InventoryMovement[];
  preview?: boolean;
}) {
  const ownerPath = preview ? "/preview/owner" : "/owner";
  const productsPath = preview ? "/preview/owner/products" : "/owner/products";
  const unitsOnHand = products.reduce((total, product) => total + product.stockOnHand, 0);
  const availableListings = products.filter((product) => product.stockOnHand > 0).length;
  const outOfStock = products.filter((product) => product.stockOnHand === 0).length;

  return (
    <section className="owner-shell page-shell">
      <div className="owner-topbar">
        <div>
          <span className="eyebrow">{preview ? "Safe owner preview" : "Owner workspace"}</span>
          <h1>Inventory</h1>
          <p className="owner-subtitle">Adjust physical stock with a reason. Every change is recorded in the permanent movement log.</p>
        </div>
        <div className="owner-topbar-actions">
          <Link className="button button-outline" href={ownerPath}><ArrowLeft size={16} /> Dashboard</Link>
          <Link className="button button-coral" href={productsPath}>Products</Link>
        </div>
      </div>

      {preview ? <div className="owner-note"><strong>Preview state:</strong> controls are disabled and no live data is shown or changed.</div> : null}

      <div className="inventory-metrics" aria-label="Inventory totals">
        <div><span>Units on hand</span><strong>{unitsOnHand}</strong></div>
        <div><span>Listings with stock</span><strong>{availableListings}</strong></div>
        <div><span>Out of stock</span><strong>{outOfStock}</strong></div>
      </div>

      <div className="inventory-workspace-grid">
        <section className="owner-panel inventory-stock-panel">
          <div className="panel-heading">
            <div><span className="owner-step">01</span><h2>Stock adjustments</h2></div>
            <span className="catalog-count">{products.length} products</span>
          </div>
          {products.length === 0 ? (
            <div className="empty-state owner-empty-state">
              <h3>No products to adjust yet.</h3>
              <p>Create the first listing, then use this workspace for every stock correction.</p>
              <Link className="button button-coral" href={`${productsPath}/new`}>Add a product</Link>
            </div>
          ) : (
            <div className="inventory-adjustment-list">
              {products.map((product) => (
                <article className="inventory-adjustment-row" key={product.id}>
                  <div className="inventory-product-summary">
                    {product.mediaCount > 0 ? (
                      // Owner uploads can use the configured Supabase storage hostname.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image} alt={product.imageAlt} />
                    ) : (
                      <span className="owner-row-placeholder"><ImageOff size={20} /></span>
                    )}
                    <div>
                      <strong>{product.shortName}</strong>
                      <span>{product.sku} · {product.status}</span>
                    </div>
                    <div className="inventory-current-stock">
                      <strong>{product.stockOnHand}</strong>
                      <span>on hand</span>
                    </div>
                    <Link href={preview ? `${productsPath}/new` : `${productsPath}/${product.id}`} aria-label={`Edit ${product.name}`}><Pencil size={16} /></Link>
                  </div>
                  <InventoryAdjustmentForm productId={product.id} isExactFish={product.isExactFish} preview={preview} />
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="owner-panel inventory-history-panel">
          <div className="panel-heading">
            <div><span className="owner-step">02</span><h2>Movement log</h2></div>
            <span className="catalog-count">Latest 50</span>
          </div>
          {movements.length === 0 ? (
            <div className="empty-state"><p>The first recorded stock change will appear here.</p></div>
          ) : (
            <ol className="inventory-history-list">
              {movements.map((movement) => (
                <li key={movement.id}>
                  <div className="inventory-history-heading">
                    <strong>{movement.productName}</strong>
                    <span className={movement.quantityDelta > 0 ? "is-positive" : "is-negative"}>
                      {movement.quantityDelta > 0 ? "+" : ""}{movement.quantityDelta}
                    </span>
                  </div>
                  <p>{inventoryReasonLabels[movement.reason as InventoryReason] ?? movement.reason}</p>
                  {movement.note ? <blockquote>{movement.note}</blockquote> : null}
                  <time dateTime={movement.createdAt}>{movement.sku} · {movementDate.format(new Date(movement.createdAt))}</time>
                </li>
              ))}
            </ol>
          )}
        </aside>
      </div>
    </section>
  );
}
