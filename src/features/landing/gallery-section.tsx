import { GalleryGrid } from "@/components/public/gallery-grid";
import { LandingHeading } from "@/components/public/landing";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { resolveSectionCopy } from "@/lib/site/section-copy";
import type { LandingPageData } from "@/lib/site/landing-types";

interface GallerySectionProps {
  data: LandingPageData;
}

export function GallerySection({ data }: GallerySectionProps) {
  const gallery = data.gallery;
  const copy = resolveSectionCopy(data.siteConfig.sectionCopy).gallery;

  if (!gallery || gallery.length === 0) return null;

  return (
    <section
      aria-labelledby="gallery-heading"
      id="galeria"
      className="landing-section"
    >
      <ScrollReveal>
        <LandingHeading
          title={copy.title}
          titleId="gallery-heading"
          subtitle={copy.subtitle}
        />
      </ScrollReveal>

      <div className="mt-8 sm:mt-10">
        <GalleryGrid images={gallery} />
      </div>
    </section>
  );
}
