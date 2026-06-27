interface SuperKpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function SuperKpiCard({ label, value, hint }: SuperKpiCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      {hint ? (
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
