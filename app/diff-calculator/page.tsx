"use client";

import { useState, useEffect, useRef, ReactNode, Fragment as ReactFragment } from 'react';
import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

type DiffMode = 'breaking' | 'changelog' | 'diff';

interface Check {
  id: string;
  level: string;
  direction: string;
  location: string;
  action: string;
  description: string;
  detailed_description: string;
  mitigation?: string;
  number?: number;
}

interface Change {
  id: string;
  text: string;
  level: number;
  operation?: string;
  operationId?: string;
  path?: string;
  source?: string;
  section?: string;
  comment?: string;
}

interface DiffResponse {
  changes: Change[];
}

interface SelectedFileProps {
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

function SelectedFile({ file, onChange, label }: SelectedFileProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="file"
          accept=".yaml,.yml,.json"
          onChange={onChange}
          key={file ? `${file.name}-${file.lastModified}` : 'file-input'}
          className="block w-full text-sm text-transparent
            [&::file-selector-button]:mr-4 [&::file-selector-button]:py-2 [&::file-selector-button]:px-4
            [&::file-selector-button]:rounded [&::file-selector-button]:border-0
            [&::file-selector-button]:text-sm [&::file-selector-button]:font-medium
            [&::file-selector-button]:bg-emerald-600 [&::file-selector-button]:text-white
            [&::file-selector-button]:hover:bg-emerald-700
            [&::file-selector-button]:cursor-pointer
            [&::-webkit-file-upload-button]:mr-4 [&::-webkit-file-upload-button]:py-2 [&::-webkit-file-upload-button]:px-4
            [&::-webkit-file-upload-button]:rounded [&::-webkit-file-upload-button]:border-0
            [&::-webkit-file-upload-button]:text-sm [&::-webkit-file-upload-button]:font-medium
            [&::-webkit-file-upload-button]:bg-emerald-600 [&::-webkit-file-upload-button]:text-white
            [&::-webkit-file-upload-button]:hover:bg-emerald-700
            [&::-webkit-file-upload-button]:cursor-pointer"
        />
        {file && (
          <span className="absolute left-[140px] top-1/2 -translate-y-1/2 text-sm text-[var(--foreground)] truncate max-w-[calc(100%-150px)]">
            {file.name}
          </span>
        )}
      </div>
    </div>
  );
}

function colorizeOutput(text: string, mode: DiffMode | null, file1Name: string, file2Name: string, onCheckHover: (checkId: string, event: React.MouseEvent) => void, onCheckLeave: () => void): ReactNode[] {
  if (mode === 'diff' || !mode) return [text];

  try {
    const jsonData = JSON.parse(text) as DiffResponse;
    const lines: ReactNode[] = [];

    // Handle the changes array
    if (jsonData.changes && Array.isArray(jsonData.changes)) {
      jsonData.changes.forEach((item: Change, index: number) => {
        // First line: error/warning/info with check ID
        const levelText = item.level === 1 ? 'info' : item.level === 2 ? 'warning' : 'error';
        const levelColor = item.level === 1 ? 'text-cyan-400' : item.level === 2 ? 'text-pink-400' : 'text-red-400';
        
        // Replace temporary file paths with actual file names
        let source = item.source;
        if (source) {
          // Replace base patterns
          const basePatterns = [/\/tmp\/tmp[^/]+\/base/, /[^/]+\.yaml/];
          const revisionPatterns = [/\/tmp\/tmp[^/]+\/revision/, /[^/]+\.yaml/];

          // Check if it's a base file reference
          if (source.includes('/base') || source.includes('base.yaml')) {
            for (const pattern of basePatterns) {
              source = source.replace(pattern, file1Name);
            }
          }
          // Check if it's a revision file reference
          else if (source.includes('/revision') || source.includes('revision.yaml')) {
            for (const pattern of revisionPatterns) {
              source = source.replace(pattern, file2Name);
            }
          }
        }
        
        lines.push(
          <ReactFragment key={`first-${index}`}>
            <span className={levelColor}>{levelText}</span>{' '}
            <span
              className="text-yellow-400 cursor-pointer hover:text-yellow-300"
              style={{ borderBottom: '1px dotted currentColor' }}
              onMouseOver={(e) => onCheckHover(item.id, e)}
              onMouseOut={onCheckLeave}
            >
              [{item.id}]
            </span>
            {source ? ` at ${source}` : ''}{'\n'}
          </ReactFragment>
        );

        // Second line: in API operation path
        if (item.operation && item.path) {
          lines.push(
            <ReactFragment key={`second-${index}`}>
              {'      in API '}
              <span className="text-emerald-400">{item.operation}</span>
              {' '}
              <span className="text-emerald-400">{item.path}</span>
              {'\n'}
            </ReactFragment>
          );
        }

        // Third line: the actual change text
        lines.push(
          <ReactFragment key={`third-${index}`}>
            {'          '}{item.text}{'\n'}
          </ReactFragment>
        );

        // Fourth line (if present): the comment
        if (item.comment) {
          lines.push(
            <ReactFragment key={`fourth-${index}`}>
              {'          '}{item.comment}{'\n'}
            </ReactFragment>
          );
        }

        // Add a blank line between items unless it's the last item
        if (index < jsonData.changes.length - 1) {
          lines.push(<ReactFragment key={`space-${index}`}>{'\n'}</ReactFragment>);
        }
      });
    }

    return lines;
  } catch (e) {
    console.error('Error parsing/colorizing JSON:', e);
    return [text];
  }
}

