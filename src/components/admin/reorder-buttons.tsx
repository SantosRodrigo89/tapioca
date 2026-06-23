"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReorderButtonsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  disabled?: boolean;
}

export function ReorderButtons({
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  disabled,
}: ReorderButtonsProps) {
  return (
    <div className="flex flex-col shrink-0">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-7 w-7"
        onClick={onMoveUp}
        disabled={disabled || !canMoveUp}
        aria-label="Mover para cima"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-7 w-7"
        onClick={onMoveDown}
        disabled={disabled || !canMoveDown}
        aria-label="Mover para baixo"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
