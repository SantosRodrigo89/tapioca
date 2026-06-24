"use client";

import type { CSSProperties, ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle } from "@/components/admin/drag-handle";
import { cn } from "@/lib/utils";

interface SortableCategoryCardProps {
  id: string;
  disabled?: boolean;
  header: ReactNode;
  body?: ReactNode;
}

export function SortableCategoryCard({
  id,
  disabled,
  header,
  body,
}: SortableCategoryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border bg-card",
        isDragging && "z-10 opacity-60 shadow-lg",
      )}
    >
      <div className="flex items-center gap-2 p-4">
        <DragHandle
          ref={setActivatorNodeRef}
          label="Arrastar categoria"
          disabled={disabled}
          {...attributes}
          {...listeners}
        />
        {header}
      </div>
      {body}
    </div>
  );
}

interface SortableItemRowProps {
  id: string;
  disabled?: boolean;
  children: ReactNode;
}

export function SortableItemRow({
  id,
  disabled,
  children,
}: SortableItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-md border bg-card p-3",
        isDragging && "z-10 opacity-60 shadow-md",
      )}
    >
      <DragHandle
        ref={setActivatorNodeRef}
        label="Arrastar item"
        disabled={disabled}
        {...attributes}
        {...listeners}
      />
      {children}
    </div>
  );
}
