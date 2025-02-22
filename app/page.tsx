import Link from "next/link";

export default function Test() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <header className="w-full py-6 bg-blue-500 text-center">
        <h1 className="text-4xl font-bold">OASDiff</h1>
        <p className="text-lg">OpenAPI Diff and Breaking Changes</p>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h2 className="text-3xl font-bold mb-4">Compare OpenAPI Specifications</h2>
        <p className="text-lg mb-8 text-center">
          Easily identify differences and breaking changes between OpenAPI specifications.
        </p>
        <Link href="https://github.com/Tufin/oasdiff" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Get Started
        </Link>
      </main>
      <footer className="w-full py-4 bg-gray-800 text-center">
        <p>&copy; 2023 OASDiff. All rights reserved.</p>
      </footer>
    </div>
  );
}
