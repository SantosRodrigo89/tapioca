import type { SiteConfig } from "./site";

// ─── Tenant ────────────────────────────────────────────────────────────────

export type TenantStatus = "trial" | "active" | "suspended" | "cancelled";

export type UserRole = "super_admin" | "tenant_admin";

export interface TenantTheme {
  primaryColor: string;
  primaryDarkColor: string;
  secondaryColor: string;
}

export type WeekdayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface DaySchedule {
  day: WeekdayKey;
  closed: boolean;
  open: string;
  close: string;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  address?: string;
  whatsapp?: string;
  theme?: TenantTheme;
  openingHours?: DaySchedule[];
  highlightItemIds?: string[];
  siteConfig?: SiteConfig;
  status: TenantStatus;
  ownerUid: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Catalog ───────────────────────────────────────────────────────────────

export interface TimeWindow {
  start: string;
  end: string;
}

export interface AvailabilitySchedule {
  enabled: boolean;
  windows: TimeWindow[];
}

export interface Category {
  id: string;
  name: string;
  order: number;
  active: boolean;
  availability?: AvailabilitySchedule;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  /** Price stored in cents (e.g. R$ 12,90 = 1290) */
  price: number;
  imageUrl?: string;
  available: boolean;
  availability?: AvailabilitySchedule;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  tenantId?: string;
  role?: UserRole;
}

// ─── SlugIndex ─────────────────────────────────────────────────────────────

export interface SlugIndexEntry {
  tenantId: string;
  createdAt: Date;
}

export type { SiteConfig, SiteSectionConfig, SiteSectionId, GalleryImage } from "./site";
