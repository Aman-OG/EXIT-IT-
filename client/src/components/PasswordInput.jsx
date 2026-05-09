import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = 'Enter password',
  className = '',
  required = false,
  name = 'password'
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        required={required}
        className="w-full px-4 py-3 pr-12 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text/60 hover:text-primary transition-colors duration-200 p-1"
        tabIndex="-1"
      >
        {showPassword ? (
          <EyeOff size={20} strokeWidth={2} />
        ) : (
          <Eye size={20} strokeWidth={2} />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
