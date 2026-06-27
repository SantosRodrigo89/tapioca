"use client";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SortableCategoryCard } from "@/components/admin/catalog-sortable";
import { categoryDndId } from "@/lib/utils/reorder";
import { formatAvailabilitySummary } from "@/lib/utils/availability";
import type { Category } from "@/types";
import { useMenuAuth } from "@/features/cardapio/use-menu-auth";
import { useCatalogDndSensors } from "@/features/cardapio/use-catalog-dnd";
import { useCategoriesPanel } from "@/features/cardapio/use-categories-panel";
import { CategoryDialogs } from "@/features/cardapio/category-dialogs";

interface CategoriesPanelProps {
  tenantId: string;
  initialCategories: Category[];
  itemCounts: Record<string, number>;
}

export function CategoriesPanel({
  tenantId,
  initialCategories,
  itemCounts,
}: CategoriesPanelProps) {
  useMenuAuth();
  const sensors = useCatalogDndSensors();
  const {
    categories,
    dialog,
    setDialog,
    reordering,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleDragEnd,
  } = useCategoriesPanel({ tenantId, initialCategories });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => setDialog({ type: "new-category" })}>
          <Plus className="mr-2 h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      {categories.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <p className="text-sm">Nenhuma categoria criada ainda.</p>
          <Button
            variant="link"
            className="mt-1 h-auto p-0 text-sm"
            onClick={() => setDialog({ type: "new-category" })}
          >
            Criar primeira categoria
          </Button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categories.map((c) => categoryDndId(c.id))}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {categories.map((category) => {
              const count = itemCounts[category.id] ?? 0;
              return (
                <SortableCategoryCard
                  key={category.id}
                  id={categoryDndId(category.id)}
                  disabled={reordering}
                  header={
                    <div className="flex flex-1 items-center gap-2 min-w-0">
                      <span className="font-medium flex-1 truncate">
                        {category.name}
                      </span>

                      {!category.active && (
                        <Badge variant="secondary" className="shrink-0">
                          Inativa
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground shrink-0">
                        {count} produto{count !== 1 ? "s" : ""}
                      </span>
                      {formatAvailabilitySummary(category.availability) && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Clock className="h-3 w-3" />
                          {formatAvailabilitySummary(category.availability)}
                        </span>
                      )}

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0"
                        onClick={() =>
                          setDialog({ type: "edit-category", category })
                        }
                        aria-label="Editar categoria"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                        onClick={() =>
                          setDialog({
                            type: "delete-category",
                            categoryId: category.id,
                            name: category.name,
                          })
                        }
                        aria-label="Excluir categoria"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  }
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      <CategoryDialogs
        dialog={dialog}
        onClose={() => setDialog({ type: "none" })}
        onCreate={handleCreateCategory}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}
