import { NextRequest } from 'next/server';

const OASDIFF_SERVICE_URL = 'https://api.oasdiff.com/tenants/0634345d-02fb-43df-b56a-68fc22253621';

// Map frontend modes to service endpoints
const modeToEndpoint = {
  'breaking': 'breaking-changes',
  'changelog': 'changelog',
  'diff': 'diff'
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file1 = formData.get('file1') as File;
    const file2 = formData.get('file2') as File;
    const mode = formData.get('mode') as string;

    if (!file1 || !file2) {
      return new Response('Missing files', { status: 400 });
    }

    // Create a new FormData object for the oasdiff-service request
    const serviceFormData = new FormData();
    serviceFormData.append('base', file1);
    serviceFormData.append('revision', file2);

    const endpoint = modeToEndpoint[mode as keyof typeof modeToEndpoint];
    const url = `${OASDIFF_SERVICE_URL}/${endpoint}`;
    console.log('Calling oasdiff-service at:', url);

    // Call oasdiff-service with mode in URL
    const response = await fetch(url, {
      method: 'POST',
      body: serviceFormData
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error from oasdiff-service:', error);
      return new Response(error, { status: response.status });
    }

    const result = await response.text();
    
    // Try to parse and format JSON if the response is JSON
    try {
      const jsonResult = JSON.parse(result);
      const formattedResult = JSON.stringify(jsonResult, null, 2);
      return new Response(formattedResult, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (_) {
      // If it's not JSON, return as plain text
      return new Response(result);
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 