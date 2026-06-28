"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SortableItemRow } from "@/components/admin/catalog-sortable";
import { complementDndId } from "@/lib/utils/reorder";
import { formatPrice } from "@/lib/utils";
import type { Complement } from "@/types";
import { useMenuAuth } from "@/features/cardapio/use-menu-auth";
import { useCatalogDndSensors } from "@/features/cardapio/use-catalog-dnd";
import { useComplementsPanel } from "@/features/cardapio/use-complements-panel";
import { ComplementDialogs } from "@/features/cardapio/complement-dialogs";

interface ComplementsPanelProps {
  tenantId: string;
  initialComplements: Complement[];
}

export function ComplementsPanel({
  tenantId,
  initialComplements,
}: ComplementsPanelProps) {
  useMenuAuth();
  const sensors = useCatalogDndSensors();
  const {
    complements,
    dialog,
    setDialog,
    reordering,
    handleCreateComplement,
    handleUpdateComplement,
    handleDeleteComplement,
    handleDragEnd,
  } = useComplementsPanel({ tenantId, initialComplements });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => setDialog({ type: "new-complement" })}>
          <Plus className="mr-2 h-4 w-4" />
          Novo complemento
        </Button>
      </div>

      {complements.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <p className="text-sm">Nenhum complemento cadastrado ainda.</p>
          <Button
            variant="link"
            className="mt-1 h-auto p-0 text-sm"
            onClick={() => setDialog({ type: "new-complement" })}
          >
            Criar primeiro complemento
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={complements.map((entry) => complementDndId(entry.id))}
            strategy={verticalListSortingStrategy}
          >
            <ul className="divide-y rounded-lg border">
              {complements.map((complement) => (
                <SortableItemRow
                  key={complement.id}
                  id={complementDndId(complement.id)}
                  disabled={reordering}
                >
                  <div className="flex flex-1 items-center gap-2 min-w-0 py-1">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {complement.name}
                      </p>
                      {complement.description && (
                        <p className="truncate text-xs text-muted-foreground">
                          {complement.description}
                        </p>
                      )}
                    </div>

                    {!complement.enabled && (
                      <Badge variant="secondary" className="shrink-0">
                        Inativo
                      </Badge>
                    )}

                    <span className="text-sm font-medium tabular-nums shrink-0">
                      {formatPrice(complement.price)}
                    </span>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0"
                      onClick={() =>
                        setDialog({
                          type: "edit-complement",
                          complement,
                        })
                      }
                      aria-label="Editar complemento"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                      onClick={() =>
                        setDialog({
                          type: "delete-complement",
                          complementId: complement.id,
                          name: complement.name,
                        })
                      }
                      aria-label="Excluir complemento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </SortableItemRow>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <ComplementDialogs
        dialog={dialog}
        onClose={() => setDialog({ type: "none" })}
        onCreate={handleCreateComplement}
        onUpdate={handleUpdateComplement}
        onDelete={handleDeleteComplement}
      />
    </div>
  );
}
