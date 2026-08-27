import type { Metadata } from "next";

import { SignInForm } from "@/components/auth/sign-in-form";
import { hasSupabaseEnvironment } from "@/lib/env";

export const metadata: Metadata = { title: "Owner Sign In" };

export default async function SignInPage({
  searchParams,
}: PageProps<"/auth/sign-in">) {
  const { error } = await searchParams;
  const authFailed = error === "authentication_failed";

  return (
    <section className="auth-section page-shell">
      <div className="auth-card">
        <span className="eyebrow">Private access</span>
        <h1>Owner sign in</h1>
        <p>Enter your approved owner or manager email. We will send a secure, one-time sign-in link.</p>
        <SignInForm
          configured={hasSupabaseEnvironment()}
          initialError={authFailed}
          initialMessage={authFailed ? "That sign-in link is invalid or expired. Request a new one below." : null}
        />
      </div>
    </section>
  );
}
