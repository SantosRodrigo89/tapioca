import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface ItemThumbnailProps {
  src?: string;
  alt: string;
}

export function ItemThumbnail({ src, alt }: ItemThumbnailProps) {
  if (src) {
    return (
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-muted">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground"
      aria-hidden
    >
      <ImageIcon className="h-5 w-5" />
    </div>
  );
}