export default function DiffCalculator() {
  console.log('DiffCalculator component mounting');

  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [selectedMode, setSelectedMode] = useState<DiffMode | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [checks, setChecks] = useState<Check[]>([]);
  const checksRef = useRef<Check[]>([]);
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const availableFormats = ['text', 'yaml', 'json', 'html', 'markdown'];

  // Explanations for Breaking/Changelog Modes (from BREAKING-CHANGES.md#output-formats)
  const formatExplanations: { [key: string]: string } = {
    text: 'Human-readable text format, emulates the output of the oasdiff command line tool.',
    yaml: 'Structured, human-readable YAML format.',
    json: 'Structured JSON format for machine processing.',
    html: 'Generates an interactive HTML report (opens in new tab).',
    markdown: 'Markdown format suitable for documentation.'
    // Note: githubactions and junit are not included as options here.
  };

  // Explanations for Diff Mode (from DIFF.md#output-formats)
  const diffFormatExplanations: { [key: string]: string } = {
    yaml: 'Includes all diff details.',
    json: 'Includes all diff details (excludes endpoints section).',
    text: 'Simplified, user-friendly format showing important changes.',
    markdown: 'Simplified, user-friendly format showing important changes (same as text).',
    html: 'Simplified, user-friendly HTML report showing important changes (opens in new tab).'
  };

  // Map formats to Accept header values
  const formatToAcceptHeader: { [key: string]: string } = {
    yaml: 'application/yaml',
    json: 'application/json',
    html: 'text/html',
    text: 'text/plain',
    markdown: 'text/markdown'
  };

  const filesSelected = !!file1 && !!file2;
  const modeSelected = !!selectedMode;
  const formatSelected = !!selectedFormat;
  const canGenerate = filesSelected && modeSelected && formatSelected && !isLoading;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileNum: 1 | 2) => {
    const file = e.target.files?.[0] || null;
    if (fileNum === 1) setFile1(file);
    else setFile2(file);
    setSelectedMode(null);
    setSelectedFormat(null);
    setResult('');
  };

  const handleModeSelect = (mode: DiffMode) => {
    setSelectedMode(mode);
    setSelectedFormat(null);
    setResult('');
  };

  const handleFormatSelect = (format: string) => {
    setSelectedFormat(format);
    setResult('');
  };

  const handleGenerate = async () => {
    if (!canGenerate || !file1 || !file2 || !selectedMode || !selectedFormat) return;

    // Map user selected format to the format value sent to the backend
    const userFormatToBackendFormat: { [key: string]: string } = {
      text: 'json',      // User wants text, request json from backend (for breaking/changelog colorizing)
      json: 'json',
      yaml: 'yaml',
      html: 'html',
      markdown: 'markdown' 
    };
    
    // Determine the format to request from the backend
    let formatToSend = userFormatToBackendFormat[selectedFormat] || 'json'; // Default to json
    // *** Override: If mode is diff and user wants text, request actual text ***
    if (selectedMode === 'diff' && selectedFormat === 'text') {
      formatToSend = 'text'; 
    }

    console.log(`Generating diff. User selected: ${selectedFormat}, Mode: ${selectedMode}, Sending format: ${formatToSend} to backend`);
    setIsLoading(true);
    setResult('');

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);
    formData.append('mode', selectedMode);
    formData.append('format', formatToSend); // Use the potentially overridden format value

    try {
      // Accept header should still reflect what the user ultimately wants to *display*
      const acceptHeader = formatToAcceptHeader[selectedFormat] || 'text/plain'; 
      console.log(`Setting Accept header for backend call: ${acceptHeader}`);

      const response = await fetch('/api/diff', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': acceptHeader
        }
      });
      const data = await response.text();
      if (!response.ok) {
        setResult(`Error: ${data || response.statusText}`);
      } else if (selectedFormat === 'html') {
        // Handle HTML: Open in new tab
        try {
          const blob = new Blob([data], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          URL.revokeObjectURL(url); // Clean up the object URL
          setResult('HTML report opened in a new tab.'); // Set success message
        } catch (e) {
          console.error("Error creating Blob URL for HTML:", e);
          setResult("Error: Failed to open HTML report.");
        }
      } else {
        // Handle other formats: Set result state for display
        setResult(data || 'No differences found.');
      }
    } catch (error) {
      setResult(`Fetch Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checksRef.current = checks;
  }, [checks]);

  useEffect(() => {
    fetch("/data/checks.json?" + new Date().getTime())
      .then(res => res.json())
      .then(data => setChecks(data))
      .catch(error => console.error('Error loading checks:', error));
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const spec1Path = searchParams.get('spec1');
    const spec2Path = searchParams.get('spec2');
    if (spec1Path && spec2Path) {
      const loadInitialFiles = async () => {
        try {
          const [res1, res2] = await Promise.all([
            fetch(spec1Path + '?' + new Date().getTime()),
            fetch(spec2Path + '?' + new Date().getTime())
          ]);
          if (!res1.ok || !res2.ok) throw new Error('Failed to fetch initial specs');
          const [blob1, blob2] = await Promise.all([res1.blob(), res2.blob()]);
          setFile1(new File([blob1], spec1Path.split('/').pop() || 'spec1.yaml'));
          setFile2(new File([blob2], spec2Path.split('/').pop() || 'spec2.yaml'));
          console.log('Loaded initial files from URL');
        } catch (err) {
          console.error('Error loading initial files from URL:', err);
        }
      };
      loadInitialFiles();
    }
  }, []);

  // --- Copy Handler ---
  const handleCopy = async () => {
    if (!result || selectedFormat === 'html' || result === 'HTML report opened in a new tab.') return;

    try {
      await navigator.clipboard.writeText(result);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 1500); // Reset after 1.5 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000); // Reset after 2 seconds
    }
  };

  // Enhanced Hover Handler (now defined within the main component)
  const handleCheckHover = (checkId: string, event: React.MouseEvent) => {
    const check = checksRef.current.find(c => c.id === checkId);
    if (check) {
      setSelectedCheck(check);

      const margin = 15; // Increased margin
      const popupWidth = 384; // from w-96
      const popupHeight = 400; // Adjusted estimate based on content

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = event.clientX + margin; // Default: right of cursor
      if (x + popupWidth > viewportWidth) {
        // Try left of cursor
        x = event.clientX - popupWidth - margin;
      }
      // Ensure it doesn't go off-screen left
      x = Math.max(margin, x); 
      // Ensure it doesn't go off-screen right (in case left didn't fit either)
      x = Math.min(x, viewportWidth - popupWidth - margin); 

      let y = event.clientY + margin; // Default: below cursor
      if (y + popupHeight > viewportHeight) {
        // Try placing it so bottom aligns with viewport bottom
        y = viewportHeight - popupHeight - margin;
      }
      // Ensure it doesn't go off-screen top
      y = Math.max(margin, y); 

      setModalPosition({ x, y });
      setIsModalVisible(true);
    }
  };

  const handleCheckLeave = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[var(--foreground)]">Diff Calculator</h1>
      </div>

      <div className="mb-10 p-6 border border-[var(--background-hover)] rounded-lg bg-[var(--background-card)]/30">
        <h2 className="text-xl font-semibold text-center text-[var(--foreground)] mb-6">1. Select Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SelectedFile
            file={file1}
            onChange={(e) => handleFileChange(e, 1)}
            label="Base Specification (Old)"
          />
          <SelectedFile
            file={file2}
            onChange={(e) => handleFileChange(e, 2)}
            label="Revision Specification (New)"
          />
        </div>
      </div>

      <div className={`mb-10 p-6 border rounded-lg ${filesSelected ? 'border-[var(--background-hover)] bg-[var(--background-card)]/30' : 'border-dashed border-[var(--foreground)]/30 bg-transparent'}`}>
        <h2 className={`text-xl font-semibold text-center mb-6 ${filesSelected ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]/50'}`}>2. Select Comparison Type</h2>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => handleModeSelect('breaking')}
            disabled={!filesSelected}
            className={`w-[180px] px-4 py-2 rounded font-medium ${
              selectedMode === 'breaking'
                ? 'bg-emerald-600 text-white'
                : 'bg-transparent text-[var(--foreground)] border border-emerald-600 hover:bg-emerald-600/10 disabled:border-[var(--foreground)]/30 disabled:text-[var(--foreground)]/50 disabled:hover:bg-transparent'
            }`}
          >
            Breaking Changes
          </Button>
          <Button
            onClick={() => handleModeSelect('changelog')}
            disabled={!filesSelected}
            className={`w-[180px] px-4 py-2 rounded font-medium ${
              selectedMode === 'changelog'
                ? 'bg-emerald-600 text-white'
                : 'bg-transparent text-[var(--foreground)] border border-emerald-600 hover:bg-emerald-600/10 disabled:border-[var(--foreground)]/30 disabled:text-[var(--foreground)]/50 disabled:hover:bg-transparent'
            }`}
          >
            Changelog
          </Button>
          <Button
            onClick={() => handleModeSelect('diff')}
            disabled={!filesSelected}
            className={`w-[180px] px-4 py-2 rounded font-medium ${
              selectedMode === 'diff'
                ? 'bg-emerald-600 text-white'
                : 'bg-transparent text-[var(--foreground)] border border-emerald-600 hover:bg-emerald-600/10 disabled:border-[var(--foreground)]/30 disabled:text-[var(--foreground)]/50 disabled:hover:bg-transparent'
            }`}
          >
            Raw Diff
          </Button>
        </div>
      </div>

      <div className={`mb-10 p-6 border rounded-lg ${modeSelected ? 'border-[var(--background-hover)] bg-[var(--background-card)]/30' : 'border-dashed border-[var(--foreground)]/30 bg-transparent'}`}>
        <h2 className={`text-xl font-semibold text-center mb-6 ${modeSelected ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]/50'}`}>3. Select Output Format</h2>
        <div className="flex justify-center gap-3 flex-wrap">
          {availableFormats.map(format => (
            <Button
              key={format}
              onClick={() => handleFormatSelect(format)}
              disabled={!modeSelected}
              className={`min-w-[100px] px-4 py-2 rounded font-medium ${
                selectedFormat === format
                  ? 'bg-emerald-600 text-white'
                  : 'bg-transparent text-[var(--foreground)] border border-emerald-600 hover:bg-emerald-600/10 disabled:border-[var(--foreground)]/30 disabled:text-[var(--foreground)]/50 disabled:hover:bg-transparent'
              }`}
            >
              {format.toUpperCase()}
            </Button>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-[var(--foreground)]/70 min-h-[1.25rem]">
          {selectedFormat && (selectedMode === 'diff' ? diffFormatExplanations[selectedFormat] : formatExplanations[selectedFormat])}
        </div>
      </div>

      <div className="mb-8 flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="w-[180px] px-4 py-2 rounded font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
      </div>

      {(isLoading || result) && (
        <div className="relative bg-[var(--background-card)]/50 backdrop-blur-sm rounded p-6 pr-12 border border-[var(--background-hover)] min-h-[100px]">
          <div className="absolute top-2 right-2">
            {!isLoading && result && selectedFormat !== 'html' && result !== 'HTML report opened in a new tab.' && (
              <button 
                onClick={handleCopy}
                title="Copy to Clipboard"
                className="p-1.5 rounded text-[var(--foreground)]/60 hover:bg-[var(--background-hover)] hover:text-[var(--foreground)] transition-colors"
              >
                {copyStatus === 'idle' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                {copyStatus === 'copied' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {copyStatus === 'error' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-4 text-[var(--foreground)]/70">
              Comparing specifications...
            </div>
          ) : (
            result.trim() === '' ? (
              <p className="text-[var(--foreground)] text-center py-4">
                No output generated.
              </p>
            ) : result === 'HTML report opened in a new tab.' ? (
              <p className="text-[var(--foreground)] text-center py-4 text-emerald-500">{result}</p>
            ) : selectedFormat === 'text' ? (
              <pre className="text-sm text-[var(--foreground)] whitespace-pre-wrap font-mono">
                {colorizeOutput(result, selectedMode, file1?.name || 'Base', file2?.name || 'Revision',
                  handleCheckHover,
                  handleCheckLeave
                )}
              </pre>
            ) : selectedFormat === 'json' ? (
              <pre className="text-sm text-[var(--foreground)] whitespace-pre-wrap font-mono">
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(result), null, 2);
                  } catch (e) {
                    console.error("Result is not valid JSON for formatting:", e);
                    return result; // Display raw result if parsing fails
                  }
                })()}
              </pre>
            ) : (
              <pre className="text-sm text-[var(--foreground)] whitespace-pre-wrap font-mono">
                {result}
              </pre>
            )
          )}
        </div>
      )}

      {selectedCheck && (
        <div 
          ref={modalRef}
          className="w-96 overflow-hidden border border-[var(--background-hover)] rounded-lg bg-[var(--background-card)] fixed z-50 pointer-events-auto" 
          style={{ 
            left: modalPosition.x,
            top: modalPosition.y,
            display: isModalVisible ? 'block' : 'none'
          }}
          onMouseEnter={() => setIsModalVisible(true)}
          onMouseLeave={() => setIsModalVisible(false)}
        >
          <>
            <div className="bg-[var(--background-card)] border-b border-[var(--background-hover)]">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="p-3 text-[var(--foreground)] font-bold">{selectedCheck.id}</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="p-6">
              <div className="space-y-1">
                <div className="pb-4">
                  <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Description</h3>
                  <p className="text-[var(--foreground)]">{selectedCheck.description}</p>
                </div>
                {selectedCheck.number && (
                  <p className="text-[var(--foreground)] flex">
                    <strong className="w-20">Serial #:</strong>
                    <span>{selectedCheck.number}</span>
                  </p>
                )}
                <p className="text-[var(--foreground)] flex">
                  <strong className="w-20">Level:</strong>
                  <span>{selectedCheck.level}</span>
                </p>
                <p className="text-[var(--foreground)] flex">
                  <strong className="w-20">Direction:</strong>
                  <span>{selectedCheck.direction}</span>
                </p>
                <p className="text-[var(--foreground)] flex">
                  <strong className="w-20">Location:</strong>
                  <span>{selectedCheck.location}</span>
                </p>
                <p className="text-[var(--foreground)] flex">
                  <strong className="w-20">Action:</strong>
                  <span>{selectedCheck.action}</span>
                </p>
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Details</h3>
                  <p className="text-[var(--foreground)]">{selectedCheck.detailed_description}</p>
                </div>
                {selectedCheck.mitigation && (
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Mitigation</h3>
                    <p className="text-[var(--foreground)]">{selectedCheck.mitigation}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  );
} 