/**
 * MultiplierWidget Component
 *
 * Real-time display of current multiplier with breakdown and expiration warnings.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Info, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { useMultipliers } from '../hooks/useMultipliers';

export interface MultiplierWidgetProps {
  variant?: 'compact' | 'detailed';
  showBreakdown?: boolean;
  className?: string;
}

/**
 * MultiplierWidget Component
 */
export const MultiplierWidget: React.FC<MultiplierWidgetProps> = ({
  variant = 'compact',
  showBreakdown = true,
  className = '',
}) => {
  const {
    totalMultiplier,
    allSources,
    permanentMultipliers,
    temporaryMultipliers,
    hasExpiringSoon,
    expiringSoon,
    getMultiplierPercentage,
  } = useMultipliers();

  const [isExpanded, setIsExpanded] = useState(false);

  // Format time remaining
  const formatTimeRemaining = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 rounded-full',
          'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
          'shadow-md hover:shadow-lg transition-shadow cursor-pointer',
          className
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Zap className="w-4 h-4" />
        <span className="font-bold text-sm">
          {totalMultiplier.toFixed(2)}x
        </span>
        {hasExpiringSoon && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Clock className="w-3 h-3" />
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-detective-text">
              Multiplicador Activo
            </h3>
            <p className="text-xs text-detective-text-secondary">
              {allSources.length} fuente{allSources.length !== 1 ? 's' : ''} activa
              {allSources.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
            {totalMultiplier.toFixed(2)}x
          </div>
          <div className="text-sm text-detective-text-secondary">
            {getMultiplierPercentage()} bonus
          </div>
        </div>
      </motion.div>

      {/* Expiring Soon Warning */}
      {hasExpiringSoon && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg"
        >
          <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-orange-800">
              {expiringSoon.length} multiplicador{expiringSoon.length !== 1 ? 'es' : ''}{' '}
              expira{expiringSoon.length === 1 ? '' : 'n'} pronto
            </p>
            <p className="text-xs text-orange-600">
              {expiringSoon[0]?.name} - Expira en{' '}
              {expiringSoon[0]?.expiresAt && formatTimeRemaining(expiringSoon[0].expiresAt)}
            </p>
          </div>
        </motion.div>
      )}

      {/* Breakdown Toggle */}
      {showBreakdown && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm text-detective-text-secondary hover:text-detective-text rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            Ver desglose
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <TrendingUp className="w-4 h-4" />
          </motion.div>
        </button>
      )}

      {/* Breakdown Details */}
      <AnimatePresence>
        {isExpanded && showBreakdown && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2 overflow-hidden"
          >
            {/* Permanent Multipliers */}
            {permanentMultipliers.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-detective-text-secondary uppercase">
                  Permanentes
                </h4>
                {permanentMultipliers.map((source, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-detective-text">
                        {source.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-green-700">
                      {source.value.toFixed(2)}x
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Temporary Multipliers */}
            {temporaryMultipliers.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-detective-text-secondary uppercase">
                  Temporales
                </h4>
                {temporaryMultipliers.map((source, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-2 bg-amber-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        <span className="text-sm text-detective-text">
                          {source.name}
                        </span>
                      </div>
                      {source.expiresAt && (
                        <div className="ml-4 text-xs text-detective-text-secondary flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expira en {formatTimeRemaining(source.expiresAt)}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-amber-700">
                      {source.value.toFixed(2)}x
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * CompactMultiplierWidget - Badge version for headers
 */
export const CompactMultiplierWidget: React.FC<MultiplierWidgetProps> = (props) => {
  return <MultiplierWidget {...props} variant="compact" showBreakdown={false} />;
};
