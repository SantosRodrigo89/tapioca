import { Fragment, Suspense } from "react";
import dynamic from "next/dynamic";
import { LandingNav } from "@/components/public/landing-nav";
import { HeroSection } from "@/features/landing/hero-section";
import { SectionSkeleton } from "@/features/landing/section-skeleton";
import { resolveLandingNavItems } from "@/lib/site/landing-nav";
import { resolveEnabledSections } from "@/services/site.service";
import {
  isEntitled,
  SECTION_FEATURE_MAP,
  type TenantEntitlements,
} from "@/lib/platform/entitlements";
import type { SiteSectionId } from "@/types/site";
import type { LandingPageData } from "./landing-types";
import { bandVariantToClass, resolveBandVariant } from "./section-bands";

export const HERO_SECTIONS = ["hero"] as const satisfies readonly SiteSectionId[];

export const LAZY_SECTIONS = [
  "about",
  "differentials",
  "featured",
  "menu",
  "gallery",
  "contact",
  "location",
  "footer",
] as const satisfies readonly SiteSectionId[];

const BANDED_SECTIONS = new Set<SiteSectionId>([
  "about",
  "differentials",
  "featured",
  "menu",
  "gallery",
  "contact",
  "location",
]);

const AboutSection = dynamic(
  () =>
    import("@/features/landing/about-section").then((m) => ({
      default: m.AboutSection,
    })),
  { loading: () => <SectionSkeleton /> },
);

const DifferentialsSection = dynamic(
  () =>
    import("@/features/landing/differentials-section").then((m) => ({
      default: m.DifferentialsSection,
    })),
  { loading: () => <SectionSkeleton /> },
);

const FeaturedSection = dynamic(
  () =>
    import("@/features/landing/featured-section").then((m) => ({
      default: m.FeaturedSection,
    })),
  { loading: () => <SectionSkeleton /> },
);

const MenuSection = dynamic(
  () =>
    import("@/features/landing/menu-section").then((m) => ({
      default: m.MenuSection,
    })),
  { loading: () => <SectionSkeleton /> },
);

const GallerySection = dynamic(
  () =>
    import("@/features/landing/gallery-section").then((m) => ({
      default: m.GallerySection,
    })),
  { loading: () => <SectionSkeleton /> },
);

const ContactSection = dynamic(
  () =>
    import("@/features/landing/contact-section").then((m) => ({
      default: m.ContactSection,
    })),
  { loading: () => <SectionSkeleton /> },
);

const LocationSection = dynamic(
  () =>
    import("@/features/landing/location-section").then((m) => ({
      default: m.LocationSection,
    })),
  { loading: () => <SectionSkeleton /> },
);

const FooterSection = dynamic(
  () =>
    import("@/features/landing/footer-section").then((m) => ({
      default: m.FooterSection,
    })),
  { loading: () => <SectionSkeleton /> },
);

type SectionRenderer = (data: LandingPageData) => React.ReactNode;

function renderWithLayout(
  sectionId: keyof LandingPageData["layout"]["sections"],
  render: (variant: string) => React.ReactNode,
  data: LandingPageData,
) {
  return render(data.layout.sections[sectionId]);
}

export const SECTION_COMPONENTS: Partial<
  Record<SiteSectionId, SectionRenderer>
