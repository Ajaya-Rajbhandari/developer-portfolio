import BentoGridWrapper from "@/components/home/bento-grid-wrapper";
import Footer from "@/components/footer/footer";
import { fetchPersonalData, buildPersonJsonLd } from "@/lib/data";
import type { Metadata } from "next";

// Revalidate Sanity content periodically so production picks up new entries
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const personal = await fetchPersonalData();
  const title = personal?.metaTitle || "Ajaya Rajbhandari - Developer Portfolio";
  const description =
    personal?.metaDescription ||
    "Portfolio of Ajaya Rajbhandari, a Full-Stack Software Developer.";
  const ogImage = personal?.ogImage || "/profile.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/",
      siteName: title,
      images: [{ url: ogImage }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Home() {
  const personal = await fetchPersonalData();
  const personJsonLd = buildPersonJsonLd(personal);

  return (
    <>
      {personJsonLd ? (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      ) : null}
      <BentoGridWrapper />
      <Footer />
    </>
  );
}
