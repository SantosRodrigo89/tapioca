"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { CreateMenuItemInput } from "@/lib/schemas";
import type { CategoryWithItems } from "@/features/cardapio/types";
import type { ProductDialogState } from "@/features/cardapio/use-products-panel";

interface ProductDialogsProps {
  dialog: ProductDialogState;
  categories: CategoryWithItems[];
  pickCategoryId: string;
  onPickCategoryIdChange: (id: string) => void;
  onClose: () => void;
  onContinuePickCategory: (categoryId: string) => void;
  onCreate: (
    categoryId: string,
    data: CreateMenuItemInput,
    imageFile: File | null,
  ) => Promise<void>;
  onUpdate: (
    categoryId: string,
    itemId: string,
    data: CreateMenuItemInput,
    imageFile: File | null,
  ) => Promise<void>;
  onDelete: (categoryId: string, itemId: string) => void;
}

export function ProductDialogs({
  dialog,
  categories,
  pickCategoryId,
  onPickCategoryIdChange,
  onClose,
  onContinuePickCategory,
  onCreate,
  onUpdate,
  onDelete,
}: ProductDialogsProps) {
  return (
    <>
      {dialog.type === "pick-category" && (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
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
                  onChange={(e) => onPickCategoryIdChange(e.target.value)}
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
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    if (pickCategoryId) {
                      onContinuePickCategory(pickCategoryId);
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
        <Dialog open onOpenChange={(o) => !o && onClose()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo produto</DialogTitle>
            </DialogHeader>
            <MenuItemForm
              categoryAvailability={
                categories.find((c) => c.id === dialog.categoryId)?.availability
              }
              onSubmit={(data, imageFile) =>
                onCreate(dialog.categoryId, data, imageFile)
              }
              onCancel={onClose}
              submitLabel="Criar produto"
            />
          </DialogContent>
        </Dialog>
      )}

      {dialog.type === "edit-item" && (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
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
                onUpdate(dialog.categoryId, dialog.item.id, data, imageFile)
              }
              onCancel={onClose}
            />
          </DialogContent>
        </Dialog>
      )}

      {dialog.type === "delete-item" && (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && onClose()}
          title="Excluir produto"
          description={`Tem certeza que deseja excluir "${dialog.name}"?`}
          confirmLabel="Excluir"
          destructive
          onConfirm={() => onDelete(dialog.categoryId, dialog.itemId)}
        />
      )}
    </>
  );
}
