/**
 * Audit Interceptor
 *
 * Automatically logs HTTP requests for auditing purposes
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { AuditService } from '../services/audit.service';
import { ActorType, Severity, Status } from '../entities/audit-log.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, body, user } = request;

    // Skip audit logging for certain endpoints
    if (this.shouldSkipAudit(url)) {
      return next.handle();
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (response) => {
          const duration = Date.now() - startTime;

          // Only log certain HTTP methods
          if (this.shouldLogMethod(method)) {
            this.logAuditEvent(request, response, Status.SUCCESS, duration);
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;

          // Log errors for all methods
          this.logAuditEvent(request, null, Status.FAILURE, duration, error);
        },
      }),
    );
  }

  /**
   * Determine if audit logging should be skipped for this URL
   */
  private shouldSkipAudit(url: string): boolean {
    const skipPatterns = [
      '/health',
      '/metrics',
      '/api/auth/refresh', // Too frequent
      '/api/notifications', // Too frequent
      '/socket.io', // WebSocket connections
    ];

    return skipPatterns.some((pattern) => url.includes(pattern));
  }

  /**
   * Determine if this HTTP method should be logged
   */
  private shouldLogMethod(method: string): boolean {
    // Log POST, PUT, PATCH, DELETE (mutations)
    // Skip GET, HEAD, OPTIONS (reads)
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
  }

  /**
   * Log the audit event
   */
  private async logAuditEvent(
    request: Request,
    response: any,
    status: Status,
    duration: number,
    error?: any,
  ): Promise<void> {
    try {
      const { method, url, body, user } = request;
      const actorId = (user as any)?.userId || (user as any)?.sub || undefined;
      const actorIp = this.getClientIp(request);
      const actorUserAgent = request.headers['user-agent'] || undefined;

      // Extract resource information from URL
      const { resourceType, resourceId, action } = this.parseUrl(url, method);

      await this.auditService.logEvent({
        eventType: `http_${method.toLowerCase()}_${action}`,
        action,
        resourceType: resourceType || undefined,
        resourceId: resourceId || undefined,
        actorId,
        actorType: actorId ? ActorType.USER : ActorType.SYSTEM,
        actorIp: actorIp || undefined,
        actorUserAgent,
        description: `${method} ${url}`,
        severity: error ? Severity.ERROR : Severity.INFO,
        status,
        errorCode: error?.status?.toString() || undefined,
        errorMessage: error?.message || undefined,
        stackTrace: error?.stack || undefined,
        additionalData: {
          method,
          url,
          body: this.sanitizeBody(body),
          duration,
          statusCode: error?.status || 200,
        },
        tags: ['http', method.toLowerCase(), status],
      });
    } catch (err) {
      // Don't throw - just log the error
      this.logger.error('Failed to log audit event:', err);
    }
  }

  /**
   * Parse URL to extract resource type, ID, and action
   */
  private parseUrl(url: string, method: string): {
    resourceType: string | null;
    resourceId: string | null;
    action: string;
  } {
    // Remove query string
    const path = url.split('?')[0];

    // Split by '/' and filter empty strings
    const segments = path.split('/').filter((s) => s);

    // Try to extract resource type and ID
    // Pattern: /api/{module}/{resource}/{id}
    let resourceType: string | null = null;
    let resourceId: string | null = null;

    if (segments.length >= 3) {
      resourceType = segments[2]; // e.g., 'users', 'organizations'
      if (segments.length >= 4 && this.isUuid(segments[3])) {
        resourceId = segments[3];
      }
    }

    // Determine action from HTTP method
    const actionMap: Record<string, string> = {
      POST: 'create',
      GET: 'read',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
    };

    const action = actionMap[method.toUpperCase()] || 'unknown';

    return { resourceType, resourceId, action };
  }

  /**
   * Check if string is a UUID
   */
  private isUuid(str: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  /**
   * Get client IP address
   */
  private getClientIp(request: Request): string | null {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (request.headers['x-real-ip'] as string) ||
      request.socket.remoteAddress ||
      null
    );
  }

  /**
   * Sanitize request body to remove sensitive data
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...body };

    // Remove sensitive fields
    const sensitiveFields = [
      'password',
      'newPassword',
      'oldPassword',
      'currentPassword',
      'token',
      'accessToken',
      'refreshToken',
      'apiKey',
      'secret',
      'creditCard',
      'ssn',
    ];

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
