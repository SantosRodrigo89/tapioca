import Image from "next/image";
import Link from "next/link";
import { Clock, Plus } from "lucide-react";
import { formatPrice, formatWhatsAppOrderLink } from "@/lib/utils";
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
  const imageSize = "h-[104px] w-[104px] sm:h-[112px] sm:w-[112px]";

  return (
    <article
      className={`menu-card menu-animate-in flex gap-3 p-3 sm:gap-4 sm:p-4 ${
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
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-[#999]">
            Sem foto
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-snug text-[var(--menu-secondary)] sm:text-lg">
              {item.name}
            </h3>
            <p
              className="shrink-0 text-lg font-bold sm:text-xl"
              style={{ color: "var(--menu-primary-dark)" }}
            >
              {formatPrice(item.price)}
            </p>
          </div>
          {item.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-[#777]">
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

        {whatsapp && status.orderable ? (
          <Link
            href={formatWhatsAppOrderLink(
              whatsapp,
              `Olá! Gostaria de pedir: ${item.name}`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--menu-secondary)] transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "var(--menu-primary)" }}
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Link>
        ) : whatsapp ? (
          <span className="text-xs font-medium text-[#999]">
            Fora do horário de pedido
          </span>
        ) : (
          <span className="text-xs text-[#999]">Pedidos indisponíveis</span>
        )}
      </div>
    </article>
  );
}
