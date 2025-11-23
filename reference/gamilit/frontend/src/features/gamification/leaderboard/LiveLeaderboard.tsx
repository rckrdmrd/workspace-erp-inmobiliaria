/**
 * LiveLeaderboard Component
 *
 * Complete leaderboard with real-time updates and 4 leaderboard types:
 * - XP: Total experience points ranking
 * - Completion: Completion percentage ranking
 * - Streak: Consecutive days streak ranking
 * - Detective: Overall detective ranking
 *
 * Features:
 * - Header with type selector tabs
 * - UserRankCard showing current user position (highlighted)
 * - Table with 15-20 entries per page
 * - Rank position with special icons for top 3 (Crown, Medal, Trophy)
 * - Avatar, username, score, streak display
 * - Animated entry with stagger effect
 * - Real-time auto-refresh every 30 seconds
 * - Responsive design
 * - Empty states and loading states
 *
 * @example
 * <LiveLeaderboard userId="user-123" initialType="xp" />
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Medal,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  RefreshCw,
  Flame,
  Target,
  Zap,
  Award,
  BarChart3,
  Users,
  Clock
} from 'lucide-react';
import { cn } from '@shared/utils/cn';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type LeaderboardTypeVariant = 'xp' | 'completion' | 'streak' | 'detective';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  rankBadge: string;
  score: number;
  xp: number;
  completionPercentage: number;
  streak: number;
  mlCoins: number;
  change: number;
  changeType: 'up' | 'down' | 'same' | 'new';
  isCurrentUser: boolean;
}

export interface LiveLeaderboardProps {
  userId: string;
  initialType?: LeaderboardTypeVariant;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  itemsPerPage?: number;
  onUserClick?: (userId: string) => void;
  className?: string;
}

interface TabConfig {
  type: LeaderboardTypeVariant;
  label: string;
  icon: React.ElementType;
  description: string;
  sortKey: keyof LeaderboardEntry;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const TABS: TabConfig[] = [
  {
    type: 'xp',
    label: 'XP Total',
    icon: Zap,
    description: 'Clasificación por experiencia acumulada',
    sortKey: 'xp'
  },
  {
    type: 'completion',
    label: 'Completado',
    icon: BarChart3,
    description: 'Clasificación por porcentaje completado',
    sortKey: 'completionPercentage'
  },
  {
    type: 'streak',
    label: 'Racha',
    icon: Flame,
    description: 'Clasificación por días consecutivos',
    sortKey: 'streak'
  },
  {
    type: 'detective',
    label: 'Detective',
    icon: Target,
    description: 'Ranking general de detectives',
    sortKey: 'score'
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getRankIcon = (rank: number): React.ElementType | null => {
  if (rank === 1) return Crown;
  if (rank === 2) return Medal;
  if (rank === 3) return Trophy;
  return null;
};

const getRankColor = (rank: number): string => {
  if (rank === 1) return 'from-yellow-400 to-yellow-600';
  if (rank === 2) return 'from-gray-300 to-gray-500';
  if (rank === 3) return 'from-orange-400 to-orange-600';
  return 'from-detective-blue to-detective-orange';
};

const getRankTextColor = (rank: number): string => {
  if (rank === 1) return 'text-yellow-500';
  if (rank === 2) return 'text-gray-400';
  if (rank === 3) return 'text-orange-500';
  return 'text-detective-text';
};

const getScoreForType = (entry: LeaderboardEntry, type: LeaderboardTypeVariant): number => {
  switch (type) {
    case 'xp':
      return entry.xp;
    case 'completion':
      return entry.completionPercentage;
    case 'streak':
      return entry.streak;
    case 'detective':
    default:
      return entry.score;
  }
};

const formatScoreForType = (score: number, type: LeaderboardTypeVariant): string => {
  switch (type) {
    case 'xp':
      return `${score.toLocaleString()} XP`;
    case 'completion':
      return `${score.toFixed(1)}%`;
    case 'streak':
      return `${score} días`;
    case 'detective':
    default:
      return score.toLocaleString();
  }
};

// ============================================================================
// MOCK DATA GENERATOR
// ============================================================================

const generateMockLeaderboardData = (
  currentUserId: string,
  type: LeaderboardTypeVariant
): LeaderboardEntry[] => {
  const firstNames = ['Ana', 'Carlos', 'María', 'Luis', 'Sofia', 'Diego', 'Valentina', 'Miguel', 'Isabella', 'Javier', 'Camila', 'Pablo', 'Lucía', 'Andrés', 'Elena', 'Fernando', 'Daniela', 'Ricardo', 'Gabriela', 'Sebastián'];
  const lastNames = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Jiménez', 'Hernández', 'Vargas', 'Castro', 'Ruiz'];
  const ranks = ['Nacom', 'Ajaw', "Ah K'in", 'Halach Uinic', "K'uk'ulkan"];

  const entries: LeaderboardEntry[] = [];
  const totalEntries = 20;
  const userRank = Math.floor(Math.random() * 15) + 5; // User ranks between 5-20

  for (let i = 0; i < totalEntries; i++) {
    const rank = i + 1;
    const isCurrentUser = rank === userRank;

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const username = isCurrentUser ? 'Tú' : `${firstName} ${lastName}`;

    // Generate scores based on rank and type
    let xp, completionPercentage, streak, score;

    switch (type) {
      case 'xp':
        xp = 15000 - (rank * 200) + Math.floor(Math.random() * 100);
        score = xp;
        completionPercentage = 60 + Math.random() * 30;
        streak = Math.floor(Math.random() * 30) + 1;
        break;
      case 'completion':
        completionPercentage = 100 - (rank * 2) + Math.random() * 2;
        score = Math.floor(completionPercentage * 100);
        xp = Math.floor(Math.random() * 10000) + 5000;
        streak = Math.floor(Math.random() * 30) + 1;
        break;
      case 'streak':
        streak = 50 - rank + Math.floor(Math.random() * 3);
        score = streak * 100;
        xp = Math.floor(Math.random() * 10000) + 5000;
        completionPercentage = 60 + Math.random() * 30;
        break;
      case 'detective':
      default:
        score = 10000 - (rank * 150) + Math.floor(Math.random() * 100);
        xp = score * 1.5;
        completionPercentage = 60 + Math.random() * 30;
        streak = Math.floor(Math.random() * 30) + 1;
        break;
    }

    const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
    let changeType: 'up' | 'down' | 'same' | 'new';

    if (rank <= 3 && Math.random() > 0.7) {
      changeType = 'new';
    } else if (change > 0) {
      changeType = 'up';
    } else if (change < 0) {
      changeType = 'down';
    } else {
      changeType = 'same';
    }

    entries.push({
      rank,
      userId: isCurrentUser ? currentUserId : `user-${rank}`,
      username,
      avatar: `/avatars/avatar-${rank % 10}.png`,
      rankBadge: ranks[Math.floor((rank - 1) / 4) % ranks.length],
      score,
      xp,
      completionPercentage,
      streak,
      mlCoins: Math.floor(score * 0.5),
      change,
      changeType,
      isCurrentUser
    });
  }

  return entries;
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * TypeSelector - Tab selector for leaderboard types
 */
