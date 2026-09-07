import React, { forwardRef } from 'react';

/**
 * Reusable Input component with labels, errors, icons, and accessible focus states.
 */
export const Input = forwardRef(({
  label,
  id,
  type = 'text',
  error,
  helperText,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-lab-text-secondary uppercase tracking-wider mb-1.5"
        >
          {label}
          {required && <span className="text-lab-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-lab-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`
            w-full bg-lab-surface border rounded-lg px-3.5 py-2.5 text-sm text-lab-text-primary placeholder:text-lab-text-muted
            transition-colors duration-150
            focus:outline-none focus:ring-1
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-lab-secondary/50
            ${Icon ? 'pl-9' : ''}
            ${error
              ? 'border-lab-danger/70 focus:border-lab-danger focus:ring-lab-danger/50 text-lab-text-primary'
              : 'border-lab-border focus:border-lab-accent focus:ring-lab-accent/40 hover:border-lab-border-light'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-lab-danger flex items-center gap-1">
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-lab-text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
