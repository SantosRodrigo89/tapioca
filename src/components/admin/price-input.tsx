"use client";

import { Input } from "@/components/ui/input";
import {
  centsToDigits,
  digitsToCents,
  formatDigitsAsPrice,
} from "@/lib/utils/price";

interface PriceInputProps {
  id?: string;
  value: number;
  onChange: (cents: number) => void;
  disabled?: boolean;
}

export function PriceInput({ id, value, onChange, disabled }: PriceInputProps) {
  const display = formatDigitsAsPrice(centsToDigits(value));

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        R$
      </span>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        className="pl-10"
        placeholder="0,00"
        value={display}
        disabled={disabled}
        onChange={(e) => onChange(digitsToCents(e.target.value))}
      />
    </div>
  );
}
