"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/repositories/category.repository";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SortableCategoryCard } from "@/components/admin/catalog-sortable";
import {
  applyOrderUpdates,
  categoryDndId,
  getDragReorderUpdates,
  parseDndId,
} from "@/lib/utils/reorder";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/admin/category-form";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { formatAvailabilitySummary } from "@/lib/utils/availability";
import type { Category } from "@/types";
import type { CreateCategoryInput } from "@/lib/schemas";
import { sortCategoryList } from "@/features/cardapio/types";
import { useMenuAuth } from "@/features/cardapio/use-menu-auth";

interface CategoriesPanelProps {
  tenantId: string;
  initialCategories: Category[];
  itemCounts: Record<string, number>;
}

type DialogState =
  | { type: "none" }
  | { type: "new-category" }
  | { type: "edit-category"; category: Category }
  | { type: "delete-category"; categoryId: string; name: string };

export function CategoriesPanel({
  tenantId,
  initialCategories,
  itemCounts,
}: CategoriesPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState(() =>
    sortCategoryList(initialCategories),
  );
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });
  const [reordering, setReordering] = useState(false);

  useMenuAuth();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  useEffect(() => {
    if (searchParams.get("action") === "new-category") {
      setDialog({ type: "new-category" });
      router.replace("/menu/categories", { scroll: false });
    }
  }, [searchParams, router]);

  const handleCreateCategory = async (data: CreateCategoryInput) => {
    try {
      const created = await createCategory(tenantId, data);
      setCategories((prev) => sortCategoryList([...prev, created]));
      setDialog({ type: "none" });
      toast.success("Categoria criada");
    } catch (err) {
      console.error("[createCategory]", err);
      const message =
        err instanceof Error ? err.message : "Erro ao criar categoria";
      toast.error(
        message.includes("permission") || message.includes("insufficient")
          ? "Sem permissão. Saia e entre novamente na conta."
          : "Erro ao criar categoria",
      );
    }
  };

  const handleUpdateCategory = async (
    categoryId: string,
    data: CreateCategoryInput,
  ) => {
    try {
      const { availability, ...rest } = data;
      await updateCategory(tenantId, categoryId, {
        ...rest,
        availability: availability?.enabled ? availability : null,
      });
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                ...rest,
                availability: availability?.enabled ? availability : undefined,
              }
            : c,
        ),
      );
      setDialog({ type: "none" });
      toast.success("Categoria atualizada");
    } catch {
      toast.error("Erro ao atualizar categoria");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(tenantId, categoryId);
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      setDialog({ type: "none" });
      toast.success("Categoria excluída");
    } catch {
      toast.error("Erro ao excluir categoria");
    }
  };

  const persistCategoryOrder = async (
    activeCategoryId: string,
    overCategoryId: string,
  ) => {
    const updates = getDragReorderUpdates(
      categories,
      activeCategoryId,
      overCategoryId,
    );
    if (!updates) return;

    setReordering(true);
    const previous = categories;
    setCategories((prev) => sortCategoryList(applyOrderUpdates(prev, updates)));

    try {
      await Promise.all(
        updates.map(({ id, order }) =>
          updateCategory(tenantId, id, { order }),
        ),
      );
    } catch (err) {
      console.error("[reorderCategory]", err);
      setCategories(previous);
      toast.error("Erro ao reordenar categoria");
    } finally {
      setReordering(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || reordering) return;

    const activeParsed = parseDndId(String(active.id));
    const overParsed = parseDndId(String(over.id));
    if (!activeParsed || !overParsed) return;

    if (
      activeParsed.type === "category" &&
      overParsed.type === "category"
    ) {
      void persistCategoryOrder(
        activeParsed.categoryId,
        overParsed.categoryId,
      );
    }
  };

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

      <Dialog
        open={dialog.type === "new-category"}
        onOpenChange={(o) => !o && setDialog({ type: "none" })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova categoria</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSubmit={handleCreateCategory}
            onCancel={() => setDialog({ type: "none" })}
            submitLabel="Criar categoria"
          />
        </DialogContent>
      </Dialog>

      {dialog.type === "edit-category" && (
        <Dialog open onOpenChange={(o) => !o && setDialog({ type: "none" })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar categoria</DialogTitle>
            </DialogHeader>
            <CategoryForm
              defaultValues={{
                name: dialog.category.name,
                active: dialog.category.active,
                availability: dialog.category.availability,
              }}
              onSubmit={(data) =>
                handleUpdateCategory(dialog.category.id, data)
              }
              onCancel={() => setDialog({ type: "none" })}
            />
          </DialogContent>
        </Dialog>
      )}

      {dialog.type === "delete-category" && (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && setDialog({ type: "none" })}
          title="Excluir categoria"
          description={`Tem certeza que deseja excluir a categoria "${dialog.name}"? Todos os produtos dentro dela também serão removidos.`}
          confirmLabel="Excluir"
          destructive
          onConfirm={() => handleDeleteCategory(dialog.categoryId)}
        />
      )}
    </div>
  );
}
