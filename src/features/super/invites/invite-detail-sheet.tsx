"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { InviteStatusBadge } from "@/components/super/invite-status-badge";
import { PlanBadge } from "@/components/super/plan-badge";
import type { InviteListItem } from "@/features/super/invites/invite-types";
import { getInvitePublicLink } from "@/features/super/invites/invite-types";

interface InviteDetailSheetProps {
  invite: InviteListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDateTime(value: string | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR");
}

export function InviteDetailSheet({
  invite,
  open,
  onOpenChange,
}: InviteDetailSheetProps) {
  if (!invite) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes do convite</SheetTitle>
        </SheetHeader>

        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-muted-foreground">E-mail</dt>
            <dd className="font-medium break-all">{invite.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Administrador</dt>
            <dd className="font-medium">{invite.adminName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Restaurante</dt>
            <dd className="font-medium">{invite.tenantName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Plano</dt>
            <dd className="pt-1">
              <PlanBadge planId={invite.planId} />
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="pt-1">
              <InviteStatusBadge status={invite.status} />
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Enviado em</dt>
            <dd>{formatDateTime(invite.sentAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Expira em</dt>
            <dd>{formatDateTime(invite.expiresAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Aceito em</dt>
            <dd>{formatDateTime(invite.acceptedAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Telefone</dt>
            <dd>{invite.adminPhone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Link</dt>
            <dd className="font-mono text-xs break-all mt-1">
              {getInvitePublicLink(invite.token)}
            </dd>
          </div>
        </dl>
      </SheetContent>
    </Sheet>
  );
}
