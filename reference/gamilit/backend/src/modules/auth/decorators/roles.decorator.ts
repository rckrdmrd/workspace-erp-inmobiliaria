import { SetMetadata } from '@nestjs/common';
import { GamilityRoleEnum } from '@/shared/constants';

/**
 * Decorador @Roles()
 *
 * @description Define los roles permitidos para acceder a una ruta.
 * Debe usarse junto con RolesGuard.
 *
 * @usage
 * @Roles(GamilityRoleEnum.TEACHER, GamilityRoleEnum.ADMIN)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * async teacherRoute() {
 *   // Solo TEACHER y ADMIN pueden acceder
 * }
 */
export const Roles = (...roles: GamilityRoleEnum[]) => SetMetadata('roles', roles);
