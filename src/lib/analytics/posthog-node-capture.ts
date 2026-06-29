import { PostHog } from "posthog-node";

function getPostHogNodeClient(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (!key) return null;

  const host =
    process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim().replace(/\/$/, "") ??
    "https://us.i.posthog.com";

  return new PostHog(key, { host, flushAt: 1, flushInterval: 0 });
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  const client = getPostHogNodeClient();
  if (!client) return;

  client.capture({ distinctId, event, properties });
  await client.shutdown();
}
