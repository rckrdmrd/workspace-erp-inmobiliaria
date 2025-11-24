import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Calendar } from 'lucide-react';
import { TimelineEvent as TimelineEventType } from './timelineTypes';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';

export interface TimelineEventProps {
  event: TimelineEventType;
  index: number;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({ event, index }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="cursor-move">
      <DetectiveCard variant="default" padding="md" className="flex items-center gap-4">
        <GripVertical className="w-5 h-5 text-gray-400" />
        <div className="flex items-center gap-3 w-12 h-12 bg-detective-orange text-white rounded-full justify-center font-bold">
          {index + 1}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-detective-text">{event.title}</h4>
          <p className="text-sm text-detective-text-secondary">{event.description}</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
          <Calendar className="w-4 h-4" />
          <span className="hidden">{event.year}</span>
        </div>
      </DetectiveCard>
    </motion.div>
  );
};
