import { NextResponse, type NextRequest } from "next/server";

import { getSafeNextPath } from "@/lib/auth/redirect";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const destination = getSafeNextPath(request.nextUrl.searchParams.get("next"));
  const supabase = await createServerSupabaseClient();

  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  const retryUrl = new URL("/auth/sign-in", request.url);
  retryUrl.searchParams.set("error", "authentication_failed");
  retryUrl.searchParams.set("next", destination);
  return NextResponse.redirect(retryUrl);
}
