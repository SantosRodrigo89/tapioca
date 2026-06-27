const DEBOUNCE_MS = 400;
const pending = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Schedules a debounced request to purge the public landing cache after admin edits.
 * Fire-and-forget — write success must not depend on revalidation.
 */
export function notifyPublicLandingChanged(tenantId: string): void {
  if (typeof window === "undefined") return;

  const existing = pending.get(tenantId);
  if (existing) clearTimeout(existing);

  pending.set(
    tenantId,
    setTimeout(() => {
      pending.delete(tenantId);
      void fetch("/api/revalidate/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId }),
      }).catch((err) => console.error("[notifyPublicLandingChanged]", err));
    }, DEBOUNCE_MS),
  );
}
