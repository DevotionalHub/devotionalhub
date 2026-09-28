"use client";

import { ArrowRight, LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { FormMessage } from "@/components/auth/form-message";
import { PasswordField } from "@/components/auth/password-field";
import { friendlyAuthError } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

interface LoginFormProps {
  nextPath: string;
  initialMessage?: string;
  initialError?: string;
}

export function LoginForm({
  nextPath,
  initialMessage,
  initialError,
}: LoginFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(friendlyAuthError(signInError.message));
      setPending(false);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {initialMessage ? (
        <FormMessage message={initialMessage} type="success" />
      ) : null}
      {initialError ? (
        <FormMessage message={initialError} type="error" />
      ) : null}
      {error ? <FormMessage message={error} type="error" /> : null}

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

      <div className="field-row-label">
        <span>Password</span>
        <Link href="/forgot-password">Forgot password?</Link>
      </div>
      <PasswordField
        id="password"
        label=""
        name="password"
        autoComplete="current-password"
      />

      <button className="button button--primary button--full" disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="spin" size={18} />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
