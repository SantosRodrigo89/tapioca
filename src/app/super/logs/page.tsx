import type { Metadata } from "next";
import { Suspense } from "react";
import { ListAuditLogsQuerySchema } from "@/lib/schemas/platform/list-audit-logs.schema";
import {
  listAuditLogsPaginatedServer,
  serializeAuditLogForClient,
} from "@/services/platform/list-audit-logs.service";
import { LogsPage } from "@/features/super/logs/logs-page";

export const metadata: Metadata = { title: "Logs — Super Admin" };

interface SuperLogsRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SuperLogsRoute({ searchParams }: SuperLogsRouteProps) {
  const params = await searchParams;

  const parsed = ListAuditLogsQuerySchema.parse({
    type: typeof params.type === "string" ? params.type : undefined,
    q: typeof params.q === "string" ? params.q : undefined,
    page: typeof params.page === "string" ? params.page : undefined,
    pageSize: typeof params.pageSize === "string" ? params.pageSize : undefined,
  });

  const result = await listAuditLogsPaginatedServer(parsed);

  const listKey = [parsed.type, parsed.q ?? "", parsed.page].join("-");

  return (
    <Suspense>
      <LogsPage
        key={listKey}
        data={{
          items: result.items.map(serializeAuditLogForClient),
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages,
        }}
      />
    </Suspense>
  );
}
