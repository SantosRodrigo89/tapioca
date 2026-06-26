"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ColorField({
  label,
  value,
  onChange,
  disabled,
}: ColorFieldProps) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-md border border-input bg-transparent p-1 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Input
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 font-mono text-sm uppercase"
          maxLength={7}
        />
      </div>
    </div>
  );
}
