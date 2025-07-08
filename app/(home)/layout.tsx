import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "oasdiff - OpenAPI Specification Comparison Tool",
  description: "Compare OpenAPI specifications and identify breaking changes with our powerful diff calculator",
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 