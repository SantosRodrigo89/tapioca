"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Loader2, Trash2 } from "lucide-react";
import {
  createGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
  updateGalleryImage,
} from "@/lib/repositories/gallery.repository";
import { uploadGalleryImage } from "@/lib/storage/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GalleryImage } from "@/types";

const MAX_IMAGES = 20;

interface GalleryTabProps {
  tenantId: string;
  initialImages: GalleryImage[];
}

export function GalleryTab({ tenantId, initialImages }: GalleryTabProps) {
  const [images, setImages] = useState(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingPreview, setUploadingPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (images.length >= MAX_IMAGES) {
      toast.error(`Máximo de ${MAX_IMAGES} imagens`);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setUploadingPreview(previewUrl);
    setIsUploading(true);

    try {
      const imageId = crypto.randomUUID();
      const url = await uploadGalleryImage(tenantId, imageId, file);
      const created = await createGalleryImage(tenantId, imageId, { url });
      setImages((prev) => [...prev, created].sort((a, b) => a.order - b.order));
      toast.success("Imagem adicionada");
    } catch (err) {
      console.error("[gallery-tab]", err);
      toast.error("Erro ao enviar imagem");
    } finally {
      URL.revokeObjectURL(previewUrl);
      setUploadingPreview(null);
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleCaptionChange = (id: string, caption: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, caption } : img)),
    );
  };

  const handleCaptionSave = async (id: string, caption: string) => {
    try {
      await updateGalleryImage(tenantId, id, {
        caption: caption.trim() || null,
      });
      toast.success("Legenda salva");
    } catch (err) {
      console.error("[gallery-tab]", err);
      toast.error("Erro ao salvar legenda");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGalleryImage(tenantId, id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      toast.success("Imagem removida");
    } catch (err) {
      console.error("[gallery-tab]", err);
      toast.error("Erro ao remover imagem");
    }
  };

  const moveImage = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;

    const previous = images;
    const reordered = [...images];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    const next = reordered.map((img, i) => ({ ...img, order: i }));
    const updates = next.map((img) => ({ id: img.id, order: img.order }));
    setImages(next);

    try {
      await reorderGalleryImages(tenantId, updates);
    } catch (err) {
      console.error("[gallery-tab]", err);
      toast.error("Erro ao reordenar");
      setImages(previous);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Galeria</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fotos do ambiente e pratos. Máximo de {MAX_IMAGES} imagens.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Adicionar imagem ({images.length}/{MAX_IMAGES})</Label>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={isUploading || images.length >= MAX_IMAGES}
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />
        {isUploading && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
          >
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
            Enviando imagem, aguarde...
          </div>
        )}
      </div>

      {images.length === 0 && !isUploading ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma imagem na galeria ainda.
        </p>
      ) : (
        <ul className="space-y-3">
          {isUploading && (
            <li
              role="status"
              aria-live="polite"
              className="flex flex-col gap-3 rounded-xl border border-dashed border-primary/30 bg-muted/30 p-4 sm:flex-row sm:items-start"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted">
                {uploadingPreview && (
                  <Image
                    src={uploadingPreview}
                    alt=""
                    fill
                    className="object-cover opacity-60"
                    sizes="96px"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              </div>
              <div className="flex flex-1 items-center">
                <p className="text-sm text-muted-foreground">
                  Processando upload...
                </p>
              </div>
            </li>
          )}
          {images.map((img, index) => (
            <li
              key={img.id}
              className="flex flex-col gap-3 rounded-xl border border-border/60 p-4 sm:flex-row sm:items-start"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={img.url}
                  alt={img.caption ?? ""}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex-1 space-y-2">
                <Input
                  value={img.caption ?? ""}
                  placeholder="Legenda (opcional)"
                  disabled={isUploading}
                  onChange={(e) => handleCaptionChange(img.id, e.target.value)}
                  onBlur={(e) => handleCaptionSave(img.id, e.target.value)}
                />

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isUploading || index === 0}
                    onClick={() => moveImage(index, -1)}
                    aria-label="Mover para cima"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isUploading || index === images.length - 1}
                    onClick={() => moveImage(index, 1)}
                    aria-label="Mover para baixo"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isUploading}
                    onClick={() => handleDelete(img.id)}
                    aria-label="Remover imagem"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
