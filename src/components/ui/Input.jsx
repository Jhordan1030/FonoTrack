// src/components/ui/Input.jsx
const Input = ({ 
    icon: Icon, 
    className = '', 
    ...props 
  }) => {
    return (
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={16} className="text-gray-400" />
          </div>
        )}
        <input
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            placeholder-gray-400
            ${Icon ? 'pl-10' : 'pl-3'}
            ${className}
          `}
          {...props}
        />
      </div>
    );
  };
  
  export default Input;