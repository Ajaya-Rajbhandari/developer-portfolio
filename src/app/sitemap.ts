import { MetadataRoute } from "next";
import { getProjects, getArticles } from "@/lib/sanity.queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ajayrajbhandari.com.np";

type SitemapProject = {
  slug?: {
    current?: string;
  };
};

type SitemapArticle = {
  slug?: {
    current?: string;
  };
  hasBody?: boolean;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/writing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
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

  let articleEntries: MetadataRoute.Sitemap = [];

  try {
    const articles = await getArticles();
    if (articles && Array.isArray(articles)) {
      articleEntries = (articles as SitemapArticle[])
        .filter((article) => article.hasBody && article.slug?.current)
        .map((article) => ({
          url: `${baseUrl}/writing/${article.slug!.current}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }));
    }
  } catch (error) {
    console.error("Error building sitemap articles", error);
  }

  return [...staticEntries, ...projectEntries, ...articleEntries];
}
