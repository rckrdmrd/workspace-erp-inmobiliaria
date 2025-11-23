/**
 * EnhancedCard Component
 *
 * Reusable card component based on MissionCard styling patterns.
 * Provides a flexible, animated card with multiple variants and hover effects.
 *
 * Features:
 * - Multiple color variants (default, primary, success, warning, danger, info)
 * - Configurable padding levels (none, sm, md, lg)
 * - Optional hover animation with elevation effect
 * - Smooth transitions and entrance animations
 * - Framer Motion powered animations
 * - Responsive and accessible
 * - Click handler support
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@shared/utils';

export interface EnhancedCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: {
    border: 'border-gray-300',
    shadow: '',
  },
  primary: {
    border: 'border-blue-400',
    shadow: 'shadow-blue-200',
  },
  success: {
    border: 'border-green-400',
    shadow: 'shadow-green-200',
  },
  warning: {
    border: 'border-yellow-400',
    shadow: 'shadow-yellow-200',
  },
  danger: {
    border: 'border-red-400',
    shadow: 'shadow-red-200',
  },
  info: {
    border: 'border-cyan-400',
    shadow: 'shadow-cyan-200',
  },
};

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  (
    {
      children,
      variant = 'default',
      hover = true,
      className,
      onClick,
      padding = 'md',
    },
    ref
  ) => {
    const styles = variantStyles[variant];

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={hover ? { y: -5 } : undefined}
        onClick={onClick}
        className={cn(
          // Base styles
          'bg-white rounded-xl shadow-md overflow-hidden',
          'border-2 transition-all duration-300',
          // Variant styles
          styles.border,
          styles.shadow,
          // Padding
          paddingStyles[padding],
          // Clickable cursor
          onClick && 'cursor-pointer',
          // Custom classes
          className
        )}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        {children}
      </motion.div>
    );
  }
);

EnhancedCard.displayName = 'EnhancedCard';
