import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Transform Response Interceptor
 *
 * Normaliza todas las respuestas HTTP con el formato:
 * {
 *   success: boolean,
 *   data: any,
 *   timestamp: string,
 *   path: string
 * }
 *
 * También transforma strings ISO de fechas a objetos Date
 */
@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { url } = request;

    return next.handle().pipe(
      map((data) => {
        // Si es un stream de archivo, no transformar
        if (data instanceof Buffer || data?.isStream) {
          return data;
        }

        // Transformar fechas en el objeto
        const transformedData = this.transformDates(data);

        // Estructura de respuesta estándar
        return {
          success: true,
          data: transformedData,
          timestamp: new Date().toISOString(),
          path: url,
        };
      }),
    );
  }

  /**
   * Transforma recursivamente strings ISO a objetos Date
   */
  private transformDates(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    // Si es un string de fecha ISO, convertir a Date
    if (typeof obj === 'string' && this.isISODateString(obj)) {
      return new Date(obj);
    }

    // Si es un array, transformar cada elemento
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformDates(item));
    }

    // Si es un objeto, transformar cada propiedad
    if (typeof obj === 'object') {
      const transformed: Record<string, any> = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          transformed[key] = this.transformDates(obj[key]);
        }
      }
      return transformed;
    }

    return obj;
  }

  /**
   * Verifica si un string es una fecha ISO válida
   */
  private isISODateString(value: string): boolean {
    // Regex para formato ISO 8601
    const isoDateRegex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})?$/;

    if (!isoDateRegex.test(value)) {
      return false;
    }

    // Verificar que sea una fecha válida
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
}

/**
 * Tipo de respuesta estándar
 */
export interface StandardResponse<T = any> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}
