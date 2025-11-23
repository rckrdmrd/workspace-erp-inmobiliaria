import React from 'react';
import { cn } from '@shared/utils';

export interface InputDetectiveProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  icon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'error' | 'success' | 'warning';
}

const sizeStyles = {
  sm: 'input-detective-sm',
  md: 'input-detective-md',
  lg: 'input-detective-lg',
};

const variantStyles = {
  default: '',
  error: 'input-detective-error',
  success: 'input-detective-success',
  warning: 'input-detective-warning',
};

export const InputDetective = React.forwardRef<HTMLInputElement, InputDetectiveProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      icon,
      inputSize = 'md',
      variant = 'default',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const helperTextId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    // Determine actual variant based on error/success state
    const actualVariant = error ? 'error' : success ? 'success' : variant;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="text-detective-body mb-2 block font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-detective-text-secondary"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperTextId : undefined}
            className={cn(
              'input-detective',
              sizeStyles[inputSize],
              variantStyles[actualVariant],
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} className="text-red-500 text-sm mt-1" role="alert">
            {error}
          </p>
        )}
        {success && !error && (
          <p className="text-green-500 text-sm mt-1">{success}</p>
        )}
        {helperText && !error && !success && (
          <p id={helperTextId} className="text-detective-text-secondary text-sm mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputDetective.displayName = 'InputDetective';
