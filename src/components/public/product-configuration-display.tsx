import { formatOptionPrice, getGroupSelectionLabel } from "@/lib/catalog/configuration-hints";
import type { ConfigurationGroup } from "@/types";

interface ProductConfigurationDisplayProps {
  groups: ConfigurationGroup[];
}

export function ProductConfigurationDisplay({
  groups,
}: ProductConfigurationDisplayProps) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const options = group.options
          .filter((option) => option.enabled)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        if (options.length === 0) return null;

        return (
          <section
            key={group.id}
            aria-labelledby={`group-${group.id}`}
            className="space-y-3"
          >
            <div className="space-y-1">
              <h3
                id={`group-${group.id}`}
                className="text-base font-semibold text-[var(--menu-secondary)]"
              >
                {group.name}
                {group.required && (
                  <span className="ml-1 text-[var(--menu-primary-dark)]">
                    *
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#888]">
                {getGroupSelectionLabel(group)}
              </p>
            </div>

            <ul className="space-y-2">
              {options.map((option) => {
                const priceLabel = formatOptionPrice(group, option.price);

                return (
                  <li
                    key={option.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-[var(--menu-border)] bg-white px-4 py-3"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-medium text-[var(--menu-secondary)]">
                        {option.name}
                      </p>
                      {option.description && (
                        <p className="text-xs leading-relaxed text-[#888]">
                          {option.description}
                        </p>
                      )}
                    </div>
                    {priceLabel && (
                      <span
                        className="shrink-0 text-sm font-semibold"
                        style={{ color: "var(--menu-primary-dark)" }}
                      >
                        {priceLabel}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
