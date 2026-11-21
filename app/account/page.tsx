import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/auth/profile-form";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getAccountSession } from "@/lib/auth/account";
import { formatUsd } from "@/lib/commerce/money";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));

const formatStatus = (value: string) => value.replaceAll("_", " ");

export default async function AccountPage() {
  const session = await getAccountSession();

  if (session.state === "signed_out") {
    redirect("/auth/sign-in?next=/account");
  }

  if (session.state === "not_configured") {
    redirect("/auth/sign-in?next=/account");
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/auth/sign-in?next=/account");

  const [{ data: profile }, { data: orders, error: ordersError }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", session.userId)
      .maybeSingle(),
    supabase
      .from("orders")
      .select("order_number, created_at, payment_status, fulfillment_status, total_cents, tracking_number")
      .eq("customer_user_id", session.userId)
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  return (
    <section className="account-shell page-shell">
      <div className="account-hero">
        <div>
          <span className="showroom-eyebrow">YOUR BETTA FREAKS ACCOUNT</span>
          <h1>Welcome back.</h1>
          <p>{session.email}</p>
        </div>
        <div className="account-hero-actions">
          {session.isStaff ? <Link className="button button-coral" href="/owner">Owner workspace</Link> : null}
          <SignOutButton />
        </div>
      </div>

      <div className="account-grid">
        <section className="account-panel" aria-labelledby="profile-heading">
          <span className="account-panel-number">01</span>
          <div className="account-panel-heading">
            <h2 id="profile-heading">Profile</h2>
            <p>Keep the contact details used for order updates current.</p>
          </div>
          <ProfileForm fullName={profile?.full_name ?? null} phone={profile?.phone ?? null} />
        </section>

        <section className="account-panel account-orders-panel" aria-labelledby="orders-heading">
          <span className="account-panel-number">02</span>
          <div className="account-panel-heading">
            <h2 id="orders-heading">Orders</h2>
            <p>Payment, fulfillment, and tracking for purchases linked to this account.</p>
          </div>

          {ordersError ? (
            <div className="account-empty"><p>Order history is temporarily unavailable.</p></div>
          ) : orders && orders.length > 0 ? (
            <div className="account-order-list">
              {orders.map((order) => (
                <article className="account-order" key={order.order_number}>
                  <div>
                    <span>{formatDate(order.created_at)}</span>
                    <strong>Order {order.order_number}</strong>
                  </div>
                  <div className="account-order-statuses">
                    <span>{formatStatus(order.payment_status)}</span>
                    <span>{formatStatus(order.fulfillment_status)}</span>
                  </div>
                  <strong className="account-order-total">{formatUsd(order.total_cents)}</strong>
                  {order.tracking_number ? <p>Tracking: {order.tracking_number}</p> : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="account-empty">
              <p>No orders are linked to this account yet.</p>
              <Link href="/new-arrivals">Explore available fish</Link>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
