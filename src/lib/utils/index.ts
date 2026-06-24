export { cn } from "./cn";
export {
  centsToDigits,
  digitsToCents,
  formatDigitsAsPrice,
} from "./price";

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatWhatsAppLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function formatWhatsAppOrderLink(
  phone: string,
  message: string,
): string {
  return `${formatWhatsAppLink(phone)}?text=${encodeURIComponent(message)}`;
}
