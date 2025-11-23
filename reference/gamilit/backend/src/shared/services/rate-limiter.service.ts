/**
 * Rate Limiter Service
 *
 * Implements rate limiting for API endpoints
 */

export interface RateLimitConfig {
  readonly windowMs: number;
  readonly maxRequests: number;
}

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const requestCounts = new Map<string, RateLimitRecord>();

/**
 * Custom error for rate limit exceeded
 */
export class TooManyRequestsError extends Error {
  public readonly statusCode: number = 429;
  public readonly retryAfter: number;

  constructor(message: string = 'Too many requests', retryAfter: number = 60) {
    super(message);
    this.name = 'TooManyRequestsError';
    this.retryAfter = retryAfter;

    // Restore prototype chain
    Object.setPrototypeOf(this, TooManyRequestsError.prototype);
  }
}

export interface RateLimiter {
  check(key: string): boolean;
  checkLimit(userId: string, resourceId: string): Promise<void>;
  reset(key: string): void;
}

/**
 * Get or create rate limiter for a specific key
 */
export function getRateLimiter(config?: RateLimitConfig): RateLimiter {
  // Default config: 1 request per 5 seconds
  const defaultConfig: RateLimitConfig = {
    windowMs: 5000,
    maxRequests: 1,
  };

  const finalConfig: RateLimitConfig = config ?? defaultConfig;

  return {
    check: (key: string): boolean => {
      const now = Date.now();
      const record = requestCounts.get(key);

      // Reset if window has passed
      if (record === undefined || now > record.resetAt) {
        requestCounts.set(key, {
          count: 1,
          resetAt: now + finalConfig.windowMs,
        });
        return true;
      }

      // Check if limit exceeded
      if (record.count >= finalConfig.maxRequests) {
        return false;
      }

      // Increment count
      record.count++;
      return true;
    },

    checkLimit: async (userId: string, resourceId: string): Promise<void> => {
      const key = `${userId}:${resourceId}`;
      const now = Date.now();
      const record = requestCounts.get(key);

      if (record === undefined || now > record.resetAt) {
        requestCounts.set(key, {
          count: 1,
          resetAt: now + finalConfig.windowMs,
        });
        return;
      }

      if (record.count >= finalConfig.maxRequests) {
        const retryAfter = Math.ceil((record.resetAt - now) / 1000);
        throw new TooManyRequestsError(
          'Too many requests. Please try again later.',
          retryAfter
        );
      }

      record.count++;
    },

    reset: (key: string): void => {
      requestCounts.delete(key);
    },
  };
}

export interface RateLimitRequest {
  ip: string;
  path: string;
}

export interface RateLimitResponse {
  status(code: number): RateLimitResponse;
  json(data: unknown): void;
}

export type NextFunction = () => void;

export type RateLimitMiddleware = (
  req: RateLimitRequest,
  res: RateLimitResponse,
  next: NextFunction
) => void;

/**
 * Middleware to apply rate limiting
 */
export function rateLimitMiddleware(
  config: RateLimitConfig
): RateLimitMiddleware {
  const limiter = getRateLimiter(config);

  return (
    req: RateLimitRequest,
    res: RateLimitResponse,
    next: NextFunction
  ): void => {
    const key = `${req.ip}:${req.path}`;

    if (!limiter.check(key)) {
      throw new TooManyRequestsError(
        'Rate limit exceeded. Please try again later.'
      );
    }

    next();
  };
}

/**
 * Clear all rate limit records
 */
export function clearAllRateLimits(): void {
  requestCounts.clear();
}
