import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from "next"
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
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-gray-50 antialiased pt-16">
        <MainNav />
        <main className="p-4 mt-14">
          {children}
        </main>
      </body>
    </html>
  )
}
