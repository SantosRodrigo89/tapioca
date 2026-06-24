"use client";

import { forwardRef } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragHandleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const DragHandle = forwardRef<HTMLButtonElement, DragHandleProps>(
  function DragHandle({ label, className, disabled, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex h-8 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        aria-label={label}
        disabled={disabled}
        {...props}
      >
        <GripVertical className="h-4 w-4" />
      </button>
    );
  },
);
