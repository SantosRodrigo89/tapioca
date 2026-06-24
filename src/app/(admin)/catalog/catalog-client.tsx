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
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { refreshAuthToken } from "@/hooks/use-auth";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/repositories/category.repository";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/lib/repositories/menu-item.repository";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  SortableCategoryCard,
  SortableItemRow,
} from "@/components/admin/catalog-sortable";
import {
  applyOrderUpdates,
  categoryDndId,
  getDragReorderUpdates,
  itemDndId,
  parseDndId,
} from "@/lib/utils/reorder";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/admin/category-form";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ItemThumbnail } from "@/components/admin/item-thumbnail";
import { formatPrice } from "@/lib/utils";
import { uploadMenuItemImage } from "@/lib/storage/upload";
import type { CategoryWithItems } from "./page";
import type { Category, MenuItem } from "@/types";
import type { CreateCategoryInput } from "@/lib/schemas";
import type { CreateMenuItemInput } from "@/lib/schemas";

interface CatalogClientProps {
  tenantId: string;
  initialCategories: CategoryWithItems[];
}

type DialogState =
  | { type: "none" }
  | { type: "new-category" }
  | { type: "edit-category"; category: Category }
  | { type: "new-item"; categoryId: string }
  | { type: "edit-item"; categoryId: string; item: MenuItem }
  | { type: "delete-category"; categoryId: string; name: string }
  | { type: "delete-item"; categoryId: string; itemId: string; name: string };

function sortCategories(cats: CategoryWithItems[]): CategoryWithItems[] {
  return [...cats]
    .sort((a, b) => a.order - b.order)
    .map((c) => ({
      ...c,
      items: [...c.items].sort((a, b) => a.order - b.order),
    }));
}

