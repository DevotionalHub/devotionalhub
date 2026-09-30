import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Begin your journey"
      title="Make room for what matters."
      description="Create a free account to save devotionals and continue your Bible plan on any device."
      footer={
        <p>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
