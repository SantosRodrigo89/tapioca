import Image from "next/image";
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
      className="landing-section menu-animate-in mx-auto max-w-4xl px-4"
    >
      <h2
        id="gallery-heading"
        className="mb-8 text-2xl font-semibold text-[var(--menu-secondary)] sm:text-3xl"
      >
        Galeria
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {gallery.map((image) => (
          <figure
            key={image.id}
            className="menu-card group overflow-hidden"
          >
            <div className="relative aspect-square">
              <Image
                src={image.url}
                alt={image.caption ?? "Foto da galeria"}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 50vw, 280px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {image.caption && (
              <figcaption className="px-3 py-2 text-xs text-[#666]">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
