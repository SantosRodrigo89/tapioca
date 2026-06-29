"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { WhatsAppClickSource } from "@/lib/analytics/events";
import {
  capturePageView,
  captureProductOpen,
  captureWhatsAppClick,
  inferWhatsAppSourceFromElement,
  isWhatsAppHref,
} from "@/lib/analytics/posthog-client";

interface PublicAnalyticsContextValue {
  enabled: boolean;
  captureProductOpen: (productId: string, categoryId: string) => void;
  captureWhatsAppClick: (source: WhatsAppClickSource) => void;
}

const PublicAnalyticsContext = createContext<PublicAnalyticsContextValue | null>(
  null,
);

export function usePublicAnalytics(): PublicAnalyticsContextValue | null {
  return useContext(PublicAnalyticsContext);
}

interface PublicAnalyticsProviderProps {
  tenantId: string;
  slug: string;
  enabled: boolean;
  children: ReactNode;
}

export function PublicAnalyticsProvider({
  tenantId,
  slug,
  enabled,
  children,
}: PublicAnalyticsProviderProps) {
  const trackProductOpen = useCallback(
    (productId: string, categoryId: string) => {
      if (!enabled) return;
      captureProductOpen(tenantId, slug, productId, categoryId);
    },
    [enabled, tenantId, slug],
  );

  const trackWhatsAppClick = useCallback(
    (source: WhatsAppClickSource) => {
      if (!enabled) return;
      captureWhatsAppClick(tenantId, slug, source);
    },
    [enabled, tenantId, slug],
  );

  useEffect(() => {
    if (!enabled) return;
    capturePageView(tenantId, slug);
  }, [enabled, tenantId, slug]);

  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute("href") ?? "";
      if (!isWhatsAppHref(href)) return;

      const source = inferWhatsAppSourceFromElement(anchor);
      captureWhatsAppClick(tenantId, slug, source);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [enabled, tenantId, slug]);

  const value = useMemo(
    () => ({
      enabled,
      captureProductOpen: trackProductOpen,
      captureWhatsAppClick: trackWhatsAppClick,
    }),
    [enabled, trackProductOpen, trackWhatsAppClick],
  );

  return (
    <PublicAnalyticsContext.Provider value={value}>
      {children}
    </PublicAnalyticsContext.Provider>
  );
}
