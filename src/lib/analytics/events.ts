export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  QR_VISIT: "qr_visit",
  PRODUCT_OPEN: "product_open",
  WHATSAPP_CLICK: "whatsapp_click",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type WhatsAppClickSource =
  | "hero"
  | "contact"
  | "footer"
  | "drawer"
  | "menu_hero"
  | "other";

export interface AnalyticsEventProperties {
  tenant_id: string;
  slug: string;
  referrer?: string;
  visit_source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  product_id?: string;
  category_id?: string;
  source?: WhatsAppClickSource;
}

export interface TenantAnalyticsSummary {
  views7d: number | null;
  views30d: number | null;
  whatsappClicks30d: number | null;
  topProducts: Array<{ productId: string; count: number }>;
  configured: boolean;
}
