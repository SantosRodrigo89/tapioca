export type {
  FeatureId,
  FeatureCategory,
  PlatformFeature,
  FeatureMap,
} from "./feature";
export type { PlanId, PlanStatus, Plan } from "./plan";
export type {
  TemplateCategory,
  TemplateStatus,
  SiteTemplate,
} from "./template";
export type { InviteStatus, TenantInvite } from "./invite";
export type { AuditEventType, AuditLog } from "./audit-log";
export type { PlatformSettings } from "./platform-settings";

export type TenantCreatedBy = "signup" | "super_admin";

export interface TenantMetrics {
  productCount?: number;
  categoryCount?: number;
  landingPublished?: boolean;
  /** Page views (30d) synced from PostHog or live query */
  views?: number;
}

export interface SuperDashboardMetrics {
  activeTenants: number;
  trialTenants: number;
  suspendedTenants: number;
  cancelledTenants: number;
  pendingInvites: number;
  totalProducts: number;
  publishedLandings: number;
  /** Placeholder */
  totalViews: number | null;
}

export interface SuperPlatformMetrics {
  totalTenants: number;
  totalProducts: number;
  totalCategories: number;
  publishedLandings: number;
  totalUsers: number;
  totalQrCodes: number;
  totalViews: number | null;
  pendingInvites: number;
  activeTenants: number;
  trialTenants: number;
  suspendedTenants: number;
  cancelledTenants: number;
  totalPlans: number;
  totalTemplates: number;
  totalFeatures: number;
}
