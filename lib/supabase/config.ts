const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Friendly, user-facing message shown when the Supabase environment variables
 * have not been provided (for example, when the required values are missing from
 * the Netlify site settings). It avoids leaking configuration details while
 * still telling the reader that the problem is on our side, not theirs.
 */
export const SUPABASE_CONFIG_MESSAGE =
  "Sign-in is temporarily unavailable while the site finishes setup. Please try again shortly.";

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

export function getSupabaseConfig() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  return { supabaseUrl, supabasePublishableKey };
}
