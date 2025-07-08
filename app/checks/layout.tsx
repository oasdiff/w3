import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "oasdiff Checks - Browse Breaking Change Detection Rules",
  description: "Browse and search all available oasdiff checks used to detect changes between OpenAPI specifications",
}

export default function ChecksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 