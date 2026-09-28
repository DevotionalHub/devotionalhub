"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { FormMessage } from "@/components/auth/form-message";
import { PasswordField } from "@/components/auth/password-field";
import { friendlyAuthError } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmPassword") ?? "");

    if (password !== confirmation) {
      setError("The two passwords do not match.");
      setPending(false);
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(friendlyAuthError(updateError.message));
      setPending(false);
      return;
    }

    router.replace("/login?message=Password updated. You can now sign in.");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error ? <FormMessage message={error} type="error" /> : null}

      <PasswordField
        id="password"
        label="New password"
        name="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
      />
      <PasswordField
        id="confirmPassword"
        label="Confirm new password"
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="Enter it once more"
      />

      <button className="button button--primary button--full" disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="spin" size={18} />
            Updating password…
          </>
        ) : (
          <>
            Save new password
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
