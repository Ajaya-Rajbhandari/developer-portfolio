import { getProjects } from "@/lib/sanity.queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ajayrajbhandari.com.np";

export default async function sitemap() {
  let projectEntries: { url: string; lastModified?: string }[] = [];

  try {
    const projects = await getProjects();
    projectEntries =
      projects
        ?.filter((project: any) => project?.slug?.current)
        .map((project: any) => ({
          url: `${baseUrl}/projects/${project.slug.current}`,
        })) || [];
  } catch (error) {
    console.error("Error building sitemap projects", error);
  }

  const staticEntries = [
    { url: `${baseUrl}/`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/#projects` },
    { url: `${baseUrl}/#skills` },
    { url: `${baseUrl}/#contact` },
  ];

  return [...staticEntries, ...projectEntries];
}
