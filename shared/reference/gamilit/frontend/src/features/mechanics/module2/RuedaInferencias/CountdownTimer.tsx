/**
 * CountdownTimer Component
 *
 * @description Visual countdown timer with progress bar and color variants
 * @task FE-071
 */

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import type { CountdownTimerProps } from './ruedaInferenciasTypes';

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration,
  isRunning,
  onComplete,
  onTick,
  variant = 'default',
}) => {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;

        if (next <= 0) {
          clearInterval(interval);
          onComplete();
          return 0;
        }

        if (onTick) {
          onTick(next);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete, onTick]);

  // Calculate progress percentage
  const progress = (remaining / duration) * 100;

  // Determine color variant based on remaining time
  const getVariant = () => {
    if (variant !== 'default') return variant;
    if (remaining <= 5) return 'danger';
    if (remaining <= 10) return 'warning';
    return 'default';
  };

  const currentVariant = getVariant();

  const variantStyles = {
    default: {
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      border: 'border-blue-400',
      progress: 'bg-blue-500',
    },
    warning: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-600',
      border: 'border-yellow-400',
      progress: 'bg-yellow-500',
    },
    danger: {
      bg: 'bg-red-500',
      text: 'text-red-600',
      border: 'border-red-400',
      progress: 'bg-red-500',
    },
  };

  const styles = variantStyles[currentVariant];

  return (
    <div className={`bg-white rounded-lg shadow-md border-2 ${styles.border} p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${styles.text}`} />
          <span className="font-semibold text-gray-700">Tiempo Restante</span>
        </div>
        <div
          className={`text-2xl font-bold ${styles.text} ${
            currentVariant === 'danger' && isRunning ? 'animate-pulse' : ''
          }`}
        >
          {remaining}s
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${styles.progress} ${
            currentVariant === 'danger' ? 'animate-pulse' : ''
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Warning Message */}
      {currentVariant === 'danger' && isRunning && (
        <div className="mt-3 text-center text-red-600 text-sm font-semibold animate-bounce">
          ⏰ ¡Tiempo casi agotado!
        </div>
      )}

      {/* Completed Message */}
      {remaining === 0 && (
        <div className="mt-3 text-center text-gray-500 text-sm font-semibold">
          ⏱️ Tiempo terminado
        </div>
      )}
    </div>
  );
};
