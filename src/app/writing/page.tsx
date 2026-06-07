import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";
import { fetchArticles } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Writing - Ajaya Rajbhandari",
  description:
    "Articles and learning notes on frontend development, JavaScript, UI design, and lessons learned while building real projects.",
};

type ArticleListItem = {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  status: string;
  url: string;
  featured?: boolean;
  coverImage?: string;
  hasBody?: boolean;
};

const statusLabel = (status: string) =>
  status === "published"
    ? "Published article"
    : status === "draft"
    ? "Draft in progress"
    : "Upcoming article";

// Decide where a card points: on-site page when there's body content,
// otherwise the external link, otherwise a non-clickable card.
const articleHref = (article: ArticleListItem) => {
  if (article.hasBody && article.slug) return `/writing/${article.slug}`;
  if (article.url) return article.url;
  return null;
};

export default async function WritingPage() {
  const articles = (await fetchArticles()) as ArticleListItem[];

  return (
    <section className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-20 pt-28 md:px-8 lg:px-10">
      <Link
        href="/#writing"
        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary-accent"
      >
        <FaArrowLeft className="text-xs" /> Back to portfolio
      </Link>

      <header className="mt-6 mb-10 flex items-start gap-3">
        <div className="mt-1 h-12 w-1 rounded-full bg-gradient-to-b from-primary-accent to-secondary-accent" />
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary-accent">
            Writing &amp; learning notes
          </p>
          <h1 className="text-3xl font-bold text-text-primary md:text-5xl">Articles</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">
            Practical notes on frontend development, JavaScript concepts, UI decisions, and lessons
            learned while building projects.
          </p>
        </div>
      </header>

      {articles.length === 0 ? (
        <p className="text-text-secondary">No articles published yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const href = articleHref(article);
            const external = href?.startsWith("http");

            const card = (
              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border-light bg-surface-soft transition-all duration-200 hover:border-primary-accent/40 hover:bg-surface-muted">
                {article.coverImage ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] w-full bg-gradient-to-br from-primary-accent/15 to-secondary-accent/10" />
                )}

                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary-accent">
                    {statusLabel(article.status)}
                  </p>
                  <h2 className="mb-3 text-xl font-bold text-text-primary">{article.title}</h2>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary">
                    {article.summary}
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-primary-accent/20 bg-primary-accent/10 px-3 py-1 text-xs text-primary-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {href ? (
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-accent">
                      {external ? (
                        <>
                          Read article <FaExternalLinkAlt className="text-xs" />
                        </>
                      ) : (
                        <>
                          Read article <FaArrowRight className="text-xs" />
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-sm text-text-secondary/70">Coming soon</span>
                  )}
                </div>
              </article>
            );

            if (!href) {
              return <div key={article.id}>{card}</div>;
            }

            return external ? (
              <a key={article.id} href={href} target="_blank" rel="noopener noreferrer">
                {card}
              </a>
            ) : (
              <Link key={article.id} href={href}>
                {card}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
