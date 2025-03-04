"use client";

import { useState } from 'react';

type DiffMode = 'breaking' | 'changelog' | 'diff';

function colorizeOutput(text: string, mode: DiffMode, file1Name: string, file2Name: string) {
  if (mode === 'diff') return text;

  return text.split('\n').map((line, i) => {
    // Replace temporary file paths with actual file names
    line = line.replace(/at .*?spec1\.yaml/g, `at ${file1Name}`);
    line = line.replace(/at .*?spec2\.yaml/g, `at ${file2Name}`);

    // Color the summary line
    if (line.includes('changes:')) {
      return line.replace(
        /(\d+) (error)|\b(warning)\b|\b(info)\b/g,
        (match, num, error, warning, info) => {
          if (error) return `${num} <span class="text-red-400">error</span>`;
          if (warning) return `<span class="text-pink-400">warning</span>`;
          if (info) return `<span class="text-cyan-400">info</span>`;
          return match;
        }
      );
    }

    // Color the error/warning/info lines
    if (line.includes('error')) {
      return line
        .replace(/error/, '<span class="text-red-400">error</span>')
        .replace(/\[(.*?)\]/, '[$1]'.replace(/\[(.+?)\]/, '<span class="text-yellow-400">[$1]</span>'))
        .replace(/GET|POST|PUT|DELETE|PATCH.*$/, match => `<span class="text-emerald-400">${match}</span>`);
    }
    if (line.includes('warning')) {
      return line
        .replace(/warning/, '<span class="text-pink-400">warning</span>')
        .replace(/\[(.*?)\]/, '[$1]'.replace(/\[(.+?)\]/, '<span class="text-yellow-400">[$1]</span>'))
        .replace(/GET|POST|PUT|DELETE|PATCH.*$/, match => `<span class="text-emerald-400">${match}</span>`);
    }
    if (line.includes('info')) {
      return line
        .replace(/info/, '<span class="text-cyan-400">info</span>')
        .replace(/\[(.*?)\]/, '[$1]'.replace(/\[(.+?)\]/, '<span class="text-yellow-400">[$1]</span>'))
        .replace(/GET|POST|PUT|DELETE|PATCH.*$/, match => `<span class="text-emerald-400">${match}</span>`);
    }

    return line;
  }).join('\n');
}

export default function DiffCalculator() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [mode, setMode] = useState<DiffMode>('breaking');
  const [result, setResult] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileNum: 1 | 2) => {
    if (e.target.files && e.target.files[0]) {
      if (fileNum === 1) setFile1(e.target.files[0]);
      else setFile2(e.target.files[0]);
    }
  };

  const handleCompare = async () => {
    if (!file1 || !file2) {
      alert('Please select both files');
      return;
    }

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);
    formData.append('mode', mode);

    try {
      const response = await fetch('/api/diff', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.text();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult('Error comparing files');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-white">Diff Calculator</h1>
      
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            First OpenAPI Specification
          </label>
          <input
            type="file"
            accept=".yaml,.yml,.json"
            onChange={(e) => handleFileChange(e, 1)}
            className="block w-full text-sm text-gray-300
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-medium
              file:bg-emerald-600 file:text-white
              hover:file:bg-emerald-700
              file:cursor-pointer"
          />
          {file1 && (
            <p className="mt-2 text-sm text-gray-400">
              Selected: {file1.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Second OpenAPI Specification
          </label>
          <input
            type="file"
            accept=".yaml,.yml,.json"
            onChange={(e) => handleFileChange(e, 2)}
            className="block w-full text-sm text-gray-300
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-medium
              file:bg-emerald-600 file:text-white
              hover:file:bg-emerald-700
              file:cursor-pointer"
          />
          {file2 && (
            <p className="mt-2 text-sm text-gray-400">
              Selected: {file2.name}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setMode('breaking')}
          className={`px-4 py-2 rounded font-medium ${
            mode === 'breaking'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Breaking Changes
        </button>
        <button
          onClick={() => setMode('changelog')}
          className={`px-4 py-2 rounded font-medium ${
            mode === 'changelog'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Changelog
        </button>
        <button
          onClick={() => setMode('diff')}
          className={`px-4 py-2 rounded font-medium ${
            mode === 'diff'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Raw Diff
        </button>
      </div>

      <button
        onClick={handleCompare}
        disabled={!file1 || !file2}
        className="w-full py-3 px-4 rounded font-medium bg-emerald-600 text-white 
          hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed mb-8"
      >
        Compare Specifications
      </button>

      {result && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded p-6 border border-gray-700/50">
          <pre 
            className="text-sm text-gray-300 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ 
              __html: colorizeOutput(result, mode, file1?.name || 'First Specification', file2?.name || 'Second Specification') 
            }}
          />
        </div>
      )}
    </div>
  );
} 