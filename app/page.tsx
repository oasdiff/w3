"use client";

import Link from "next/link";
import { Collapsible } from "@/components/ui/collapsible";
import { useState } from "react";

export default function Test() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleNavClick = (sectionId: string) => {
    setOpenSection(sectionId);
    // Wait for state to update and section to expand before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-row justify-between px-8 py-12 max-w-[1400px] mx-auto gap-12">
        <div className="w-[70%]">
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

          <div className="space-y-8">
            <div id="breaking-changes">
              <Collapsible 
                title="What are breaking changes?"
                open={openSection === 'breaking-changes'}
                onOpenChange={() => setOpenSection(openSection === 'breaking-changes' ? null : 'breaking-changes')}
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-gray-300 leading-relaxed mb-4">
                    A breaking change is a change made to an API's contract that introduces incompatibilities with existing client applications. 
                    These changes can disrupt the functionality of client applications and potentially cause them to break or malfunction.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Many types of breaking changes can occur in an API contract, and there is no universally accepted definition.
                    To address this issue, the oasdiff community created <a href="/checks" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">a comprehensive set of open-source checks</a> for testing contract changes.
                  </p>
                </div>
              </Collapsible>
            </div>
            
            <div id="preventing-changes">
              <Collapsible 
                title="Preventing breaking changes manually"
                open={openSection === 'preventing-changes'}
                onOpenChange={() => setOpenSection(openSection === 'preventing-changes' ? null : 'preventing-changes')}
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    Generally speaking, there are only two rules to follow in order to prevent breaking changes:
                  </p>
                  
                  <div className="grid grid-cols-1 gap-8">
                    <div className="border border-gray-700 rounded-xl overflow-hidden shadow-lg">
                      <img
                        src="/breaking-request.png"
                        alt="Diagram illustrating breaking changes"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="border border-gray-700 rounded-xl overflow-hidden shadow-lg">
                      <img
                        src="/breaking-response.png"
                        alt="Diagram illustrating breaking changes"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </Collapsible>
            </div>

            <div id="detect-changes">
              <Collapsible 
                title="Using oasdiff to detect breaking changes"
                open={openSection === 'detect-changes'}
                onOpenChange={() => setOpenSection(openSection === 'detect-changes' ? null : 'detect-changes')}
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-gray-300 leading-relaxed mb-4">
                    Use the <code className="text-pink-400">breaking</code> command to see breaking changes:
                  </p>
                  <div className="overflow-x-auto rounded-lg">
                    <pre className="bg-gray-800/50 backdrop-blur-sm p-4 text-sm">
                      <code className="language-bash">
                        <span className="text-emerald-400">❯ oasdiff</span> breaking spec1.yaml spec2.yaml<br/>
                        1 changes: 1 <span className="text-red-400">error</span>, 0 <span className="text-pink-400">warning</span>, 0 <span className="text-cyan-400">info</span><br/>
                        <span className="text-red-400">error</span>	  [<span className="text-yellow-400">api-removed-without-deprecation</span>] at spec1.yaml<br/>
                        <pre>        in API <span className="text-emerald-400">GET /api/test</span><br/></pre>
                        <pre>                api removed without deprecation <br/></pre>
                      </code>
                    </pre>
                  </div>
                </div>
              </Collapsible>
            </div>

            <div id="prevent-breaking">
              <Collapsible 
                title="Using oasdiff to prevent breaking changes"
                open={openSection === 'prevent-breaking'}
                onOpenChange={() => setOpenSection(openSection === 'prevent-breaking' ? null : 'prevent-breaking')}
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-gray-300 leading-relaxed mb-4">
                    Run oasdiff with the <code className="text-pink-400">--fail-on</code> flag to return a non-zero value if any breaking changes are detected.
                    When run in the CI/CD, this will break the build and prevent deployments or other actions until breaking changes are addressed.
                  </p>
                  <div className="overflow-x-auto rounded-lg">
                    <pre className="bg-gray-800/50 backdrop-blur-sm p-4 text-sm">
                      <code className="language-bash">
                        <span className="text-emerald-400">❯ oasdiff</span> breaking --fail-on ERR spec1.yaml spec2.yaml<br/>
                        1 changes: 1 <span className="text-red-400">error</span>, 0 <span className="text-pink-400">warning</span>, 0 <span className="text-cyan-400">info</span><br/>
                        <span className="text-red-400">error</span>	  [<span className="text-yellow-400">api-removed-without-deprecation</span>] at spec1.yaml<br/>
                        <pre>        in API <span className="text-emerald-400">GET /api/test</span><br/></pre>
                        <pre>                api removed without deprecation <br/></pre>
                        <span className="text-emerald-400">❯ echo</span> $?<br/>
                        1
                      </code>
                    </pre>
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed mt-4">
                    See <a href="https://github.com/Tufin/oasdiff/blob/main/docs/BREAKING-CHANGES.md#preventing-breaking-changes" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">here</a> for more info.
                  </p>
                </div>
              </Collapsible>
            </div>

            <div id="cicd">
              <Collapsible 
                title="Using oasdiff in CI/CD"
                open={openSection === 'cicd'}
                onOpenChange={() => setOpenSection(openSection === 'cicd' ? null : 'cicd')}
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Oasdiff can be useful in continuous integration/continuous deployment (CI/CD) pipelines, where it can automatically compare API versions to ensure that modifications are thoroughly reviewed and tested before deployment.<br/><br/>
                    If you're using github, check out the <a href="https://github.com/oasdiff/oasdiff-action" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">oasdiff GitHub Action</a>.<br/>
                    <a href="https://github.com/oasdiff/github-demo" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">This repo</a> shows how to run oasdiff directly in your pipeline.
                  </p>
                </div>
              </Collapsible>
            </div>

            <div id="changelog">
              <Collapsible 
                title="Generating a changelog"
                open={openSection === 'changelog'}
                onOpenChange={() => setOpenSection(openSection === 'changelog' ? null : 'changelog')}
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-gray-300 leading-relaxed mb-4">
                    Oasdiff can generate a changelog by comparing two API specifications.
                    The changelog includes both breaking and non-breaking changes, making it easy to track and communicate API evolution.
                    Use the <code className="text-pink-400">changelog</code> command to generate a detailed report:
                  </p>
                  <div className="overflow-x-auto rounded-lg mb-6">
                    <pre className="bg-gray-800/50 backdrop-blur-sm p-4 text-sm">
                      <code className="language-bash">
                        <span className="text-emerald-400">❯ oasdiff</span> changelog spec1.yaml spec2.yaml<br/>
                        1 changes: 1 <span className="text-red-400">error</span>, 0 <span className="text-pink-400">warning</span>, 1 <span className="text-cyan-400">info</span><br/>
                        <span className="text-red-400">error</span>	  [<span className="text-yellow-400">api-removed-without-deprecation</span>] at spec1.yaml<br/>
                        <pre>        in API <span className="text-emerald-400">GET /api/test</span><br/></pre>
                        <pre>                api removed without deprecation <br/></pre>
                        <br/>
                        <span className="text-cyan-400">info</span>	   [<span className="text-yellow-400">endpoint-added</span>] at spec2.yaml<br/>
                        <pre>        in API <span className="text-emerald-400">POST /api/test</span><br/></pre>
                        <pre>                endpoint added <br/></pre>
                      </code>
                    </pre>
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed mb-4">
                    Use the <code className="text-pink-400">--format</code> flag to specify the format of the changelog:
                  </p>
                  <div className="overflow-x-auto rounded-lg">
                    <pre className="bg-gray-800/50 backdrop-blur-sm p-4 text-sm">
                      <code className="language-bash">
                        <span className="text-emerald-400">❯ oasdiff</span> changelog --format html spec1.yaml spec2.yaml &gt; <a href="https://html-preview.github.io/?url=https://github.com/Tufin/oasdiff/blob/main/docs/changelog.html" target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">changelog.html</a>
                      </code>
                    </pre>
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed mt-4">
                    See <a href="https://github.com/Tufin/oasdiff/blob/main/docs/BREAKING-CHANGES.md#output-formats" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">here</a> for supported formats.
                  </p>
                </div>
              </Collapsible>
            </div>

            <div id="raw-diff">
              <Collapsible 
                title="Raw diff"
                open={openSection === 'raw-diff'}
                onOpenChange={() => setOpenSection(openSection === 'raw-diff' ? null : 'raw-diff')}
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-gray-300 leading-relaxed mb-4">
                    Use the <code className="text-pink-400">diff</code> command to see a raw diff between two API specifications:
                  </p>
                  <div className="overflow-x-auto rounded-lg">
                    <pre className="bg-gray-800/50 backdrop-blur-sm p-4 text-sm">
                      <code className="language-bash">
                        <span className="text-emerald-400">❯ oasdiff</span> diff spec1.yaml spec2.yaml
                      </code>
                    </pre>
                    <pre className="bg-gray-800/50 backdrop-blur-sm p-4 text-sm mt-2">
paths:
    modified:
    get:
         /api/test:
            operations:
                added:
                    - POST
                deleted:
                    - GET
endpoints:
    added:
        - method: POST
          path: /api/test
    deleted:
        - method: GET
          path: /api/test
                    </pre>
                  </div>
                </div>
              </Collapsible>
            </div>
          </div>
        </div>

        <nav className="w-[25%] fixed right-8 top-12">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-white">Contents</h2>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => handleNavClick('breaking-changes')}
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2 w-full text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  What are breaking changes?
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('preventing-changes')}
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2 w-full text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Preventing breaking changes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('detect-changes')}
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2 w-full text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Using oasdiff to detect changes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('prevent-breaking')}
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2 w-full text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Using oasdiff to prevent changes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('cicd')}
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2 w-full text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Using oasdiff in CI/CD
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('changelog')}
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2 w-full text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Generating a changelog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('raw-diff')}
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2 w-full text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Raw diff
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </main>
    </div>
  );
}
