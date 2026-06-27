"use client";

import { Plus, Clock } from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatAvailabilitySummary } from "@/lib/utils/availability";
import { itemDndId } from "@/lib/utils/reorder";
import type { MenuItem } from "@/types";
import type { CategoryWithItems } from "@/features/cardapio/types";
import { ProductItemRow } from "@/features/cardapio/product-item-row";

interface ProductCategorySectionProps {
  category: CategoryWithItems;
  reordering: boolean;
  onAddProduct: () => void;
  onToggleAvailable: (
    categoryId: string,
    itemId: string,
    available: boolean,
  ) => void;
  onEditItem: (categoryId: string, item: MenuItem) => void;
  onDeleteItem: (categoryId: string, itemId: string, name: string) => void;
}

export function ProductCategorySection({
  category,
  reordering,
  onAddProduct,
  onToggleAvailable,
  onEditItem,
  onDeleteItem,
}: ProductCategorySectionProps) {
  return (
    <section className="rounded-lg border bg-card overflow-hidden">
      <div className="flex items-center gap-2 p-4">
        <span className="font-medium flex-1 truncate">{category.name}</span>
        {!category.active && (
          <Badge variant="secondary" className="shrink-0">
            Inativa
          </Badge>
        )}
        <span className="text-xs text-muted-foreground shrink-0">
          {category.items.length} produto
          {category.items.length !== 1 ? "s" : ""}
        </span>
        {formatAvailabilitySummary(category.availability) && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Clock className="h-3 w-3" />
            {formatAvailabilitySummary(category.availability)}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={onAddProduct}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar produto
        </Button>
      </div>

      {category.items.length > 0 && (
        <>
          <Separator />
          <div className="p-4 space-y-2">
            <SortableContext
              items={category.items.map((item) =>
                itemDndId(category.id, item.id),
              )}
              strategy={verticalListSortingStrategy}
            >
              {category.items.map((item) => (
                <ProductItemRow
                  key={item.id}
                  category={category}
                  item={item}
                  disabled={reordering}
                  onToggleAvailable={(available) =>
                    onToggleAvailable(category.id, item.id, available)
                  }
                  onEdit={() => onEditItem(category.id, item)}
                  onDelete={() =>
                    onDeleteItem(category.id, item.id, item.name)
                  }
                />
              ))}
            </SortableContext>
          </div>
        </>
      )}
    </section>
  );
}
