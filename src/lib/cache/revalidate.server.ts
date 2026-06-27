import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  publicLandingCacheTag,
  SUPER_METRICS_CACHE_TAG,
} from "@/lib/cache/revalidate";

/** Purges cached public landing data and page for a tenant slug. */
export function revalidatePublicLanding(slug: string): void {
  revalidateTag(publicLandingCacheTag(slug), "seconds");
  revalidatePath(`/${slug}`, "page");
}

/** Purges super-admin aggregate metrics cache. */
export function revalidateSuperMetrics(): void {
  revalidateTag(SUPER_METRICS_CACHE_TAG, "seconds");
}
