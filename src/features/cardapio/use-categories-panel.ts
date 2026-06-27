"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/repositories/category.repository";
import {
  applyOrderUpdates,
  getDragReorderUpdates,
  parseDndId,
} from "@/lib/utils/reorder";
import type { Category } from "@/types";
import type { CreateCategoryInput } from "@/lib/schemas";
import { sortCategoryList } from "@/features/cardapio/types";

export type CategoryDialogState =
  | { type: "none" }
  | { type: "new-category" }
  | { type: "edit-category"; category: Category }
  | { type: "delete-category"; categoryId: string; name: string };

interface UseCategoriesPanelOptions {
  tenantId: string;
  initialCategories: Category[];
}

export function useCategoriesPanel({
  tenantId,
  initialCategories,
}: UseCategoriesPanelOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState(() =>
    sortCategoryList(initialCategories),
  );
  const [dialog, setDialog] = useState<CategoryDialogState>({ type: "none" });
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    if (searchParams.get("action") !== "new-category") return;
    queueMicrotask(() => setDialog({ type: "new-category" }));
    router.replace("/menu/categories", { scroll: false });
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

  return {
    categories,
    dialog,
    setDialog,
    reordering,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleDragEnd,
  };
}
