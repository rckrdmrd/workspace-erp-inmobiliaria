import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@shared/utils';

export interface DetectiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'blue' | 'green' | 'purple' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode;
  as?: 'button' | 'a' | 'span';
}

const sizeStyles = {
  sm: 'py-1.5 px-3 text-detective-sm',
  md: 'py-2 px-4 text-detective-base',
  lg: 'py-3 px-6 text-detective-lg',
};

const variantStyles = {
  primary: 'btn-detective', // Uses detective-theme.css
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-2 border-gray-500',
  gold: 'btn-gold', // Uses detective-theme.css
  blue: 'btn-blue', // Uses detective-theme.css
  green: 'btn-green', // Uses detective-theme.css
  purple: 'btn-purple', // Uses detective-theme.css
  danger: 'btn-danger', // Uses detective-theme.css
  outline: 'border-2 border-detective-orange text-detective-orange hover:bg-detective-orange hover:text-white',
  ghost: 'text-detective-orange hover:bg-detective-bg',
};

const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn('animate-spin h-4 w-4', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const DetectiveButton = React.forwardRef<HTMLButtonElement, DetectiveButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      className,
      children,
      leftIcon,
      rightIcon,
      icon,
      type = 'button',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-pressed': ariaPressed,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Auto-generate aria-label for icon-only buttons
    const computedAriaLabel = ariaLabel || ((icon || leftIcon || rightIcon) && !children ? 'Botón' : undefined);

    // Display icon (leftIcon takes precedence, then icon)
    const displayIcon = leftIcon || icon;

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-label={computedAriaLabel}
        aria-describedby={ariaDescribedby}
        aria-pressed={ariaPressed}
        aria-busy={loading}
        aria-disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-detective-orange focus:ring-offset-2',
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          // Disabled state
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        {...(props as any)}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            <span className="sr-only">Cargando...</span>
          </>
        ) : (
          <>
            {displayIcon && <span className="flex items-center" aria-hidden="true">{displayIcon}</span>}
            {children}
            {rightIcon && !leftIcon && !icon && <span className="flex items-center" aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

DetectiveButton.displayName = 'DetectiveButton';
