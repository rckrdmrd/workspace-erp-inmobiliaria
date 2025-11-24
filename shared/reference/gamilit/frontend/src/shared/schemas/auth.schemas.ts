/**
 * Auth Validation Schemas
 * Zod schemas for authentication form validation
 *
 * These schemas enforce:
 * - Email format validation
 * - Password complexity requirements
 * - Password confirmation matching
 * - Terms acceptance
 *
 * @requires zod - Install with: npm install zod @hookform/resolvers
 */

import { z } from 'zod';

/**
 * Password validation regex patterns
 */
const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

/**
 * Login Schema
 * Validates user login credentials
 *
 * Fields:
 * - email: Must be a valid email format
 * - password: Minimum 8 characters (no complexity required for login)
 *
 * @example
 * ```typescript
 * const formData = loginSchema.parse({
 *   email: "user@example.com",
 *   password: "password123"
 * });
 * ```
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Por favor ingresa un correo electrónico válido'),

  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

/**
 * Register Schema
 * Validates new user registration data with password complexity rules
 *
 * Fields:
 * - email: Valid email format, required
 * - password: Min 8 chars, must contain uppercase, lowercase, number, and special char
 * - confirmPassword: Must match password
 * - full_name: Optional, min 2 characters if provided
 * - role: Optional, must be one of: student, admin_teacher, super_admin
 * - terms_accepted: Must be true (required checkbox)
 *
 * @example
 * ```typescript
 * const formData = registerSchema.parse({
 *   email: "user@example.com",
 *   password: "SecurePass123!",
 *   confirmPassword: "SecurePass123!",
 *   full_name: "John Doe",
 *   role: "student",
 *   terms_accepted: true
 * });
 * ```
 */
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'El correo electrónico es requerido')
      .email('Por favor ingresa un correo electrónico válido'),

    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        PASSWORD_REGEX.uppercase,
        'La contraseña debe contener al menos una letra mayúscula'
      )
      .regex(
        PASSWORD_REGEX.lowercase,
        'La contraseña debe contener al menos una letra minúscula'
      )
      .regex(
        PASSWORD_REGEX.number,
        'La contraseña debe contener al menos un número'
      )
      .regex(
        PASSWORD_REGEX.special,
        'La contraseña debe contener al menos un carácter especial (!@#$%^&*...)'
      ),

    confirmPassword: z
      .string()
      .min(1, 'Por favor confirma tu contraseña'),

    full_name: z
      .string()
      .min(2, 'El nombre completo debe tener al menos 2 caracteres')
      .optional()
      .or(z.literal('')),

    role: z
      .enum(['student', 'admin_teacher', 'super_admin'], {
        message: 'Por favor selecciona un rol válido',
      })
      .optional(),

    terms_accepted: z
      .boolean()
      .refine((val) => val === true, {
        message: 'Debes aceptar los términos y condiciones',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

/**
 * Forgot Password Schema
 * Validates email for password reset requests
 *
 * @example
 * ```typescript
 * const formData = forgotPasswordSchema.parse({
 *   email: "user@example.com"
 * });
 * ```
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Por favor ingresa un correo electrónico válido'),
});

/**
 * Reset Password Schema
 * Validates new password and confirmation for password reset
 *
 * @example
 * ```typescript
 * const formData = resetPasswordSchema.parse({
 *   password: "NewSecurePass123!",
 *   confirmPassword: "NewSecurePass123!"
 * });
 * ```
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        PASSWORD_REGEX.uppercase,
        'La contraseña debe contener al menos una letra mayúscula'
      )
      .regex(
        PASSWORD_REGEX.lowercase,
        'La contraseña debe contener al menos una letra minúscula'
      )
      .regex(
        PASSWORD_REGEX.number,
        'La contraseña debe contener al menos un número'
      )
      .regex(
        PASSWORD_REGEX.special,
        'La contraseña debe contener al menos un carácter especial'
      ),

    confirmPassword: z
      .string()
      .min(1, 'Por favor confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

/**
 * Type exports for form data
 * Use these types with React Hook Form
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Password strength calculator
 * Returns strength level and score for password validation feedback
 *
 * @param password - The password to evaluate
 * @returns Object with strength level and score (0-4)
 *
 * @example
 * ```typescript
 * const strength = calculatePasswordStrength("MyPass123!");
 * // Returns: { strength: "strong", score: 4 }
 * ```
 */
export const calculatePasswordStrength = (
  password: string
): { strength: 'weak' | 'medium' | 'strong'; score: number } => {
  let score = 0;

  if (!password) return { strength: 'weak', score: 0 };

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Complexity checks
  if (PASSWORD_REGEX.uppercase.test(password)) score++;
  if (PASSWORD_REGEX.lowercase.test(password)) score++;
  if (PASSWORD_REGEX.number.test(password)) score++;
  if (PASSWORD_REGEX.special.test(password)) score++;

  // Determine strength level
  if (score <= 2) return { strength: 'weak', score };
  if (score <= 4) return { strength: 'medium', score };
  return { strength: 'strong', score };
};
