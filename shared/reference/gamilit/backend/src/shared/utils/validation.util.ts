/**
 * Validation Utilities
 *
 * Common validation helper functions.
 */

/**
 * Check if value is email
 */
export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if value is UUID
 */
export const isUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Check if value is URL
 */
export const isURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if password is strong
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

/**
 * Check if value is phone number (international format)
 */
export const isPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

/**
 * Check if value is numeric
 */
export const isNumeric = (value: string): boolean => {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
};

/**
 * Check if value is alphanumeric
 */
export const isAlphanumeric = (value: string): boolean => {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(value);
};

/**
 * Check if value is within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Check if array has minimum length
 */
export const hasMinLength = <T>(array: T[], minLength: number): boolean => {
  return array.length >= minLength;
};

/**
 * Check if array has maximum length
 */
export const hasMaxLength = <T>(array: T[], maxLength: number): boolean => {
  return array.length <= maxLength;
};

/**
 * Check if value is valid JSON
 */
export const isValidJSON = (value: string): boolean => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if value is positive number
 */
export const isPositive = (value: number): boolean => {
  return value > 0;
};

/**
 * Check if value is non-negative number
 */
export const isNonNegative = (value: number): boolean => {
  return value >= 0;
};

/**
 * Check if string matches pattern
 */
export const matchesPattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};

/**
 * Validate required fields in object
 */
export const hasRequiredFields = <T extends object>(
  obj: T,
  requiredFields: (keyof T)[]
): boolean => {
  return requiredFields.every(field => obj[field] !== undefined && obj[field] !== null);
};
