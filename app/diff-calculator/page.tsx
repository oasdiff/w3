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

export function colorizeOutput(text: string, mode: DiffMode, file1Name: string, file2Name: string, onCheckHover: (checkId: string, event: React.MouseEvent) => void, onCheckLeave: () => void): ReactNode[] {
  if (mode === 'diff') return [text];

  return text.split('\n').map((line, i, lines) => {
    // Replace temporary file paths with actual file names
    line = line.replace(/at .*?spec1\.yaml/g, `at ${file1Name}`);
    line = line.replace(/at .*?spec2\.yaml/g, `at ${file2Name}`);

    // Add indentation to lines that should align with the opening bracket above
    if (i > 0 && !line.trim().startsWith('[') && lines[i-1].includes('[')) {
      line = ' '.repeat(8) + line.trimStart();
    }

    // Color the summary line
    if (line.includes('changes:')) {
      const parts = line.split(/(\d+ error|\bwarning\b|\binfo\b)/g);
      return <Fragment key={i}>
        {parts.map((part, index) => {
          if (part.match(/\d+ error/)) {
            const [num, type] = part.split(' ');
            return <span key={index}>{num} <span className="text-red-400">{type}</span></span>;
          }
          if (part === 'warning') return <span key={index} className="text-pink-400">{part}</span>;
          if (part === 'info') return <span key={index} className="text-cyan-400">{part}</span>;
          return part;
        })}
        {'\n'}
      </Fragment>;
    }

    // Color the error/warning/info lines and make check IDs clickable
    if (line.includes('error') || line.includes('warning') || line.includes('info')) {
      const parts = line.split(/(\[.*?\])/g);
      return <Fragment key={i}>
        {parts.map((part, index) => {
          if (part.startsWith('[') && part.endsWith(']')) {
            const checkId = part.slice(1, -1);
            return (
              <span
                key={index}
                className="text-yellow-400 cursor-pointer hover:text-yellow-300"
                style={{ borderBottom: '1px dotted currentColor' }}
                onMouseOver={(e) => onCheckHover(checkId, e)}
                onMouseOut={onCheckLeave}
              >
                {part}
              </span>
            );
          }
          if (part.match(/^(GET|POST|PUT|DELETE|PATCH)/)) {
            return <span key={index} className="text-emerald-400">{part}</span>;
          }
          if (part.includes('error')) {
            return <span key={index} className="text-red-400">{part}</span>;
          }
          if (part.includes('warning')) {
            return <span key={index} className="text-pink-400">{part}</span>;
          }
          if (part.includes('info')) {
            return <span key={index} className="text-cyan-400">{part}</span>;
          }
          return part;
        })}
        {'\n'}
      </Fragment>;
    }

    return <Fragment key={i}>{line}{'\n'}</Fragment>;
  });
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
  const [result, setResult] = useState<string>('');
  const [checks, setChecks] = useState<Check[]>([]);
  const checksRef = useRef<Check[]>([]);
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
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
    
    if (file1 && file2) {
      const formData = new FormData();
      formData.append('file1', file1);
      formData.append('file2', file2);
      formData.append('mode', newMode);

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
          {file1 && (
            <p className="mt-2 text-sm text-[var(--foreground)]/70">
              Selected: {file1.name}
            </p>
          )}
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
          {file2 && (
            <p className="mt-2 text-sm text-[var(--foreground)]/70">
              Selected: {file2.name}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleModeChange('breaking')}
          disabled={!file1 || !file2}
          className={`px-4 py-2 rounded font-medium ${
            mode === 'breaking'
              ? 'bg-emerald-600 text-white'
              : 'bg-[var(--background-card)] text-[var(--foreground)] hover:bg-[var(--background-hover)]'
          } disabled:bg-[var(--background-dark)] disabled:text-[var(--foreground)]/40 disabled:cursor-not-allowed`}
        >
          Breaking Changes
        </button>
        <button
          onClick={() => handleModeChange('changelog')}
          disabled={!file1 || !file2}
          className={`px-4 py-2 rounded font-medium ${
            mode === 'changelog'
              ? 'bg-emerald-600 text-white'
              : 'bg-[var(--background-card)] text-[var(--foreground)] hover:bg-[var(--background-hover)]'
          } disabled:bg-[var(--background-dark)] disabled:text-[var(--foreground)]/40 disabled:cursor-not-allowed`}
        >
          Changelog
        </button>
        <button
          onClick={() => handleModeChange('diff')}
          disabled={!file1 || !file2}
          className={`px-4 py-2 rounded font-medium ${
            mode === 'diff'
              ? 'bg-emerald-600 text-white'
              : 'bg-[var(--background-card)] text-[var(--foreground)] hover:bg-[var(--background-hover)]'
          } disabled:bg-[var(--background-dark)] disabled:text-[var(--foreground)]/40 disabled:cursor-not-allowed`}
        >
          Raw Diff
        </button>
      </div>

      {result && (
        <div className="bg-[var(--background-card)]/50 backdrop-blur-sm rounded p-6 border border-[var(--background-hover)]">
          <pre className="text-sm text-[var(--foreground)] whitespace-pre-wrap">
            {colorizeOutput(result, mode, file1?.name || 'First Specification', file2?.name || 'Second Specification',
              (checkId, event) => {
                const check = checks.find(c => c.id === checkId);
                if (check) {
                  setSelectedCheck(check);
                  setModalPosition({ x: event.clientX + 10, y: event.clientY });
                  if (modalRef.current) {
                    modalRef.current.style.display = 'block';
                  }
                }
                console.log('in');
              },
              () => {
                if (modalRef.current) {
                  modalRef.current.style.display = 'none';
                }
                console.log('out');
              }
            )}
          </pre>
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
            display: 'none'
          }}
          onMouseEnter={() => {
            if (modalRef.current) {
              modalRef.current.style.display = 'block';
            }
          }}
          onMouseLeave={() => {
            if (modalRef.current) {
              modalRef.current.style.display = 'none';
            }
          }}
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