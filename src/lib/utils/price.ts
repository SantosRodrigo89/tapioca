export function centsToDigits(cents: number): string {
  return String(Math.max(0, Math.round(cents)));
}

export function digitsToCents(digits: string): number {
  const n = parseInt(digits.replace(/\D/g, "") || "0", 10);
  return Number.isFinite(n) ? n : 0;
}

export function formatDigitsAsPrice(digits: string): string {
  const cents = digitsToCents(digits);
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
