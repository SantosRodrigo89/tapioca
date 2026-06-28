"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ComplementForm } from "@/components/admin/complement-form";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { CreateComplementInput } from "@/lib/schemas";
import type { ComplementDialogState } from "@/features/cardapio/use-complements-panel";

interface ComplementDialogsProps {
  dialog: ComplementDialogState;
  onClose: () => void;
  onCreate: (data: CreateComplementInput) => Promise<void>;
  onUpdate: (complementId: string, data: CreateComplementInput) => Promise<void>;
  onDelete: (complementId: string) => void;
}

export function ComplementDialogs({
  dialog,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: ComplementDialogsProps) {
  return (
    <>
      <Dialog
        open={dialog.type === "new-complement"}
        onOpenChange={(o) => !o && onClose()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo complemento</DialogTitle>
          </DialogHeader>
          <ComplementForm
            onSubmit={onCreate}
            onCancel={onClose}
            submitLabel="Criar complemento"
          />
        </DialogContent>
      </Dialog>

      {dialog.type === "edit-complement" && (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar complemento</DialogTitle>
            </DialogHeader>
            <ComplementForm
              defaultValues={{
                name: dialog.complement.name,
                description: dialog.complement.description,
                price: dialog.complement.price,
                enabled: dialog.complement.enabled,
              }}
              onSubmit={(data) => onUpdate(dialog.complement.id, data)}
              onCancel={onClose}
            />
          </DialogContent>
        </Dialog>
      )}

      {dialog.type === "delete-complement" && (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && onClose()}
          title="Excluir complemento"
          description={`Tem certeza que deseja excluir "${dialog.name}"? Só é possível excluir complementos que não estejam vinculados a produtos.`}
          confirmLabel="Excluir"
          destructive
          onConfirm={() => onDelete(dialog.complementId)}
        />
      )}
    </>
  );
}
