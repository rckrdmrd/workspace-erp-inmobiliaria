import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@shared/utils';

export interface ProgressBarProps {
  progress: number; // 0-100
  variant?: 'detective' | 'xp';
  showLabel?: boolean;
  label?: string;
  className?: string;
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const heightStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3',
};

const variantStyles = {
  detective: 'progress-detective', // Uses detective-theme.css
  xp: 'progress-xp', // Uses detective-theme.css
};

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      progress,
      variant = 'detective',
      showLabel = false,
      label,
      className,
      height = 'md',
      animated = true,
    },
    ref
  ) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
      <div ref={ref} className={cn('w-full', className)}>
        {showLabel && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-detective-small">{label || 'Progreso'}</span>
            <span className="text-detective-small font-medium">{clampedProgress}%</span>
          </div>
        )}
        <div
          className={cn(variantStyles[variant], heightStyles[height])}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || 'Progreso'}
        >
          {animated ? (
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${clampedProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          ) : (
            <div className="progress-fill" style={{ width: `${clampedProgress}%` }} />
          )}
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
