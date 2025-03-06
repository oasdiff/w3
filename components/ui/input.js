export function Input({ className, ...props }) {
    return (
      <input
        className={`border border-[var(--border-color)] rounded px-3 py-2 w-full bg-[var(--background-card)] text-[var(--foreground)] placeholder:text-[var(--foreground)]/50 ${className}`}
        {...props}
      />
    );
  }