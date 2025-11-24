import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

/**
 * Permissions Guard
 *
 * Verifica que el usuario tenga los permisos requeridos
 * Se usa junto con @Permissions decorator
 *
 * Los permisos se verifican contra user.permissions del JWT payload
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener permisos requeridos del decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay permisos requeridos, permitir acceso
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Obtener usuario del request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario autenticado, denegar
    if (!user) {
      throw new ForbiddenException('No user authenticated');
    }

    // Obtener permisos del usuario
    const userPermissions: string[] = user.permissions || [];

    // Admins tienen todos los permisos
    if (user.role === 'super_admin' || user.role === 'admin') {
      return true;
    }

    // Verificar si el usuario tiene todos los permisos requeridos
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Missing required permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }

  /**
   * Verifica si el usuario tiene al menos uno de los permisos
   */
  private hasAnyPermission(
    userPermissions: string[],
    requiredPermissions: string[],
  ): boolean {
    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }
}
