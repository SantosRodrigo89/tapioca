"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/lib/repositories/menu-item.repository";
import {
  applyOrderUpdates,
  getDragReorderUpdates,
  parseDndId,
} from "@/lib/utils/reorder";
import { uploadMenuItemImage } from "@/lib/storage/upload";
import type { MenuItem } from "@/types";
import type { CreateMenuItemInput } from "@/lib/schemas";
import {
  sortCategories,
  type CategoryWithItems,
} from "@/features/cardapio/types";

export type ProductDialogState =
  | { type: "none" }
  | { type: "pick-category" }
  | { type: "new-item"; categoryId: string }
  | { type: "edit-item"; categoryId: string; item: MenuItem }
  | { type: "delete-item"; categoryId: string; itemId: string; name: string };

interface UseProductsPanelOptions {
  tenantId: string;
  initialCategories: CategoryWithItems[];
}

export function useProductsPanel({
  tenantId,
  initialCategories,
}: UseProductsPanelOptions) {
  const router = useRouter();
  const [categories, setCategories] = useState(() =>
    sortCategories(initialCategories),
  );
  const [dialog, setDialog] = useState<ProductDialogState>({ type: "none" });
  const [pickCategoryId, setPickCategoryId] = useState("");
  const [reordering, setReordering] = useState(false);

  const refreshCategories = () => router.refresh();
  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);

  const handleCreateItem = async (
    categoryId: string,
    data: CreateMenuItemInput,
    imageFile: File | null,
  ) => {
    try {
      const created = await createMenuItem(tenantId, categoryId, data);

      let imageUrl = created.imageUrl;
      if (imageFile) {
        imageUrl = await uploadMenuItemImage(tenantId, created.id, imageFile);
        await updateMenuItem(tenantId, categoryId, created.id, { imageUrl });
      }

      const itemWithImage = { ...created, imageUrl };
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? { ...c, items: [...c.items, itemWithImage] }
            : c,
        ),
      );
      setDialog({ type: "none" });
      toast.success("Produto criado");
    } catch (err) {
      console.error("[createItem]", err);
      toast.error("Erro ao criar produto");
    }
  };

  const handleUpdateItem = async (
    categoryId: string,
    itemId: string,
    data: CreateMenuItemInput,
    imageFile: File | null,
  ) => {
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadMenuItemImage(tenantId, itemId, imageFile);
      }

      await updateMenuItem(tenantId, categoryId, itemId, {
        ...data,
        availability: data.availability?.enabled ? data.availability : null,
        configurationGroups: data.configurationGroups?.length
          ? data.configurationGroups
          : null,
        complementIds: data.complementIds?.length ? data.complementIds : null,
        ...(imageUrl ? { imageUrl } : {}),
      });

      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                items: c.items.map((i) =>
                  i.id === itemId
                    ? {
                        ...i,
                        ...data,
                        availability: data.availability?.enabled
                          ? data.availability
                          : undefined,
                        configurationGroups: data.configurationGroups,
                        complementIds: data.complementIds,
                        ...(imageUrl ? { imageUrl } : {}),
                      }
                    : i,
                ),
              }
            : c,
        ),
      );
      setDialog({ type: "none" });
      toast.success("Produto atualizado");
    } catch (err) {
      console.error("[updateItem]", err);
      toast.error("Erro ao atualizar produto");
    }
  };

  const handleToggleAvailable = async (
    categoryId: string,
    itemId: string,
    available: boolean,
  ) => {
    try {
      await updateMenuItem(tenantId, categoryId, itemId, { available });
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                items: c.items.map((i) =>
                  i.id === itemId ? { ...i, available } : i,
                ),
              }
            : c,
        ),
      );
    } catch {
      toast.error("Erro ao atualizar disponibilidade");
      refreshCategories();
    }
  };

  const handleDeleteItem = async (categoryId: string, itemId: string) => {
    try {
      await deleteMenuItem(tenantId, categoryId, itemId);
      setCategories((prev) =>
        sortCategories(
          prev.map((c) =>
            c.id === categoryId
              ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
              : c,
          ),
        ),
      );
      setDialog({ type: "none" });
      toast.success("Produto excluído");
    } catch {
      toast.error("Erro ao excluir produto");
    }
  };

  const persistItemOrder = async (
    categoryId: string,
    activeItemId: string,
    overItemId: string,
  ) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    const updates = getDragReorderUpdates(
      category.items,
      activeItemId,
      overItemId,
    );
    if (!updates) return;

    setReordering(true);
    const previous = categories;
    setCategories((prev) =>
      sortCategories(
        prev.map((c) =>
          c.id === categoryId
            ? { ...c, items: applyOrderUpdates(c.items, updates) }
            : c,
        ),
      ),
    );

    try {
      await Promise.all(
        updates.map(({ id, order }) =>
          updateMenuItem(tenantId, categoryId, id, { order }),
        ),
      );
    } catch (err) {
      console.error("[reorderItem]", err);
      setCategories(previous);
      toast.error("Erro ao reordenar produto");
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

    if (activeParsed.type === "item" && overParsed.type === "item") {
      if (activeParsed.categoryId !== overParsed.categoryId) return;
      void persistItemOrder(
        activeParsed.categoryId,
        activeParsed.itemId,
        overParsed.itemId,
      );
    }
  };

  const openNewProduct = () => {
    if (categories.length === 0) return;
    if (categories.length === 1) {
      setDialog({ type: "new-item", categoryId: categories[0].id });
      return;
    }
    setPickCategoryId(categories[0]?.id ?? "");
    setDialog({ type: "pick-category" });
  };

  return {
    categories,
    dialog,
    setDialog,
    pickCategoryId,
    setPickCategoryId,
    reordering,
    totalItems,
    handleCreateItem,
    handleUpdateItem,
    handleToggleAvailable,
    handleDeleteItem,
    handleDragEnd,
    openNewProduct,
  };
}
