// src/components/ui/Input.jsx
const Input = ({ 
    label, 
    error, 
    helperText,
    className = '',
    ...props 
  }) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          className={`
            w-full px-3 py-2.5 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            transition-all duration-200
            placeholder:text-gray-400
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  };
  
  export default Input;