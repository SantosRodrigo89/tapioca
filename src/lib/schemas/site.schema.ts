import { z } from "zod";
import { TenantThemeSchema } from "./tenant-menu.schema";

export const SiteSectionIdSchema = z.enum([
  "hero",
  "about",
  "differentials",
  "featured",
  "menu",
  "gallery",
  "contact",
  "location",
  "footer",
  "faq",
  "testimonials",
]);

export const SiteSectionConfigSchema = z.object({
  id: SiteSectionIdSchema,
  enabled: z.boolean(),
  order: z.number().int().min(0),
});

export const FontPresetSchema = z.enum(["plus-jakarta", "inter", "dm-sans"]);

export const SiteButtonSchema = z.object({
  label: z.string().min(1).max(50),
  href: z.string().min(1).max(500),
  variant: z.enum(["primary", "secondary", "outline"]).optional(),
});

export const SiteIdentitySchema = z.object({
  typography: FontPresetSchema.optional(),
});

export const SiteHeroSchema = z.object({
  title: z.string().max(100).optional(),
  subtitle: z.string().max(200).optional(),
  imageUrl: z.string().url().optional(),
  buttons: z.array(SiteButtonSchema).max(3).optional(),
});

export const SiteAboutSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional(),
});

export const SiteDifferentialSchema = z.object({
  id: z.string(),
  icon: z.string().max(50).optional(),
  title: z.string().min(1).max(80),
  description: z.string().max(300).optional(),
});

export const SiteFeaturedSchema = z.object({
  itemIds: z.array(z.string()).max(12),
  maxCount: z.number().int().min(1).max(12).default(6),
});

export const SiteContactSchema = z.object({
  whatsapp: z
    .string()
    .regex(/^\d+$/, "WhatsApp deve conter apenas números")
    .optional()
    .or(z.literal("")),
  phone: z.string().max(20).optional(),
  instagram: z.string().max(100).optional(),
  facebook: z.string().max(200).optional(),
  tiktok: z.string().max(100).optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export const SiteLocationSchema = z.object({
  address: z.string().max(300).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  directionsUrl: z.string().url().optional(),
});

export const SiteSeoSchema = z.object({
  title: z.string().max(70).optional(),
  description: z.string().max(160).optional(),
  ogImageUrl: z.string().url().optional(),
  keywords: z.array(z.string().max(50)).max(20).optional(),
});

export const SiteFaqItemSchema = z.object({
  id: z.string(),
  question: z.string().min(1).max(200),
  answer: z.string().min(1).max(1000),
});

export const SiteTestimonialSchema = z.object({
  id: z.string(),
  author: z.string().min(1).max(80),
  text: z.string().min(1).max(500),
  imageUrl: z.string().url().optional(),
});

export const SiteConfigSchema = z.object({
  sections: z.array(SiteSectionConfigSchema),
  identity: SiteIdentitySchema,
  hero: SiteHeroSchema,
  about: SiteAboutSchema,
  differentials: z.array(SiteDifferentialSchema).max(12),
  featured: SiteFeaturedSchema,
  contact: SiteContactSchema,
  location: SiteLocationSchema,
  seo: SiteSeoSchema,
  faq: z.array(SiteFaqItemSchema).max(20),
  testimonials: z.array(SiteTestimonialSchema).max(20),
});

export const GalleryImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  caption: z.string().max(200).optional(),
  order: z.number().int().min(0),
  createdAt: z.date(),
});

export const UpdateSiteHeroSchema = SiteHeroSchema.partial();
export const UpdateSiteAboutSchema = SiteAboutSchema.partial();
export const UpdateSiteContactSchema = SiteContactSchema.partial();
export const UpdateSiteLocationSchema = SiteLocationSchema.partial();
export const UpdateSiteSeoSchema = SiteSeoSchema.partial();
export const UpdateSiteIdentitySchema = SiteIdentitySchema.partial();
export const UpdateSiteFeaturedSchema = SiteFeaturedSchema.partial();
export const UpdateSiteSectionsSchema = z.object({
  sections: z.array(SiteSectionConfigSchema),
});

export type SiteSectionId = z.infer<typeof SiteSectionIdSchema>;
export type SiteConfigInput = z.infer<typeof SiteConfigSchema>;
export type UpdateSiteHeroInput = z.infer<typeof UpdateSiteHeroSchema>;
export type UpdateSiteAboutInput = z.infer<typeof UpdateSiteAboutSchema>;
export type UpdateSiteContactInput = z.infer<typeof UpdateSiteContactSchema>;
export type UpdateSiteSeoInput = z.infer<typeof UpdateSiteSeoSchema>;

export { TenantThemeSchema };
