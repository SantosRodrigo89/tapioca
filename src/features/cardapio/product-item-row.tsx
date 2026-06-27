"use client";

import { Clock, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableItemRow } from "@/components/admin/catalog-sortable";
import { ItemThumbnail } from "@/components/admin/item-thumbnail";
import { formatMenuItemPrice } from "@/lib/pricing";
import {
  formatAvailabilitySummary,
  getItemAvailabilityStatus,
} from "@/lib/utils/availability";
import { itemDndId } from "@/lib/utils/reorder";
import type { Category, MenuItem } from "@/types";

interface ProductItemRowProps {
  category: Category;
  item: MenuItem;
  disabled: boolean;
  onToggleAvailable: (available: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductItemRow({
  category,
  item,
  disabled,
  onToggleAvailable,
  onEdit,
  onDelete,
}: ProductItemRowProps) {
  const scheduleLabel =
    formatAvailabilitySummary(item.availability) ??
    (!item.availability?.enabled
      ? formatAvailabilitySummary(category.availability)
      : null);
  const status = getItemAvailabilityStatus(item, category);

  return (
    <SortableItemRow
      id={itemDndId(category.id, item.id)}
      disabled={disabled}
    >
      <ItemThumbnail src={item.imageUrl} alt={item.name} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate">
            {item.description}
          </p>
        )}
        <p className="text-sm font-semibold mt-0.5">
          {formatMenuItemPrice(item)}
        </p>
        {scheduleLabel && (
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {scheduleLabel}
              {!status.orderable && " · fora do horário"}
            </span>
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={item.available}
        onClick={() => onToggleAvailable(!item.available)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          item.available ? "bg-primary" : "bg-input"
        }`}
        title={item.available ? "Disponível" : "Indisponível"}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            item.available ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>

      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 shrink-0"
        onClick={onEdit}
        aria-label="Editar produto"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
        onClick={onDelete}
        aria-label="Excluir produto"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </SortableItemRow>
  );
}
