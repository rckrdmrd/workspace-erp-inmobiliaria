/**
 * CooldownTimer Component
 */

import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

interface CooldownTimerProps {
  cooldownEndsAt: Date;
  onComplete?: () => void;
}

export const CooldownTimer: React.FC<CooldownTimerProps> = ({ cooldownEndsAt, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, cooldownEndsAt.getTime() - now);
      setTimeLeft(remaining);

      if (remaining === 0 && onComplete) {
        onComplete();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [cooldownEndsAt, onComplete]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="flex items-center gap-1 text-detective-text-secondary">
      <Icons.Clock className="w-4 h-4" />
      <span className="text-detective-sm font-mono">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};
