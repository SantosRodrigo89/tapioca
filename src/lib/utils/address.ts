/** Extract city name from a Brazilian address string (UI-only helper). */
export function extractCityFromAddress(address?: string): string | null {
  if (!address?.trim()) return null;

  const trimmed = address.trim();

  // Pattern: "..., City/UF" or "..., City - UF"
  const slashMatch = trimmed.match(/,\s*([^,/]+)\s*\/\s*[A-Z]{2}\s*$/i);
  if (slashMatch?.[1]) return slashMatch[1].trim();

  const dashMatch = trimmed.match(/,\s*([^,]+)\s*-\s*[A-Z]{2}\s*$/i);
  if (dashMatch?.[1]) return dashMatch[1].trim();

  // Fallback: last segment after comma (skip house numbers like ", 518")
  const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const last = parts[parts.length - 1]!;
    const cityCandidate = last.replace(/\s*[-/]\s*[A-Z]{2}$/i, "").trim();
    if (/^\d+[A-Za-z]?$/.test(cityCandidate)) return null;
    return cityCandidate || null;
  }

  return null;
}

/** Compact location label for the hero (city when available, otherwise full address). */
export function getHeroLocationLabel(address?: string): string | null {
  if (!address?.trim()) return null;

  const city = extractCityFromAddress(address);
  if (city) return city;

  return address.trim();
}
