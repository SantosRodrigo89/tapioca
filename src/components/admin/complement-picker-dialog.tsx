"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Complement } from "@/types";

interface ComplementPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complements: Complement[];
  selectedIds: string[];
  onConfirm: (selectedIds: string[]) => void;
  disabled?: boolean;
}

export function ComplementPickerDialog({
  open,
  onOpenChange,
  complements,
  selectedIds,
  onConfirm,
  disabled,
}: ComplementPickerDialogProps) {
  const [query, setQuery] = useState("");
  const [draftIds, setDraftIds] = useState<string[]>(selectedIds);

  const sortedComplements = useMemo(
    () => [...complements].sort((a, b) => a.order - b.order),
    [complements],
  );

  const filteredComplements = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return sortedComplements;
    return sortedComplements.filter((entry) =>
      entry.name.toLowerCase().includes(normalized),
    );
  }, [query, sortedComplements]);

  const toggleId = (complementId: string) => {
    setDraftIds((prev) =>
      prev.includes(complementId)
        ? prev.filter((id) => id !== complementId)
        : [...prev, complementId],
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftIds(selectedIds);
      setQuery("");
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar complementos</DialogTitle>
        </DialogHeader>

        {complements.length === 0 ? (
          <div className="space-y-3 py-4 text-center text-sm text-muted-foreground">
            <p>Nenhum complemento cadastrado.</p>
            <Button variant="link" className="h-auto p-0" asChild>
              <Link href="/menu/complements?action=new-complement">
                Criar complemento
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <Input
              placeholder="Buscar complemento…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={disabled}
            />

            <p className="text-xs text-muted-foreground">
              Selecionados: {draftIds.length}
            </p>

            <ul className="divide-y overflow-y-auto rounded-lg border">
              {filteredComplements.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Nenhum complemento encontrado.
                </li>
              ) : (
                filteredComplements.map((complement) => {
                  const checked = draftIds.includes(complement.id);
                  return (
                    <li key={complement.id}>
                      <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-muted/50">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => toggleId(complement.id)}
                          className="rounded border-input"
                        />
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
                      </label>
                    </li>
                  );
                })
              )}
            </ul>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={disabled}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const orderedIds = sortedComplements
                    .map((entry) => entry.id)
                    .filter((id) => draftIds.includes(id));
                  onConfirm(orderedIds);
                  onOpenChange(false);
                }}
                disabled={disabled}
              >
                Confirmar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
