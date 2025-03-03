export function Input({ className, ...props }) {
    return (
      <input
        className={`border rounded px-3 py-2 w-full  bg-gray-800 ${className}`}
        {...props}
      />
    );
  }