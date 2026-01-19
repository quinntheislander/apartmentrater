import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const siteUrl = process.env.NEXTAUTH_URL || "https://apartmentrater.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/apartments`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/guidelines`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/accessibility`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/dmca`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic apartment pages
  let apartmentPages: MetadataRoute.Sitemap = [];

  try {
    const apartments = await prisma.apartment.findMany({
      select: {
        id: true,
        updatedAt: true,
        reviewCount: true,
      },
      orderBy: {
        reviewCount: "desc",
      },
    });

    apartmentPages = apartments.map((apartment) => ({
      url: `${siteUrl}/apartments/${apartment.id}`,
      lastModified: apartment.updatedAt,
      changeFrequency: "weekly" as const,
      // Higher priority for apartments with more reviews
      priority: Math.min(0.8, 0.5 + apartment.reviewCount * 0.05),
    }));
  } catch (error) {
    // If database is unavailable, continue with static pages only
    console.error("Error fetching apartments for sitemap:", error);
  }

  return [...staticPages, ...apartmentPages];
}
