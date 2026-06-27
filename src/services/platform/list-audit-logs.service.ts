import type { AuditEventType } from "@/types/platform/audit-log";
import type { ListAuditLogsQuery } from "@/lib/schemas/platform/list-audit-logs.schema";
import { listAuditLogsServer } from "@/lib/repositories/server/platform/audit-log.server";

export interface AuditLogListItem {
  id: string;
  type: AuditEventType;
  actorUid?: string;
  actorEmail?: string;
  tenantId?: string;
  tenantName?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface ListAuditLogsResult {
  items: AuditLogListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function matchesSearch(log: AuditLogListItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    log.type.toLowerCase().includes(q) ||
    (log.tenantName?.toLowerCase().includes(q) ?? false) ||
    (log.actorEmail?.toLowerCase().includes(q) ?? false) ||
    (log.tenantId?.toLowerCase().includes(q) ?? false)
  );
}

export async function listAuditLogsPaginatedServer(
  query: ListAuditLogsQuery,
): Promise<ListAuditLogsResult> {
  const fetchLimit = 500;
  const logs = await listAuditLogsServer(fetchLimit);

  let filtered = logs.map((log) => ({ ...log }));

  if (query.type && query.type !== "all") {
    filtered = filtered.filter((log) => log.type === query.type);
  }

  if (query.q) {
    filtered = filtered.filter((log) => matchesSearch(log, query.q!));
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, totalPages);
  const start = (page - 1) * query.pageSize;

  return {
    items: filtered.slice(start, start + query.pageSize),
    total,
    page,
    pageSize: query.pageSize,
    totalPages,
  };
}

export function serializeAuditLogForClient(
  log: AuditLogListItem,
): Omit<AuditLogListItem, "createdAt"> & { createdAt: string } {
  return {
    ...log,
    createdAt: log.createdAt.toISOString(),
  };
}
