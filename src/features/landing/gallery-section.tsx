import Image from "next/image";
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
        <h2 id="gallery-heading" className="landing-heading mb-10 sm:mb-12">
          Galeria
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
        {gallery.map((image, index) => (
          <ScrollReveal
            key={image.id}
            delay={index * 60}
            as="figure"
            className="menu-card group overflow-hidden"
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={image.url}
                alt={image.caption ?? "Foto da galeria"}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 50vw, 280px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {image.caption && (
              <figcaption className="px-4 py-3 text-sm text-[#666]">
                {image.caption}
              </figcaption>
            )}
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
