"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  createComplement,
  updateComplement,
  deleteComplement,
  getComplementUsage,
} from "@/lib/repositories/complement.repository";
import {
  applyOrderUpdates,
  getDragReorderUpdates,
  parseDndId,
} from "@/lib/utils/reorder";
import type { Complement } from "@/types";
import type { CreateComplementInput } from "@/lib/schemas";

export type ComplementDialogState =
  | { type: "none" }
  | { type: "new-complement" }
  | { type: "edit-complement"; complement: Complement }
  | { type: "delete-complement"; complementId: string; name: string };

function sortComplementList(complements: Complement[]): Complement[] {
  return [...complements].sort((a, b) => a.order - b.order);
}

interface UseComplementsPanelOptions {
  tenantId: string;
  initialComplements: Complement[];
}

export function useComplementsPanel({
  tenantId,
  initialComplements,
}: UseComplementsPanelOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [complements, setComplements] = useState(() =>
    sortComplementList(initialComplements),
  );
  const [dialog, setDialog] = useState<ComplementDialogState>({ type: "none" });
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    if (searchParams.get("action") !== "new-complement") return;
    queueMicrotask(() => setDialog({ type: "new-complement" }));
    router.replace("/menu/complements", { scroll: false });
  }, [searchParams, router]);

  const handleCreateComplement = async (data: CreateComplementInput) => {
    try {
      const created = await createComplement(tenantId, data);
      setComplements((prev) => sortComplementList([...prev, created]));
      setDialog({ type: "none" });
      toast.success("Complemento criado");
    } catch (err) {
      console.error("[createComplement]", err);
      toast.error("Erro ao criar complemento");
    }
  };

  const handleUpdateComplement = async (
    complementId: string,
    data: CreateComplementInput,
  ) => {
    try {
      await updateComplement(tenantId, complementId, data);
      setComplements((prev) =>
        prev.map((entry) =>
          entry.id === complementId ? { ...entry, ...data } : entry,
        ),
      );
      setDialog({ type: "none" });
      toast.success("Complemento atualizado");
    } catch {
      toast.error("Erro ao atualizar complemento");
    }
  };

  const handleDeleteComplement = async (complementId: string) => {
    try {
      const usage = await getComplementUsage(tenantId, complementId);
      if (usage.count > 0) {
        toast.error(
          `Este complemento está vinculado a ${usage.count} produto(s). Remova-o dos produtos antes de excluir.`,
        );
        return;
      }

      await deleteComplement(tenantId, complementId);
      setComplements((prev) => prev.filter((entry) => entry.id !== complementId));
      setDialog({ type: "none" });
      toast.success("Complemento excluído");
    } catch {
      toast.error("Erro ao excluir complemento");
    }
  };

  const persistComplementOrder = async (
    activeComplementId: string,
    overComplementId: string,
  ) => {
    const updates = getDragReorderUpdates(
      complements,
      activeComplementId,
      overComplementId,
    );
    if (!updates) return;

    setReordering(true);
    const previous = complements;
    setComplements((prev) => sortComplementList(applyOrderUpdates(prev, updates)));

    try {
      await Promise.all(
        updates.map(({ id, order }) =>
          updateComplement(tenantId, id, { order }),
        ),
      );
    } catch (err) {
      console.error("[reorderComplement]", err);
      setComplements(previous);
      toast.error("Erro ao reordenar complemento");
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
      activeParsed.type === "complement" &&
      overParsed.type === "complement"
    ) {
      void persistComplementOrder(
        activeParsed.complementId,
        overParsed.complementId,
      );
    }
  };

  return {
    complements,
    dialog,
    setDialog,
    reordering,
    handleCreateComplement,
    handleUpdateComplement,
    handleDeleteComplement,
    handleDragEnd,
  };
}
