import type { MetadataRoute } from "next";

const BASE = "https://maakolatalsham.chameleon.vision";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/menu`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE}/offers`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/branches`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/occasions`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
