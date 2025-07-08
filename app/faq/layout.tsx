import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "oasdiff FAQ - Breaking Changes & API Versioning Guide",
  description: "Learn about breaking changes, how to prevent them, and best practices for API versioning",
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 