import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from "next"
import Script from 'next/script'
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
        <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-C7KPYNHWS0`} />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);
            gtag('js', new Date());
            gtag('config', 'G-C7KPYNHWS0');
          `}
        </Script>
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased pt-16">
        <MainNav />
        <main className="">
          {children}
        </main>
      </body>
    </html>
  )
}