interface TypeSelectorProps {
  selectedType: LeaderboardTypeVariant;
  onTypeChange: (type: LeaderboardTypeVariant) => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ selectedType, onTypeChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-detective-orange scrollbar-track-gray-200">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = selectedType === tab.type;

        return (
          <motion.button
            key={tab.type}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTypeChange(tab.type)}
            className={cn(
              'relative flex items-center gap-2 px-5 py-3 rounded-lg font-semibold whitespace-nowrap transition-all group min-w-fit',
              isActive
                ? 'bg-gradient-to-r from-detective-orange to-pink-500 text-white shadow-lg shadow-orange-500/50'
                : 'bg-white text-detective-text hover:bg-detective-bg shadow-md hover:shadow-lg'
            )}
          >
            <motion.div
              animate={isActive ? {
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ duration: 0.5 }}
            >
              <Icon className={cn(
                'w-5 h-5 transition-colors',
                isActive ? 'text-white' : 'text-detective-orange'
              )} />
            </motion.div>

            <span>{tab.label}</span>

            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg border-2 border-white/50"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

/**
 * UserRankCard - Highlighted card showing user's current position
 */
interface UserRankCardProps {
  userEntry: LeaderboardEntry;
  type: LeaderboardTypeVariant;
}

const UserRankCard: React.FC<UserRankCardProps> = ({ userEntry, type }) => {
  const gradient = getRankColor(userEntry.rank);
  const Icon = getRankIcon(userEntry.rank) || Award;
  const score = getScoreForType(userEntry, type);
  const formattedScore = formatScoreForType(score, type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl shadow-2xl"
    >
      {/* Gradient Background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-r',
        gradient
      )} />

      {/* Animated Background Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '20px 20px']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Content */}
      <div className="relative p-6 text-white">
        <div className="flex items-center justify-between">
          {/* Left Side: User Info */}
          <div className="flex items-center gap-4">
            {/* Rank Icon */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="p-3 bg-white/20 rounded-full backdrop-blur-sm"
            >
              <Icon className="w-8 h-8" />
            </motion.div>

            {/* Avatar */}
            <div className="relative">
              <motion.img
                src={userEntry.avatar}
                alt={userEntry.username}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userEntry.username)}&background=8b5cf6&color=fff`;
                }}
                whileHover={{ scale: 1.05 }}
              />

              {/* Rank Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <span className={cn(
                  'font-bold text-sm',
                  userEntry.rank <= 3 ? 'text-yellow-500' : 'text-purple-600'
                )}>
                  #{userEntry.rank}
                </span>
              </motion.div>
            </div>

            {/* User Details */}
            <div>
              <h3 className="text-xl font-bold mb-1">Tu Posición</h3>
              <p className="text-sm opacity-90">{userEntry.rankBadge}</p>
            </div>
          </div>

          {/* Right Side: Score */}
          <div className="text-right">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
              className="text-4xl font-bold mb-1"
            >
              {formattedScore}
            </motion.div>

            {/* Rank Change */}
            {userEntry.change !== 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className={cn(
                  'flex items-center justify-end gap-1 text-sm font-semibold px-3 py-1 rounded-full',
                  userEntry.changeType === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'
                )}
              >
                {userEntry.changeType === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {userEntry.changeType === 'up' ? '+' : '-'}{Math.abs(userEntry.change)}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
          >
            <div className="text-xl font-bold mb-1">{userEntry.xp.toLocaleString()}</div>
            <div className="text-xs opacity-75">XP</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
          >
            <div className="text-xl font-bold mb-1">{userEntry.completionPercentage.toFixed(0)}%</div>
            <div className="text-xs opacity-75">Completado</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
          >
            <div className="flex items-center justify-center gap-1 text-xl font-bold mb-1">
              <Flame className="w-5 h-5" />
              {userEntry.streak}
            </div>
            <div className="text-xs opacity-75">Racha</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * LeaderboardEntryRow - Single row in the leaderboard table
 */
interface LeaderboardEntryRowProps {
  entry: LeaderboardEntry;
  type: LeaderboardTypeVariant;
  index: number;
  onUserClick?: (userId: string) => void;
}

const LeaderboardEntryRow: React.FC<LeaderboardEntryRowProps> = ({
  entry,
  type,
  index,
  onUserClick
}) => {
  const RankIcon = getRankIcon(entry.rank);
  const isTopThree = entry.rank <= 3;
  const score = getScoreForType(entry, type);
  const formattedScore = formatScoreForType(score, type);
  const rankColor = getRankColor(entry.rank);
  const rankTextColor = getRankTextColor(entry.rank);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => onUserClick?.(entry.userId)}
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg transition-all cursor-pointer',
        entry.isCurrentUser
          ? 'bg-detective-orange bg-opacity-10 border-2 border-detective-orange shadow-lg'
          : 'bg-white hover:shadow-md hover:scale-[1.01]'
      )}
    >
      {/* Rank */}
      <div className={cn(
        'flex items-center justify-center w-14 h-14 rounded-full font-bold text-white shrink-0',
        isTopThree ? `bg-gradient-to-br ${rankColor}` : 'bg-detective-blue'
      )}>
        {isTopThree && RankIcon ? (
          <RankIcon className="w-7 h-7" />
        ) : (
          <span className="text-lg">#{entry.rank}</span>
        )}
      </div>

      {/* Avatar */}
      <motion.img
        src={entry.avatar}
        alt={entry.username}
        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shrink-0"
        whileHover={{ scale: 1.1 }}
        onError={(e) => {
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.username)}&background=f97316&color=fff`;
        }}
      />

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn(
            'font-semibold truncate',
            entry.isCurrentUser ? 'text-detective-orange' : 'text-detective-text'
          )}>
            {entry.username}
          </p>
          {entry.isCurrentUser && (
            <span className="text-xs bg-detective-orange text-white px-2 py-0.5 rounded-full shrink-0">
              Tú
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-detective-text-secondary">{entry.rankBadge}</p>
          {type === 'streak' && (
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-semibold">{entry.streak}d</span>
            </div>
          )}
        </div>
      </div>

      {/* Score */}
      <div className="text-right shrink-0">
        <p className={cn(
          'font-bold text-lg',
          entry.isCurrentUser ? 'text-detective-orange' : 'text-detective-text'
        )}>
          {formattedScore}
        </p>

        {/* Change Indicator */}
        <div className="flex items-center gap-1 justify-end mt-1">
          {entry.changeType === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
          {entry.changeType === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
          {entry.changeType === 'same' && <Minus className="w-4 h-4 text-gray-400" />}
          {entry.changeType === 'new' && <Sparkles className="w-4 h-4 text-detective-gold" />}
          <span className={cn(
            'text-sm font-medium',
            entry.changeType === 'up' ? 'text-green-500' :
            entry.changeType === 'down' ? 'text-red-500' :
            'text-gray-400'
          )}>
            {Math.abs(entry.change) > 0 ? Math.abs(entry.change) : '-'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({
  userId,
  initialType = 'detective',
  autoRefresh = true,
  refreshInterval = 30000,
  itemsPerPage = 20,
  onUserClick,
  className
}) => {
  const [selectedType, setSelectedType] = useState<LeaderboardTypeVariant>(initialType);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch leaderboard data
  const fetchLeaderboardData = useCallback(async () => {
    setLoading(true);

    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const data = generateMockLeaderboardData(userId, selectedType);
      setEntries(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [userId, selectedType]);

  // Manual refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  // Auto-refresh
  useEffect(() => {
    fetchLeaderboardData();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchLeaderboardData();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchLeaderboardData, autoRefresh, refreshInterval]);

  // Handle type change
  const handleTypeChange = (type: LeaderboardTypeVariant) => {
    setSelectedType(type);
  };

  // Get user entry
  const userEntry = entries.find(e => e.isCurrentUser);

  // Get visible entries (limit to itemsPerPage)
  const visibleEntries = entries.slice(0, itemsPerPage);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold text-detective-text mb-2">
            Tabla de Clasificación
          </h2>
          <div className="flex items-center gap-2 text-sm text-detective-text-secondary">
            <Clock className="w-4 h-4" />
            <span>Última actualización: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Refresh Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-detective-orange text-white rounded-lg font-semibold hover:bg-detective-orange-dark transition-colors disabled:opacity-50 shadow-md"
        >
          <RefreshCw className={cn('w-5 h-5', isRefreshing && 'animate-spin')} />
          <span>Actualizar</span>
        </motion.button>
      </div>

      {/* Type Selector */}
      <TypeSelector selectedType={selectedType} onTypeChange={handleTypeChange} />

      {/* Loading State */}
      {loading && entries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-detective-orange border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-detective-text-secondary">Cargando clasificación...</p>
        </div>
      ) : (
        <>
          {/* User Rank Card */}
          {userEntry && (
            <UserRankCard userEntry={userEntry} type={selectedType} />
          )}

          {/* Leaderboard Table */}
          <div className="bg-detective-bg rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-detective-text flex items-center gap-2">
                <Users className="w-6 h-6 text-detective-orange" />
                Top {itemsPerPage}
              </h3>
              <div className="text-sm text-detective-text-secondary">
                {entries.length} participantes
              </div>
            </div>

            {/* Entries */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {visibleEntries.map((entry, index) => (
                  <LeaderboardEntryRow
                    key={entry.userId}
                    entry={entry}
                    type={selectedType}
                    index={index}
                    onUserClick={onUserClick}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {entries.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <Trophy className="w-16 h-16 text-detective-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-detective-text mb-2">
                  No hay datos disponibles
                </h3>
                <p className="text-detective-text-secondary">
                  Aún no hay clasificaciones para este período
                </p>
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-detective-text-secondary"
      >
        <p>
          Las clasificaciones se actualizan automáticamente cada {refreshInterval / 1000} segundos
        </p>
      </motion.div>
    </div>
  );
};

export default LiveLeaderboard;
