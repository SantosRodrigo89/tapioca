import type { Metadata } from "next";
import { listTemplatesServer } from "@/lib/repositories/server/platform/template.server";
import { TemplatesPage } from "@/features/super/templates/templates-page";
import { serializeTemplateForClient } from "@/features/super/templates/template-types";

export const metadata: Metadata = { title: "Templates — Super Admin" };

export default async function SuperTemplatesRoute() {
  const templates = await listTemplatesServer();

  return (
    <TemplatesPage initialTemplates={templates.map(serializeTemplateForClient)} />
  );
}
