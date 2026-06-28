"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/site";

interface GalleryGridProps {
  images: GalleryImage[];
}

function galleryItemLayout(index: number, total: number): string {
  if (total === 1) return "gallery-grid__item--solo";
  if (index === 0 && total >= 3) return "gallery-grid__item--featured";
  if (index === 1 && total === 2) return "gallery-grid__item--tall";
  return "";
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex !== null ? images[activeIndex] : null;

  return (
    <>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <ScrollReveal
            key={image.id}
            delay={index * 50}
            as="figure"
            className={cn(
              "gallery-grid__item group",
              galleryItemLayout(index, images.length),
            )}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="gallery-grid__button"
              aria-label={
                image.caption
                  ? `Ampliar foto: ${image.caption}`
                  : "Ampliar foto da galeria"
              }
            >
              <Image
                src={image.url}
                alt={image.caption ?? "Foto da galeria"}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 50vw, 320px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="gallery-grid__shine" aria-hidden />
              {image.caption && (
                <span className="gallery-grid__caption">{image.caption}</span>
              )}
            </button>
          </ScrollReveal>
        ))}
      </div>

      <Dialog
        open={activeIndex !== null}
        onOpenChange={(open) => !open && setActiveIndex(null)}
      >
        <DialogContent className="gallery-lightbox max-w-4xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            {activeImage?.caption ?? "Foto ampliada da galeria"}
          </DialogTitle>
          {activeImage && (
            <figure className="gallery-lightbox__figure">
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="gallery-lightbox__close"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="gallery-lightbox__image">
                <Image
                  src={activeImage.url}
                  alt={activeImage.caption ?? "Foto da galeria"}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-contain"
                  priority
                />
              </div>
              {activeImage.caption && (
                <figcaption className="gallery-lightbox__caption">
                  {activeImage.caption}
                </figcaption>
              )}
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
