import Link from "next/link";
import { Collapsible } from "@/components/ui/collapsible";

export default function Test() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center px-4 max-w-4xl mx-auto py-8">
        <div className="w-full">
          <p className="text-lg text-left mb-8">
            Welcome to oasdiff, an <a href="https://github.com/Tufin/oasdiff" className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline">open source</a> tool for comparing API contracts written in <a className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline" href="https://swagger.io/specification/v3/">OpenAPI Specification v3</a>,
            designed to help developers and teams understand the changes between different versions of their APIs.
          </p>

          <Collapsible title="Using oasdiff to detect breaking changes">
            <p className="text-lg text-left w-full max-w-full mb-4">
              Compare two OpenAPI specs to detect breaking changes:
            </p>
            <div className="w-full max-w-full overflow-x-auto mb-8">
              <pre className="bg-gray-800 text-white p-2 rounded-md text-sm whitespace-pre">
                <code className="language-bash">
                  &gt; <span className="text-green-300">oasdiff</span> breaking spec1.yaml spec2.yaml<br/>
                  1 changes: 1 <span className="text-red-500">error</span>, 0 <span className="text-pink-500">warning</span>, 0 <span className="text-cyan-500">info</span><br/>
                  <span className="text-red-500">error</span>	  [<span className="text-yellow-500">api-removed-without-deprecation</span>] at simple1.yaml<br/>
                  <pre>        in API <span className="text-green-300">GET /api/test</span><br/></pre>
                  <pre>                api removed without deprecation <br/></pre>
                </code>
              </pre>
            </div>
          </Collapsible>

          <Collapsible title="What are breaking changes?">
            <p className="text-lg text-left w-full max-w-full mb-4">
              An OpenAPI breaking change is a change made to an API's contract (defined using the OpenAPI Specification) that introduces incompatibilities with existing client applications or consumers of the API. These changes can disrupt the functionality of client applications and potentially cause them to break or malfunction.
              <br/>
              Generally speaking, there are two kinds of breaking changes.<br/>
            </p>
            
            <div className="mb-8 w-full">
              <h4 className="text-xl font-semibold text-left mb-3 mt-3">1. Changes that require the client to send something new or different</h4>
              <div className="border-4 border-gray-300 rounded-lg shadow-lg p-2">
                <img
                  src="/breaking-request.png"
                  alt="Diagram illustrating breaking changes"
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="mb-4 w-full">
              <h4 className="text-xl font-semibold text-left mb-3">2. Changes that omit or change something that the client was expecting</h4>
              <div className="border-4 border-gray-300 rounded-lg shadow-lg p-2">
                <img
                  src="/breaking-response.png"
                  alt="Diagram illustrating breaking changes"
                  className="w-full"
                />
              </div>
            </div>

            <p className="text-lg text-left w-full max-w-full">However, this is a simplification. In reality, there are many types of breaking changes that can occur in an API contract, and unfortunatly, there is no standard definition.<br/>
              This was one of the challenges we faced when creating oasdiff and to tackle it, we, the oasdiff community, have created <a href="/checks" className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline">a comprehensive set of checks for testing changes in API contracts</a>.<br/>
              The checks are implemented as open source and we welcome feedback to continue refining and improving them.<br/>
            </p>
          </Collapsible>
        </div>
      </main>
    </div>
  );
}
