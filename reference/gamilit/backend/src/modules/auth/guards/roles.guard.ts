import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GamilityRoleEnum } from '@/shared/constants';

/**
 * RolesGuard
 *
 * @description Guard para verificar roles de usuario.
 * Funciona en conjunto con el decorador @Roles()
 *
 * @usage
 * @Roles(GamilityRoleEnum.TEACHER, GamilityRoleEnum.ADMIN)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * async teacherOnlyRoute(@Request() req) {
 *   // Solo accesible para TEACHER y ADMIN
 * }
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener roles requeridos del decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<GamilityRoleEnum[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtener usuario del request (poblado por JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Verificar si el usuario no existe
    if (!user) {
      return false;
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    return requiredRoles.some((role) => user.role === role);
  }
}
