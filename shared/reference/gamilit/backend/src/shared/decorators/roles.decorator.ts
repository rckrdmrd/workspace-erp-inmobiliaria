/**
 * Roles Decorator
 *
 * Specifies required roles for accessing a route.
 * Usage: @Roles('admin', 'teacher') above controller method.
 */

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Roles decorator
 *
 * Use this decorator to specify which roles can access a route.
 * Combine with a RolesGuard to enforce role-based access control.
 *
 * @param roles - Array of role names required to access the route
 *
 * @example
 * @Roles('admin', 'super_admin')
 * @Delete('users/:id')
 * deleteUser() { ... }
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
