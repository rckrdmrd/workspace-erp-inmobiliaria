import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Generate unique request ID
    const requestId = randomUUID();

    // Attach to request
    req.requestId = requestId;

    // Add to response headers
    res.setHeader('X-Request-ID', requestId);

    next();
  }
}
