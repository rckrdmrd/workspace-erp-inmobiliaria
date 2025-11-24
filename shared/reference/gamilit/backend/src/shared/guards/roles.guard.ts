import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@shared/decorators/roles.decorator';
import { logger } from '@shared/utils/logger.util';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get user from request (attached by AuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      logger.warn('Roles check failed: No user in request');
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has required role
    const hasRole = requiredRoles.some((role: string) => user.roles?.includes(role));

    if (!hasRole) {
      logger.warn(`User ${user.sub} missing required roles: ${requiredRoles.join(', ')}`);
      throw new ForbiddenException('Insufficient permissions');
    }

    logger.debug(`User ${user.sub} authorized with roles: ${user.roles.join(', ')}`);
    return true;
  }
}
