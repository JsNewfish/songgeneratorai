import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aisonggen.io"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/my-creations", "/my-subscription"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
