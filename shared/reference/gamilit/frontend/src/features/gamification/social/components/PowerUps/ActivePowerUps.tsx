/**
 * ActivePowerUps Component
 * Shows currently active power-ups
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Sparkles, type LucideIcon } from 'lucide-react';
import { usePowerUps } from '../../hooks/usePowerUps';

// Icon mapping helper
const iconMap: Record<string, LucideIcon> = {
  Zap,
  Clock,
  Sparkles,
};

export const ActivePowerUps: React.FC = () => {
  const { getActivePowerUps } = usePowerUps();
  const [activePowerUps, setActivePowerUps] = useState(getActivePowerUps());

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePowerUps(getActivePowerUps());
    }, 1000);

    return () => clearInterval(interval);
  }, [getActivePowerUps]);

  if (activePowerUps.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 space-y-2">
      <AnimatePresence>
        {activePowerUps.map((powerUp) => {
          const Icon = iconMap[powerUp.icon] || Zap;
          const remainingMinutes = Math.ceil(powerUp.remainingTime / 60);

          return (
            <motion.div
              key={powerUp.powerUpId}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white rounded-detective shadow-detective p-3 flex items-center gap-3 min-w-[200px]"
            >
              <div className="bg-gradient-to-br from-detective-orange to-detective-gold p-2 rounded-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-detective-text text-detective-sm">
                  {powerUp.name}
                </p>
                <div className="flex items-center gap-1 text-detective-xs text-detective-text-secondary">
                  <Clock className="w-3 h-3" />
                  <span>{remainingMinutes} min restantes</span>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-detective-gold animate-pulse" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
