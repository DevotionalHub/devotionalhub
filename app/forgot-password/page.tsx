import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Let’s get you back in."
      description="Enter your email and we’ll send you a secure link to choose a new password."
      footer={
        <p>
          Remembered your password? <Link href="/login">Return to sign in</Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
