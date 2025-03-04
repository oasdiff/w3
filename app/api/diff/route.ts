import { NextRequest } from 'next/server';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import { promisify } from 'util';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file1 = formData.get('file1') as File;
    const file2 = formData.get('file2') as File;
    const mode = formData.get('mode') as string;

    if (!file1 || !file2) {
      return new Response('Missing files', { status: 400 });
    }

    // Create temporary files
    const tmpDir = os.tmpdir();
    const file1Path = path.join(tmpDir, 'spec1.yaml');
    const file2Path = path.join(tmpDir, 'spec2.yaml');

    // Write uploaded files to temp directory
    await writeFile(file1Path, Buffer.from(await file1.arrayBuffer()));
    await writeFile(file2Path, Buffer.from(await file2.arrayBuffer()));

    // Execute oasdiff command based on mode
    const command = `oasdiff ${mode} ${file1Path} ${file2Path}`;
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error('Error:', stderr);
      return new Response(stderr, { status: 500 });
    }

    return new Response(stdout);
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 