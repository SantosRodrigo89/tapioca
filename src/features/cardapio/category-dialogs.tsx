"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/admin/category-form";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { CreateCategoryInput } from "@/lib/schemas";
import type { CategoryDialogState } from "@/features/cardapio/use-categories-panel";

interface CategoryDialogsProps {
  dialog: CategoryDialogState;
  onClose: () => void;
  onCreate: (data: CreateCategoryInput) => Promise<void>;
  onUpdate: (categoryId: string, data: CreateCategoryInput) => Promise<void>;
  onDelete: (categoryId: string) => void;
}

export function CategoryDialogs({
  dialog,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: CategoryDialogsProps) {
  return (
    <>
      <Dialog
        open={dialog.type === "new-category"}
        onOpenChange={(o) => !o && onClose()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova categoria</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSubmit={onCreate}
            onCancel={onClose}
            submitLabel="Criar categoria"
          />
        </DialogContent>
      </Dialog>

      {dialog.type === "edit-category" && (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
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
              onSubmit={(data) => onUpdate(dialog.category.id, data)}
              onCancel={onClose}
            />
          </DialogContent>
        </Dialog>
      )}

      {dialog.type === "delete-category" && (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && onClose()}
          title="Excluir categoria"
          description={`Tem certeza que deseja excluir a categoria "${dialog.name}"? Todos os produtos dentro dela também serão removidos.`}
          confirmLabel="Excluir"
          destructive
          onConfirm={() => onDelete(dialog.categoryId)}
        />
      )}
    </>
  );
}
