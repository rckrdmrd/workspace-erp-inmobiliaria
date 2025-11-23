import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Declaración global para performanceMetrics
declare global {
  var performanceMetrics: any[] | undefined;
}

/**
 * Performance Interceptor
 *
 * Mide el tiempo de respuesta de cada request y:
 * - Agrega header X-Response-Time
 * - Log de warning para requests lentos (>3s)
 * - Métricas de performance
 */
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);
  private readonly SLOW_REQUEST_THRESHOLD = 3000; // 3 segundos

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Agregar header de tiempo de respuesta
          response.setHeader('X-Response-Time', `${duration}ms`);

          // Log de request completado
          this.logger.debug(
            `${method} ${url} ${statusCode} - ${duration}ms - ${ip} - ${userAgent}`,
          );

          // Warning para requests lentos
          if (duration > this.SLOW_REQUEST_THRESHOLD) {
            this.logger.warn(
              `Slow request detected: ${method} ${url} took ${duration}ms`,
            );
          }

          // Métricas adicionales para monitoreo
          if (process.env.ENABLE_METRICS === 'true') {
            this.recordMetrics({
              method,
              url,
              statusCode,
              duration,
              ip,
              userAgent,
            });
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `${method} ${url} failed after ${duration}ms - ${error.message}`,
          );
          response.setHeader('X-Response-Time', `${duration}ms`);
        },
      }),
    );
  }

  private recordMetrics(metrics: {
    method: string;
    url: string;
    statusCode: number;
    duration: number;
    ip: string;
    userAgent: string;
  }) {
    // Aquí se pueden enviar métricas a sistemas como Prometheus, DataDog, etc.
    // Por ahora solo guardamos en memoria (podría extenderse a Redis)
    if (global.performanceMetrics === undefined) {
      global.performanceMetrics = [];
    }

    global.performanceMetrics.push({
      ...metrics,
      timestamp: new Date().toISOString(),
    });

    // Mantener solo las últimas 1000 métricas en memoria
    if (global.performanceMetrics.length > 1000) {
      global.performanceMetrics.shift();
    }
  }
}
