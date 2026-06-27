import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { formatWhatsAppOrderLink } from "@/lib/utils";
import { formatMenuItemPrice } from "@/lib/pricing";
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
    <div className="space-y-8">
      <ScrollReveal>
        <div className="space-y-2">
          <h2 className="landing-heading">Destaques da Casa</h2>
          <p className="landing-subheading">
            Os favoritos dos nossos clientes
          </p>
        </div>
      </ScrollReveal>

      <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:gap-5 sm:px-6">
        {entries.map(({ item, category }, index) => {
          const status = getItemAvailabilityStatus(item, category);

          return (
            <ScrollReveal
              key={item.id}
              delay={index * 80}
              as="article"
              className={`menu-card w-[260px] shrink-0 overflow-hidden sm:w-[280px] ${
                !status.orderable ? "opacity-75" : ""
              }`}
            >
                <div className="relative h-[180px] bg-[var(--menu-surface)] sm:h-[200px]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#999]">
                      Sem foto
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <h3 className="line-clamp-1 text-base font-semibold text-[var(--menu-secondary)] sm:text-lg">
                    {item.name}
                  </h3>
                  <p
                    className="text-xl font-bold"
                    style={{ color: "var(--menu-primary-dark)" }}
                  >
                    {formatMenuItemPrice(item)}
                  </p>
                  {!status.orderable && status.label && (
                    <p className="inline-flex items-center gap-1 text-xs font-medium text-[#999]">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">{status.label}</span>
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
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-[var(--menu-secondary)] transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{ backgroundColor: "var(--menu-primary)" }}
                    >
                      Pedir
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : whatsapp ? (
                    <span className="text-xs font-medium text-[#999]">
                      Fora do horário
                    </span>
                  ) : null}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
