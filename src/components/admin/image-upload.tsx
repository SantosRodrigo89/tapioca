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
  disabled?: boolean;
}

export function ImageUpload({
  label,
  currentUrl,
  onFileChange,
  disabled,
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
    setPreview(null);
    setError(null);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const isBlobPreview = preview?.startsWith("blob:") ?? false;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-start gap-4">
        {preview ? (
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-md border">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="112px"
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
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-md border border-dashed bg-muted/50">
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
    </div>
  );
}
