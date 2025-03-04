export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col px-8 py-12 max-w-[1400px] mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-pink-500 text-transparent bg-clip-text">
            oasdiff
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Welcome to oasdiff, an <a href="https://github.com/Tufin/oasdiff" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">open source</a> tool
            for comparing API contracts written with <a className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors" href="https://swagger.io/specification/v3/">OpenAPI Specification v3</a>.
            Designed to help developers and teams understand the changes between different versions of their APIs.
          </p>
        </header>
      </main>
    </div>
  );
}
