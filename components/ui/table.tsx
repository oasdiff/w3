import { ReactNode, MouseEvent } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLTableRowElement>) => void;
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return <table className={`w-full border-collapse rounded-lg ${className}`}>{children}</table>;
}

export function TableHeader({ children, className = "" }: TableHeaderProps) {
  return <thead className={`rounded-t-lg overflow-hidden ${className}`}>{children}</thead>;
}

export function TableRow({ children, className, onClick }: TableRowProps) {
  return (
    <tr className={className} onClick={onClick}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "" }: TableHeadProps) {
  return <th className={`text-left ${className}`}>{children}</th>;
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody>{children}</tbody>;
}

export function TableCell({ children, className = "" }: TableCellProps) {
  return <td className={`${className}`}>{children}</td>;
} 