import { ChangeEvent } from 'react';

interface SelectProps {
  id?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options?: string[];
  placeholder?: string;
  className?: string;
}

export function Select({ id, value, onChange, options = [], placeholder, className = "" }: SelectProps) {
  return (
    <select 
      id={id}
      value={value} 
      onChange={onChange} 
      className={`border border-[var(--border-color)] p-2 rounded bg-[var(--background-card)] text-[var(--foreground)] w-full ${className}`}
    >
      <option value="" className="bg-[var(--background-card)] text-[var(--foreground)]">
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option} value={option} className="bg-[var(--background-card)] text-[var(--foreground)]">
          {option}
        </option>
      ))}
    </select>
  );
} 