"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AuditEventBadge } from "@/components/super/audit-event-badge";
import type { AuditLogClientItem } from "@/features/super/logs/audit-labels";

interface LogDetailSheetProps {
  log: AuditLogClientItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogDetailSheet({ log, open, onOpenChange }: LogDetailSheetProps) {
  if (!log) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes do evento</SheetTitle>
        </SheetHeader>

        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Evento</dt>
            <dd className="pt-1">
              <AuditEventBadge type={log.type} />
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Data</dt>
            <dd>{new Date(log.createdAt).toLocaleString("pt-BR")}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Ator</dt>
            <dd>{log.actorEmail ?? log.actorUid ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Restaurante</dt>
            <dd>{log.tenantName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tenant ID</dt>
            <dd className="font-mono text-xs break-all">{log.tenantId ?? "—"}</dd>
          </div>
          {log.metadata && Object.keys(log.metadata).length > 0 ? (
            <div>
              <dt className="text-muted-foreground mb-2">Metadados</dt>
              <dd>
                <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </dd>
            </div>
          ) : null}
        </dl>
      </SheetContent>
    </Sheet>
  );
}
