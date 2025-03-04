"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();

  const faqItems = [
    { href: "/faq#breaking-changes", label: "What are breaking changes?" },
    { href: "/faq#preventing-changes", label: "Preventing breaking changes" },
    { href: "/faq#detect-changes", label: "Using oasdiff to detect changes" },
    { href: "/faq#prevent-breaking", label: "Using oasdiff to prevent changes" },
    { href: "/faq#cicd", label: "Using oasdiff in CI/CD" },
    { href: "/faq#changelog", label: "Generating a changelog" },
    { href: "/faq#raw-diff", label: "Raw diff" },
  ];

  const handleFaqItemClick = (href: string) => {
    // If we're already on the FAQ page, manually trigger the hash change
    if (pathname === '/faq') {
      const hash = href.split('#')[1];
      window.location.hash = hash;
    } else {
      router.push(href);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex h-16 items-center space-x-8">
          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
          >
            Home
          </Link>
          <div className="relative group">
            <button
              className={`${
                pathname === "/faq"
                  ? "text-emerald-400"
                  : "text-gray-300 hover:text-emerald-300"
              } transition-colors font-medium flex items-center gap-1`}
            >
              FAQ
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-1 py-2 w-64 bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {faqItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleFaqItemClick(item.href)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <Link
            href="/diff-calculator"
            className={`${
              pathname === "/diff-calculator"
                ? "text-emerald-400"
                : "text-gray-300 hover:text-emerald-300"
            } transition-colors font-medium`}
          >
            Diff Calculator
          </Link>
          <Link
            href="/checks"
            className={`${
              pathname === "/checks"
                ? "text-emerald-400"
                : "text-gray-300 hover:text-emerald-300"
            } transition-colors font-medium`}
          >
            Checks
          </Link>
        </div>
      </div>
    </nav>
  );
} 