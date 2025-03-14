"use client";

import { useState, useEffect, useRef, ReactNode, Fragment } from 'react';
import { Modal } from '../components/ui/modal';

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

export function colorizeOutput(text: string, mode: DiffMode, file1Name: string, file2Name: string, onCheckHover: (checkId: string, event: React.MouseEvent) => void, onCheckLeave: () => void): ReactNode[] {
  if (mode === 'diff') return [text];

  try {
    const jsonData = JSON.parse(text) as DiffResponse;
    const lines: ReactNode[] = [];

    // Handle the changes array
    if (jsonData.changes && Array.isArray(jsonData.changes)) {
      jsonData.changes.forEach((item: Change, index: number) => {
        // First line: error/warning/info with check ID
        const levelText = item.level === 3 ? 'info' : item.level === 2 ? 'warning' : 'error';
        const levelColor = item.level === 3 ? 'text-cyan-400' : item.level === 2 ? 'text-pink-400' : 'text-red-400';
        
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
          <Fragment key={`first-${index}`}>
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
          </Fragment>
        );

        // Second line: in API operation path
        if (item.operation && item.path) {
          lines.push(
            <Fragment key={`second-${index}`}>
              {'      in API '}
              <span className="text-emerald-400">{item.operation}</span>
              {' '}
              <span className="text-emerald-400">{item.path}</span>
              {'\n'}
            </Fragment>
          );
        }

        // Third line: the actual change text
        lines.push(
          <Fragment key={`third-${index}`}>
            {'          '}{item.text}{'\n'}
          </Fragment>
        );

        // Fourth line (if present): the comment
        if (item.comment) {
          lines.push(
            <Fragment key={`fourth-${index}`}>
              {'          '}{item.comment}{'\n'}
            </Fragment>
          );
        }

        // Add a blank line between items unless it's the last item
        if (index < jsonData.changes.length - 1) {
          lines.push(<Fragment key={`space-${index}`}>{'\n'}</Fragment>);
        }
      });
    }

    return lines;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return [text];
  }
}

interface Window {
  handleCheckClick?: (checkId: string) => void;
  handleCheckHover?: (checkId: string, event: MouseEvent) => void;
  handleCheckLeave?: () => void;
  hideTimeout?: NodeJS.Timeout;
}

export default function DiffCalculator() {
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

  const handleModeChange = async (newMode: DiffMode) => {
    setMode(newMode);
    setResult('');
    setProcessingMode(newMode);
    
    if (file1 && file2) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file1', file1);
      formData.append('file2', file2);
      formData.append('mode', newMode);

      try {
        const response = await fetch('/api/diff', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const error = await response.text();
          setResult(`Error: ${error}`);
          return;
        }

        const data = await response.text();
        setResult(data);
      } catch (error) {
        console.error('Error:', error);
        setResult('Error comparing files');
      } finally {
        setIsLoading(false);
        setProcessingMode(null);
      }
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
                    setModalPosition({ x: event.clientX + 10, y: event.clientY });
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
          className="space-y-4 bg-[var(--background-card)] rounded-lg shadow-lg p-4 max-w-sm border border-[var(--background-hover)]" 
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
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">{selectedCheck.id}</h2>
            <div className="space-y-2">
              <p className="text-[var(--foreground)]"><strong>Level:</strong> {selectedCheck.level}</p>
              <p className="text-[var(--foreground)]"><strong>Direction:</strong> {selectedCheck.direction}</p>
              <p className="text-[var(--foreground)]"><strong>Location:</strong> {selectedCheck.location}</p>
              <p className="text-[var(--foreground)]"><strong>Action:</strong> {selectedCheck.action}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Details</h3>
              <p className="text-[var(--foreground)]">{selectedCheck.detailed_description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 