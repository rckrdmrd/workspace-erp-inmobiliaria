/**
 * Progress Formatters
 * Utility functions for formatting progress-related data
 */

/**
 * Format time spent in seconds to human-readable string
 * @param seconds - Time in seconds
 * @returns Formatted string (e.g., "2h 30m", "45m", "1h")
 */
export const formatTimeSpent = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    if (remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${hours}h`;
  }

  return `${minutes}m`;
};

/**
 * Format progress percentage
 * @param percentage - Progress percentage (0-100)
 * @returns Formatted string (e.g., "75%")
 */
export const formatProgressPercentage = (percentage: number): string => {
  return `${Math.round(percentage)}%`;
};

/**
 * Format score as fraction
 * @param score - User's score
 * @param maxScore - Maximum possible score
 * @returns Formatted string (e.g., "85/100")
 */
export const formatScore = (score: number, maxScore: number): string => {
  return `${score}/${maxScore}`;
};

/**
 * Format date to relative time (e.g., "2 days ago", "just now")
 * @param date - Date to format
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  } else if (diffWeeks < 4) {
    return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
  } else if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
  } else {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

/**
 * Format date to absolute date string
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Jan 15, 2025")
 */
export const formatAbsoluteDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format accuracy percentage
 * @param correct - Number of correct answers
 * @param total - Total number of attempts
 * @returns Formatted percentage string (e.g., "85%")
 */
export const formatAccuracy = (correct: number, total: number): string => {
  if (total === 0) return '0%';
  const accuracy = (correct / total) * 100;
  return `${Math.round(accuracy)}%`;
};

/**
 * Format attempt count
 * @param count - Number of attempts
 * @returns Formatted string (e.g., "1 attempt", "5 attempts")
 */
export const formatAttemptCount = (count: number): string => {
  return count === 1 ? '1 attempt' : `${count} attempts`;
};

/**
 * Get status badge color
 * @param status - Progress status
 * @returns Tailwind color class
 */
export const getStatusBadgeColor = (
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered'
): string => {
  switch (status) {
    case 'not_started':
      return 'bg-gray-100 text-gray-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'mastered':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get difficulty badge color
 * @param difficulty - Difficulty level (CEFR or simple)
 * @returns Tailwind color class
 */
export const getDifficultyBadgeColor = (
  difficulty: string
): string => {
  // Normalize to lowercase for consistent matching
  const level = difficulty.toLowerCase();

  // CEFR levels (8 levels)
  switch (level) {
    case 'beginner':     // A1
    case 'elementary':   // A2
      return 'bg-green-100 text-green-800';
    case 'pre_intermediate': // B1
    case 'intermediate':     // B2
      return 'bg-yellow-100 text-yellow-800';
    case 'upper_intermediate': // C1
    case 'advanced':           // C2
    case 'proficient':         // C2+
    case 'native':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
