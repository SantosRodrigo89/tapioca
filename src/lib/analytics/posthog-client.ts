import posthog from "posthog-js";
import {
  ANALYTICS_EVENTS,
  type AnalyticsEventProperties,
  type WhatsAppClickSource,
} from "@/lib/analytics/events";

// PostHog is initialized in instrumentation-client.ts (Next.js 15.3+)

export function identifyUser(
  uid: string,
  properties?: {
    email?: string | null;
    role?: string;
    tenantId?: string;
  },
): void {
  posthog.identify(uid, {
    ...(properties?.email ? { email: properties.email } : {}),
    ...(properties?.role ? { role: properties.role } : {}),
    ...(properties?.tenantId ? { tenant_id: properties.tenantId } : {}),
  });
}

export function resetUser(): void {
  posthog.reset();
}

export function identifyTenantGroup(tenantId: string): void {
  posthog.group("tenant", tenantId);
}

export function captureAnalyticsEvent(
  event: string,
  properties: AnalyticsEventProperties,
): void {
  posthog.capture(event, properties);
}

export function capturePageView(tenantId: string, slug: string): void {
  const params = new URLSearchParams(window.location.search);
  const referrer = document.referrer || undefined;
  const visitSource = params.get("from") ?? undefined;

  identifyTenantGroup(tenantId);

  captureAnalyticsEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
    tenant_id: tenantId,
    slug,
    referrer,
    visit_source: visitSource ?? undefined,
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
  });

  if (visitSource === "qr") {
    captureAnalyticsEvent(ANALYTICS_EVENTS.QR_VISIT, {
      tenant_id: tenantId,
      slug,
    });
  }
}

export function captureProductOpen(
  tenantId: string,
  slug: string,
  productId: string,
  categoryId: string,
): void {
  captureAnalyticsEvent(ANALYTICS_EVENTS.PRODUCT_OPEN, {
    tenant_id: tenantId,
    slug,
    product_id: productId,
    category_id: categoryId,
  });
}

export function captureWhatsAppClick(
  tenantId: string,
  slug: string,
  source: WhatsAppClickSource,
): void {
  captureAnalyticsEvent(ANALYTICS_EVENTS.WHATSAPP_CLICK, {
    tenant_id: tenantId,
    slug,
    source,
  });
}

export function inferWhatsAppSourceFromElement(
  element: Element,
): WhatsAppClickSource {
  const hero = element.closest("#landing-hero");
  if (hero) return "hero";

  const contact = element.closest("#contato, #landing-contact, [id*='contact']");
  if (contact) return "contact";

  const footer = element.closest("footer, [id*='footer']");
  if (footer) return "footer";

  const drawer = element.closest("[data-product-drawer]");
  if (drawer) return "drawer";

  const menuHero = element.closest(".menu-hero, [class*='menu-hero']");
  if (menuHero) return "menu_hero";

  return "other";
}

export function isWhatsAppHref(href: string): boolean {
  return /wa\.me|api\.whatsapp\.com|whatsapp\.com/i.test(href);
}
