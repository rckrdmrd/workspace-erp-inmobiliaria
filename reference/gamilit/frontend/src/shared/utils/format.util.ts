/**
 * Format Utilities
 *
 * Common formatting functions for dates, numbers, etc.
 */

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date to short string (DD/MM/YYYY)
 */
export const formatDateShort = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-MX');
};

/**
 * Format number as currency (MXN)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-MX').format(num);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Format file size (bytes to human-readable)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format rank with medal/number
 * @param rank - Rank number (1, 2, 3, etc.)
 * @returns Formatted rank string with medal for top 3
 */
export const formatRank = (rank: number): string => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

/**
 * Format XP with commas and suffix
 * @param xp - Experience points
 * @returns Formatted XP string (e.g., "1,234 XP")
 */
export const formatXP = (xp: number): string => {
  return `${formatNumber(xp)} XP`;
};

/**
 * Format streak with fire icon
 * @param days - Number of consecutive days
 * @returns Formatted streak string (e.g., "🔥 5 días")
 */
export const formatStreak = (days: number): string => {
  if (days === 0) return '0 días';
  const dayLabel = days === 1 ? 'día' : 'días';
  return `🔥 ${days} ${dayLabel}`;
};

/**
 * Format ML Coins
 * @param coins - Number of ML Coins
 * @returns Formatted ML Coins string
 */
export const formatMLCoins = (coins: number): string => {
  return `${formatNumber(coins)} ML`;
};

/**
 * Format large numbers with K/M suffixes
 * @param num - Number to format
 * @returns Formatted number (e.g., 1.5K, 2.3M)
 */
export const formatCompactNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
};

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 * @param date - Date to format
 * @returns Relative time string in Spanish
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'Hace un momento';
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
  }
  if (seconds < 2592000) {
    const weeks = Math.floor(seconds / 604800);
    return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  }

  return formatDate(d);
};
