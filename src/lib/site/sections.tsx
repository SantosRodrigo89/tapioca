import { Fragment, Suspense } from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "@/features/landing/hero-section";
import { SectionSkeleton } from "@/features/landing/section-skeleton";
import { resolveEnabledSections } from "@/services/site.service";
import type { SiteSectionId } from "@/types/site";
import type { LandingPageData } from "./landing-types";

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

export const SECTION_COMPONENTS: Partial<
  Record<SiteSectionId, SectionRenderer>
> = {
  hero: (data) => <HeroSection data={data} />,
  about: (data) => (
    <Suspense fallback={<SectionSkeleton />}>
      <AboutSection data={data} />
    </Suspense>
  ),
  differentials: (data) => (
    <Suspense fallback={<SectionSkeleton />}>
      <DifferentialsSection data={data} />
    </Suspense>
  ),
  featured: (data) => (
    <Suspense fallback={<SectionSkeleton />}>
      <FeaturedSection data={data} />
    </Suspense>
  ),
  menu: (data) => (
    <Suspense fallback={<SectionSkeleton />}>
      <MenuSection data={data} />
    </Suspense>
  ),
  gallery: (data) => (
    <Suspense fallback={<SectionSkeleton />}>
      <GallerySection data={data} />
    </Suspense>
  ),
  contact: (data) => (
    <Suspense fallback={<SectionSkeleton />}>
      <ContactSection data={data} />
    </Suspense>
  ),
  location: (data) => (
    <Suspense fallback={<SectionSkeleton />}>
      <LocationSection data={data} />
    </Suspense>
  ),
  footer: (data) => (
    <Suspense fallback={<SectionSkeleton />}>
      <FooterSection data={data} />
    </Suspense>
  ),
};

export function renderLandingSections(data: LandingPageData) {
  const sections = resolveEnabledSections(data.siteConfig);

  return (
    <div className="space-y-16">
      {sections.map((section) => {
        const render = SECTION_COMPONENTS[section.id];
        if (!render) return null;
        return <Fragment key={section.id}>{render(data)}</Fragment>;
      })}
    </div>
  );
}
