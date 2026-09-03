import React from 'react';

export const Input = ({
  label,
  id,
  error,
  icon: Icon,
  className = '',
  type = 'text',
  required = false,
  helperText,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          type={type}
          id={id}
          required={required}
          className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder-ink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 disabled:bg-paper-100 disabled:text-ink-400 ${
            Icon ? 'pl-10' : ''
          } ${
            error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-paper-300'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-ink-500">{helperText}</p>}
    </div>
  );
};
