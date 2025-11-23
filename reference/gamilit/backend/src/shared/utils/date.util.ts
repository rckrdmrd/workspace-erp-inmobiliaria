/**
 * Date Utilities
 *
 * Common date manipulation and formatting functions.
 */

/**
 * Format date to ISO string
 */
export const formatToISO = (date: Date): string => {
  return date.toISOString();
};

/**
 * Format date to readable string (YYYY-MM-DD)
 */
export const formatToDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Format date to datetime string (YYYY-MM-DD HH:mm:ss)
 */
export const formatToDateTime = (date: Date): string => {
  return date.toISOString().replace('T', ' ').split('.')[0];
};

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add hours to a date
 */
export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

/**
 * Check if date is in the past
 */
export const isPast = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Check if date is in the future
 */
export const isFuture = (date: Date): boolean => {
  return date > new Date();
};

/**
 * Get start of day
 */
export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get end of day
 */
export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Get difference in days between two dates
 */
export const diffInDays = (date1: Date, date2: Date): number => {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Parse ISO string to Date
 */
export const parseISO = (isoString: string): Date => {
  return new Date(isoString);
};

/**
 * Check if string is valid date
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
