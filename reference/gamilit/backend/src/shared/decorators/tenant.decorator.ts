import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @Tenant Decorator
 *
 * Extrae el tenant ID del usuario autenticado
 * Usa: @Tenant() tenantId: string
 */
export const Tenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return user?.tenantId || null;
  },
);

/**
 * @RequireTenant Decorator
 *
 * Marca que una ruta requiere que el usuario tenga un tenant asignado
 */
export const REQUIRE_TENANT_KEY = 'require_tenant';
export const RequireTenant = () =>
  Reflect.metadata(REQUIRE_TENANT_KEY, true);
