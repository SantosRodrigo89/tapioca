"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { ComplementPickerDialog } from "@/components/admin/complement-picker-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Complement } from "@/types";

interface ProductComplementsSectionProps {
  complements: Complement[];
  value: string[];
  onChange: (complementIds: string[]) => void;
  disabled?: boolean;
}

export function ProductComplementsSection({
  complements,
  value,
  onChange,
  disabled,
}: ProductComplementsSectionProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const catalogById = useMemo(
    () => new Map(complements.map((entry) => [entry.id, entry])),
    [complements],
  );

  const selectedEntries = value
    .map((id) => catalogById.get(id))
    .filter((entry): entry is Complement => entry != null);

  const orphanCount = value.length - selectedEntries.length;

  const removeId = (complementId: string) => {
    onChange(value.filter((id) => id !== complementId));
  };

  return (
    <div className="space-y-3 rounded-lg border p-3">
      <div className="space-y-1">
        <p className="text-sm font-medium">Complementos</p>
        <p className="text-xs text-muted-foreground">
          Escolha extras do catálogo global que o cliente pode adicionar a este
          produto.
        </p>
      </div>

      {value.length > 0 && (
        <ul className="space-y-2">
          {selectedEntries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{entry.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(entry.price)}
                </p>
              </div>
              {!entry.enabled && (
                <Badge variant="secondary" className="shrink-0">
                  Inativo
                </Badge>
              )}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                onClick={() => removeId(entry.id)}
                disabled={disabled}
                aria-label={`Remover ${entry.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
          {orphanCount > 0 && (
            <li className="text-xs text-destructive">
              {orphanCount} complemento(s) vinculado(s) não encontrado(s) no
              catálogo.
            </li>
          )}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPickerOpen(true)}
          disabled={disabled}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Adicionar complemento
        </Button>
        {complements.length === 0 && (
          <Button type="button" variant="link" className="h-auto px-0" asChild>
            <Link href="/menu/complements?action=new-complement">
              Cadastrar complementos
            </Link>
          </Button>
        )}
      </div>

      <ComplementPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        complements={complements}
        selectedIds={value}
        onConfirm={onChange}
        disabled={disabled}
      />
    </div>
  );
}
