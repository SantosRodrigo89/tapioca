/** Extract city name from a Brazilian address string (UI-only helper). */
export function extractCityFromAddress(address?: string): string | null {
  if (!address?.trim()) return null;

  const trimmed = address.trim();

  // Pattern: "..., City/UF" or "..., City - UF"
  const slashMatch = trimmed.match(/,\s*([^,/]+)\s*\/\s*[A-Z]{2}\s*$/i);
  if (slashMatch?.[1]) return slashMatch[1].trim();

  const dashMatch = trimmed.match(/,\s*([^,]+)\s*-\s*[A-Z]{2}\s*$/i);
  if (dashMatch?.[1]) return dashMatch[1].trim();

  // Fallback: last segment after comma
  const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const last = parts[parts.length - 1]!;
    // Strip UF suffix if present
    return last.replace(/\s*[-/]\s*[A-Z]{2}$/i, "").trim() || null;
  }

  return null;
}
