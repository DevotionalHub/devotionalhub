"use client";

import { ArrowRight, LoaderCircle, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { FormMessage } from "@/components/auth/form-message";
import { PasswordField } from "@/components/auth/password-field";
import { friendlyAuthError, getRedirectBase } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_CONFIG_MESSAGE } from "@/lib/supabase/config";

export function RegisterForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const displayName = String(form.get("displayName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("The two passwords do not match.");
      setPending(false);
      return;
    }

    const form_ = event.currentTarget;

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: `${getRedirectBase()}/auth/callback?next=/today`,
        },
      });

      if (signUpError) {
        setError(friendlyAuthError(signUpError.message));
        setPending(false);
        return;
      }

      if (data.session) {
        router.replace("/today");
        router.refresh();
        return;
      }

      setSuccess(
        "Your account has been created. Check your inbox to confirm your email, then sign in.",
      );
      form_.reset();
      setPending(false);
    } catch {
      setError(SUPABASE_CONFIG_MESSAGE);
      setPending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error ? <FormMessage message={error} type="error" /> : null}
      {success ? <FormMessage message={success} type="success" /> : null}

      <div className="field-group">
        <label htmlFor="displayName">First name or display name</label>
        <div className="input-wrap">
          <UserRound aria-hidden="true" size={18} />
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            placeholder="How should we address you?"
            minLength={2}
            maxLength={80}
            required
          />
        </div>
      </div>

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

      <PasswordField
        id="password"
        label="Password"
        name="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="Enter it once more"
      />

      <label className="check-row">
        <input name="terms" type="checkbox" required />
        <span>
          I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
        </span>
      </label>

      <button className="button button--primary button--full" disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="spin" size={18} />
            Creating account…
          </>
        ) : (
          <>
            Create my account
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
