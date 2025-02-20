export function Select({ value, onChange, options = [], placeholder }) {
    return (
      <select value={value} onChange={onChange} className="border p-2 rounded bg-gray-800">
      <option value="">
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
        {option}
        </option>
      ))}
      </select>
    );
  }