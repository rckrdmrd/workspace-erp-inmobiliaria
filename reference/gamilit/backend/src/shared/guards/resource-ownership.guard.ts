import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Metadata key para identificar el campo de ownership
 */
export const OWNERSHIP_FIELD_KEY = 'ownership_field';

/**
 * Decorator para especificar el campo de ownership
 * Usa: @OwnershipField('userId') o @OwnershipField('authorId')
 */
export const OwnershipField = (field: string) =>
  Reflect.metadata(OWNERSHIP_FIELD_KEY, field);

/**
 * Resource Ownership Guard
 *
 * Verifica que el usuario sea dueño del recurso que está intentando acceder/modificar
 *
 * Extrae el ID del recurso de:
 * 1. params.userId, params.id, params.resourceId
 * 2. body.userId
 * 3. query.userId
 *
 * Los administradores pueden acceder a cualquier recurso
 */
@Injectable()
export class ResourceOwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario, denegar
    if (!user) {
      throw new ForbiddenException('No user authenticated');
    }

    // Administradores pueden acceder a todo
    if (
      user.role === 'super_admin' ||
      user.role === 'admin' ||
      user.roles?.includes('admin')
    ) {
      return true;
    }

    // Obtener campo de ownership del decorator (si existe)
    const ownershipField = this.reflector.get<string>(
      OWNERSHIP_FIELD_KEY,
      context.getHandler(),
    );

    // Extraer ID del recurso
    const resourceUserId = this.extractResourceUserId(
      request,
      ownershipField,
    );

    // Si no se puede determinar el owner, denegar por seguridad
    if (!resourceUserId) {
      throw new BadRequestException(
        'Cannot determine resource ownership. Missing user identifier.',
      );
    }

    // Verificar que el usuario sea el dueño
    const currentUserId = user.sub || user.id || user.userId;

    if (resourceUserId !== currentUserId) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }

  /**
   * Extrae el user ID del recurso de params, body o query
   */
  private extractResourceUserId(
    request: any,
    ownershipField?: string,
  ): string | null {
    const { params, body, query } = request;

    // Si se especificó un campo custom
    if (ownershipField) {
      return (
        params[ownershipField] || body[ownershipField] || query[ownershipField]
      );
    }

    // Intentar campos comunes
    const commonFields = [
      'userId',
      'user_id',
      'id',
      'resourceId',
      'ownerId',
      'authorId',
      'creatorId',
    ];

    for (const field of commonFields) {
      const value = params[field] || body[field] || query[field];
      if (value) {
        return value;
      }
    }

    return null;
  }
}
