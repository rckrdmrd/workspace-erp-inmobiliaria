import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from '@shared/utils/logger.util';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Log request
    logger.info(`[${method}] ${originalUrl} - ${ip} - ${userAgent}`);

    // Log response when finished
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      const logMessage = `[${method}] ${originalUrl} ${statusCode} - ${duration}ms`;

      if (statusCode >= 500) {
        logger.error(logMessage);
      } else if (statusCode >= 400) {
        logger.warn(logMessage);
      } else {
        logger.info(logMessage);
      }
    });

    next();
  }
}
