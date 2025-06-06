import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from "next"
import { GoogleAnalytics } from '@next/third-parties/google'
import { MainNav } from "./components/MainNav"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "oasdiff",
  description: "Compare OpenAPI Specifications and detect breaking changes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased pt-16">
        <MainNav />
        <main className="">
          {children}
        </main>
        <GoogleAnalytics gaId="G-C7KPYNHWS0" />
      </body>
    </html>
  )
}
