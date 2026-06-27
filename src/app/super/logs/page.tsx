import type { Metadata } from "next";
import { listAuditLogsServer } from "@/lib/repositories/server/platform/audit-log.server";
import { SuperPageHeader } from "@/components/super/super-page-header";

export const metadata: Metadata = { title: "Logs — Super Admin" };

export default async function SuperLogsPage() {
  const logs = await listAuditLogsServer();

  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Logs"
        description="Auditoria de eventos da plataforma."
      />

      {logs.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nenhum evento registrado ainda.
        </div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Evento</th>
                <th className="px-4 py-3 font-medium">Restaurante</th>
                <th className="px-4 py-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{log.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {log.tenantName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {log.createdAt.toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
