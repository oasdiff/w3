import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact oasdiff - Get in Touch",
  description: "Contact us for questions, feedback, or support regarding oasdiff and API comparison",
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 