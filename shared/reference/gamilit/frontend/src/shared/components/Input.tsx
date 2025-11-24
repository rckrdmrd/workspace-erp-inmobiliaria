import React from 'react';
import { cn } from '@shared/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, disabled, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              // Base styles
              'w-full border rounded-md px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2',
              // Icon padding adjustment
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              // Default state
              !error && 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
              // Error state
              error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
              // Success state (when no error)
              !error && !disabled && 'hover:border-gray-400',
              // Disabled state
              disabled && 'bg-gray-100 cursor-not-allowed text-gray-500 border-gray-200',
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-1" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-gray-500 text-sm mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
