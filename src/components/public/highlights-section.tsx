import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatPrice, formatWhatsAppOrderLink } from "@/lib/utils";
import type { MenuItem } from "@/types";

interface HighlightsSectionProps {
  items: MenuItem[];
  whatsapp?: string;
}

export function HighlightsSection({ items, whatsapp }: HighlightsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="highlights-heading" className="menu-animate-in space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2
          id="highlights-heading"
          className="text-xl font-semibold text-[var(--menu-secondary)] sm:text-2xl"
        >
          Destaques da Casa
        </h2>
      </div>

      <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:gap-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="menu-card w-[200px] shrink-0 overflow-hidden sm:w-[220px]"
          >
            <div className="relative h-[120px] bg-[var(--menu-surface)]">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-[#999]">
                  Sem foto
                </div>
              )}
            </div>
            <div className="space-y-2 p-3">
              <h3 className="line-clamp-1 text-sm font-semibold text-[var(--menu-secondary)]">
                {item.name}
              </h3>
              <p
                className="text-base font-bold"
                style={{ color: "var(--menu-primary-dark)" }}
              >
                {formatPrice(item.price)}
              </p>
              {whatsapp && (
                <Link
                  href={formatWhatsAppOrderLink(
                    whatsapp,
                    `Olá! Gostaria de pedir: ${item.name}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--menu-secondary)]"
                >
                  Pedir
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
