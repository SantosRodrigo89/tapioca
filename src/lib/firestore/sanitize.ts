/**
 * Removes undefined values recursively so Firestore updateDoc accepts the payload.
 */
export function stripUndefined<T>(value: T): T {
  if (value === undefined) {
    return value;
  }

  if (value === null || typeof value !== "object") {
    return value;
  }

  if (value instanceof Date) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item)) as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value)) {
    if (nested !== undefined) {
      result[key] = stripUndefined(nested);
    }
  }
  return result as T;
}
