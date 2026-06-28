"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { validateImageFile } from "@/lib/storage/upload";

interface ImageUploadProps {
  label: string;
  currentUrl?: string | null;
  onFileChange: (file: File | null) => void;
  onRemoveExisting?: () => void;
  disabled?: boolean;
  previewClassName?: string;
  aspect?: "square" | "banner";
}

export function ImageUpload({
  label,
  currentUrl,
  onFileChange,
  onRemoveExisting,
  disabled,
  previewClassName,
  aspect = "square",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(currentUrl ?? null);
  }, [currentUrl]);

  const handleFile = (file: File | null) => {
    setError(null);
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      onFileChange(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setPreview(URL.createObjectURL(file));
    onFileChange(file);
  };

  const handleClear = () => {
    const wasExisting =
      preview && !preview.startsWith("blob:") && Boolean(currentUrl);
    setPreview(null);
    setError(null);
    onFileChange(null);
    if (wasExisting) onRemoveExisting?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  const isBlobPreview = preview?.startsWith("blob:") ?? false;
  const previewBoxClass =
    previewClassName ??
    (aspect === "banner"
      ? "h-24 w-full max-w-md"
      : "h-28 w-28 shrink-0");

  const isStacked = aspect === "banner";

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {isStacked ? (
        <div className="space-y-3">
          {preview ? (
            <div
              className={`relative overflow-hidden rounded-md border ${previewBoxClass}`}
            >
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                sizes={isStacked ? "448px" : "112px"}
                unoptimized={isBlobPreview}
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6"
                  onClick={handleClear}
                  aria-label="Remover imagem"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ) : (
            <div
              className={`flex items-center justify-center rounded-md border border-dashed bg-muted/50 ${previewBoxClass}`}
            >
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="space-y-1">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
              disabled={disabled}
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">
              JPEG, PNG ou WebP. Máximo 5 MB.
            </p>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          {preview ? (
            <div
              className={`relative overflow-hidden rounded-md border ${previewBoxClass}`}
            >
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                sizes={isStacked ? "448px" : "112px"}
                unoptimized={isBlobPreview}
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6"
                  onClick={handleClear}
                  aria-label="Remover imagem"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ) : (
            <div
              className={`flex shrink-0 items-center justify-center rounded-md border border-dashed bg-muted/50 ${previewBoxClass}`}
            >
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 space-y-1 min-w-0">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
              disabled={disabled}
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">
              JPEG, PNG ou WebP. Máximo 5 MB.
            </p>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
