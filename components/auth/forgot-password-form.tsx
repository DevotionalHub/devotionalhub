"use client";

import { ArrowRight, LoaderCircle, Mail } from "lucide-react";
import { FormEvent, useState } from "react";

import { FormMessage } from "@/components/auth/form-message";
import { friendlyAuthError } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` },
    );

    if (resetError) {
      setError(friendlyAuthError(resetError.message));
    } else {
      setSuccess(
        "If an account exists for that email, a password reset link is on its way.",
      );
      event.currentTarget.reset();
    }

    setPending(false);
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error ? <FormMessage message={error} type="error" /> : null}
      {success ? <FormMessage message={success} type="success" /> : null}

      <div className="field-group">
        <label htmlFor="email">Email address</label>
        <div className="input-wrap">
          <Mail aria-hidden="true" size={18} />
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <button className="button button--primary button--full" disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="spin" size={18} />
            Sending link…
          </>
        ) : (
          <>
            Send reset link
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
