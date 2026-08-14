import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = 'Enter password',
  className = '',
  inputClassName = '',
  required = false,
  name = 'password'
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Consistent Left Lock Icon */}
      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
      
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        required={required}
        className={`w-full pl-11 pr-11 py-3 rounded-xl border border-text/10 bg-background text-text text-sm placeholder-text/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${inputClassName}`}
      />
      
      {/* Eye Toggle */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text/40 hover:text-text transition-colors p-1 rounded-md focus:outline-none"
        tabIndex="-1"
        title={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff size={16} />
        ) : (
          <Eye size={16} />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
