"use client";

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Collapsible({ title, children, open, onOpenChange }: CollapsibleProps) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = open ?? isOpenInternal;

  const handleToggle = () => {
    const newState = !isOpen;
    onOpenChange?.(newState);
    if (!onOpenChange) {
      setIsOpenInternal(newState);
    }
  };

  return (
    <div className="border border-[var(--border-color)] rounded-md overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 flex justify-between items-center bg-[var(--background-card)] hover:bg-[var(--background-hover)] transition-colors"
      >
        <h3 className="text-xl font-semibold text-[var(--foreground)]">{title}</h3>
        <ChevronDownIcon 
          className={`w-5 h-5 text-[var(--foreground)]/60 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-[var(--background)]">
          {children}
        </div>
      )}
    </div>
  );
} 