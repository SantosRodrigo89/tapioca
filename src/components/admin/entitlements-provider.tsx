"use client";

import { createContext, useContext } from "react";
import type { TenantEntitlements } from "@/lib/platform/entitlements";
import type { FeatureId } from "@/types/platform";

const EntitlementsContext = createContext<TenantEntitlements | null>(null);

export function EntitlementsProvider({
  entitlements,
  children,
}: {
  entitlements: TenantEntitlements;
  children: React.ReactNode;
}) {
  return (
    <EntitlementsContext.Provider value={entitlements}>
      {children}
    </EntitlementsContext.Provider>
  );
}

export function useEntitlements(): TenantEntitlements {
  const ctx = useContext(EntitlementsContext);
  if (!ctx) {
    throw new Error("useEntitlements must be used within EntitlementsProvider");
  }
  return ctx;
}

export function useFeatureEnabled(featureId: FeatureId): boolean {
  return useEntitlements()[featureId] ?? false;
}
