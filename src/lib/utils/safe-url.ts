const BLOCKED_SCHEMES = /^(javascript|data|vbscript|file|blob):/i;

const ALLOWED_ABSOLUTE_SCHEMES = new Set(["https:", "http:", "tel:", "mailto:"]);

export function isSafeHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;
  if (BLOCKED_SCHEMES.test(trimmed)) return false;

  if (trimmed.startsWith("/")) {
    return !trimmed.startsWith("//");
  }

  if (trimmed.startsWith("#")) return true;

  try {
    const url = new URL(trimmed);
    return ALLOWED_ABSOLUTE_SCHEMES.has(url.protocol);
  } catch {
    return false;
  }
}

/** Returns href if safe, otherwise undefined. */
export function sanitizeHref(href: string | undefined | null): string | undefined {
  if (!href) return undefined;
  return isSafeHref(href) ? href.trim() : undefined;
}

export function normalizeInstagram(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith("@")) {
    const handle = trimmed.slice(1).replace(/[^a-zA-Z0-9._]/g, "");
    return handle ? `https://instagram.com/${handle}` : undefined;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return isSafeHref(trimmed) ? trimmed : undefined;
  }

  const handle = trimmed.replace(/^instagram\.com\/?/i, "").replace(/^@/, "");
  const safe = handle.replace(/[^a-zA-Z0-9._]/g, "");
  return safe ? `https://instagram.com/${safe}` : undefined;
}

export function normalizeFacebook(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (/^https?:\/\//i.test(trimmed)) {
    return isSafeHref(trimmed) ? trimmed : undefined;
  }

  const slug = trimmed.replace(/^facebook\.com\/?/i, "").replace(/[^a-zA-Z0-9._-]/g, "");
  return slug ? `https://facebook.com/${slug}` : undefined;
}

export function normalizeTiktok(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith("@")) {
    const handle = trimmed.slice(1).replace(/[^a-zA-Z0-9._]/g, "");
    return handle ? `https://tiktok.com/@${handle}` : undefined;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return isSafeHref(trimmed) ? trimmed : undefined;
  }

  const handle = trimmed.replace(/^tiktok\.com\/@?/i, "").replace(/[^a-zA-Z0-9._]/g, "");
  return handle ? `https://tiktok.com/@${handle}` : undefined;
}

export function normalizeExternalUrl(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (isSafeHref(trimmed)) return trimmed;
  return undefined;
}
