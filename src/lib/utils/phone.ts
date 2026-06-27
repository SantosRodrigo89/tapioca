export function stripPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function formatPartialNational(digits: string): string {
  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : "";
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function formatCompleteNational(digits: string): string | null {
  if (digits.length === 11) {
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }
  if (digits.length === 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }
  return null;
}

/** Formats a stored digit string for display (admin inputs and landing page). */
export function formatPhoneNumber(value: string | undefined | null): string {
  const digits = stripPhoneDigits(value ?? "");
  if (!digits) return "";

  if (digits.startsWith("55") && digits.length > 2) {
    const national = digits.slice(2);
    const complete = formatCompleteNational(national);
    if (complete) return `+55 ${complete}`;
    return `+55 ${formatPartialNational(national)}`;
  }

  return formatCompleteNational(digits) ?? formatPartialNational(digits);
}

/** Applies mask while typing; store the return value of {@link normalizePhoneInput} in state. */
export function formatPhoneInputValue(digits: string): string {
  if (!digits) return "";

  if (digits.startsWith("55")) {
    const national = digits.slice(2);
    if (national.length === 0) return "+55 ";
    return `+55 ${formatPartialNational(national)}`;
  }

  return formatPartialNational(digits);
}

export function normalizePhoneInput(value: string, maxDigits: number): string {
  return stripPhoneDigits(value).slice(0, maxDigits);
}
