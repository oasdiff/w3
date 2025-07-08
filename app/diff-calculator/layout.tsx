import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenAPI Diff Calculator - Compare API Specifications",
  description: "Compare two OpenAPI specifications to identify breaking changes, generate changelog, or view raw diff",
}

export default function DiffCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 