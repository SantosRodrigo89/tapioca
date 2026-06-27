import type { SiteTemplate } from "@/types/platform/template";
import type { UpdateTemplateFormInput } from "@/lib/schemas/platform/template.schema";
import {
  getTemplateByIdServer,
  updateTemplateServer,
} from "@/lib/repositories/server/platform/template.server";

export class TemplateError extends Error {
  constructor(
    message: string,
    readonly code: "NOT_FOUND",
  ) {
    super(message);
    this.name = "TemplateError";
  }
}

export async function updateTemplateAdminServer(
  templateId: string,
  input: UpdateTemplateFormInput,
): Promise<SiteTemplate> {
  const existing = await getTemplateByIdServer(templateId);
  if (!existing) {
    throw new TemplateError("Template não encontrado.", "NOT_FOUND");
  }

  return updateTemplateServer(templateId, {
    name: input.name,
    description: input.description,
    category: input.category,
    thumbnailUrl: input.thumbnailUrl || undefined,
    status: input.status,
    order: input.order,
    themePreset: input.themePreset,
  });
}
