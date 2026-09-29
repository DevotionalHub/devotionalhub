import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

/**
 * Brand logo + favicon used on the registration page. The image is served
 * directly to the browser so it renders without any server-side network access.
 */
const REGISTER_LOGO_URL =
  "https://res.cloudinary.com/nylncw2s/image/upload/v1790681059/a_Minimalist_modern_ap.png";

export const metadata: Metadata = {
  title: "Create account",
  icons: {
    icon: REGISTER_LOGO_URL,
    shortcut: REGISTER_LOGO_URL,
    apple: REGISTER_LOGO_URL,
  },
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Begin your journey"
      title="Make room for what matters."
      description="Create a free account to save devotionals and continue your Bible plan on any device."
      logoSrc={REGISTER_LOGO_URL}
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
