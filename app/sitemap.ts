import type { MetadataRoute } from "next";

const BASE = "https://skillmarketcap.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [{ url: BASE, lastModified, changeFrequency: "daily", priority: 1 }];
}
