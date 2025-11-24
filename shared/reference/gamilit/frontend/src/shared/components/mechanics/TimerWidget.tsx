/**
 * Timer Widget Component
 * Displays elapsed time for exercises
 *
 * TODO: Stub component - needs full implementation
 */

import React from 'react';
import { Clock } from 'lucide-react';

export interface TimerWidgetProps {
  startTime: number;
  isPaused?: boolean;
  showSeconds?: boolean;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({
  startTime,
  isPaused = false,
  showSeconds = true,
}) => {
  const [elapsedTime, setElapsedTime] = React.useState(0);

  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPaused]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }
    if (showSeconds) {
      return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
    }
    return `${minutes} min`;
  };

  return (
    <div className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg">
      <Clock className="w-4 h-4" />
      <span className="text-sm font-medium">{formatTime(elapsedTime)}</span>
    </div>
  );
};

export default TimerWidget;
