"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
  layout?: "asymmetric" | "uniform";
}

function galleryItemLayout(
  index: number,
  total: number,
  layout: "asymmetric" | "uniform",
): string {
  if (layout === "uniform") return "";
  if (total === 1) return "gallery-grid__item--solo";
  if (index === 0 && total >= 3) return "gallery-grid__item--featured";
  if (index === 1 && total === 2) return "gallery-grid__item--tall";
  return "";
}

export function GalleryGrid({ images, layout = "asymmetric" }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex !== null ? images[activeIndex] : null;
  const hasMultiple = images.length > 1;

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current + 1) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, goToNext, goToPrevious]);

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
              galleryItemLayout(index, images.length, layout),
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
        <DialogContent className="max-w-[min(92vw,56rem)] border-0 bg-transparent p-0 shadow-none [&>button.absolute]:hidden">
          <DialogTitle className="sr-only">
            {activeImage?.caption ?? "Foto ampliada da galeria"}
          </DialogTitle>
          {activeImage && activeIndex !== null && (
            <figure className="relative m-0">
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border-0 bg-black/55 text-white cursor-pointer"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>

              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="absolute top-1/2 left-2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-black/55 text-white cursor-pointer sm:left-3"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="absolute top-1/2 right-2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-black/55 text-white cursor-pointer sm:right-3"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <p
                    className="absolute top-3 left-3 z-10 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white"
                    aria-live="polite"
                  >
                    {activeIndex + 1} / {images.length}
                  </p>
                </>
              )}

              <div className="relative w-full overflow-hidden rounded-2xl bg-black">
                <Image
                  src={activeImage.url}
                  alt={activeImage.caption ?? "Foto da galeria"}
                  width={1600}
                  height={1200}
                  sizes="(max-width: 896px) 92vw, 896px"
                  className="mx-auto max-h-[min(85vh,56rem)] w-auto max-w-full object-contain"
                  priority
                />
              </div>

              {activeImage.caption && (
                <figcaption className="mt-3 text-center text-sm text-white">
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
