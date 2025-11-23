import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GamilityRoleEnum } from '@shared/constants/enums.constants';

/**
 * TeacherGuard
 *
 * @description Guard para verificar que el usuario tiene rol de profesor
 * @module teacher/guards
 *
 * Uso:
 * @UseGuards(JwtAuthGuard, TeacherGuard)
 *
 * Validaciones:
 * - Requiere que user esté autenticado (JwtAuthGuard debe ejecutarse primero)
 * - Verifica que user.role es 'admin_teacher' o 'super_admin'
 *
 * @example
 * @Controller('teacher/classrooms')
 * @UseGuards(JwtAuthGuard, TeacherGuard)
 * export class TeacherClassroomsController {
 *   // Solo usuarios con rol de profesor pueden acceder
 * }
 */
@Injectable()
export class TeacherGuard implements CanActivate {
  /**
   * Determina si la petición puede continuar
   *
   * @param context Contexto de ejecución de NestJS
   * @returns true si el usuario es profesor, false en caso contrario
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario autenticado, rechazar
    // (esto debería ser manejado por JwtAuthGuard, pero validamos por seguridad)
    if (!user || !user.role) {
      return false;
    }

    // Verificar que el usuario tiene rol de profesor
    const allowedRoles = [
      GamilityRoleEnum.ADMIN_TEACHER,
      GamilityRoleEnum.SUPER_ADMIN,
    ];

    return allowedRoles.includes(user.role);
  }
}
