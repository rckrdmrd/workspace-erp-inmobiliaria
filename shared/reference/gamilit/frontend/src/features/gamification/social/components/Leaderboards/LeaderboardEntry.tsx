/**
 * LeaderboardEntry Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { LeaderboardEntry as Entry } from '../../types/leaderboardsTypes';

interface LeaderboardEntryProps {
  entry: Entry;
  index: number;
}

const getRankColor = (rank: number) => {
  if (rank === 1) return 'from-yellow-400 to-yellow-600';
  if (rank === 2) return 'from-gray-300 to-gray-500';
  if (rank === 3) return 'from-orange-400 to-orange-600';
  return 'from-detective-blue to-detective-orange';
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return Icons.Crown;
  if (rank === 2) return Icons.Medal;
  if (rank === 3) return Icons.Award;
  return Icons.User;
};

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({ entry, index }) => {
  const RankIcon = getRankIcon(entry.rank);
  const isTopThree = entry.rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center gap-4 p-4 rounded-detective transition-all ${
        entry.isCurrentUser
          ? 'bg-detective-orange bg-opacity-10 border-2 border-detective-orange shadow-orange'
          : 'bg-white hover:shadow-card'
      }`}
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-white ${
        isTopThree ? `bg-gradient-to-br ${getRankColor(entry.rank)}` : 'bg-detective-blue'
      }`}>
        {isTopThree ? <RankIcon className="w-6 h-6" /> : <span className="text-lg">#{entry.rank}</span>}
      </div>

      <img
        src={entry.avatar}
        alt={entry.username}
        className="w-12 h-12 rounded-full object-cover"
        onError={(e) => {
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.username)}&background=f97316&color=fff`;
        }}
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-detective-text truncate">{entry.username}</p>
        <p className="text-detective-sm text-detective-text-secondary">{entry.rankBadge}</p>
      </div>

      <div className="text-right">
        <p className="font-bold text-detective-text text-lg">{entry.score.toLocaleString()}</p>
        <div className="flex items-center gap-1 justify-end">
          {entry.changeType === 'up' && <Icons.TrendingUp className="w-4 h-4 text-green-500" />}
          {entry.changeType === 'down' && <Icons.TrendingDown className="w-4 h-4 text-red-500" />}
          {entry.changeType === 'same' && <Icons.Minus className="w-4 h-4 text-gray-400" />}
          {entry.changeType === 'new' && <Icons.Sparkles className="w-4 h-4 text-detective-gold" />}
          <span className={`text-detective-sm ${
            entry.changeType === 'up' ? 'text-green-500' :
            entry.changeType === 'down' ? 'text-red-500' :
            'text-gray-400'
          }`}>
            {Math.abs(entry.change) > 0 ? Math.abs(entry.change) : '-'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
