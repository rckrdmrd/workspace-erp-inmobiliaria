/**
 * GAMILIT Platform - Validation Utilities
 * Security and input validation functions
 */

// ==================== TYPES ====================

export interface PasswordStrength {
  score: number; // 0-4
  level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  color: string;
  percentage: number;
  label?: string; // Human-readable label for the strength level
}

export interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

// ==================== PASSWORD VALIDATION ====================

/**
 * Validates password strength and returns detailed analysis
 * @param password - Password to validate
 * @returns PasswordStrength object with score, level, color, and percentage
 */
export function validatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      level: 'weak',
      color: '#ef4444', // red-500
      percentage: 0,
    };
  }

  let score = 0;

  // Length check (max 2 points)
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety (max 4 points)
  if (/[a-z]/.test(password)) score++; // lowercase
  if (/[A-Z]/.test(password)) score++; // uppercase
  if (/\d/.test(password)) score++; // number
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++; // special char

  // Common patterns penalty
  if (/^(123|abc|qwe|pass|admin)/i.test(password)) score = Math.max(0, score - 2);
  if (/(.)\1{2,}/.test(password)) score = Math.max(0, score - 1); // repeated chars

  // Normalize score to 0-4
  score = Math.min(4, Math.max(0, score));

  // Map score to level and color
  const levels: Record<number, { level: PasswordStrength['level']; color: string }> = {
    0: { level: 'weak', color: '#ef4444' }, // red-500
    1: { level: 'weak', color: '#ef4444' },
    2: { level: 'fair', color: '#f59e0b' }, // amber-500
    3: { level: 'good', color: '#eab308' }, // yellow-500
    4: { level: 'strong', color: '#22c55e' }, // green-500
  };

  // Very strong bonus (length > 16 + all criteria)
  if (password.length > 16 && score === 4) {
    return {
      score: 5,
      level: 'very-strong',
      color: '#10b981', // emerald-500
      percentage: 100,
    };
  }

  const result = levels[score];
  return {
    score,
    level: result.level,
    color: result.color,
    percentage: (score / 4) * 100,
  };
}

/**
 * Checks if password meets all security criteria
 * @param password - Password to check
 * @returns boolean - true if password meets all criteria
 */
export function isPasswordStrong(password: string): boolean {
  const criteria = getPasswordCriteria(password);
  return Object.values(criteria).every((v) => v === true);
}

/**
 * Gets detailed password criteria checklist
 * @param password - Password to analyze
 * @returns PasswordCriteria object with individual criteria checks
 */
export function getPasswordCriteria(password: string): PasswordCriteria {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
}

// ==================== EMAIL VALIDATION ====================

/**
 * Validates email format using RFC 5322 standard
 * @param email - Email to validate
 * @returns boolean - true if email is valid
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;

  // RFC 5322 compliant regex (simplified)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) return false;

  // Additional checks
  const [localPart, domain] = email.split('@');

  // Local part checks
  if (localPart.length > 64) return false;
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
  if (localPart.includes('..')) return false;

  // Domain checks
  if (domain.length > 255) return false;
  if (domain.startsWith('-') || domain.endsWith('-')) return false;

  return true;
}

// ==================== SANITIZATION ====================

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - Input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Replace HTML special characters
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'\/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Sanitizes HTML content (more aggressive)
 * Use for user-generated content that shouldn't contain HTML
 * @param html - HTML string to sanitize
 * @returns Sanitized string
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  // Remove all HTML tags
  let sanitized = html.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = sanitized;
  sanitized = textarea.value;

  // Remove any remaining scripts or dangerous content
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*/gi, '');

  return sanitized.trim();
}

// ==================== NAME VALIDATION ====================

/**
 * Validates full name (first + last name)
 * @param name - Full name to validate
 * @returns boolean - true if valid
 */
export function validateFullName(name: string): boolean {
  if (!name) return false;

  // Must have at least 2 words
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return false;

  // Each word must be at least 2 characters
  if (words.some((word) => word.length < 2)) return false;

  // Must contain only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
  if (!nameRegex.test(name)) return false;

  // Must not contain numbers
  if (/\d/.test(name)) return false;

  return true;
}

// ==================== LEADERBOARD VALIDATION ====================

/**
 * Type guard to check if an entry is valid
 * @param entry - Entry to check
 * @returns boolean - true if entry is valid
 */
export function isValidEntry(entry: unknown): entry is { id: string; name: string; score: number } {
  if (typeof entry !== 'object' || entry === null) return false;

  const e = entry as Record<string, unknown>;

  return (
    typeof e.id === 'string' &&
    e.id.length > 0 &&
    typeof e.name === 'string' &&
    e.name.length > 0 &&
    typeof e.score === 'number' &&
    !isNaN(e.score) &&
    e.score >= 0
  );
}

/**
 * Sanitizes leaderboard entries by filtering out invalid ones
 * @param entries - Array of entries to sanitize
 * @returns Filtered array of valid entries
 */
export function sanitizeEntries<T>(entries: T[]): T[] {
  if (!Array.isArray(entries)) return [];

  return entries.filter((entry) => {
    // Basic validation
    if (!entry || typeof entry !== 'object') return false;

    // Check for required fields
    const e = entry as Record<string, unknown>;
    if (!e.id || !e.name || typeof e.score !== 'number') return false;

    // Check for suspicious values
    if (e.score < 0 || e.score > 1000000) return false;

    // Passed all checks
    return true;
  });
}

// ==================== URL VALIDATION ====================

/**
 * Validates URL format
 * @param url - URL to validate
 * @returns boolean - true if URL is valid
 */
export function validateURL(url: string): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) return false;

    // Must have a hostname
    if (!urlObj.hostname) return false;

    return true;
  } catch {
    return false;
  }
}

// ==================== NUMBER VALIDATION ====================

/**
 * Checks if a value is a valid positive integer
 * @param value - Value to check
 * @returns boolean - true if valid positive integer
 */
export function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

/**
 * Checks if a value is within a valid range
 * @param value - Value to check
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns boolean - true if value is in range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return typeof value === 'number' && !isNaN(value) && value >= min && value <= max;
}

// ==================== FILE VALIDATION ====================

/**
 * Validates file type
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns boolean - true if file type is allowed
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  if (!file || !file.type) return false;
  return allowedTypes.includes(file.type);
}

/**
 * Validates file size
 * @param file - File to validate
 * @param maxSizeInMB - Maximum size in megabytes
 * @returns boolean - true if file size is within limit
 */
export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  if (!file || !file.size) return false;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

// ==================== EXPORTS ====================

export default {
  // Password
  validatePasswordStrength,
  isPasswordStrong,
  getPasswordCriteria,

  // Email
  validateEmail,

  // Sanitization
  sanitizeInput,
  sanitizeHTML,

  // Name
  validateFullName,

  // Leaderboard
  isValidEntry,
  sanitizeEntries,

  // URL
  validateURL,

  // Number
  isPositiveInteger,
  isInRange,

  // File
  validateFileType,
  validateFileSize,
};
