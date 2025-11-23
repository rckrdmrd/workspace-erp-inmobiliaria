/**
 * LeaderboardLayout Component
 * Main layout wrapper for leaderboard display
 */

import React from 'react';
import { motion } from 'framer-motion';
import { LeaderboardEntry } from './LeaderboardEntry';
import type { LeaderboardEntry as Entry } from '../../types/leaderboardsTypes';

interface LeaderboardLayoutProps {
  entries: Entry[];
  showTopThree?: boolean;
  highlightUser?: boolean;
}

export const LeaderboardLayout: React.FC<LeaderboardLayoutProps> = ({
  entries,
  showTopThree = true,
  highlightUser = true,
}) => {
  const topThree = showTopThree ? entries.slice(0, 3) : [];
  const remaining = showTopThree ? entries.slice(3) : entries;

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      {showTopThree && topThree.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          {topThree[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center pt-8"
            >
              <div className="relative mb-4">
                <img
                  src={topThree[1].avatar}
                  alt={topThree[1].username}
                  className="w-20 h-20 rounded-full border-4 border-gray-400 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[1].username)}&background=9ca3af&color=fff`;
                  }}
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  2
                </div>
              </div>
              <h3 className="font-bold text-detective-text text-center truncate w-full px-2">
                {topThree[1].username}
              </h3>
              <p className="text-detective-sm text-detective-text-secondary">{topThree[1].rankBadge}</p>
              <p className="text-detective-lg font-bold text-detective-text mt-2">
                {topThree[1].score.toLocaleString()}
              </p>
            </motion.div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl"
                  >
                    =Q
                  </motion.div>
                </div>
                <img
                  src={topThree[0].avatar}
                  alt={topThree[0].username}
                  className="w-24 h-24 rounded-full border-4 border-yellow-400 object-cover shadow-xl"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[0].username)}&background=fbbf24&color=fff`;
                  }}
                />
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl animate-gold-shine">
                  1
                </div>
              </div>
              <h3 className="font-bold text-detective-text text-lg text-center truncate w-full px-2">
                {topThree[0].username}
              </h3>
              <p className="text-detective-sm text-detective-text-secondary">{topThree[0].rankBadge}</p>
              <p className="text-detective-xl font-bold text-detective-gold mt-2">
                {topThree[0].score.toLocaleString()}
              </p>
            </motion.div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center pt-12"
            >
              <div className="relative mb-4">
                <img
                  src={topThree[2].avatar}
                  alt={topThree[2].username}
                  className="w-20 h-20 rounded-full border-4 border-orange-400 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[2].username)}&background=fb923c&color=fff`;
                  }}
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  3
                </div>
              </div>
              <h3 className="font-bold text-detective-text text-center truncate w-full px-2">
                {topThree[2].username}
              </h3>
              <p className="text-detective-sm text-detective-text-secondary">{topThree[2].rankBadge}</p>
              <p className="text-detective-lg font-bold text-detective-text mt-2">
                {topThree[2].score.toLocaleString()}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Remaining Entries */}
      <div className="space-y-2">
        {remaining.map((entry, index) => (
          <LeaderboardEntry key={entry.userId} entry={entry} index={index} />
        ))}
      </div>
    </div>
  );
};
