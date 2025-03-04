import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OASDiff - OpenAPI Diff",
  description: "Diff and Breaking Changes for OpenAPI Specification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-2 z-50">
            <Link className='navBarLink' href="/">
              <img src="/oasdiff-logo.png" alt="OASDiff Logo" className="h-8" />
            </Link>
        </nav>
        <main className="p-4 mt-14">
          {children}
        </main>
      </body>
    </html>
  );
}
