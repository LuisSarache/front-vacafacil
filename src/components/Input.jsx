import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({ label, type = 'text', error, className = '', id, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  
  const getAutocomplete = () => {
    if (props.autoComplete) return props.autoComplete;
    if (type === 'email') return 'email';
    if (type === 'password') return 'current-password';
    return undefined;
  };

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-dark">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          className={`w-full px-3 py-2 bg-white border-2 border-gray-400 rounded-lg text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${error ? 'border-red-500' : ''} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
          autoComplete={getAutocomplete()}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-medium hover:text-dark transition-colors"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            tabIndex={0}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
