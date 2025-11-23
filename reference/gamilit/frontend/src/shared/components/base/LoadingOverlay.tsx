import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  variant?: 'full' | 'inline';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Cargando...',
  variant = 'full',
}) => {
  if (variant === 'inline') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center p-8"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-detective-orange" aria-hidden="true" />
              <p className="text-detective-text-secondary text-detective-sm">{message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="loading-overlay" // Uses detective-theme.css
          role="dialog"
          aria-modal="true"
          aria-label={message}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="loading-modal" // Uses detective-theme.css
          >
            <Loader2
              className="w-12 h-12 animate-spin text-detective-orange mx-auto mb-4"
              aria-hidden="true"
            />
            <p className="text-detective-text font-medium">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Skeleton loader for cards and content
export interface SkeletonProps {
  variant?: 'text' | 'card' | 'circle' | 'rectangle';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const variantStyles = {
    text: 'h-4 rounded',
    card: 'h-32 rounded-lg',
    circle: 'rounded-full',
    rectangle: 'rounded-md',
  };

  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`skeleton ${variantStyles[variant]} ${className} mb-2`}
            style={{ width, height }}
            aria-hidden="true"
          />
        ))}
      </>
    );
  }

  return (
    <div
      className={`skeleton ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};