> = {
  hero: (data) =>
    renderWithLayout("hero", (variant) => (
      <HeroSection data={data} variant={variant} />
    ), data),
  about: (data) =>
    renderWithLayout("about", (variant) => (
      <Suspense fallback={<SectionSkeleton />}>
        <AboutSection data={data} variant={variant} />
      </Suspense>
    ), data),
  differentials: (data) =>
    renderWithLayout("differentials", (variant) => (
      <Suspense fallback={<SectionSkeleton />}>
        <DifferentialsSection data={data} variant={variant} />
      </Suspense>
    ), data),
  featured: (data) =>
    renderWithLayout("featured", (variant) => (
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedSection data={data} variant={variant} />
      </Suspense>
    ), data),
  menu: (data) =>
    renderWithLayout("menu", (variant) => (
      <Suspense fallback={<SectionSkeleton />}>
        <MenuSection data={data} variant={variant} />
      </Suspense>
    ), data),
  gallery: (data) =>
    renderWithLayout("gallery", (variant) => (
      <Suspense fallback={<SectionSkeleton />}>
        <GallerySection data={data} variant={variant} />
      </Suspense>
    ), data),
  contact: (data) =>
    renderWithLayout("contact", (variant) => (
      <Suspense fallback={<SectionSkeleton />}>
        <ContactSection data={data} variant={variant} />
      </Suspense>
    ), data),
  location: (data) =>
    renderWithLayout("location", (variant) => (
      <Suspense fallback={<SectionSkeleton />}>
        <LocationSection data={data} variant={variant} />
      </Suspense>
    ), data),
  footer: (data) =>
    renderWithLayout("footer", (variant) => (
      <Suspense fallback={<SectionSkeleton />}>
        <FooterSection data={data} variant={variant} />
      </Suspense>
    ), data),
};

function wrapInBand(
  sectionId: SiteSectionId,
  content: React.ReactNode,
  bandIndex: number,
  bandOverrides?: LandingPageData["layout"]["bandOverrides"],
) {
  if (!BANDED_SECTIONS.has(sectionId)) return content;

  const variant = resolveBandVariant(sectionId, bandIndex, bandOverrides);

  return (
    <div className={`landing-section-band ${bandVariantToClass(variant)}`}>
      <div className="landing-container">{content}</div>
    </div>
  );
}

function sectionHasContent(
  sectionId: SiteSectionId,
  data: LandingPageData,
): boolean {
  switch (sectionId) {
    case "hero":
    case "menu":
    case "footer":
      return true;
    case "about":
      return !!(
        data.siteConfig.about.description || data.siteConfig.about.imageUrl
      );
    case "differentials":
      return (data.siteConfig.differentials?.length ?? 0) > 0;
    case "featured":
      return data.highlights.length > 0;
    case "gallery":
      return data.gallery.length > 0;
    case "contact": {
      const contact = data.siteConfig.contact;
      return !!(
        contact.whatsapp ||
        contact.phone ||
        contact.email ||
        contact.instagram ||
        contact.facebook ||
        contact.tiktok ||
        data.siteConfig.location.address ||
        data.tenant.address ||
        data.tenant.openingHours
      );
    }
    case "location": {
      const location = data.siteConfig.location;
      return !!(
        location.address ||
        data.tenant.address ||
        location.directionsUrl ||
        (location.lat != null && location.lng != null)
      );
    }
    default:
      return false;
  }
}

export function renderLandingSections(
  data: LandingPageData,
  entitlements?: TenantEntitlements,
) {
  const sections = resolveEnabledSections(data.siteConfig).filter((section) => {
    const requiredFeature = SECTION_FEATURE_MAP[section.id];
    if (!requiredFeature || !entitlements) return true;
    return isEntitled(entitlements, requiredFeature);
  });
  const navItems = resolveLandingNavItems(data);
  let bandIndex = 0;

  return (
    <>
      <div data-template={data.layout.templateId}>
        {sections.map((section) => {
        if (!sectionHasContent(section.id, data)) return null;

        const render = SECTION_COMPONENTS[section.id];
        if (!render) return null;

        const content = render(data);

        if (section.id === "hero") {
          return (
            <Fragment key={section.id}>
              <LandingNav
                items={navItems}
                tenantName={data.tenant.name}
                tenantLogo={data.tenant.logoUrl}
                whatsapp={data.whatsapp}
              />
              {content}
            </Fragment>
          );
        }

        const wrapped = BANDED_SECTIONS.has(section.id)
          ? wrapInBand(
              section.id,
              content,
              bandIndex++,
              data.layout.bandOverrides,
            )
          : content;

        return <Fragment key={section.id}>{wrapped}</Fragment>;
      })}
      </div>
    </>
  );
}

export {
  CLASSIC_TEMPLATE_ID,
  SECTION_REGISTRY,
  resolveTemplateLayout,
  resolveTemplateSections,
} from "./template-registry";
