import { MetadataRoute } from "next";
import { getProjects } from "@/lib/sanity.queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ajayrajbhandari.com.np";

type SitemapProject = {
  slug?: {
    current?: string;
  };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { 
      url: `${baseUrl}/`, 
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  let projectEntries: MetadataRoute.Sitemap = [];

  try {
    const projects = await getProjects();
    if (projects && Array.isArray(projects)) {
      projectEntries = (projects as SitemapProject[])
        .map((project) => project.slug?.current)
        .filter((slug): slug is string => Boolean(slug))
        .map((slug) => ({
          url: `${baseUrl}/projects/${slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.8,
        }));
    }
  } catch (error) {
    console.error("Error building sitemap projects", error);
  }

  return [...staticEntries, ...projectEntries];
}
