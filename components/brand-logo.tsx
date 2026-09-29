import { BookOpenText, Sparkles } from "lucide-react";
import Link from "next/link";

interface BrandLogoProps {
  href?: string;
  inverse?: boolean;
  /**
   * Optional remote logo image. When provided the image is rendered in place of
   * the built-in icon mark. The image is loaded directly by the browser (not via
   * the Next.js image optimizer) so it works even when the server has no network.
   */
  logoSrc?: string;
  logoAlt?: string;
}

export function BrandLogo({
  href = "/",
  inverse = false,
  logoSrc,
  logoAlt = "DevotionalHub",
}: BrandLogoProps) {
  return (
    <Link
      className={`brand-logo${inverse ? " brand-logo--inverse" : ""}`}
      href={href}
      aria-label="DevotionalHub home"
    >
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="brand-logo__image"
          src={logoSrc}
          alt={logoAlt}
          width={38}
          height={38}
        />
      ) : (
        <span className="brand-logo__mark" aria-hidden="true">
          <BookOpenText size={22} strokeWidth={1.8} />
          <Sparkles className="brand-logo__spark" size={10} />
        </span>
      )}
      <span>DevotionalHub</span>
    </Link>
  );
}
