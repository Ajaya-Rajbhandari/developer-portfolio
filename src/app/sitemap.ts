import { MetadataRoute } from "next";
import { getProjects } from "@/lib/sanity.queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ajayrajbhandari.com.np";

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
      projectEntries = projects
        .filter((project: any) => project?.slug?.current)
        .map((project: any) => ({
          url: `${baseUrl}/projects/${project.slug.current}`,
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
