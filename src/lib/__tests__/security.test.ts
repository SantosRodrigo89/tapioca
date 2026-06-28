import { describe, expect, it } from "vitest";
import { isSafeInternalRedirect } from "@/lib/auth/safe-redirect";
import { getPostLoginPath } from "@/lib/auth/redirect";
import {
  isSafeHref,
  normalizeInstagram,
  sanitizeHref,
} from "@/lib/utils/safe-url";
import {
  buildProductionContentSecurityPolicy,
  CSP_HEADER_ENFORCE,
} from "@/lib/security/content-security-policy";
import { prepareAdminDocWrite } from "@/lib/firestore/sanitize";

describe("prepareAdminDocWrite", () => {
  it("removes id, timestamps and undefined before Firestore admin writes", () => {
    const payload = prepareAdminDocWrite({
      id: "restaurante",
      name: "Restaurante",
      thumbnailUrl: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(payload).toEqual({ name: "Restaurante" });
    expect(payload).not.toHaveProperty("id");
    expect(payload).not.toHaveProperty("thumbnailUrl");
  });
});

describe("content-security-policy", () => {
  it("uses enforce header directives without unsafe-eval in production", () => {
    const policy = buildProductionContentSecurityPolicy();
    expect(policy).not.toContain("unsafe-eval");
    expect(policy).toContain("upgrade-insecure-requests");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("https://firestore.googleapis.com");
  });

  it("exports enforce header name", () => {
    expect(CSP_HEADER_ENFORCE).toBe("Content-Security-Policy");
  });
});

describe("isSafeInternalRedirect", () => {
  it("allows valid admin paths", () => {
    expect(isSafeInternalRedirect("/dashboard")).toBe(true);
    expect(isSafeInternalRedirect("/menu/products")).toBe(true);
    expect(isSafeInternalRedirect("/auth/invite/abc-123")).toBe(true);
  });

  it("blocks open redirects", () => {
    expect(isSafeInternalRedirect("//evil.com")).toBe(false);
    expect(isSafeInternalRedirect("/\\evil.com")).toBe(false);
    expect(isSafeInternalRedirect("//evil.com/path")).toBe(false);
  });

  it("blocks auth and super paths", () => {
    expect(isSafeInternalRedirect("/auth/login")).toBe(false);
    expect(isSafeInternalRedirect("/super")).toBe(false);
    expect(isSafeInternalRedirect("/super/restaurants")).toBe(false);
  });
});

describe("getPostLoginPath", () => {
  it("forces super admin to /super", () => {
    expect(getPostLoginPath("super_admin", "/dashboard")).toBe("/super");
  });

  it("falls back on unsafe redirect", () => {
    expect(getPostLoginPath("tenant_admin", "//evil.com")).toBe("/dashboard");
  });
});

describe("safe-url", () => {
  it("blocks dangerous schemes", () => {
    expect(isSafeHref("javascript:alert(1)")).toBe(false);
    expect(isSafeHref("data:text/html,evil")).toBe(false);
  });

  it("allows safe links", () => {
    expect(isSafeHref("https://example.com")).toBe(true);
    expect(isSafeHref("/contato")).toBe(true);
    expect(isSafeHref("mailto:a@b.com")).toBe(true);
  });

  it("normalizes instagram handles", () => {
    expect(normalizeInstagram("@mesio")).toBe("https://instagram.com/mesio.app");
  });

  it("sanitizeHref strips unsafe values", () => {
    expect(sanitizeHref("javascript:void(0)")).toBeUndefined();
    expect(sanitizeHref("https://ok.com")).toBe("https://ok.com");
  });
});
