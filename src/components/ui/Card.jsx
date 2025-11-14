// src/components/ui/Card.jsx
const Card = ({ children, className = '', hover = false }) => {
    return (
      <div className={`
        bg-white rounded-xl shadow-sm border border-gray-200 
        ${hover ? 'hover:shadow-md hover:border-gray-300' : ''}
        transition-all duration-200
        ${className}
      `}>
        {children}
      </div>
    );
  };
  
  export const CardHeader = ({ children, className = '' }) => (
    <div className={`p-6 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
  
  export const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
  
  export const CardFooter = ({ children, className = '' }) => (
    <div className={`p-6 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
  
  export default Card;