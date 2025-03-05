import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[var(--foreground)]">OpenAPI Diff</h1>
        <p className="text-lg text-[var(--foreground)]/80">
          Compare OpenAPI specifications and identify breaking changes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/diff-calculator" className="group">
          <div className="p-6 rounded-lg border border-[var(--background-hover)] bg-[var(--background-card)]/50 backdrop-blur-sm hover:bg-[var(--background-hover)]/50 transition-colors">
            <h2 className="text-xl font-semibold mb-2 text-[var(--foreground)] group-hover:text-emerald-400 transition-colors">
              Diff Calculator
            </h2>
            <p className="text-[var(--foreground)]/70">
              Compare two OpenAPI specifications and identify breaking changes, generate changelog, or view raw diff
            </p>
          </div>
        </Link>

        <Link href="/faq" className="group">
          <div className="p-6 rounded-lg border border-[var(--background-hover)] bg-[var(--background-card)]/50 backdrop-blur-sm hover:bg-[var(--background-hover)]/50 transition-colors">
            <h2 className="text-xl font-semibold mb-2 text-[var(--foreground)] group-hover:text-emerald-400 transition-colors">
              FAQ
            </h2>
            <p className="text-[var(--foreground)]/70">
              Learn about breaking changes, how to prevent them, and best practices for API versioning
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
