import { z } from 'zod';

/**
 * Schema de validación para el formulario de login
 * Validaciones básicas de email y contraseña
 */
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email requerido')
    .email('Email inválido'),
  password: z.string()
    .min(8, 'Contraseña debe tener al menos 8 caracteres'),
  rememberMe: z.boolean().optional()
});

/**
 * Schema de validación para el formulario de registro
 * Incluye validaciones avanzadas de contraseña y confirmación
 */
export const registerSchema = z.object({
  fullName: z.string()
    .min(3, 'Nombre completo debe tener al menos 3 caracteres')
    .max(100, 'Nombre muy largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo puede contener letras'),
  email: z.string()
    .min(1, 'Email requerido')
    .email('Email inválido')
    .toLowerCase(),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un símbolo especial'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

/**
 * Schema de validación para solicitud de recuperación de contraseña
 */
export const passwordRecoverySchema = z.object({
  email: z.string()
    .min(1, 'Email requerido')
    .email('Email inválido')
});

/**
 * Schema de validación para restablecer contraseña
 * Incluye validaciones de fortaleza y confirmación
 */
export const passwordResetSchema = z.object({
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un símbolo especial'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

/**
 * Schema de validación para código 2FA
 */
export const twoFactorSchema = z.object({
  code: z.string()
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^\d+$/, 'El código solo debe contener números')
});

// Types exportados para TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PasswordRecoveryFormData = z.infer<typeof passwordRecoverySchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
export type TwoFactorFormData = z.infer<typeof twoFactorSchema>;
