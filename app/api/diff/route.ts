import { NextRequest } from 'next/server';

const OASDIFF_SERVICE_URL = 'https://api.oasdiff.com/tenants/0634345d-02fb-43df-b56a-68fc22253621';

// Map frontend modes to service endpoints
const modeToEndpoint = {
  'breaking': 'breaking-changes',
  'changelog': 'changelog',
  'diff': 'diff'
};

// Map formats to Accept header values for the service call
const formatToAcceptHeader: { [key: string]: string } = {
  yaml: 'application/yaml',
  json: 'application/json',
  html: 'text/html',
  text: 'text/plain',
  markdown: 'text/markdown' 
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file1 = formData.get('file1') as File;
    const file2 = formData.get('file2') as File;
    const mode = formData.get('mode') as string;
    const format = formData.get('format') as string || 'json'; // Get format, default to json

    if (!file1 || !file2 || !mode) {
      console.error('Missing files or mode in request');
      return new Response('Missing files or mode', { status: 400 });
    }

    console.log('Processing request:', {
      file1Name: file1.name,
      file2Name: file2.name,
      mode,
      format
    });

    // Create a new FormData object for the oasdiff-service request
    const serviceFormData = new FormData();
    
    // Use blobs to ensure correct content type handling if needed by the service
    const file1Blob = new Blob([await file1.arrayBuffer()], { type: file1.type || 'application/yaml' });
    const file2Blob = new Blob([await file2.arrayBuffer()], { type: file2.type || 'application/yaml' });
    
    serviceFormData.append('base', file1Blob, file1.name);
    serviceFormData.append('revision', file2Blob, file2.name);

    const endpoint = modeToEndpoint[mode as keyof typeof modeToEndpoint];
    if (!endpoint) {
       console.error('Invalid mode:', mode);
       return new Response('Invalid mode', { status: 400 });
    }
    
    // Construct URL without format query parameter
    const url = `${OASDIFF_SERVICE_URL}/${endpoint}`;
    console.log('Calling oasdiff-service at:', url);
    
    // Determine the Accept header value
    const acceptHeader = formatToAcceptHeader[format] || 'text/plain';
    console.log(`Setting Accept header for service call: ${acceptHeader}`);

    // Call oasdiff-service with mode in URL and Accept header
    const response = await fetch(url, {
      method: 'POST',
      body: serviceFormData,
      headers: {
          'Accept': acceptHeader
      }
    });

    const result = await response.text();
    console.log('Service response status:', response.status);
    
    if (!response.ok) {
      console.error('Error from oasdiff-service:', result);
      return new Response(result || 'Error from service', { status: response.status });
    }

    // Return the raw result from the service, letting the frontend handle display based on format
    // We also forward the Content-Type header received from the service if available
    const responseHeaders = new Headers();
    const contentType = response.headers.get('content-type');
    if (contentType) { 
        responseHeaders.set('Content-Type', contentType);
    }

    return new Response(result, { 
        status: 200, 
        headers: responseHeaders 
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 