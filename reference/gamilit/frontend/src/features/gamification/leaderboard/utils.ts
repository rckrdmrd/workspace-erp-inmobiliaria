/**
 * Leaderboard Utilities
 *
 * Helper functions and utilities for leaderboard operations
 */

import type { LeaderboardEntry, LeaderboardTypeVariant } from './LiveLeaderboard';

// ============================================================================
// SCORE CALCULATIONS
// ============================================================================

/**
 * Calculate score based on leaderboard type
 */
export const calculateScore = (
  entry: LeaderboardEntry,
  type: LeaderboardTypeVariant
): number => {
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

/**
 * Format score for display based on type
 */
export const formatScore = (
  score: number,
  type: LeaderboardTypeVariant
): string => {
  switch (type) {
    case 'xp':
      return `${score.toLocaleString()} XP`;
    case 'completion':
      return `${score.toFixed(1)}%`;
    case 'streak':
      return `${score} ${score === 1 ? 'día' : 'días'}`;
    case 'detective':
    default:
      return score.toLocaleString();
  }
};

// ============================================================================
// RANK UTILITIES
// ============================================================================

/**
 * Get rank tier based on position
 */
export const getRankTier = (rank: number): 'gold' | 'silver' | 'bronze' | 'top10' | 'top50' | 'standard' => {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  if (rank <= 10) return 'top10';
  if (rank <= 50) return 'top50';
  return 'standard';
};

/**
 * Get percentile from rank and total participants
 */
export const calculatePercentile = (rank: number, totalParticipants: number): number => {
  if (totalParticipants === 0) return 0;
  return ((totalParticipants - rank + 1) / totalParticipants) * 100;
};

/**
 * Get motivational message based on rank and percentile
 */
export const getMotivationalMessage = (rank: number, percentile: number): string => {
  if (rank === 1) return '¡Eres el número 1! ¡Increíble!';
  if (rank === 2) return '¡Casi en la cima! ¡Sigue así!';
  if (rank === 3) return '¡En el podio! ¡Excelente trabajo!';
  if (rank <= 10) return '¡En el Top 10! ¡Eres un crack!';
  if (percentile >= 90) return '¡En el Top 10%! ¡Impresionante!';
  if (percentile >= 75) return '¡En el Top 25%! ¡Muy bien!';
  if (percentile >= 50) return '¡Por encima del promedio!';
  if (percentile >= 25) return '¡Sigue escalando posiciones!';
  return '¡Cada paso cuenta! ¡Adelante!';
};

/**
 * Calculate points needed to reach next rank
 */
export const calculatePointsToNextRank = (
  currentScore: number,
  nextRankScore: number
): number => {
  return Math.max(0, nextRankScore - currentScore);
};

// ============================================================================
// SORTING & FILTERING
// ============================================================================

/**
 * Sort entries by score for given type
 */
export const sortEntriesByType = (
  entries: LeaderboardEntry[],
  type: LeaderboardTypeVariant
): LeaderboardEntry[] => {
  return [...entries].sort((a, b) => {
    const scoreA = calculateScore(a, type);
    const scoreB = calculateScore(b, type);
    return scoreB - scoreA; // Descending order
  });
};

/**
 * Filter entries by rank range
 */
export const filterByRankRange = (
  entries: LeaderboardEntry[],
  minRank: number,
  maxRank: number
): LeaderboardEntry[] => {
  return entries.filter(e => e.rank >= minRank && e.rank <= maxRank);
};

/**
 * Get top N entries
 */
export const getTopN = (
  entries: LeaderboardEntry[],
  n: number
): LeaderboardEntry[] => {
  return entries.slice(0, n);
};

/**
 * Get entries around a specific rank (e.g., ±5 positions)
 */
export const getEntriesAroundRank = (
  entries: LeaderboardEntry[],
  targetRank: number,
  range: number = 5
): LeaderboardEntry[] => {
  const minRank = Math.max(1, targetRank - range);
  const maxRank = targetRank + range;
  return filterByRankRange(entries, minRank, maxRank);
};

// ============================================================================
// CHANGE CALCULATIONS
// ============================================================================

/**
 * Calculate rank change type
 */
export const calculateChangeType = (
  change: number
): 'up' | 'down' | 'same' | 'new' => {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  if (change === 0) return 'same';
  return 'new';
};

/**
 * Format rank change for display
 */
export const formatRankChange = (change: number, changeType: 'up' | 'down' | 'same' | 'new'): string => {
  if (changeType === 'new') return 'NUEVO';
  if (changeType === 'same') return '-';
  const prefix = changeType === 'up' ? '+' : '';
  return `${prefix}${change}`;
};

// ============================================================================
// TIME UTILITIES
// ============================================================================

/**
 * Format last updated timestamp
 */
export const formatLastUpdated = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 60) return 'Hace unos segundos';
  if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
  if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;

  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculate time until next refresh
 */
export const getTimeUntilRefresh = (
  lastUpdated: Date,
  refreshInterval: number
): number => {
  const now = new Date();
  const nextRefresh = new Date(lastUpdated.getTime() + refreshInterval);
  return Math.max(0, nextRefresh.getTime() - now.getTime());
};

