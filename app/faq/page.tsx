"use client";

import { useState, useEffect } from "react";
import { Collapsible } from "@/components/ui/collapsible";
import { useSearchParams } from "next/navigation";
import { faqItems } from '../constants';

export default function FAQ() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Handle hash changes for direct navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the # symbol
      if (hash) {
        setOpenSection(hash);
        // Find the matching section title
        const section = faqItems.find(item => item.id === hash);
        const element = document.getElementById(hash);
        if (element) {
          setTimeout(() => {
            const navHeight = 64; // height of the nav bar
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
              top: elementPosition - navHeight - 24, // Additional 24px for comfortable spacing
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    };

    // Handle initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[var(--foreground)]">FAQ</h1>
        <p className="text-lg text-[var(--foreground)]/80">
          Frequently asked questions about breaking changes and API versioning
        </p>
      </div>

      <style jsx global>{`
        .collapsible-content {
          width: 100% !important;
          min-width: 100% !important;
        }
        .collapsible-content > div {
          width: 100% !important;
          min-width: 100% !important;
        }
        .prose pre {
          max-width: none !important;
          width: 100% !important;
        }
        .prose img {
          width: 100% !important;
          max-width: 100% !important;
        }
        .prose {
          width: 100% !important;
          max-width: 100% !important;
        }
        code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
      `}</style>

      <div className="space-y-8 w-full">
        {[
          {
            id: 'breaking-changes',
            title: 'What are breaking changes?',
            content: (
              <>
                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  A breaking change is a change made to an API's contract that introduces incompatibilities with existing client applications and may cause them to break or malfunction.
                </p>
                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  While there are numerous ways an API contract can introduce breaking changes, and definitions may vary across organizations, we can broadly categorize them into two fundamental types:
                </p>

                <div className="grid grid-cols-1 gap-8">
                  <div className="border border-[var(--border-color)] rounded overflow-hidden shadow-lg">
                    <img
                      src="/breaking-request.png"
                      alt="Diagram illustrating breaking changes"
                      className="w-full"
                    />
                  </div>

                  <div className="border border-[var(--border-color)] rounded overflow-hidden shadow-lg">
                    <img
                      src="/breaking-response.png"
                      alt="Diagram illustrating breaking changes"
                      className="w-full"
                    />
                  </div>
                </div>
              </>
            )
          },
          {
            id: 'detect-changes',
            title: 'Using oasdiff to detect breaking changes',
            content: (
              <>
                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  Use the <code className="text-pink-400">breaking</code> command to detect breaking changes:
                </p>
                <div className="overflow-x-auto rounded">
                  <pre className="bg-[var(--background-card)]/50 backdrop-blur-sm p-4 text-sm">
                    <code className="language-bash">
                      <span className="text-emerald-400">❯ oasdiff</span> breaking spec1.yaml spec2.yaml<br />
                      1 changes: 1 <span className="text-red-400">error</span>, 0 <span className="text-pink-400">warning</span>, 0 <span className="text-cyan-400">info</span><br />
                      <span className="text-red-400">error</span>	  [<span className="text-yellow-400">api-removed-without-deprecation</span>] at spec1.yaml<br />
                      <pre>        in API <span className="text-emerald-400">GET /api/test</span><br /></pre>
                      <pre>                api removed without deprecation <br /></pre>
                    </code>
                  </pre>
                </div>
              </>
            )
          },
          {
            id: 'prevent-breaking',
            title: 'Using oasdiff to prevent breaking changes',
            content: (
              <>
                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  Run oasdiff with the <code className="text-pink-400">--fail-on</code> flag to return a non-zero value if any breaking changes are detected.
                  When run in the CI/CD, this will break the build and prevent deployments or other actions until breaking changes are addressed.
                </p>
                <div className="overflow-x-auto rounded">
                  <pre className="bg-[var(--background-card)]/50 backdrop-blur-sm p-4 text-sm">
                    <code className="language-bash">
                      <span className="text-emerald-400">❯ oasdiff</span> breaking --fail-on ERR spec1.yaml spec2.yaml<br />
                      1 changes: 1 <span className="text-red-400">error</span>, 0 <span className="text-pink-400">warning</span>, 0 <span className="text-cyan-400">info</span><br />
                      <span className="text-red-400">error</span>	  [<span className="text-yellow-400">api-removed-without-deprecation</span>] at spec1.yaml<br />
                      <pre>        in API <span className="text-emerald-400">GET /api/test</span><br /></pre>
                      <pre>                api removed without deprecation <br /></pre>
                      <span className="text-emerald-400">❯ echo</span> $?<br />
                      1
                    </code>
                  </pre>
                </div>
                <p className="text-lg text-[var(--foreground)] leading-relaxed mt-4">
                  See <a href="https://github.com/Tufin/oasdiff/blob/main/docs/BREAKING-CHANGES.md#preventing-breaking-changes" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">here</a> for more info.
                </p>
              </>
            )
          },
          {
            id: 'cicd',
            title: 'Using oasdiff in CI/CD',
            content: (
              <>
                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  Oasdiff can be useful in continuous integration/continuous deployment (CI/CD) pipelines, where it can automatically compare API versions to ensure that modifications are thoroughly reviewed and tested before deployment.
                </p>

                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  The <a href="https://github.com/oasdiff/oasdiff-action" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">oasdiff GitHub Action</a> makes it easy to integrate breaking change checks into your CI/CD pipeline. It automatically runs when pull requests are created or updated, comparing the changes between the base branch and the pull request.
                </p>

                <p className="text-lg text-[var(--foreground)] leading-relaxed mt-4">
                  You can also run oasdiff directly in your pipeline, as demonstrated in <a href="https://github.com/oasdiff/github-demo" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">this repo</a>.
                </p>
              </>
            )
          },
          {
            id: 'diff-service',
            title: 'Diff as a Service',
            content: (
              <>
                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  Oasdiff provides a web service that allows you to compare OpenAPI specifications without installing any software. This is perfect for quick comparisons or when you need to integrate API diffing into your existing tools.
                </p>

                <p className="text-lg text-[var(--foreground)] leading-relaxed mt-4">
                  For more information, visit the <a href="https://www.oasdiff.com/diff-as-a-service" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">Diff as a Service</a> repo.
                </p>
              </>
            )
          },
          {
            id: 'changelog',
            title: 'Generating a changelog',
            content: (
              <>
                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  Oasdiff can generate a changelog by comparing two API specifications.
                  The changelog includes both breaking and non-breaking changes, making it easy to track and communicate API evolution.
                  Use the <code className="text-pink-400">changelog</code> command to generate a detailed report:
                </p>
                <div className="overflow-x-auto rounded">
                  <pre className="bg-[var(--background-card)]/50 backdrop-blur-sm p-4 text-sm">
                    <code className="language-bash">
                      <span className="text-emerald-400">❯ oasdiff</span> changelog spec1.yaml spec2.yaml<br />
                      1 changes: 1 <span className="text-red-400">error</span>, 0 <span className="text-pink-400">warning</span>, 1 <span className="text-cyan-400">info</span><br />
                      <span className="text-red-400">error</span>	  [<span className="text-yellow-400">api-removed-without-deprecation</span>] at spec1.yaml<br />
                      <pre>        in API <span className="text-emerald-400">GET /api/test</span><br /></pre>
                      <pre>                api removed without deprecation <br /></pre>
                      <br />
                      <span className="text-cyan-400">info</span>	   [<span className="text-yellow-400">endpoint-added</span>] at spec2.yaml<br />
                      <pre>        in API <span className="text-emerald-400">POST /api/test</span><br /></pre>
                      <pre>                endpoint added <br /></pre>
                    </code>
                  </pre>
                </div>
              </>
            )
          },
          {
            id: 'formats',
            title: 'Output formats',
            content: (
              <>
                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  oasdiff supports several output formats to suit different use cases. You can specify the format using the <code className="text-pink-400">--format</code> flag:
                </p>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">JSON Format</h4>
                    <p className="text-[var(--foreground)] leading-relaxed mb-4">
                      The JSON format is ideal for programmatic processing and integration with other tools. It provides a structured representation of the differences between specifications.
                    </p>
                    <div className="overflow-x-auto rounded">
                      <pre className="bg-[var(--background-card)]/50 backdrop-blur-sm p-4 text-sm">
                        <code className="language-bash">
                          <span className="text-emerald-400">❯ oasdiff</span> &lt;diff|breaking|changelog&gt; --format json spec1.yaml spec2.yaml
                        </code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">YAML Format</h4>
                    <p className="text-[var(--foreground)] leading-relaxed mb-4">
                      The YAML format provides a human-readable, hierarchical view of the differences between specifications. It's particularly useful for OpenAPI specifications since they are often written in YAML format.
                    </p>
                    <div className="overflow-x-auto rounded">
                      <pre className="bg-[var(--background-card)]/50 backdrop-blur-sm p-4 text-sm">
                        <code className="language-bash">
                          <span className="text-emerald-400">❯ oasdiff</span> &lt;diff|breaking|changelog&gt; --format yaml spec1.yaml spec2.yaml
                        </code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">HTML Format</h4>
                    <p className="text-[var(--foreground)] leading-relaxed mb-4">
                      The HTML format generates a beautifully formatted, interactive report that's perfect for sharing with team members or stakeholders. It includes syntax highlighting and collapsible sections.
                    </p>
                    <div className="overflow-x-auto rounded">
                      <pre className="bg-[var(--background-card)]/50 backdrop-blur-sm p-4 text-sm">
                        <code className="language-bash">
                          <span className="text-emerald-400">❯ oasdiff</span> &lt;diff|breaking|changelog&gt; --format html spec1.yaml spec2.yaml
                        </code>
                      </pre>
                    </div>
                    <p className="text-[var(--foreground)] leading-relaxed">
                      <a href="https://html-preview.github.io/?url=https://github.com/Tufin/oasdiff/blob/main/docs/changelog.html" target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">See example</a>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">Markdown Format</h4>
                    <p className="text-[var(--foreground)] leading-relaxed mb-4">
                      The Markdown format is great for documentation and can be easily converted to other formats or rendered in various Markdown viewers.
                    </p>
                    <div className="overflow-x-auto rounded">
                      <pre className="bg-[var(--background-card)]/50 backdrop-blur-sm p-4 text-sm">
                        <code className="language-bash">
                          <span className="text-emerald-400">❯ oasdiff</span> &lt;diff|breaking|changelog&gt; --format markdown spec1.yaml spec2.yaml
                        </code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">Text Formatfor more details about output formats and their specific features.</h4>
                    <p className="text-[var(--foreground)] leading-relaxed mb-4">
                      The text format provides a simple, human-readable output that's perfect for quick reviews and terminal-based workflows.
                    </p>
                    <div className="overflow-x-auto rounded">
                      <pre className="bg-[var(--background-card)]/50 backdrop-blur-sm p-4 text-sm">
                        <code className="language-bash">
                          <span className="text-emerald-400">❯ oasdiff</span> &lt;diff|breaking|changelog&gt; spec1.yaml spec2.yaml
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-[var(--foreground)] leading-relaxed mt-6">
                  See <a href="https://github.com/oasdiff/oasdiff/blob/main/docs/BREAKING-CHANGES.md#output-formats" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">here</a> for more details about output formats and their specific features.
                </p>
              </>
            )
          },
          {
            id: 'raw-diff',
            title: 'Raw diff',
            content: (
              <>
                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  Use the <code className="text-pink-400">diff</code> command to see a comprehensive diff between two API specifications:
                </p>
                <div className="overflow-x-auto rounded">
                  <pre className="bg-[var(--background-card)]/50 backdrop-blur-sm p-4 text-sm">
                    <code className="language-bash">
                      <span className="text-emerald-400">❯ oasdiff</span> diff spec1.yaml spec2.yaml
                      <pre>paths:</pre>
                      <pre>    modified:</pre>
                      <pre>        get:</pre>
                      <pre>            /api/test:</pre>
                      <pre>                operations:</pre>
                      <pre>                    added:</pre>
                      <pre>                        - POST</pre>
                      <pre>                    deleted:</pre>
                      <pre>                        - GET</pre>
                      <pre>endpoints:</pre>
                      <pre>    added:</pre>
                      <pre>        - method: POST</pre>
                      <pre>          path: /api/test</pre>
                      <pre>    deleted:</pre>
                      <pre>        - method: GET</pre>
                      <pre>          path: /api/test</pre>
                    </code>
                  </pre>
                </div>
              </>
            )
          },
          {
            id: 'allof-comparison',
            title: 'Comparing AllOf schemas',
            content: (
              <>
                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  OpenAPI 3.0 provides several keywords for combining schemas, including <code className="text-pink-400">allOf</code>, which validates a value against all subschemas. While these keywords are useful for describing complex data models, they can complicate breaking changes detection.
                </p>

                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  Consider this example where a new subschema is added under <code className="text-pink-400">allOf</code>:
                </p>
                <div className="overflow-x-auto rounded">
                  <pre className="bg-[var(--background-card)]/50 backdrop-blur-sm p-4 text-sm">
                    <code className="language-yaml">{`allOf:
  - type: object
    properties:
      prop1:
        type: string
  - type: object
    properties:
      prop2:
        type: boolean
  - type: object
    properties:
      prop1:
        type: string`}</code>
                  </pre>
                </div>

                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  By default, oasdiff might report this as a breaking change because it sees a new constraint. However, in this case, the new subschema is identical to an existing one and doesn't add any real constraints.
                </p>

                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  To handle this, oasdiff provides the <code className="text-pink-400">--flatten-allof</code> flag, which merges equivalent <code className="text-pink-400">allOf</code> schemas before comparison:
                </p>
                <div className="overflow-x-auto rounded">
                  <pre className="bg-[var(--background-card)]/50 backdrop-blur-sm p-4 text-sm">
                    <code className="language-bash">
                      <span className="text-emerald-400">❯ oasdiff</span> breaking --flatten-allof spec1.yaml spec2.yaml
                    </code>
                  </pre>
                </div>

                <p className="text-lg text-[var(--foreground)] leading-relaxed mb-4">
                  You can also use the <code className="text-pink-400">flatten</code> subcommand to see how oasdiff merges <code className="text-pink-400">allOf</code> schemas:
                </p>
                <div className="overflow-x-auto rounded">
                  <pre className="bg-[var(--background-card)]/50 backdrop-blur-sm p-4 text-sm">
                    <code className="language-bash">
                      <span className="text-emerald-400">❯ oasdiff</span> flatten spec.yaml
                    </code>
                  </pre>
                </div>
              </>
            )
          }
        ].map((section) => (
          <div key={section.id} id={section.id} className="w-full">
            <Collapsible
              title={section.title}
              open={openSection === section.id}
              onOpenChange={() => setOpenSection(openSection === section.id ? null : section.id)}
            >
              <div className="prose prose-invert max-w-none p-6 border-t border-[var(--border-color)] w-full">
                {section.content}
              </div>
            </Collapsible>
          </div>
        ))}
      </div>
    </div>
  );
} 