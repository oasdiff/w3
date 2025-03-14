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
    <div className="border border-gray-700/50 rounded-xl overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 flex justify-between items-center bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
      >
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <ChevronDownIcon 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-800/10">
          {children}
        </div>
      )}
    </div>
  );
} 