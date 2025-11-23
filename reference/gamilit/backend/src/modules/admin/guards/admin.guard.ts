import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * AdminGuard
 *
 * @description Guard para proteger rutas administrativas.
 * Verifica que el usuario tenga rol de 'admin' o 'super_admin'.
 *
 * @usage
 * @UseGuards(JwtAuthGuard, AdminGuard)
 * async adminOnlyRoute() { ... }
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Verificar si el usuario tiene rol admin o super_admin
    const isAdmin =
      user.role === 'admin' || user.role === 'super_admin';

    if (!isAdmin) {
      throw new ForbiddenException(
        'Access denied. Admin privileges required.',
      );
    }

    return true;
  }
}
