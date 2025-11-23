import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@shared/utils';

export interface DetectiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'exercise' | 'mystery' | 'info' | 'success' | 'danger';
  children: React.ReactNode;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  as?: React.ElementType;
}

const variantStyles = {
  default: 'detective-card', // Uses detective-theme.css
  gold: 'card-gold', // Uses detective-theme.css
  exercise: 'card-exercise', // Uses detective-theme.css
  mystery: 'card-mystery', // Uses detective-theme.css
  info: 'detective-card', // Uses detective-theme.css (same as default for now)
  success: 'detective-card', // Uses detective-theme.css (same as default for now)
  danger: 'detective-card', // Uses detective-theme.css (same as default for now)
};

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

export const DetectiveCard = React.forwardRef<HTMLDivElement, DetectiveCardProps>(
  (
    {
      variant = 'default',
      children,
      className,
      hoverable = true,
      padding = 'md',
      onClick,
      as,
      ...props
    },
    ref
  ) => {
    const isExerciseCard = variant === 'exercise';
    const isClickable = !!onClick;

    // Use motion.div only if clickable or hoverable, otherwise regular div for performance
    const Component = isClickable || hoverable ? motion.div : 'div';

    const motionProps =
      isClickable || hoverable
        ? {
            whileHover: hoverable
              ? {
                  scale: 1.01,
                  y: isExerciseCard ? -4 : -2,
                  transition: { duration: 0.2 },
                }
              : undefined,
            whileTap: isClickable ? { scale: 0.98 } : undefined,
          }
        : {};

    return (
      <Component
        ref={ref as any}
        onClick={onClick}
        className={cn(
          // Variant styles from detective-theme.css
          variantStyles[variant],
          // Padding styles
          paddingStyles[padding],
          // Clickable state
          isClickable && 'cursor-pointer',
          // Custom className
          className
        )}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={
          isClickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick?.(e as any);
                }
              }
            : undefined
        }
        {...(motionProps as any)}
        {...(props as any)}
      >
        {children}
      </Component>
    );
  }
);

DetectiveCard.displayName = 'DetectiveCard';
