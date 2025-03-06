export function Select({ value, onChange, options = [], placeholder }) {
    return (
      <select 
        value={value} 
        onChange={onChange} 
        className="border border-[var(--border-color)] p-2 rounded bg-[var(--background-card)] text-[var(--foreground)]"
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