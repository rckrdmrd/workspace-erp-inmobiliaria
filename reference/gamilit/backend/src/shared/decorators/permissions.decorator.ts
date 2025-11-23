import { SetMetadata } from '@nestjs/common';

/**
 * Key para metadata de permisos
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * @Permissions Decorator
 *
 * Especifica los permisos requeridos para acceder a una ruta
 * Usa: @Permissions('users:read', 'users:write')
 *
 * Debe usarse junto con PermissionsGuard
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Enum de permisos comunes
 * Expandir según necesidades del sistema
 */
export enum Permission {
  // Users
  USERS_READ = 'users:read',
  USERS_WRITE = 'users:write',
  USERS_DELETE = 'users:delete',
  USERS_MANAGE = 'users:manage',

  // Content
  CONTENT_READ = 'content:read',
  CONTENT_WRITE = 'content:write',
  CONTENT_DELETE = 'content:delete',
  CONTENT_PUBLISH = 'content:publish',
  CONTENT_MANAGE = 'content:manage',

  // Gamification
  GAMIFICATION_READ = 'gamification:read',
  GAMIFICATION_WRITE = 'gamification:write',
  GAMIFICATION_MANAGE = 'gamification:manage',

  // Admin
  ADMIN_ACCESS = 'admin:access',
  ADMIN_SETTINGS = 'admin:settings',
  ADMIN_SYSTEM = 'admin:system',

  // Analytics
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_EXPORT = 'analytics:export',

  // Teacher
  TEACHER_ACCESS = 'teacher:access',
  TEACHER_CLASSROOM = 'teacher:classroom',
  TEACHER_ASSIGNMENTS = 'teacher:assignments',
  TEACHER_GRADING = 'teacher:grading',
}
