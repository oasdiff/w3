export function Button({ children, size = "md", ...props }) {
    return (
      <button
        className={`px-4 py-2 bg-blue-500 text-white rounded ${size === "sm" ? "text-sm" : "text-md"}`}
        {...props}
      >
        {children}
      </button>
    );
  }