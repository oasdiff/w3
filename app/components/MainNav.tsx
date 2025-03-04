"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainNav() {
  const pathname = usePathname();

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
          <Link
            href="/faq"
            className={`${
              pathname === "/faq"
                ? "text-emerald-400"
                : "text-gray-300 hover:text-emerald-300"
            } transition-colors font-medium`}
          >
            FAQ
          </Link>
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