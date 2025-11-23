/**
 * String Utilities
 *
 * Common string manipulation and formatting functions.
 */

/**
 * Generate slug from string
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitalize each word
 */
export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Truncate string with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Remove HTML tags
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Sanitize string (remove special chars except spaces)
 */
export const sanitize = (text: string): string => {
  return text.replace(/[^\w\s]/gi, '');
};

/**
 * Check if string is empty or whitespace
 */
export const isEmpty = (text: string | null | undefined): boolean => {
  return !text || text.trim().length === 0;
};

/**
 * Generate random string
 */
export const randomString = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Mask sensitive data (show only last N chars)
 */
export const maskString = (text: string, visibleChars: number = 4): string => {
  if (text.length <= visibleChars) return text;
  const masked = '*'.repeat(text.length - visibleChars);
  return masked + text.slice(-visibleChars);
};

/**
 * Convert string to camelCase
 */
export const toCamelCase = (text: string): string => {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');
};

/**
 * Convert string to snake_case
 */
export const toSnakeCase = (text: string): string => {
  return text
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
};

/**
 * Escape regex special characters
 */
export const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Count words in string
 */
export const wordCount = (text: string): number => {
  return text.trim().split(/\s+/).length;
};
