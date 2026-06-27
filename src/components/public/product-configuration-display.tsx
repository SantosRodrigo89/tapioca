import { formatPrice } from "@/lib/utils";
import {
  getEnabledSizeOptions,
  getLinkedSizeGroup,
  groupUsesVariantPricing,
} from "@/lib/catalog/variant-pricing";
import {
  formatOptionPrice,
  getGroupSelectionLabel,
} from "@/lib/catalog/configuration-hints";
import type { ConfigurationGroup } from "@/types";

interface ProductConfigurationDisplayProps {
  groups: ConfigurationGroup[];
}

function gridColumns(sizeCount: number): string {
  return `minmax(0, 1.35fr) repeat(${sizeCount}, minmax(0, 1fr))`;
}

function UnifiedVariantPricingTable({
  group,
  sizeGroup,
}: {
  group: ConfigurationGroup;
  sizeGroup: ConfigurationGroup;
}) {
  const sizeOptions = getEnabledSizeOptions(sizeGroup);
  const flavorOptions = group.options
    .filter((option) => option.enabled)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (sizeOptions.length === 0 || flavorOptions.length === 0) return null;

  const columns = gridColumns(sizeOptions.length);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-[var(--menu-border)]">
      <div
        className="grid border-b border-[var(--menu-border)] bg-[var(--menu-surface)]"
        style={{ gridTemplateColumns: columns }}
      >
        <div className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#888] sm:text-xs">
          Sabor
        </div>
        {sizeOptions.map((sizeOption) => (
          <div
            key={sizeOption.id}
            className="px-1 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-[#888] sm:text-xs"
          >
            {sizeOption.name.trim() || "—"}
          </div>
        ))}
      </div>

      {flavorOptions.map((option, rowIndex) => (
        <div
          key={option.id}
          className={`grid ${
            rowIndex < flavorOptions.length - 1
              ? "border-b border-[var(--menu-border)]"
              : ""
          }`}
          style={{ gridTemplateColumns: columns }}
        >
          <div className="flex min-w-0 items-center px-3 py-3 text-sm font-medium leading-snug text-[var(--menu-secondary)] sm:text-base">
            <span className="line-clamp-2">{option.name}</span>
          </div>
          {sizeOptions.map((sizeOption) => {
            const cents = option.variantPrices?.[sizeOption.id];
            return (
              <div
                key={sizeOption.id}
                className="flex items-center justify-center px-0.5 py-3 text-center text-[11px] font-semibold tabular-nums leading-tight sm:text-sm"
                style={{ color: "var(--menu-primary-dark)" }}
              >
                {typeof cents === "number" ? formatPrice(cents) : "—"}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function StandardGroupSection({ group }: { group: ConfigurationGroup }) {
  const options = group.options
    .filter((option) => option.enabled)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (options.length === 0) return null;

  return (
    <section
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
            <span className="ml-1 text-[var(--menu-primary-dark)]">*</span>
          )}
        </h3>
        <p className="text-xs text-[#888]">{getGroupSelectionLabel(group)}</p>
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
}

export function ProductConfigurationDisplay({
  groups,
}: ProductConfigurationDisplayProps) {
  if (groups.length === 0) return null;

  const variantGroup = groups.find((group) =>
    groupUsesVariantPricing(group, groups),
  );
  const variantSizeGroup = variantGroup
    ? getLinkedSizeGroup(variantGroup, groups)
    : undefined;

  const hiddenGroupIds = new Set<string>();
  if (variantGroup && variantSizeGroup) {
    hiddenGroupIds.add(variantGroup.id);
    hiddenGroupIds.add(variantSizeGroup.id);
  }

  const otherGroups = groups.filter((group) => !hiddenGroupIds.has(group.id));

  return (
    <div className="space-y-6">
      {variantGroup && variantSizeGroup && (
        <section
          aria-labelledby={`group-${variantGroup.id}`}
          className="space-y-3"
        >
          <div className="space-y-1">
            <h3
              id={`group-${variantGroup.id}`}
              className="text-base font-semibold text-[var(--menu-secondary)]"
            >
              {variantGroup.name}
              {variantGroup.required && (
                <span className="ml-1 text-[var(--menu-primary-dark)]">*</span>
              )}
            </h3>
            <p className="text-xs text-[#888]">
              {getGroupSelectionLabel(variantGroup)}
            </p>
          </div>
          <UnifiedVariantPricingTable
            group={variantGroup}
            sizeGroup={variantSizeGroup}
          />
        </section>
      )}

      {otherGroups.map((group) => (
        <StandardGroupSection key={group.id} group={group} />
      ))}
    </div>
  );
}
