import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-dark text-white px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-4">404</h1>
        <div className="w-px h-12 bg-white/20 mx-auto mb-4"></div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          This page could not be found.
        </h2>
        <p className="text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary-accent text-white rounded-full font-medium hover:brightness-110 transition-all"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
