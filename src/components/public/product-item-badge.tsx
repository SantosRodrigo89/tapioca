import { cn } from "@/lib/utils";
import {
  MENU_ITEM_BADGE_LABELS,
  type MenuItemBadge,
} from "@/types/menu-item-badge";

interface ProductItemBadgeProps {
  badge: MenuItemBadge;
  className?: string;
}

export function ProductItemBadge({ badge, className }: ProductItemBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[var(--menu-primary)]/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--menu-primary-dark)]",
        className,
      )}
    >
      {MENU_ITEM_BADGE_LABELS[badge]}
    </span>
  );
}
