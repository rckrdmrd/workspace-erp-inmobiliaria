import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @CurrentUser Decorator
 *
 * Extrae el usuario autenticado del request
 * Usa: @CurrentUser() user: User
 * O para obtener solo una propiedad: @CurrentUser('email') email: string
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    // Si se especifica una propiedad, devolverla
    return data ? user[data] : user;
  },
);

/**
 * Alias para mantener compatibilidad
 */
export const GetUser = CurrentUser;

/**
 * Interface para el usuario del request
 * Debe coincidir con el payload del JWT
 */
export interface RequestUser {
  sub: string; // User ID
  email: string;
  role?: string;
  roles?: string[];
  tenantId?: string;
  iat?: number;
  exp?: number;
}
