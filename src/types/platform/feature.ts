export type FeatureId =
  | "landing_page"
  | "qr_code"
  | "gallery"
  | "products"
  | "categories"
  | "premium_themes"
  | "orders"
  | "analytics"
  | "ai"
  | "crm"
  | "custom_domain"
  | "marketing"
  | "reservations";

export type FeatureCategory = "core" | "growth" | "premium" | "future";

export interface PlatformFeature {
  id: FeatureId;
  name: string;
  description: string;
  category: FeatureCategory;
  globalEnabled: boolean;
  defaultEnabled: boolean;
  order: number;
}

export type FeatureMap = Partial<Record<FeatureId, boolean>>;
