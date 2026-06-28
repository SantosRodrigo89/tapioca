import { GalleryGrid } from "@/components/public/gallery-grid";
import { LandingHeading } from "@/components/public/landing";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import type { LandingPageData } from "@/lib/site/landing-types";

interface GallerySectionProps {
  data: LandingPageData;
}

export function GallerySection({ data }: GallerySectionProps) {
  const gallery = data.gallery;

  if (!gallery || gallery.length === 0) return null;

  return (
    <section
      aria-labelledby="gallery-heading"
      id="galeria"
      className="landing-section"
    >
      <ScrollReveal>
        <LandingHeading
          title="Galeria"
          titleId="gallery-heading"
          subtitle="Momentos e sabores do nosso restaurante"
        />
      </ScrollReveal>

      <div className="mt-8 sm:mt-10">
        <GalleryGrid images={gallery} />
      </div>
    </section>
  );
}
