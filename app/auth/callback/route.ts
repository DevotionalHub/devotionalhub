import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { safeNextPath } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles the redirect back from a Supabase authentication email (account
 * confirmation, magic link, or password recovery).
 *
 * Supabase may hand us either:
 *   - a PKCE `code` to exchange for a session, or
 *   - a `token_hash` + `type` pair to verify directly.
 *
 * We support both so confirmation links work regardless of the project's email
 * template style, and we always land the reader somewhere useful instead of a
 * dead page.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const authError =
    url.searchParams.get("error_description") ??
    url.searchParams.get("error");
  const next = safeNextPath(url.searchParams.get("next") ?? undefined);

  // Supabase reported a problem (e.g. an expired confirmation link).
  if (authError) {
    return NextResponse.redirect(
      new URL("/login?error=confirmation_failed", url.origin),
    );
  }

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=confirmation_failed", url.origin),
  );
}
