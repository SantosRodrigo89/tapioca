import { z } from "zod";
import {
  isSafeHref,
  normalizeExternalUrl,
  normalizeFacebook,
  normalizeInstagram,
  normalizeTiktok,
} from "@/lib/utils/safe-url";

export const SafeHrefSchema = z
  .string()
  .min(1)
  .max(500)
  .refine(isSafeHref, "URL inválida ou não permitida");

export const SafeOptionalHrefSchema = z
  .string()
  .max(500)
  .optional()
  .transform((v) => (v?.trim() ? v.trim() : undefined))
  .refine((v) => v === undefined || isSafeHref(v), "URL inválida ou não permitida");

export const SafeOptionalHttpUrlSchema = z
  .string()
  .max(2000)
  .optional()
  .transform((v) => (v?.trim() ? v.trim() : undefined))
  .refine(
    (v) => {
      if (v === undefined) return true;
      try {
        const url = new URL(v);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    },
    "URL deve usar http ou https",
  );

export const InstagramFieldSchema = z
  .string()
  .max(200)
  .optional()
  .transform((v) => (v?.trim() ? normalizeInstagram(v) : undefined));

export const FacebookFieldSchema = z
  .string()
  .max(200)
  .optional()
  .transform((v) => (v?.trim() ? normalizeFacebook(v) : undefined));

export const TiktokFieldSchema = z
  .string()
  .max(200)
  .optional()
  .transform((v) => (v?.trim() ? normalizeTiktok(v) : undefined));

export const ExternalUrlFieldSchema = z
  .string()
  .max(2000)
  .optional()
  .transform((v) => (v?.trim() ? normalizeExternalUrl(v) : undefined));
