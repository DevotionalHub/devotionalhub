import { BookOpenText, Sparkles } from "lucide-react";
import Link from "next/link";

interface BrandLogoProps {
  href?: string;
  inverse?: boolean;
}

export function BrandLogo({ href = "/", inverse = false }: BrandLogoProps) {
  return (
    <Link
      className={`brand-logo${inverse ? " brand-logo--inverse" : ""}`}
      href={href}
      aria-label="DevotionalHub home"
    >
      <span className="brand-logo__mark" aria-hidden="true">
        <BookOpenText size={22} strokeWidth={1.8} />
        <Sparkles className="brand-logo__spark" size={10} />
      </span>
      <span>DevotionalHub</span>
    </Link>
  );
}
