import Link from "next/link";
import { sanitizeHref } from "@/lib/utils/safe-url";

interface SafeExternalLinkProps {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  ariaLabel?: string;
}

/** Renders a link only when href passes safety checks. */
export function SafeExternalLink({
  href,
  className,
  style,
  children,
  ariaLabel,
}: SafeExternalLinkProps) {
  const safe = sanitizeHref(href);
  if (!safe) return null;

  const isExternal = /^https?:\/\//i.test(safe);

  if (isExternal) {
    return (
      <a
        href={safe}
        className={className}
        style={style}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={safe} className={className} style={style} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
