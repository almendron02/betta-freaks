import { ArrowUpRight, Fish, PackageCheck, ShoppingBag, WalletCards } from "lucide-react";
import Link from "next/link";

import type { Product } from "@/lib/commerce/types";
import { previewManagedProducts } from "@/lib/owner/preview-products";
import { formatUsd } from "@/lib/commerce/money";

export function DashboardPreview({
  authenticatedEmail,
  products = previewManagedProducts,
  preview = false,
}: {
  authenticatedEmail?: string | null;
  products?: Product[];
  preview?: boolean;
}) {
  const productsPath = preview ? "/preview/owner/products" : "/owner/products";
  const inventoryPath = preview ? "/preview/owner/inventory" : "/owner/inventory";

  return (
    <section className="owner-shell page-shell">
      <div className="owner-topbar">
        <div><span className="eyebrow">Owner workspace</span><h1>Store overview</h1></div>
        <div><span className="owner-status">{authenticatedEmail ? "Connected" : "Interactive preview"}</span>{authenticatedEmail ? <p className="catalog-count">{authenticatedEmail}</p> : null}</div>
      </div>
      <div className="metric-grid">
        <Metric icon={<ShoppingBag size={17} />} label="Orders today" value="0" />
        <Metric icon={<WalletCards size={17} />} label="Gross sales" value="$0" />
        <Metric icon={<Fish size={17} />} label="Catalog items" value={String(products.length)} />
        <Metric icon={<PackageCheck size={17} />} label="To fulfill" value="0" />
      </div>
      <div className="owner-grid">
        <section className="owner-panel">
          <div className="panel-heading"><h2>Inventory</h2><Link href={inventoryPath} className="button button-small button-dark">Manage stock</Link></div>
          {products.slice(0, 5).map((product) => (
            <div className="inventory-row" key={product.id}>
              <div><strong>{product.shortName}</strong><div className="catalog-count">{product.sku} · {formatUsd(product.priceCents)}</div></div>
              <span className={`status-chip status-${product.status}`}>{preview ? "Preview" : product.status}</span>
              <Link href={preview ? productsPath : `${productsPath}/${product.id}`} aria-label={`Manage ${product.name}`}><ArrowUpRight size={17} /></Link>
            </div>
          ))}
          <Link className="owner-panel-link" href={productsPath}>View all products <ArrowUpRight size={15} /></Link>
        </section>
        <section className="owner-panel">
          <div className="panel-heading"><h2>Recent orders</h2><span className="catalog-count">No live data</span></div>
          <div className="empty-state"><p>Paid orders will appear here after Stripe webhooks confirm payment.</p></div>
        </section>
      </div>
      <div className="owner-note"><strong>{preview ? "Preview state:" : "Protected workspace:"}</strong> {preview ? "this dashboard exposes no customer or payment data. Saving is disabled until Supabase is connected and the user has an active staff record." : "inventory changes are written through the signed-in staff session and checked by row-level security."}</div>
    </section>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="metric-card"><span>{icon} {label}</span><strong>{value}</strong></div>;
}
