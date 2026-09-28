import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { safeNextPath } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

interface LoginPageProps {
  searchParams: Promise<{
    next?: string;
    message?: string;
    error?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorMessage = params.error
    ? "We could not complete that sign-in link. Please try again."
    : undefined;

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Continue your daily walk."
      description="Sign in to keep your reading plan, prayers, and progress together."
      footer={
        <p>
          New to DevotionalHub? <Link href="/register">Create an account</Link>
        </p>
      }
    >
      <LoginForm
        nextPath={safeNextPath(params.next)}
        initialMessage={params.message}
        initialError={errorMessage}
      />
    </AuthShell>
  );
}
