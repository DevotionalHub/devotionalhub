import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Choose a new password" };

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Secure your account"
      title="Choose a new password."
      description="Use at least eight characters and choose something you don’t use elsewhere."
      footer={
        <p>
          Return to <Link href="/login">sign in</Link>
        </p>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
