import { Injectable, NestMiddleware, RequestTimeoutException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimeoutMiddleware implements NestMiddleware {
  private readonly DEFAULT_TIMEOUT = 30000; // 30 seconds

  use(req: Request, res: Response, next: NextFunction): void {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        throw new RequestTimeoutException('Request timeout exceeded');
      }
    }, this.DEFAULT_TIMEOUT);

    res.on('finish', () => {
      clearTimeout(timeout);
    });

    res.on('close', () => {
      clearTimeout(timeout);
    });

    next();
  }
}
