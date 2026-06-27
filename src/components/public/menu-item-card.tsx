import Image from "next/image";
import Link from "next/link";
import { Clock, Plus } from "lucide-react";
import { formatWhatsAppOrderLink } from "@/lib/utils";
import { formatMenuItemPrice } from "@/lib/pricing";
import { getItemAvailabilityStatus } from "@/lib/utils/availability";
import type { Category, MenuItem } from "@/types";

interface MenuItemCardProps {
  item: MenuItem;
  category: Category;
  whatsapp?: string;
}

export function MenuItemCard({
  item,
  category,
  whatsapp,
}: MenuItemCardProps) {
  const status = getItemAvailabilityStatus(item, category);
  const imageSize = "h-32 w-32 sm:h-40 sm:w-40";

  return (
    <article
      className={`menu-card flex h-full gap-4 p-4 sm:gap-5 sm:p-5 ${
        !status.orderable ? "opacity-75" : ""
      }`}
    >
      <div
        className={`relative ${imageSize} shrink-0 overflow-hidden rounded-xl bg-[var(--menu-surface)]`}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="160px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-[#999]">
            Sem foto
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-snug text-[var(--menu-secondary)] sm:text-xl">
            {item.name}
          </h3>
          {item.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-[#777] sm:text-base">
              {item.description}
            </p>
          )}
          {!status.orderable && status.label && (
            <p className="inline-flex items-center gap-1 text-xs font-medium text-[#999]">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {status.label}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <p
            className="text-xl font-bold sm:text-2xl"
            style={{ color: "var(--menu-primary-dark)" }}
          >
            {formatMenuItemPrice(item)}
          </p>

          {whatsapp && status.orderable ? (
            <Link
              href={formatWhatsAppOrderLink(
                whatsapp,
                `Olá! Gostaria de pedir: ${item.name}`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--menu-secondary)] transition-all hover:opacity-90 active:scale-[0.98] sm:rounded-full"
              style={{ backgroundColor: "var(--menu-primary)" }}
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </Link>
          ) : whatsapp ? (
            <span className="text-xs font-medium text-[#999]">
              Fora do horário
            </span>
          ) : (
            <span className="text-xs text-[#999]">Indisponível</span>
          )}
        </div>
      </div>
    </article>
  );
}
