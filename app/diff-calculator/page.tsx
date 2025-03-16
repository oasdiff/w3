"use client";

import { useState, useEffect, useRef, ReactNode, Fragment as ReactFragment, useCallback } from 'react';
import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table';

type DiffMode = 'breaking' | 'changelog' | 'diff';

interface Check {
  id: string;
  level: string;
  direction: string;
  location: string;
  action: string;
  detailed_description: string;
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

function colorizeOutput(text: string, mode: DiffMode, file1Name: string, file2Name: string, onCheckHover: (checkId: string, event: React.MouseEvent) => void, onCheckLeave: () => void): ReactNode[] {
  if (mode === 'diff') return [text];

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
    console.error('Error parsing JSON:', e);
    return [text];
  }
}

export default function DiffCalculator() {
  console.log('DiffCalculator component mounting');

  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [mode, setMode] = useState<DiffMode>('breaking');
  const [processingMode, setProcessingMode] = useState<DiffMode | null>(null);
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [checks, setChecks] = useState<Check[]>([]);
  const checksRef = useRef<Check[]>([]);
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const hasAutoCompared = useRef(false);

  const handleModeChange = useCallback(async (newMode: DiffMode, overrideFile1?: File, overrideFile2?: File) => {
    console.log('handleModeChange called with mode:', newMode, 'files:', { 
      file1: overrideFile1 || file1, 
      file2: overrideFile2 || file2 
    });
    setMode(newMode);
    setResult('');
    setProcessingMode(newMode);
    
    const activeFile1 = overrideFile1 || file1;
    const activeFile2 = overrideFile2 || file2;
    
    if (activeFile1 && activeFile2) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file1', activeFile1);
      formData.append('file2', activeFile2);
      formData.append('mode', newMode);

      try {
        console.log('Sending files to API:', {
          file1Name: activeFile1.name,
          file1Type: activeFile1.type,
          file1Size: activeFile1.size,
          file2Name: activeFile2.name,
          file2Type: activeFile2.type,
          file2Size: activeFile2.size,
          mode: newMode
        });

        const response = await fetch('/api/diff', {
          method: 'POST',
          body: formData,
        });
        
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          const error = await response.text();
          console.error('API Error:', error);
          setResult(`Error: ${error}`);
          return;
        }

        const data = await response.text();
        console.log('API Response data:', data);
        
        // Only update state if we have valid data
        if (data) {
          setResult(data);
          setProcessingMode(null);
        } else {
          console.error('Empty response from API');
          setResult('Error: Empty response from API');
        }
      } catch (error) {
        console.error('Error:', error);
        setResult('Error comparing files');
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('No files available for comparison');
      setProcessingMode(null);
      setIsLoading(false);
    }
  }, [file1, file2]);

  // Store the latest handleModeChange in a ref
  const handleModeChangeRef = useRef(handleModeChange);
  useEffect(() => {
    handleModeChangeRef.current = handleModeChange;
  }, [handleModeChange]);

  // Handle URL parameters
  useEffect(() => {
    console.log('URL Parameters effect running');
    const searchParams = new URLSearchParams(window.location.search);
    const spec1Path = searchParams.get('spec1');
    const spec2Path = searchParams.get('spec2');
    const autoCompare = searchParams.get('compare') === 'true';

    console.log('URL Parameters:', { spec1Path, spec2Path, autoCompare });

    const loadFiles = async () => {
      if (spec1Path && spec2Path) {
        try {
          console.log('Fetching spec files...');
          const [file1Response, file2Response] = await Promise.all([
            fetch(spec1Path + '?' + new Date().getTime()),
            fetch(spec2Path + '?' + new Date().getTime())
          ]);

          console.log('File responses:', {
            file1Status: file1Response.status,
            file2Status: file2Response.status
          });

          if (!file1Response.ok || !file2Response.ok) {
            throw new Error('Failed to fetch spec files');
          }

          const file1Blob = await file1Response.blob();
          const file2Blob = await file2Response.blob();

          console.log('File blobs:', {
            file1Size: file1Blob.size,
            file2Size: file2Blob.size
          });

          const file1 = new File([file1Blob], spec1Path.split('/').pop() || 'spec1.yaml', { type: 'application/yaml' });
          const file2 = new File([file2Blob], spec2Path.split('/').pop() || 'spec2.yaml', { type: 'application/yaml' });

          console.log('Setting files');
          
          // Use Promise.all to wait for both state updates
          await Promise.all([
            new Promise<void>((resolve) => {
              setFile1(file1);
              resolve();
            }),
            new Promise<void>((resolve) => {
              setFile2(file2);
              resolve();
            })
          ]);

          // Wait for React state to be updated
          await new Promise<void>((resolve) => setTimeout(resolve, 100));

          if (autoCompare) {
            console.log('Files set, checking state before comparison:', {
              file1: file1?.name,
              file2: file2?.name
            });
            handleModeChange('breaking', file1, file2);
          }
        } catch (error) {
          console.error('Error loading spec files:', error);
          setResult('Error loading specification files');
          setIsLoading(false);
          setProcessingMode(null);
        }
      } else {
        console.log('No spec files in URL parameters');
      }
    };

    loadFiles();
  }, []); // Remove window.location.search dependency to prevent re-runs

  // Update ref when checks change
  useEffect(() => {
    checksRef.current = checks;
  }, [checks]);

  useEffect(() => {
    // Load checks data
    fetch("/data/checks.json?" + new Date().getTime())
      .then(res => res.json())
      .then(data => setChecks(data))
      .catch(error => console.error('Error loading checks:', error));
  }, []); // Empty dependency array since we only want this to run once

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileNum: 1 | 2) => {
    if (e.target.files && e.target.files[0]) {
      if (fileNum === 1) setFile1(e.target.files[0]);
      else setFile2(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[var(--foreground)]">Diff Calculator</h1>
        <p className="text-lg text-[var(--foreground)]/80">
          Compare OpenAPI specifications and identify breaking changes
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            First OpenAPI Specification
          </label>
          <input
            type="file"
            accept=".yaml,.yml,.json"
            onChange={(e) => handleFileChange(e, 1)}
            className="block w-full text-sm text-[var(--foreground)]
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-medium
              file:bg-emerald-600 file:text-white
              hover:file:bg-emerald-700
              file:cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Second OpenAPI Specification
          </label>
          <input
            type="file"
            accept=".yaml,.yml,.json"
            onChange={(e) => handleFileChange(e, 2)}
            className="block w-full text-sm text-[var(--foreground)]
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-medium
              file:bg-emerald-600 file:text-white
              hover:file:bg-emerald-700
              file:cursor-pointer"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleModeChange('breaking')}
          disabled={!file1 || !file2 || isLoading}
          className={`w-[180px] px-4 py-2 rounded font-medium ${
            mode === 'breaking'
              ? 'bg-emerald-600 text-[var(--foreground)]'
              : 'bg-[var(--background-card)] text-[var(--foreground)] hover:bg-[var(--background-hover)]'
          } disabled:bg-[var(--background-dark)] disabled:text-[var(--foreground)]/40 disabled:cursor-not-allowed`}
        >
          {processingMode === 'breaking' ? 'Processing...' : 'Breaking Changes'}
        </button>
        <button
          onClick={() => handleModeChange('changelog')}
          disabled={!file1 || !file2 || isLoading}
          className={`w-[180px] px-4 py-2 rounded font-medium ${
            mode === 'changelog'
              ? 'bg-emerald-600 text-[var(--foreground)]'
              : 'bg-[var(--background-card)] text-[var(--foreground)] hover:bg-[var(--background-hover)]'
          } disabled:bg-[var(--background-dark)] disabled:text-[var(--foreground)]/40 disabled:cursor-not-allowed`}
        >
          {processingMode === 'changelog' ? 'Processing...' : 'Changelog'}
        </button>
        <button
          onClick={() => handleModeChange('diff')}
          disabled={!file1 || !file2 || isLoading}
          className={`w-[180px] px-4 py-2 rounded font-medium ${
            mode === 'diff'
              ? 'bg-emerald-600 text-[var(--foreground)]'
              : 'bg-[var(--background-card)] text-[var(--foreground)] hover:bg-[var(--background-hover)]'
          } disabled:bg-[var(--background-dark)] disabled:text-[var(--foreground)]/40 disabled:cursor-not-allowed`}
        >
          {processingMode === 'diff' ? 'Processing...' : 'Raw Diff'}
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-4 text-[var(--foreground)]/70">
          Comparing specifications...
        </div>
      )}

      {result && !isLoading && (
        <div className="bg-[var(--background-card)]/50 backdrop-blur-sm rounded p-6 border border-[var(--background-hover)]">
          {result.trim() === '' ? (
            <p className="text-[var(--foreground)] text-center py-4">
              No differences found between the specifications.
            </p>
          ) : (
            <pre className="text-sm text-[var(--foreground)] whitespace-pre-wrap font-mono">
              {colorizeOutput(result, mode, file1?.name || 'First Specification', file2?.name || 'Second Specification',
                (checkId, event) => {
                  const check = checks.find(c => c.id === checkId);
                  if (check) {
                    setSelectedCheck(check);
                    // Calculate position considering viewport boundaries
                    const viewportHeight = window.innerHeight;
                    const tooltipHeight = 300; // Approximate height of the tooltip
                    const yPosition = event.clientY + tooltipHeight > viewportHeight
                      ? Math.max(viewportHeight - tooltipHeight - 10, 10) // Keep 10px margin from top/bottom
                      : event.clientY;
                    setModalPosition({ x: event.clientX + 10, y: yPosition });
                    setIsModalVisible(true);
                  }
                },
                () => {
                  setIsModalVisible(false);
                }
              )}
            </pre>
          )}
        </div>
      )}

      {selectedCheck && (
        <div 
          ref={modalRef}
          className="w-96 overflow-hidden border border-[var(--background-hover)] rounded-lg bg-[var(--background-card)]" 
          style={{ 
            position: 'fixed', 
            left: modalPosition.x, 
            top: modalPosition.y,
            zIndex: 50,
            pointerEvents: 'auto',
            display: isModalVisible ? 'block' : 'none'
          }}
          onMouseEnter={() => setIsModalVisible(true)}
          onMouseLeave={() => setIsModalVisible(false)}
        >
          <>
            {/* Header section */}
            <div className="bg-[var(--background-card)] border-b border-[var(--background-hover)]">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="p-3 text-[var(--foreground)] font-bold">{selectedCheck.id}</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            {/* Content section */}
            <div className="p-6">
              <div className="space-y-1">
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
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  );
} 