import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";
import { fetchArticleBySlug } from "@/lib/data";
import ArticleBody from "@/components/writing/article-body";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ slug: string }>;
};

const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(decodeURIComponent(slug));
  if (!article) {
    return { title: "Article not found - Ajaya Rajbhandari" };
  }
  return {
    title: `${article.title} - Ajaya Rajbhandari`,
    description: article.summary,
    openGraph: article.coverImage
      ? { images: [{ url: article.coverImage }] }
      : undefined,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(decodeURIComponent(slug));

  if (!article) {
    notFound();
  }

  const publishedDate = formatDate(article.publishedAt);
  const hasBody = Array.isArray(article.body) && article.body.length > 0;

  return (
    <article className="mx-auto min-h-screen w-full max-w-3xl px-4 pb-20 pt-28 md:px-8">
      <Link
        href="/writing"
        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary-accent"
      >
        <FaArrowLeft className="text-xs" /> All articles
      </Link>

      <header className="mt-6 mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-primary-accent">
          <span>
            {article.status === "published"
              ? "Published article"
              : article.status === "draft"
              ? "Draft in progress"
              : "Upcoming article"}
          </span>
          {publishedDate ? (
            <span className="text-text-secondary/70">· {publishedDate}</span>
          ) : null}
        </div>

        <h1 className="text-3xl font-bold leading-tight text-text-primary md:text-5xl">
          {article.title}
        </h1>

        {article.summary ? (
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">{article.summary}</p>
        ) : null}

        {article.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary-accent/20 bg-primary-accent/10 px-3 py-1 text-xs text-primary-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      {article.coverImage ? (
        <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border-light">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      {hasBody ? (
        <ArticleBody value={article.body} />
      ) : (
        <div className="rounded-3xl border border-border-light bg-surface-soft p-8 text-center">
          <p className="text-text-secondary">
            The full write-up for this article is coming soon.
          </p>
          {article.url ? (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-secondary-accent/40 bg-secondary-accent/10 px-5 py-2 text-sm font-semibold text-secondary-accent hover:bg-secondary-accent/20"
            >
              Read it externally <FaExternalLinkAlt className="text-xs" />
            </a>
          ) : null}
        </div>
      )}

      {hasBody && article.url ? (
        <div className="mt-12 border-t border-border-light pt-6">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-accent hover:underline"
          >
            View the original source <FaExternalLinkAlt className="text-xs" />
          </a>
        </div>
      ) : null}
    </article>
  );
}
