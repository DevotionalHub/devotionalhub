import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/brand-logo";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  /** Optional remote logo image used for both the desktop and mobile brand marks. */
  logoSrc?: string;
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  logoSrc,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="Welcome to DevotionalHub">
        <div className="auth-story__glow auth-story__glow--one" />
        <div className="auth-story__glow auth-story__glow--two" />
        <div className="auth-story__top">
          <BrandLogo inverse logoSrc={logoSrc} />
          <Link className="auth-back" href="/">
            <ArrowLeft size={16} />
            Back home
          </Link>
        </div>

        <div className="auth-story__content">
          <p className="auth-story__kicker">A quieter rhythm for every day</p>
          <blockquote>
            “Your word is a lamp to my feet, and a light for my path.”
          </blockquote>
          <p className="auth-story__reference">Psalm 119:105 · WEB</p>
        </div>

        <div className="auth-story__note">
          <ShieldCheck size={18} />
          <span>Your reading and prayer progress stays private.</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel__inner">
          <div className="auth-mobile-brand">
            <BrandLogo logoSrc={logoSrc} />
            <Link href="/" aria-label="Back home">
              <ArrowLeft size={18} />
            </Link>
          </div>

          <header className="auth-heading">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>

          {children}

          <div className="auth-footer">{footer}</div>
        </div>
      </section>
    </main>
  );
}
