"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/lib/repositories/menu-item.repository";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  SortableItemRow,
} from "@/components/admin/catalog-sortable";
import {
  applyOrderUpdates,
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
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ItemThumbnail } from "@/components/admin/item-thumbnail";
import { formatMenuItemPrice } from "@/lib/pricing";
import {
  formatAvailabilitySummary,
  getItemAvailabilityStatus,
} from "@/lib/utils/availability";
import { uploadMenuItemImage } from "@/lib/storage/upload";
import type { MenuItem } from "@/types";
import type { CreateMenuItemInput } from "@/lib/schemas";
import {
  sortCategories,
  type CategoryWithItems,
} from "@/features/cardapio/types";
import { useMenuAuth } from "@/features/cardapio/use-menu-auth";

interface ProductsPanelProps {
  tenantId: string;
  initialCategories: CategoryWithItems[];
}

type DialogState =
  | { type: "none" }
  | { type: "pick-category" }
  | { type: "new-item"; categoryId: string }
  | { type: "edit-item"; categoryId: string; item: MenuItem }
  | { type: "delete-item"; categoryId: string; itemId: string; name: string };

export function ProductsPanel({
  tenantId,
  initialCategories,
}: ProductsPanelProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(() =>
    sortCategories(initialCategories),
  );
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });
  const [pickCategoryId, setPickCategoryId] = useState("");
  const [reordering, setReordering] = useState(false);

  useMenuAuth();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Crie uma{" "}
            <Link
              href="/menu/categories"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              categoria
            </Link>{" "}
            antes de adicionar produtos.
          </p>
        ) : (
          <Button onClick={openNewProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Novo produto
          </Button>
        )}
      </div>

      {categories.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <p className="text-sm">Nenhuma categoria encontrada.</p>
          <Button variant="link" className="mt-1 h-auto p-0 text-sm" asChild>
            <Link href="/menu/categories">Ir para categorias</Link>
          </Button>
        </div>
      )}

      {categories.length > 0 && totalItems === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <p className="text-sm">Nenhum produto criado ainda.</p>
          <Button
            variant="link"
            className="mt-1 h-auto p-0 text-sm"
            onClick={openNewProduct}
          >
            Criar primeiro produto
          </Button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6">
          {categories.map((category) => (
            <section
              key={category.id}
              className="rounded-lg border bg-card overflow-hidden"
            >
              <div className="flex items-center gap-2 p-4">
                <span className="font-medium flex-1 truncate">
                  {category.name}
                </span>
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
                  onClick={() =>
                    setDialog({ type: "new-item", categoryId: category.id })
                  }
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
                              {formatMenuItemPrice(item)}
                            </p>
                            {(() => {
                              const scheduleLabel =
                                formatAvailabilitySummary(item.availability) ??
                                (!item.availability?.enabled
                                  ? formatAvailabilitySummary(
                                      category.availability,
                                    )
                                  : null);
                              const status = getItemAvailabilityStatus(
                                item,
                                category,
                              );
                              return scheduleLabel ? (
                                <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 shrink-0" />
                                  <span className="truncate">
                                    {scheduleLabel}
                                    {!status.orderable && " · fora do horário"}
                                  </span>
                                </p>
                              ) : null;
                            })()}
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
                            aria-label="Editar produto"
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
                            aria-label="Excluir produto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </SortableItemRow>
                      ))}
                    </SortableContext>
                  </div>
                </>
              )}
            </section>
          ))}
        </div>
      </DndContext>

      {dialog.type === "pick-category" && (
        <Dialog
          open
          onOpenChange={(o) => !o && setDialog({ type: "none" })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo produto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="pick-category">Categoria</Label>
                <select
                  id="pick-category"
                  value={pickCategoryId}
                  onChange={(e) => setPickCategoryId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialog({ type: "none" })}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    if (pickCategoryId) {
                      setDialog({
                        type: "new-item",
                        categoryId: pickCategoryId,
                      });
                    }
                  }}
                  disabled={!pickCategoryId}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {dialog.type === "new-item" && (
        <Dialog open onOpenChange={(o) => !o && setDialog({ type: "none" })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo produto</DialogTitle>
            </DialogHeader>
            <MenuItemForm
              categoryAvailability={
                categories.find((c) => c.id === dialog.categoryId)?.availability
              }
              onSubmit={(data, imageFile) =>
                handleCreateItem(dialog.categoryId, data, imageFile)
              }
              onCancel={() => setDialog({ type: "none" })}
              submitLabel="Criar produto"
            />
          </DialogContent>
        </Dialog>
      )}

      {dialog.type === "edit-item" && (
        <Dialog open onOpenChange={(o) => !o && setDialog({ type: "none" })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar produto</DialogTitle>
            </DialogHeader>
            <MenuItemForm
              currentImageUrl={dialog.item.imageUrl}
              categoryAvailability={
                categories.find((c) => c.id === dialog.categoryId)?.availability
              }
              defaultValues={{
                name: dialog.item.name,
                description: dialog.item.description,
                price: dialog.item.price,
                available: dialog.item.available,
                availability: dialog.item.availability,
                configurationGroups: dialog.item.configurationGroups,
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

      {dialog.type === "delete-item" && (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && setDialog({ type: "none" })}
          title="Excluir produto"
          description={`Tem certeza que deseja excluir "${dialog.name}"?`}
          confirmLabel="Excluir"
          destructive
          onConfirm={() => handleDeleteItem(dialog.categoryId, dialog.itemId)}
        />
      )}
    </div>
  );
}
