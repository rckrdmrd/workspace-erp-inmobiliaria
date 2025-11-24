import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Logging Interceptor
 *
 * Interceptor dedicado para logging completo de requests/responses
 * Incluye información del usuario autenticado si está disponible
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, ip, body, query, params } = request;
    const userAgent = request.get('user-agent') || 'Unknown';
    const requestId = request.id || 'N/A';
    const user = request.user;
    const startTime = Date.now();

    // Log de request entrante
    this.logger.log(
      `Incoming ${method} ${url} - RequestID: ${requestId} - IP: ${ip}` +
        (user ? ` - User: ${user.email || user.sub}` : ' - Anonymous'),
    );

    // Log de body/query/params solo en modo debug
    if (process.env.LOG_LEVEL === 'debug') {
      if (Object.keys(query).length > 0) {
        this.logger.debug(`Query params: ${JSON.stringify(query)}`);
      }
      if (Object.keys(params).length > 0) {
        this.logger.debug(`Route params: ${JSON.stringify(params)}`);
      }
      if (body && Object.keys(body).length > 0) {
        // Ocultar campos sensibles
        const sanitizedBody = this.sanitizeBody(body);
        this.logger.debug(`Request body: ${JSON.stringify(sanitizedBody)}`);
      }
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          this.logger.log(
            `Outgoing ${method} ${url} ${statusCode} - ${duration}ms - RequestID: ${requestId}`,
          );

          // Log de response solo en modo debug
          if (process.env.LOG_LEVEL === 'debug' && data) {
            // Truncar data si es muy grande
            const dataString = JSON.stringify(data);
            const truncatedData =
              dataString.length > 500
                ? dataString.substring(0, 500) + '...'
                : dataString;
            this.logger.debug(`Response data: ${truncatedData}`);
          }
        },
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;

        this.logger.error(
          `Error ${method} ${url} ${statusCode} - ${duration}ms - RequestID: ${requestId}`,
        );
        this.logger.error(`Error message: ${error.message}`);
        if (error.stack && process.env.LOG_LEVEL === 'debug') {
          this.logger.error(`Stack trace: ${error.stack}`);
        }

        return throwError(() => error);
      }),
    );
  }

  /**
   * Sanitiza el body removiendo campos sensibles
   */
  private sanitizeBody(body: any): any {
    const sensitiveFields = [
      'password',
      'passwordConfirm',
      'oldPassword',
      'newPassword',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
      'apiKey',
      'creditCard',
      'cvv',
      'ssn',
    ];

    if (typeof body !== 'object' || body === null) {
      return body;
    }

    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }

    // Sanitizar anidados
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeBody(sanitized[key]);
      }
    }

    return sanitized;
  }
}