// ============================================================================
// DATA VALIDATION
// ============================================================================

/**
 * Validate leaderboard entry
 */
export const isValidEntry = (entry: any): entry is LeaderboardEntry => {
  return (
    typeof entry === 'object' &&
    typeof entry.rank === 'number' &&
    typeof entry.userId === 'string' &&
    typeof entry.username === 'string' &&
    typeof entry.score === 'number' &&
    typeof entry.xp === 'number' &&
    typeof entry.streak === 'number' &&
    typeof entry.completionPercentage === 'number' &&
    entry.rank > 0 &&
    entry.score >= 0 &&
    entry.xp >= 0 &&
    entry.streak >= 0 &&
    entry.completionPercentage >= 0 &&
    entry.completionPercentage <= 100
  );
};

/**
 * Sanitize leaderboard entries
 */
export const sanitizeEntries = (entries: any[]): LeaderboardEntry[] => {
  return entries.filter(isValidEntry);
};

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Calculate average score
 */
export const calculateAverageScore = (
  entries: LeaderboardEntry[],
  type: LeaderboardTypeVariant
): number => {
  if (entries.length === 0) return 0;
  const total = entries.reduce((sum, entry) => sum + calculateScore(entry, type), 0);
  return total / entries.length;
};

/**
 * Get score distribution (quartiles)
 */
export const getScoreDistribution = (
  entries: LeaderboardEntry[],
  type: LeaderboardTypeVariant
) => {
  if (entries.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0 };
  }

  const scores = entries.map(e => calculateScore(e, type)).sort((a, b) => a - b);
  const len = scores.length;

  const getQuartile = (q: number) => {
    const pos = (len - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (scores[base + 1] !== undefined) {
      return scores[base] + rest * (scores[base + 1] - scores[base]);
    }
    return scores[base];
  };

  return {
    min: scores[0],
    q1: getQuartile(0.25),
    median: getQuartile(0.5),
    q3: getQuartile(0.75),
    max: scores[len - 1]
  };
};

/**
 * Find user's position relative to others
 */
export const getUserPosition = (
  entries: LeaderboardEntry[],
  userId: string
): {
  entry: LeaderboardEntry | null;
  rank: number;
  percentile: number;
  aboveUser: LeaderboardEntry | null;
  belowUser: LeaderboardEntry | null;
} => {
  const userEntry = entries.find(e => e.userId === userId);

  if (!userEntry) {
    return {
      entry: null,
      rank: 0,
      percentile: 0,
      aboveUser: null,
      belowUser: null
    };
  }

  const rank = userEntry.rank;
  const percentile = calculatePercentile(rank, entries.length);
  const aboveUser = entries.find(e => e.rank === rank - 1) || null;
  const belowUser = entries.find(e => e.rank === rank + 1) || null;

  return {
    entry: userEntry,
    rank,
    percentile,
    aboveUser,
    belowUser
  };
};

// ============================================================================
// COMPARISON UTILITIES
// ============================================================================

/**
 * Compare two entries
 */
export const compareEntries = (
  a: LeaderboardEntry,
  b: LeaderboardEntry,
  type: LeaderboardTypeVariant
) => {
  const scoreA = calculateScore(a, type);
  const scoreB = calculateScore(b, type);

  return {
    scoreDifference: Math.abs(scoreA - scoreB),
    rankDifference: Math.abs(a.rank - b.rank),
    winner: scoreA > scoreB ? a : b,
    betterXP: a.xp > b.xp ? a : b,
    betterStreak: a.streak > b.streak ? a : b,
    betterCompletion: a.completionPercentage > b.completionPercentage ? a : b
  };
};

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Export leaderboard data as CSV
 */
export const exportToCSV = (
  entries: LeaderboardEntry[],
  type: LeaderboardTypeVariant
): string => {
  const headers = ['Rank', 'Username', 'Score', 'XP', 'Completion %', 'Streak', 'Change'];
  const rows = entries.map(entry => [
    entry.rank,
    entry.username,
    calculateScore(entry, type),
    entry.xp,
    entry.completionPercentage.toFixed(2),
    entry.streak,
    entry.change
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Download leaderboard as CSV file
 */
export const downloadAsCSV = (
  entries: LeaderboardEntry[],
  type: LeaderboardTypeVariant,
  filename: string = 'leaderboard.csv'
): void => {
  const csv = exportToCSV(entries, type);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// ============================================================================
// SHARE UTILITIES
// ============================================================================

/**
 * Generate share text for social media
 */
export const generateShareText = (
  userEntry: LeaderboardEntry,
  type: LeaderboardTypeVariant
): string => {
  const score = formatScore(calculateScore(userEntry, type), type);
  const emoji = userEntry.rank <= 3 ? ['🥇', '🥈', '🥉'][userEntry.rank - 1] : '🏆';

  return `${emoji} ¡Estoy en el puesto #${userEntry.rank} en la clasificación de ${type === 'xp' ? 'XP' : type === 'completion' ? 'Completado' : type === 'streak' ? 'Racha' : 'Detective'}! Mi puntuación: ${score}`;
};

/**
 * Copy share text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
};
