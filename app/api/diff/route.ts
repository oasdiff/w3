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
      console.error('Missing files in request');
      return new Response('Missing files', { status: 400 });
    }

    console.log('Processing files:', {
      file1Name: file1.name,
      file1Type: file1.type,
      file1Size: file1.size,
      file2Name: file2.name,
      file2Type: file2.type,
      file2Size: file2.size,
      mode
    });

    // Create a new FormData object for the oasdiff-service request
    const serviceFormData = new FormData();
    
    // Convert files to blobs with proper content type
    const file1Blob = new Blob([await file1.arrayBuffer()], { type: 'application/yaml' });
    const file2Blob = new Blob([await file2.arrayBuffer()], { type: 'application/yaml' });
    
    serviceFormData.append('base', file1Blob, file1.name);
    serviceFormData.append('revision', file2Blob, file2.name);

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
    console.log('Service response:', result);
    
    // Try to parse and format JSON if the response is JSON
    try {
      const jsonResult = JSON.parse(result);
      const formattedResult = JSON.stringify(jsonResult, null, 2);
      return new Response(formattedResult, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch {
      // If it's not JSON, return as plain text
      return new Response(result);
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 