import React from 'react';
import { Trophy, Flame, Medal, Crown, Loader } from 'lucide-react';
import { Avatar } from './Avatar';
import { cn } from '@shared/utils';
import { formatXP, formatStreak, formatRank } from '@/shared/utils/format.util';
import type { LeaderboardEntry, RANK_LABELS, RANK_COLORS, RANK_ICONS } from '@/shared/types/leaderboard.types';
import { MayaRank } from '@/shared/constants/ranks.constants';

/**
 * LeaderboardTable Props
 */
interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  isLoading?: boolean;
  className?: string;
}

/**
 * Get rank color - Updated to use official Maya Ranks
 * @see ET-GAM-003-rangos-maya.md
 */
const getRankColor = (rank: MayaRank): string => {
  const colors: Record<MayaRank, string> = {
    [MayaRank.AJAW]: 'text-brown-600',
    [MayaRank.NACOM]: 'text-bronze-600',
    [MayaRank.AH_KIN]: 'text-silver-600',
    [MayaRank.HALACH_UINIC]: 'text-yellow-600',
    [MayaRank.KUKUKULKAN]: 'text-purple-600',
  };
  return colors[rank] || 'text-gray-600';
};

/**
 * Get rank label - Updated to use official Maya Ranks
 */
const getRankLabel = (rank: MayaRank): string => {
  const labels: Record<MayaRank, string> = {
    [MayaRank.AJAW]: 'Ajaw',
    [MayaRank.NACOM]: 'Nacom',
    [MayaRank.AH_KIN]: "Ah K'in",
    [MayaRank.HALACH_UINIC]: 'Halach Uinic',
    [MayaRank.KUKUKULKAN]: "K'uk'ulkan",
  };
  return labels[rank] || String(rank);
};

/**
 * Get rank position badge
 */
const getRankBadge = (rank: number): React.ReactNode => {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
};

/**
 * Skeleton Loading Row
 */
const SkeletonRow: React.FC = () => (
  <tr className="border-b border-gray-200 animate-pulse">
    <td className="px-6 py-4">
      <div className="w-8 h-8 bg-gray-200 rounded" />
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="w-32 h-4 bg-gray-200 rounded" />
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="w-20 h-4 bg-gray-200 rounded" />
    </td>
    <td className="px-6 py-4">
      <div className="w-12 h-4 bg-gray-200 rounded" />
    </td>
    <td className="px-6 py-4">
      <div className="w-24 h-4 bg-gray-200 rounded" />
    </td>
    <td className="px-6 py-4">
      <div className="w-16 h-4 bg-gray-200 rounded" />
    </td>
    <td className="px-6 py-4">
      <div className="w-12 h-4 bg-gray-200 rounded" />
    </td>
  </tr>
);

/**
 * Mobile Card View (for responsive)
 */
const MobileCard: React.FC<{ entry: LeaderboardEntry; isCurrentUser: boolean }> = ({
  entry,
  isCurrentUser,
}) => (
  <div
    className={cn(
      'bg-white rounded-lg border-2 p-4 mb-4',
      isCurrentUser ? 'border-orange-500 bg-orange-50' : 'border-gray-200',
      entry.rank <= 3 && 'border-yellow-400 bg-yellow-50'
    )}
  >
    {/* Rank & User */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">{getRankBadge(entry.rank)}</div>
        <Avatar
          src={entry.avatar}
          alt={entry.username}
          name={entry.username}
        />
        <div>
          <p className="font-semibold text-gray-900">
            {entry.username}
            {isCurrentUser && <span className="ml-2 text-xs text-orange-600">(Tú)</span>}
          </p>
          <p className={cn('text-sm font-medium', getRankColor(entry.currentRank))}>
            {getRankLabel(entry.currentRank)}
          </p>
        </div>
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white rounded p-2">
        <p className="text-xs text-gray-600">XP Total</p>
        <p className="text-sm font-bold text-gray-900">{formatXP(entry.totalXP)}</p>
      </div>
      <div className="bg-white rounded p-2">
        <p className="text-xs text-gray-600">Nivel</p>
        <p className="text-sm font-bold text-gray-900">{entry.level}</p>
      </div>
      <div className="bg-white rounded p-2">
        <p className="text-xs text-gray-600">Racha</p>
        <p className="text-sm font-bold text-orange-600">{formatStreak(entry.streak)}</p>
      </div>
      <div className="bg-white rounded p-2">
        <p className="text-xs text-gray-600">Logros</p>
        <p className="text-sm font-bold text-yellow-600">
          <Trophy className="w-3 h-3 inline mr-1" />
          {entry.achievementCount}
        </p>
      </div>
    </div>
  </div>
);

/**
 * LeaderboardTable Component
 *
 * Displays leaderboard entries in a responsive table/card format.
 *
 * Features:
 * - Rank column with medals for top 3
 * - User column with avatar + username
 * - Total XP (formatted)
 * - Level
 * - Current Maya Rank with icon
 * - Streak (days with fire icon)
 * - Achievement count
 * - Highlight current user row
 * - Top 3 special styling (gold, silver, bronze backgrounds)
 * - Responsive: Table on desktop, cards on mobile
 * - Loading skeleton rows
 * - Sticky header
 * - Empty state
 */
export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  currentUserId,
  isLoading = false,
  className,
}) => {
  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  XP Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nivel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rango
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Racha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logros
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(10)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Loading */}
        <div className="md:hidden p-4">
          <Loader className="w-8 h-8 text-orange-600 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Empty state
  if (!entries || entries.length === 0) {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200 p-12 text-center', className)}>
        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos de clasificación</h3>
        <p className="text-gray-600">
          Sé el primero en aparecer en esta tabla de clasificación.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                XP Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nivel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rango
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Racha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Logros
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => {
              const isCurrentUser = currentUserId && entry.userId === currentUserId;
              const isTopThree = entry.rank <= 3;

              return (
                <tr
                  key={entry.userId}
                  className={cn(
                    'hover:bg-gray-50 transition-colors',
                    isCurrentUser && 'bg-orange-50 hover:bg-orange-100',
                    isTopThree && 'bg-yellow-50 hover:bg-yellow-100'
                  )}
                >
                  {/* Rank */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">{getRankBadge(entry.rank)}</div>
                  </td>

                  {/* User */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={entry.avatar}
                        alt={entry.username}
                        name={entry.username}
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {entry.username}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-orange-600 font-normal">(Tú)</span>
                          )}
                        </p>
                        {entry.firstName && entry.lastName && (
                          <p className="text-xs text-gray-500">
                            {entry.firstName} {entry.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Total XP */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatXP(entry.totalXP)}
                    </span>
                  </td>

                  {/* Level */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-600">{entry.level}</span>
                  </td>

                  {/* Maya Rank */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                        getRankColor(entry.currentRank),
                        'bg-opacity-10'
                      )}
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      {getRankLabel(entry.currentRank)}
                    </span>
                  </td>

                  {/* Streak */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-orange-600">
                      {formatStreak(entry.streak)}
                    </span>
                  </td>

                  {/* Achievements */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center text-sm font-semibold text-yellow-600">
                      <Trophy className="w-4 h-4 mr-1" />
                      {entry.achievementCount}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden p-4">
        {entries.map((entry) => {
          const isCurrentUser = currentUserId && entry.userId === currentUserId;
          return <MobileCard key={entry.userId} entry={entry} isCurrentUser={isCurrentUser} />;
        })}
      </div>
    </div>
  );
};

export default LeaderboardTable;
