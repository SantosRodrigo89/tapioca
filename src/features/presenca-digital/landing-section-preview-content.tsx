"use client";

import { LandingHeading } from "@/components/public/landing";
import { resolveSectionCopy } from "@/lib/site/section-copy";
import { sectionLayoutProps } from "@/lib/site/section-layout-props";
import { DifferentialsSection } from "@/features/landing/differentials-section";
import { FeaturedSection } from "@/features/landing/featured-section";
import { AboutSection } from "@/features/landing/about-section";
import { GallerySection } from "@/features/landing/gallery-section";
import { MenuSection } from "@/features/landing/menu-section";
import { HeroSection } from "@/features/landing/hero-section";
import { LandingPreviewProductProvider } from "@/features/presenca-digital/landing-preview-product-provider";
import type { LandingPageData } from "@/lib/site/landing-types";
import { getPreviewSectionVariant } from "@/lib/site/landing-preview";

interface SectionPreviewContentProps {
  data: LandingPageData;
}

export function DifferentialsPreviewContent({ data }: SectionPreviewContentProps) {
  const variant = getPreviewSectionVariant(data.tenant, "differentials");
  const items = data.siteConfig.differentials;

  if (!items?.length) {
    const copy = resolveSectionCopy(data.siteConfig.sectionCopy).differentials;
    return (
      <section
        className="landing-section"
        {...sectionLayoutProps("differentials", variant)}
      >
        <LandingHeading
          align="center"
          title={copy.title}
          subtitle={copy.subtitle}
        />
        <p className="mt-10 px-4 text-center text-sm text-[var(--menu-text-muted)]">
          Adicione diferenciais para ver os cards aqui.
        </p>
      </section>
    );
  }

  return <DifferentialsSection data={data} variant={variant} />;
}

export function FeaturedPreviewContent({ data }: SectionPreviewContentProps) {
  const variant = getPreviewSectionVariant(data.tenant, "featured");

  if (data.highlights.length === 0) {
    const copy = resolveSectionCopy(data.siteConfig.sectionCopy).featured;
    return (
      <section
        id="destaques"
        className="landing-section"
        {...sectionLayoutProps("featured", variant)}
      >
        <LandingHeading title={copy.title} subtitle={copy.subtitle} />
        <p className="mt-8 px-4 text-center text-sm text-[var(--menu-text-muted)]">
          Selecione produtos para ver o carrossel.
        </p>
      </section>
    );
  }

  return (
    <LandingPreviewProductProvider data={data}>
      <FeaturedSection data={data} variant={variant} />
    </LandingPreviewProductProvider>
  );
}

export function AboutPreviewContent({ data }: SectionPreviewContentProps) {
  const variant = getPreviewSectionVariant(data.tenant, "about");
  const about = data.siteConfig.about;
  const hasContent = about.description || about.imageUrl;

  if (!hasContent) {
    const copy = resolveSectionCopy(data.siteConfig.sectionCopy).about;
    return (
      <section
        className="landing-section"
        {...sectionLayoutProps("about", variant)}
      >
        <LandingHeading
          align={variant === "centered" ? "center" : undefined}
          title={about.title ?? "Sobre nós"}
          eyebrow={copy.eyebrow}
        />
        <p className="mt-10 px-4 text-center text-sm text-[var(--menu-text-muted)]">
          Adicione uma descrição para completar a seção.
        </p>
      </section>
    );
  }

  return <AboutSection data={data} variant={variant} />;
}

export function GalleryPreviewContent({ data }: SectionPreviewContentProps) {
  const variant = getPreviewSectionVariant(data.tenant, "gallery");

  if (data.gallery.length === 0) {
    const copy = resolveSectionCopy(data.siteConfig.sectionCopy).gallery;
    return (
      <section
        className="landing-section"
        {...sectionLayoutProps("gallery", variant)}
      >
        <LandingHeading title={copy.title} subtitle={copy.subtitle} />
        <p className="mt-8 px-4 text-center text-sm text-[var(--menu-text-muted)]">
          Adicione imagens para ver a galeria.
        </p>
      </section>
    );
  }

  return <GallerySection data={data} variant={variant} />;
}

export function MenuPreviewContent({ data }: SectionPreviewContentProps) {
  const variant = getPreviewSectionVariant(data.tenant, "menu");
  return (
    <LandingPreviewProductProvider data={data}>
      <MenuSection data={data} variant={variant} />
    </LandingPreviewProductProvider>
  );
}

export function HeroPreviewContent({ data }: SectionPreviewContentProps) {
  const variant = getPreviewSectionVariant(data.tenant, "hero");
  return <HeroSection data={data} variant={variant} />;
}

export function ContactHeadingPreviewContent({ data }: SectionPreviewContentProps) {
  const copy = resolveSectionCopy(data.siteConfig.sectionCopy).contact;
  const variant = getPreviewSectionVariant(data.tenant, "contact");

  return (
    <section
      className="landing-section"
      {...sectionLayoutProps("contact", variant)}
    >
      <LandingHeading
        align="center"
        title={copy.title}
        subtitle={copy.subtitle}
      />
    </section>
  );
}

export function ContactCtaPreviewContent({ data }: SectionPreviewContentProps) {
  const copy = resolveSectionCopy(data.siteConfig.sectionCopy).contact;
  const variant = getPreviewSectionVariant(data.tenant, "contact");

  return (
    <section
      className="landing-section"
      {...sectionLayoutProps("contact", variant)}
    >
      <LandingHeading
        align="center"
        title={copy.title}
        subtitle={copy.subtitle}
      />
      <div className="contact-cta mt-8 sm:mt-10">
        <div className="contact-cta__copy">
          <p className="contact-cta__eyebrow">{copy.ctaEyebrow}</p>
          <h3 className="contact-cta__title">{copy.ctaTitle}</h3>
          <p className="contact-cta__subtitle">{copy.ctaSubtitle}</p>
        </div>
        <span className="landing-btn landing-btn--primary landing-btn--lg contact-cta__button w-full">
          Pedir pelo WhatsApp
        </span>
      </div>
    </section>
  );
}

export function LocationHeadingPreviewContent({ data }: SectionPreviewContentProps) {
  const copy = resolveSectionCopy(data.siteConfig.sectionCopy).location;
  const variant = getPreviewSectionVariant(data.tenant, "location");

  return (
    <section
      className="landing-section"
      {...sectionLayoutProps("location", variant)}
    >
      <LandingHeading
        align="center"
        title={copy.title}
        subtitle={copy.subtitle}
      />
      <p className="mt-8 px-4 text-center text-sm text-[var(--menu-text-muted)]">
        {data.siteConfig.location.address ?? "Endereço do restaurante"}
      </p>
    </section>
  );
}
