import { NextResponse, type NextRequest } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const safeDestination = (value: string | null) =>
  value?.startsWith("/") && !value.startsWith("//") ? value : "/owner";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const destination = safeDestination(request.nextUrl.searchParams.get("next"));
  const supabase = await createServerSupabaseClient();

  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  const retryUrl = new URL("/auth/sign-in", request.url);
  retryUrl.searchParams.set("error", "authentication_failed");
  return NextResponse.redirect(retryUrl);
}
