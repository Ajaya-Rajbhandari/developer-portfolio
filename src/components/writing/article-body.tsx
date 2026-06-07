import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

type ImageValue = {
  url?: string;
  alt?: string;
};

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.url) return null;
      return (
        <figure className="my-8 overflow-hidden rounded-2xl border border-border-light">
          <Image
            src={value.url}
            alt={value.alt || ""}
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
          />
          {value.alt ? (
            <figcaption className="px-4 py-3 text-center text-sm text-text-secondary">
              {value.alt}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl font-bold text-text-primary md:text-3xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl font-bold text-text-primary md:text-2xl">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 text-lg font-semibold text-text-primary">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary-accent/60 bg-surface-soft px-5 py-3 italic text-text-secondary">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-5 leading-7 text-text-secondary">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 ml-6 list-disc space-y-2 text-text-secondary marker:text-primary-accent">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 ml-6 list-decimal space-y-2 text-text-secondary marker:text-primary-accent">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-surface-muted px-1.5 py-0.5 text-sm text-primary-accent">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = (value?.href as string) || "#";
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="font-medium text-secondary-accent underline decoration-secondary-accent/40 underline-offset-4 hover:decoration-secondary-accent"
        >
          {children}
        </a>
      );
    },
  },
};

export default function ArticleBody({ value }: { value: unknown }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return (
    <div className="text-base md:text-lg">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
