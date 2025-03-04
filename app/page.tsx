import Link from "next/link";
import { Collapsible } from "@/components/ui/collapsible";

export default function Test() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center px-4 max-w-4xl mx-auto py-8">
        <div className="w-full">
          <p className="text-lg text-left mb-8">
            Welcome to oasdiff, an <a href="https://github.com/Tufin/oasdiff" className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline">open source</a> tool for comparing API contracts written with <a className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline" href="https://swagger.io/specification/v3/">OpenAPI Specification v3</a>,
            designed to help developers and teams understand the changes between different versions of their APIs.
          </p>

          <Collapsible title="What are breaking changes?">
            <p className="text-lg text-left w-full max-w-full mb-4">
              A breaking change is a change made to an API's contract (defined using the OpenAPI Specification) that introduces incompatibilities with existing client applications or consumers of the API. These changes can disrupt the functionality of client applications and potentially cause them to break or malfunction.
            </p>
          </Collapsible>
          
          <Collapsible title="Preventing breaking changes manually">
            <p className="text-lg text-left w-full max-w-full mb-4">
            Generally speaking, there are rules to follow in order to prevent breaking changes:<br/>
            </p>
            
            <div className="mb-8 w-full">
              <div className="border-4 border-gray-300 rounded-lg shadow-lg p-2">
                <img
                  src="/breaking-request.png"
                  alt="Diagram illustrating breaking changes"
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="mb-4 w-full">
              <div className="border-4 border-gray-300 rounded-lg shadow-lg p-2">
                <img
                  src="/breaking-response.png"
                  alt="Diagram illustrating breaking changes"
                  className="w-full"
                />
              </div>
            </div>

            <p className="text-lg text-left w-full max-w-full">
              Many types of breaking changes can occur in an API contract, and there is no universally accepted definition.
              To address this issue, the oasdiff community created <a href="/checks" className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline">a comprehensive set of open-source checks for testing contract changes</a>.
            </p>
          </Collapsible>

          <Collapsible title="Using oasdiff to detect breaking changes">
            <p className="text-lg text-left w-full max-w-full">
              Use the <i>breaking</i> command to see breaking changes:
            </p>
            <div className="w-full max-w-full overflow-x-auto mb-8 mt-2">
              <pre className="bg-gray-800 text-white p-2 rounded-md text-sm whitespace-pre">
                <code className="language-bash">
                  <span className="text-green-300">❯ oasdiff</span> breaking spec1.yaml spec2.yaml<br/>
                  1 changes: 1 <span className="text-red-500">error</span>, 0 <span className="text-pink-500">warning</span>, 0 <span className="text-cyan-500">info</span><br/>
                  <span className="text-red-500">error</span>	  [<span className="text-yellow-500">api-removed-without-deprecation</span>] at spec1.yaml<br/>
                  <pre>        in API <span className="text-green-300">GET /api/test</span><br/></pre>
                  <pre>                api removed without deprecation <br/></pre>
                </code>
              </pre>
            </div>
          </Collapsible>

          <Collapsible title="Using oasdiff to prevent breaking changes">
            <p className="text-lg text-left w-full max-w-full">
              Run oasdiff with the <i>--fail-on</i> flag to return a non-zero value if any breaking changes are detected.<br/>
              When run in the CI/CD, this will break the build and prevent deployments or other actions until breaking changes are addressed.<br/>
            </p>
            <div className="w-full max-w-full overflow-x-auto mb-8 mt-2">
              <pre className="bg-gray-800 text-white p-2 rounded-md text-sm whitespace-pre">
                <code className="language-bash">
                  <span className="text-green-300">❯ oasdiff</span> breaking --fail-on ERR spec1.yaml spec2.yaml<br/>
                  1 changes: 1 <span className="text-red-500">error</span>, 0 <span className="text-pink-500">warning</span>, 0 <span className="text-cyan-500">info</span><br/>
                  <span className="text-red-500">error</span>	  [<span className="text-yellow-500">api-removed-without-deprecation</span>] at spec1.yaml<br/>
                  <pre>        in API <span className="text-green-300">GET /api/test</span><br/></pre>
                  <pre>                api removed without deprecation <br/></pre>
                  <span className="text-green-300">❯ echo</span> $?
                  <pre>1</pre>
                </code>
              </pre>
            </div>
            <p>See <a href="https://github.com/Tufin/oasdiff/blob/main/docs/BREAKING-CHANGES.md#preventing-breaking-changes" className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline">here</a> for more info.</p>
          </Collapsible>

          <Collapsible title="Using oasdiff in CI/CD">
            <p className="text-lg text-left w-full max-w-full">
              Oasdiff can be useful in continuous integration/continuous deployment (CI/CD) pipelines, where it can automatically compare API versions to ensure that modifications are thoroughly reviewed and tested before deployment.<br/>
              If you're using github, check out the <a href="https://github.com/oasdiff/oasdiff-action" className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline">oasdiff GitHub Action</a>.<br/>
              <a href="https://github.com/oasdiff/github-demo" className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline">This repo</a> shows how to run oasdiff directly in your pipeline.<br/>
            </p>
          </Collapsible>


          <Collapsible title="Generating a changelog">
            <p className="text-lg text-left w-full max-w-full">
              Oasdiff can generate a changelog by comparing two API specifications.<br/>
              The changelog includes both breaking and non-breaking changes, making it easy to track and communicate API evolution.<br/>
              Use the <i>changelog</i> command to generate a detailed report:
            </p>
            <div className="w-full max-w-full overflow-x-auto mb-8 mt-2">
              <pre className="bg-gray-800 text-white p-2 rounded-md text-sm whitespace-pre">
                <code className="language-bash">
                  <span className="text-green-300">❯ oasdiff</span> changelog spec1.yaml spec2.yaml<br/>
                  1 changes: 1 <span className="text-red-500">error</span>, 0 <span className="text-pink-500">warning</span>, 1 <span className="text-cyan-500">info</span><br/>
                  <span className="text-red-500">error</span>	  [<span className="text-yellow-500">api-removed-without-deprecation</span>] at spec1.yaml<br/>
                  <pre>        in API <span className="text-green-300">GET /api/test</span><br/></pre>
                  <pre>                api removed without deprecation <br/></pre>
                  <br/>
                  <span className="text-cyan-500">info</span>	   [<span className="text-yellow-500">endpoint-added</span>] at spec2.yaml<br/>
                  <pre>        in API <span className="text-green-300">POST /api/test</span><br/></pre>
                  <pre>                endpoint added <br/></pre>
                </code>
              </pre>
            </div>
            <p className="text-lg text-left w-full max-w-full">
              Use the <i>--format</i> flag to specify the format of the changelog.
            </p>
              <div className="w-full max-w-full overflow-x-auto mb-2 mt-2">
              <pre className="bg-gray-800 text-white p-2 rounded-md text-sm whitespace-pre">
              <code className="language-bash">
                  <span className="text-green-300">❯ oasdiff</span> changelog --format html spec1.yaml spec2.yaml &gt; <a href="https://html-preview.github.io/?url=https://github.com/Tufin/oasdiff/blob/main/docs/changelog.html" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline">changelog.html</a>
              </code>              
              </pre> 
              </div>
              <p className="text-lg text-left w-full max-w-full">
              See <a href="https://github.com/Tufin/oasdiff/blob/main/docs/BREAKING-CHANGES.md#output-formats" className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline">here</a> for supported formats.
            </p>
          </Collapsible>
        </div>
      </main>
    </div>
  );
}
