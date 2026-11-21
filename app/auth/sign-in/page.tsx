import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInForm } from "@/components/auth/sign-in-form";
import { PageHero } from "@/components/storefront/page-hero";
import { getSafeNextPath } from "@/lib/auth/redirect";
import { hasSupabaseEnvironment } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignInPage({
  searchParams,
}: PageProps<"/auth/sign-in">) {
  const { error, next } = await searchParams;
  const authFailed = error === "authentication_failed";
  const nextPath = getSafeNextPath(typeof next === "string" ? next : null);
  const ownerAccess = nextPath.startsWith("/owner");
  const supabase = await createServerSupabaseClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect(nextPath);
  }

  return (
    <>
      <PageHero eyebrow={ownerAccess ? "Protected staff access" : "Your account"} title={ownerAccess ? "Owner sign in" : "Welcome back"} description={ownerAccess ? "Authorized staff can securely continue to the store workspace." : "Use a one-time email link to access your profile and orders."} compact />
    <section className="auth-section page-shell editorial-form-section">
      <div className="auth-card">
        <span className="showroom-eyebrow">{ownerAccess ? "PROTECTED STAFF ACCESS" : "YOUR BETTA FREAKS ACCOUNT"}</span>
        <h1>{ownerAccess ? "Owner sign in" : "Sign in. No password needed."}</h1>
        <p>
          {ownerAccess
            ? "Use the email address tied to your owner invitation. Staff permissions are verified again before any store data can be changed."
            : "We will email you a one-time link. If this is your first visit, your customer account will be created automatically."}
        </p>
        <SignInForm
          configured={hasSupabaseEnvironment()}
          nextPath={nextPath}
          initialError={authFailed}
          initialMessage={authFailed ? "That sign-in link is invalid or expired. Request a new one below." : null}
        />
        <p className="auth-footnote">
          {ownerAccess ? <>Shopping today? <Link href="/auth/sign-in?next=/account">Use customer sign in</Link>.</> : <>Store staff can <Link href="/auth/sign-in?next=/owner">open the owner sign-in</Link>.</>}
        </p>
      </div>
    </section>
    </>
  );
}
