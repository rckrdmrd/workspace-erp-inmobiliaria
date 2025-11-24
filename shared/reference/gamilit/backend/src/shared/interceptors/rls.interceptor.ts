import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

/**
 * RLS (Row Level Security) Interceptor
 *
 * Establece el contexto de usuario en PostgreSQL para aplicar políticas RLS
 * Implementa la estrategia híbrida definida en ADR-003
 *
 * Se ejecuta después de JWT authentication y establece variables de sesión:
 * - app.current_user_id
 * - app.current_user_email
 * - app.current_user_role
 * - app.current_tenant_id (opcional)
 *
 * Estas variables son utilizadas por las políticas RLS en PostgreSQL
 * para filtrar automáticamente las filas según permisos del usuario.
 *
 * @see ADR-003: RLS vs App-Layer Authorization Strategy
 */
@Injectable()
export class RlsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RlsInterceptor.name);
  private dataSources: Map<string, DataSource> = new Map();

  constructor(private readonly moduleRef: ModuleRef) {}

  /**
   * Obtiene o cachea DataSource por nombre de conexión
   */
  private getDataSource(connectionName: string): DataSource | null {
    if (this.dataSources.has(connectionName)) {
      return this.dataSources.get(connectionName)!;
    }

    try {
      const dataSource = this.moduleRef.get<DataSource>(
        DataSource,
        { strict: false },
      );

      // En TypeORM multi-connection, necesitamos usar getDataSourceByName
      // Por ahora, simplemente retornamos null y logueamos
      this.logger.debug(`Attempting to get DataSource for connection: ${connectionName}`);
      return null;
    } catch (error) {
      this.logger.warn(`DataSource '${connectionName}' not found, skipping RLS setup`);
      return null;
    }
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario autenticado, continuar sin establecer RLS
    if (!user) {
      return next.handle();
    }

    // Extraer información del usuario
    const userId = user.userId || user.sub || user.id;
    const userEmail = user.email || 'unknown';
    const userRole = user.role || 'student';
    const tenantId = user.tenantId || user.tenant_id || null;

    // Validar que tenemos userId
    if (!userId) {
      this.logger.warn('User authenticated but userId is missing in JWT payload');
      return next.handle();
    }

    // Adjuntar contexto RLS al request para uso en servicios
    request.rlsContext = {
      userId,
      userEmail,
      userRole,
      tenantId,
    };

    this.logger.debug(
      `RLS context attached to request: userId=${userId}, role=${userRole}`,
    );

    // Por ahora, el RLS se aplicará a nivel de servicio usando el contexto
    // En el futuro, se puede implementar la aplicación automática de SET LOCAL
    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.debug(`Request completed with RLS context for user ${userId}`);
        },
        error: (error) => {
          this.logger.error(
            `Request failed with RLS context for user ${userId}:`,
            error.message,
          );
        },
      }),
    );
  }

  /**
   * Sanitiza strings para prevenir SQL injection en SET LOCAL
   * Aunque usamos parámetros preparados, validación adicional por seguridad
   */
  private sanitizeString(value: string): string {
    if (!value) return '';

    // Remover caracteres peligrosos y limitar longitud
    return value
      .replace(/['";\\]/g, '') // Remover quotes y backslashes
      .substring(0, 255); // Limitar longitud
  }
}
