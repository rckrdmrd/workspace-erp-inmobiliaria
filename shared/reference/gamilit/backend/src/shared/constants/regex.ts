/**
 * Regular Expression Constants
 *
 * Common regex patterns used throughout the application.
 */

/**
 * Email pattern (RFC 5322 simplified)
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Strong password pattern
 * At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * UUID v4 pattern
 */
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Phone number pattern (international format)
 */
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

/**
 * URL pattern
 */
export const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

/**
 * IPv4 pattern
 */
export const IPV4_REGEX =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * Hex color pattern
 */
export const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 * Alphanumeric pattern
 */
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

/**
 * Slug pattern (URL-friendly)
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Date pattern (YYYY-MM-DD)
 */
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Time pattern (HH:MM:SS)
 */
export const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

/**
 * Credit card pattern (basic)
 */
export const CREDIT_CARD_REGEX = /^[0-9]{13,19}$/;

/**
 * Username pattern (alphanumeric, underscore, 3-20 chars)
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