export function CatalogClient({ tenantId, initialCategories }: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState(() =>
    sortCategories(initialCategories),
  );
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(initialCategories.map((c) => c.id)),
  );
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });
  const [reordering, setReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  // Ensure Firestore client token includes custom claims (tenantId) for writes
  useEffect(() => {
    void refreshAuthToken().catch(console.error);
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "new-category") {
      setDialog({ type: "new-category" });
      router.replace("/catalog", { scroll: false });
    }
  }, [searchParams, router]);

  const toggleExpand = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const refreshCategories = () => router.refresh();

  // ── Category handlers ──────────────────────────────────────────────────────

  const handleCreateCategory = async (data: CreateCategoryInput) => {
    try {
      const created = await createCategory(tenantId, data);
      setCategories((prev) =>
        sortCategories([...prev, { ...created, items: [] }]),
      );
      setExpandedIds((prev) => new Set([...prev, created.id]));
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
      await updateCategory(tenantId, categoryId, data);
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId ? { ...c, ...data } : c,
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
      toast.success("Categoria excluída");
    } catch {
      toast.error("Erro ao excluir categoria");
    }
  };

  // ── Item handlers ──────────────────────────────────────────────────────────

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
      toast.success("Item criado");
    } catch (err) {
      console.error("[createItem]", err);
      toast.error("Erro ao criar item");
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
        ...(imageUrl ? { imageUrl } : {}),
      });

      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                items: c.items.map((i) =>
                  i.id === itemId
                    ? { ...i, ...data, ...(imageUrl ? { imageUrl } : {}) }
                    : i,
                ),
              }
            : c,
        ),
      );
      setDialog({ type: "none" });
      toast.success("Item atualizado");
    } catch (err) {
      console.error("[updateItem]", err);
      toast.error("Erro ao atualizar item");
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
      toast.success("Item excluído");
    } catch {
      toast.error("Erro ao excluir item");
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
    setCategories((prev) => sortCategories(applyOrderUpdates(prev, updates)));

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
      toast.error("Erro ao reordenar item");
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
      return;
    }

    if (activeParsed.type === "item" && overParsed.type === "item") {
      if (activeParsed.categoryId !== overParsed.categoryId) return;
      void persistItemOrder(
        activeParsed.categoryId,
        activeParsed.itemId,
        overParsed.itemId,
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Cardápio</h1>
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
            {categories.map((category) => (
              <SortableCategoryCard
                key={category.id}
                id={categoryDndId(category.id)}
                disabled={reordering}
                header={
                  <div className="flex flex-1 items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand(category.id)}
                      className="mr-1 text-muted-foreground hover:text-foreground"
                      aria-label={
                        expandedIds.has(category.id) ? "Recolher" : "Expandir"
                      }
                    >
                      {expandedIds.has(category.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    <span className="font-medium flex-1 truncate">
                      {category.name}
                    </span>

                    {!category.active && (
                      <Badge variant="secondary" className="shrink-0">
                        Inativa
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground shrink-0">
                      {category.items.length} item
                      {category.items.length !== 1 ? "s" : ""}
                    </span>

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
                body={
                  expandedIds.has(category.id) ? (
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
                            <SortableItemRow
                              key={item.id}
                              id={itemDndId(category.id, item.id)}
                              disabled={reordering}
                            >
                              <ItemThumbnail
                                src={item.imageUrl}
                                alt={item.name}
                              />

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {item.name}
                                </p>
                                {item.description && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {item.description}
                                  </p>
                                )}
                                <p className="text-sm font-semibold mt-0.5">
                                  {formatPrice(item.price)}
                                </p>
                              </div>

                              <button
                                type="button"
                                role="switch"
                                aria-checked={item.available}
                                onClick={() =>
                                  handleToggleAvailable(
                                    category.id,
                                    item.id,
                                    !item.available,
                                  )
                                }
                                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                  item.available ? "bg-primary" : "bg-input"
                                }`}
                                title={
                                  item.available ? "Disponível" : "Indisponível"
                                }
                              >
                                <span
                                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                    item.available
                                      ? "translate-x-4"
                                      : "translate-x-0.5"
                                  }`}
                                />
                              </button>

                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 shrink-0"
                                onClick={() =>
                                  setDialog({
                                    type: "edit-item",
                                    categoryId: category.id,
                                    item,
                                  })
                                }
                                aria-label="Editar item"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                                onClick={() =>
                                  setDialog({
                                    type: "delete-item",
                                    categoryId: category.id,
                                    itemId: item.id,
                                    name: item.name,
                                  })
                                }
                                aria-label="Excluir item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </SortableItemRow>
                          ))}
                        </SortableContext>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() =>
                            setDialog({
                              type: "new-item",
                              categoryId: category.id,
                            })
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Adicionar item
                        </Button>
                      </div>
                    </>
                  ) : undefined
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* ── Dialogs ── */}

      {/* New category */}
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

      {/* Edit category */}
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
              }}
              onSubmit={(data) =>
                handleUpdateCategory(dialog.category.id, data)
              }
              onCancel={() => setDialog({ type: "none" })}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* New item */}
      {dialog.type === "new-item" && (
        <Dialog open onOpenChange={(o) => !o && setDialog({ type: "none" })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo item</DialogTitle>
            </DialogHeader>
            <MenuItemForm
              onSubmit={(data, imageFile) =>
                handleCreateItem(dialog.categoryId, data, imageFile)
              }
              onCancel={() => setDialog({ type: "none" })}
              submitLabel="Criar item"
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit item */}
      {dialog.type === "edit-item" && (
        <Dialog open onOpenChange={(o) => !o && setDialog({ type: "none" })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar item</DialogTitle>
            </DialogHeader>
            <MenuItemForm
              currentImageUrl={dialog.item.imageUrl}
              defaultValues={{
                name: dialog.item.name,
                description: dialog.item.description,
                price: dialog.item.price,
                available: dialog.item.available,
              }}
              onSubmit={(data, imageFile) =>
                handleUpdateItem(
                  dialog.categoryId,
                  dialog.item.id,
                  data,
                  imageFile,
                )
              }
              onCancel={() => setDialog({ type: "none" })}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete category */}
      {dialog.type === "delete-category" && (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && setDialog({ type: "none" })}
          title="Excluir categoria"
          description={`Tem certeza que deseja excluir a categoria "${dialog.name}"? Todos os itens dentro dela também serão removidos.`}
          confirmLabel="Excluir"
          destructive
          onConfirm={() => handleDeleteCategory(dialog.categoryId)}
        />
      )}

      {/* Delete item */}
      {dialog.type === "delete-item" && (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && setDialog({ type: "none" })}
          title="Excluir item"
          description={`Tem certeza que deseja excluir "${dialog.name}"?`}
          confirmLabel="Excluir"
          destructive
          onConfirm={() => handleDeleteItem(dialog.categoryId, dialog.itemId)}
        />
      )}
    </div>
  );
}
