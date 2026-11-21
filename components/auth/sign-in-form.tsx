"use client";

import { LoaderCircle, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function SignInForm({
  configured,
  nextPath,
  initialMessage = null,
  initialError = false,
}: {
  configured: boolean;
  nextPath: string;
  initialMessage?: string | null;
  initialError?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    configured
      ? initialMessage
      : "Supabase is not configured yet. Add the public project URL and publishable key to enable sign-in.",
  );
  const [isError, setIsError] = useState(initialError || !configured);

  async function requestSignInLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      setIsError(true);
      setMessage("Authentication is not configured.");
      return;
    }

    setLoading(true);
    setIsError(false);
    setMessage(null);
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("next", nextPath);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl.toString(),
        shouldCreateUser: true,
      },
    });
    setLoading(false);

    if (error) {
      setIsError(true);
      setMessage(error.message);
      return;
    }

    setMessage("Check your email for a secure sign-in link. New customers will have an account created automatically.");
  }

  return (
    <form className="form-stack" onSubmit={requestSignInLink}>
      <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" inputMode="email" autoComplete="email" required disabled={!configured || loading} /></div>
      <button className="button button-dark button-full" type="submit" disabled={!configured || loading}>
        {loading ? <LoaderCircle size={17} aria-hidden /> : <Mail size={17} aria-hidden />}
        {loading ? "Sending link…" : "Continue with email"}
      </button>
      {message ? <p className={`form-message${isError ? " form-message-error" : ""}`} role="status" aria-live="polite">{message}</p> : null}
    </form>
  );
}
