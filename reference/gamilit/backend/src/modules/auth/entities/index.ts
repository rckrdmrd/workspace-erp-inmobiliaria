/**
 * Auth Entities - Barrel Exports
 *
 * @description Exporta todas las entidades del módulo auth
 * @usage import { User, Profile, UserRole, AuthProvider, Membership } from '@/modules/auth/entities';
 */

export * from './user.entity';
export * from './profile.entity';
export * from './tenant.entity';
export * from './role.entity'; // ✨ NUEVO - RBAC
export * from './user-role.entity';
export * from './auth-provider.entity';
export * from './membership.entity';
export * from './auth-attempt.entity';
export * from './user-session.entity';
export * from './email-verification-token.entity';
export * from './password-reset-token.entity';
export * from './security-event.entity'; // ✨ NUEVO - P0 (Auditoría de seguridad)
export * from './user-preferences.entity'; // ✨ NUEVO - P0 (DB-100 Ciclo B.1 - 2025-11-11)
export * from './user-suspension.entity'; // ✨ NUEVO - P0 (DB-100 Ciclo B.2 - 2025-11-11)
