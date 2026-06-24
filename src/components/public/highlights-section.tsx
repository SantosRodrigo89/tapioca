import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { formatPrice, formatWhatsAppOrderLink } from "@/lib/utils";
import { getItemAvailabilityStatus } from "@/lib/utils/availability";
import type { Category, MenuItem } from "@/types";

export interface HighlightEntry {
  item: MenuItem;
  category: Category;
}

interface HighlightsSectionProps {
  entries: HighlightEntry[];
  whatsapp?: string;
}

export function HighlightsSection({
  entries,
  whatsapp,
}: HighlightsSectionProps) {
  if (entries.length === 0) return null;

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
        {entries.map(({ item, category }) => {
          const status = getItemAvailabilityStatus(item, category);

          return (
            <article
              key={item.id}
              className={`menu-card w-[200px] shrink-0 overflow-hidden sm:w-[220px] ${
                !status.orderable ? "opacity-75" : ""
              }`}
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
                {!status.orderable && status.label && (
                  <p className="inline-flex items-center gap-1 text-[10px] font-medium text-[#999]">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span className="line-clamp-2">{status.label}</span>
                  </p>
                )}
                {whatsapp && status.orderable ? (
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
                ) : whatsapp ? (
                  <span className="text-[10px] font-medium text-[#999]">
                    Fora do horário
                  </span>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
