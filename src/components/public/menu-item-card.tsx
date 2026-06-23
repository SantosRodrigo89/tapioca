import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <div className="flex gap-3 rounded-lg border p-3 bg-card">
      {item.imageUrl && (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="font-medium text-sm leading-snug">{item.name}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}
        <p className="text-sm font-semibold">{formatPrice(item.price)}</p>
      </div>
    </div>
  );
}
