import type { MetadataRoute } from "next";
import { getMarketingBaseUrl } from "@/lib/marketing/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getMarketingBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/site/", "/menu/", "/settings/", "/super/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
