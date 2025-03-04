import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from "next"
import Link from "next/link"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "OASDiff - OpenAPI Diff",
  description: "Diff and Breaking Changes for OpenAPI Specification",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-2 z-50">
          <div className="flex justify-between items-center">
            <Link className='navBarLink' href="/">
              <img src="/oasdiff-logo.png" alt="OASDiff Logo" className="h-8" />
            </Link>
            <div className="flex gap-6">
              <Link 
                href="/checks" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Checks
              </Link>
              <Link 
                href="/diff-calculator" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Diff Calculator
              </Link>
            </div>
          </div>
        </nav>
        <main className="p-4 mt-14">
          {children}
        </main>
      </body>
    </html>
  )
}
