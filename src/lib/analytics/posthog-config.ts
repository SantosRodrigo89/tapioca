const DEFAULT_POSTHOG_HOST = "https://us.i.posthog.com";

export function getPostHogClientConfig(): {
  apiKey: string;
  apiHost: string;
} | null {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (!apiKey) return null;

  const apiHost =
    process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim().replace(/\/$/, "") ??
    DEFAULT_POSTHOG_HOST;

  return { apiKey, apiHost };
}

export function getPostHogServerConfig(): {
  personalApiKey: string;
  projectId: string;
  host: string;
} | null {
  const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY?.trim();
  const projectId = process.env.POSTHOG_PROJECT_ID?.trim();
  if (!personalApiKey || !projectId) return null;

  const host =
    process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim().replace(/\/$/, "") ??
    DEFAULT_POSTHOG_HOST;

  return { personalApiKey, projectId, host };
}

export function isPostHogConfigured(): boolean {
  return getPostHogClientConfig() !== null;
}

export function isPostHogServerConfigured(): boolean {
  return getPostHogServerConfig() !== null;
}
