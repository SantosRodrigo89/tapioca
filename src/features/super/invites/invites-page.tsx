"use client";

import { useMemo, useState } from "react";
import { Copy, Eye, Mail, XCircle } from "lucide-react";
import { toast } from "sonner";
import { SuperPageHeader } from "@/components/super/super-page-header";
import { InviteStatusBadge } from "@/components/super/invite-status-badge";
import { PlanBadge } from "@/components/super/plan-badge";
import { Button } from "@/components/ui/button";
import { InviteDetailSheet } from "@/features/super/invites/invite-detail-sheet";
import {
  getInvitePublicLink,
  type InviteListItem,
} from "@/features/super/invites/invite-types";
import type { InviteStatus } from "@/types/platform/invite";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { value: InviteStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendente" },
  { value: "accepted", label: "Aceito" },
  { value: "expired", label: "Expirado" },
  { value: "cancelled", label: "Cancelado" },
];

interface InvitesPageProps {
  initialInvites: InviteListItem[];
}

export function InvitesPage({ initialInvites }: InvitesPageProps) {
  const [invites, setInvites] = useState(initialInvites);
  const [statusFilter, setStatusFilter] = useState<InviteStatus | "all">("all");
  const [detailInvite, setDetailInvite] = useState<InviteListItem | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return invites;
    return invites.filter((invite) => invite.status === statusFilter);
  }, [invites, statusFilter]);

  const copyLink = async (invite: InviteListItem) => {
    await navigator.clipboard.writeText(getInvitePublicLink(invite.token));
    toast.success("Link copiado");
  };

  const resendInvite = async (inviteId: string) => {
    setActionId(inviteId);
    try {
      const res = await fetch(`/api/super/invites/${inviteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resend" }),
      });
      const body = (await res.json()) as {
        error?: string;
        token?: string;
        expiresAt?: string;
        inviteLink?: string;
      };
      if (!res.ok) throw new Error(body.error ?? "Falha ao reenviar");

      setInvites((current) =>
        current.map((invite) =>
          invite.id === inviteId
            ? {
                ...invite,
                token: body.token ?? invite.token,
                status: "pending",
                sentAt: new Date().toISOString(),
                expiresAt: body.expiresAt ?? invite.expiresAt,
              }
            : invite,
        ),
      );
      toast.success("Convite reenviado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao reenviar");
    } finally {
      setActionId(null);
    }
  };

  const cancelInvite = async (inviteId: string) => {
    setActionId(inviteId);
    try {
      const res = await fetch(`/api/super/invites/${inviteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Falha ao cancelar");

      setInvites((current) =>
        current.map((invite) =>
          invite.id === inviteId ? { ...invite, status: "cancelled" } : invite,
        ),
      );
      toast.success("Convite cancelado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cancelar");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Convites"
        description="Gerencie convites enviados aos administradores de restaurantes."
      />

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatusFilter(value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              statusFilter === value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nenhum convite encontrado.
        </div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Restaurante</th>
                <th className="px-4 py-3 font-medium">Plano</th>
                <th className="px-4 py-3 font-medium">Enviado em</th>
                <th className="px-4 py-3 font-medium">Expira em</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invite) => {
                const busy = actionId === invite.id;
                const canModify =
                  invite.status === "pending" || invite.status === "expired";

                return (
                  <tr key={invite.id} className="border-b last:border-0">
                    <td className="px-4 py-3">{invite.email}</td>
                    <td className="px-4 py-3 font-medium">{invite.tenantName}</td>
                    <td className="px-4 py-3">
                      <PlanBadge planId={invite.planId} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(invite.sentAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(invite.expiresAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <InviteStatusBadge status={invite.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={busy || !canModify}
                          onClick={() => resendInvite(invite.id)}
                          aria-label="Reenviar convite"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={busy || !canModify}
                          onClick={() => cancelInvite(invite.id)}
                          aria-label="Cancelar convite"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyLink(invite)}
                          aria-label="Copiar link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setDetailInvite(invite)}
                          aria-label="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <InviteDetailSheet
        invite={detailInvite}
        open={detailInvite !== null}
        onOpenChange={(open) => {
          if (!open) setDetailInvite(null);
        }}
      />
    </div>
  );
}
