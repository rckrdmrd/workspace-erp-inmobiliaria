/**
 * Rate Limiter Service Tests
 */

import {
  getRateLimiter,
  rateLimitMiddleware,
  TooManyRequestsError,
  clearAllRateLimits,
  type RateLimitConfig,
  type RateLimitRequest,
  type RateLimitResponse,
} from '../../../shared/services/rate-limiter.service';

describe('TooManyRequestsError', () => {
  it('should create error with default message and retry after', () => {
    const error = new TooManyRequestsError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(TooManyRequestsError);
    expect(error.name).toBe('TooManyRequestsError');
    expect(error.message).toBe('Too many requests');
    expect(error.statusCode).toBe(429);
    expect(error.retryAfter).toBe(60);
  });

  it('should create error with custom message and retry after', () => {
    const error = new TooManyRequestsError('Custom message', 120);

    expect(error.message).toBe('Custom message');
    expect(error.retryAfter).toBe(120);
    expect(error.statusCode).toBe(429);
  });

  it('should maintain proper prototype chain', () => {
    const error = new TooManyRequestsError();

    expect(error instanceof Error).toBe(true);
    expect(error instanceof TooManyRequestsError).toBe(true);
  });
});

describe('getRateLimiter', () => {
  beforeEach(() => {
    clearAllRateLimits();
  });

  afterEach(() => {
    clearAllRateLimits();
  });

  describe('check method', () => {
    it('should allow first request', () => {
      const limiter = getRateLimiter();
      const result = limiter.check('test-key');

      expect(result).toBe(true);
    });

    it('should block request when limit exceeded with default config', () => {
      const limiter = getRateLimiter();

      // First request should pass
      expect(limiter.check('test-key')).toBe(true);

      // Second request should be blocked (default: 1 request per window)
      expect(limiter.check('test-key')).toBe(false);
    });

    it('should allow multiple requests within custom limit', () => {
      const config: RateLimitConfig = {
        windowMs: 10000,
        maxRequests: 3,
      };
      const limiter = getRateLimiter(config);

      expect(limiter.check('test-key')).toBe(true);
      expect(limiter.check('test-key')).toBe(true);
      expect(limiter.check('test-key')).toBe(true);
      expect(limiter.check('test-key')).toBe(false);
    });

    it('should reset counter after window expires', async () => {
      const config: RateLimitConfig = {
        windowMs: 50,
        maxRequests: 1,
      };
      const limiter = getRateLimiter(config);

      // First request
      expect(limiter.check('test-key')).toBe(true);

      // Second request should be blocked
      expect(limiter.check('test-key')).toBe(false);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 60));

      // Should allow request after window reset
      expect(limiter.check('test-key')).toBe(true);
    });

    it('should handle multiple keys independently', () => {
      const limiter = getRateLimiter();

      expect(limiter.check('key-1')).toBe(true);
      expect(limiter.check('key-2')).toBe(true);
      expect(limiter.check('key-1')).toBe(false);
      expect(limiter.check('key-2')).toBe(false);
    });
  });

  describe('checkLimit method', () => {
    it('should allow first request without throwing', async () => {
      const limiter = getRateLimiter();

      await expect(
        limiter.checkLimit('user-1', 'resource-1')
      ).resolves.toBeUndefined();
    });

    it('should throw TooManyRequestsError when limit exceeded', async () => {
      const limiter = getRateLimiter();

      await limiter.checkLimit('user-1', 'resource-1');

      await expect(
        limiter.checkLimit('user-1', 'resource-1')
      ).rejects.toThrow(TooManyRequestsError);
    });

    it('should throw error with correct retry after', async () => {
      const config: RateLimitConfig = {
        windowMs: 10000,
        maxRequests: 1,
      };
      const limiter = getRateLimiter(config);

      await limiter.checkLimit('user-1', 'resource-1');

      try {
        await limiter.checkLimit('user-1', 'resource-1');
        fail('Should have thrown TooManyRequestsError');
      } catch (error) {
        expect(error).toBeInstanceOf(TooManyRequestsError);
        if (error instanceof TooManyRequestsError) {
          expect(error.retryAfter).toBeGreaterThan(0);
          expect(error.retryAfter).toBeLessThanOrEqual(10);
        }
      }
    });

    it('should allow request after window expires', async () => {
      const config: RateLimitConfig = {
        windowMs: 50,
        maxRequests: 1,
      };
      const limiter = getRateLimiter(config);

      await limiter.checkLimit('user-1', 'resource-1');

      await expect(
        limiter.checkLimit('user-1', 'resource-1')
      ).rejects.toThrow(TooManyRequestsError);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 60));

      await expect(
        limiter.checkLimit('user-1', 'resource-1')
      ).resolves.toBeUndefined();
    });

    it('should handle different user-resource combinations independently', async () => {
      const limiter = getRateLimiter();

      await expect(
        limiter.checkLimit('user-1', 'resource-1')
      ).resolves.toBeUndefined();

      await expect(
        limiter.checkLimit('user-2', 'resource-1')
      ).resolves.toBeUndefined();

      await expect(
        limiter.checkLimit('user-1', 'resource-2')
      ).resolves.toBeUndefined();
    });
  });

  describe('reset method', () => {
    it('should reset counter for specific key', () => {
      const limiter = getRateLimiter();

      // Use up the limit
      expect(limiter.check('test-key')).toBe(true);
      expect(limiter.check('test-key')).toBe(false);

      // Reset and try again
      limiter.reset('test-key');
      expect(limiter.check('test-key')).toBe(true);
    });

    it('should only reset specified key', () => {
      const limiter = getRateLimiter();

      // Use up limits for both keys
      expect(limiter.check('key-1')).toBe(true);
      expect(limiter.check('key-2')).toBe(true);

      // Reset only key-1
      limiter.reset('key-1');

      expect(limiter.check('key-1')).toBe(true);
      expect(limiter.check('key-2')).toBe(false);
    });

    it('should handle reset of non-existent key', () => {
      const limiter = getRateLimiter();

      expect(() => limiter.reset('non-existent-key')).not.toThrow();
    });
  });

  describe('config handling', () => {
    it('should use default config when none provided', () => {
      const limiter = getRateLimiter();

      expect(limiter.check('test-key')).toBe(true);
      expect(limiter.check('test-key')).toBe(false);
    });

    it('should use provided config', () => {
      const config: RateLimitConfig = {
        windowMs: 10000,
        maxRequests: 5,
      };
      const limiter = getRateLimiter(config);

      // Should allow 5 requests
      for (let i = 0; i < 5; i++) {
        expect(limiter.check('test-key')).toBe(true);
      }

      // 6th request should be blocked
      expect(limiter.check('test-key')).toBe(false);
    });
  });
});

describe('rateLimitMiddleware', () => {
  beforeEach(() => {
    clearAllRateLimits();
  });

  afterEach(() => {
    clearAllRateLimits();
  });

  it('should call next on first request', () => {
    const config: RateLimitConfig = {
      windowMs: 10000,
      maxRequests: 1,
    };
    const middleware = rateLimitMiddleware(config);
    const mockReq: RateLimitRequest = {
      ip: '127.0.0.1',
      path: '/api/test',
    };
    const mockRes = {} as RateLimitResponse;
    const mockNext = jest.fn();

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should throw error when rate limit exceeded', () => {
    const config: RateLimitConfig = {
      windowMs: 10000,
      maxRequests: 1,
    };
    const middleware = rateLimitMiddleware(config);
    const mockReq: RateLimitRequest = {
      ip: '127.0.0.1',
      path: '/api/test',
    };
    const mockRes = {} as RateLimitResponse;
    const mockNext = jest.fn();

    // First request should succeed
    middleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);

    // Second request should throw
    expect(() => middleware(mockReq, mockRes, mockNext)).toThrow(
      TooManyRequestsError
    );
    expect(mockNext).toHaveBeenCalledTimes(1); // Should not call next again
  });

  it('should handle different IP addresses independently', () => {
    const config: RateLimitConfig = {
      windowMs: 10000,
      maxRequests: 1,
    };
    const middleware = rateLimitMiddleware(config);
    const mockReq1: RateLimitRequest = {
      ip: '127.0.0.1',
      path: '/api/test',
    };
    const mockReq2: RateLimitRequest = {
      ip: '192.168.1.1',
      path: '/api/test',
    };
    const mockRes = {} as RateLimitResponse;
    const mockNext = jest.fn();

    middleware(mockReq1, mockRes, mockNext);
    middleware(mockReq2, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(2);
  });

  it('should handle different paths independently', () => {
    const config: RateLimitConfig = {
      windowMs: 10000,
      maxRequests: 1,
    };
    const middleware = rateLimitMiddleware(config);
    const mockReq1: RateLimitRequest = {
      ip: '127.0.0.1',
      path: '/api/test1',
    };
    const mockReq2: RateLimitRequest = {
      ip: '127.0.0.1',
      path: '/api/test2',
    };
    const mockRes = {} as RateLimitResponse;
    const mockNext = jest.fn();

    middleware(mockReq1, mockRes, mockNext);
    middleware(mockReq2, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(2);
  });

  it('should use provided config for rate limiting', () => {
    const config: RateLimitConfig = {
      windowMs: 10000,
      maxRequests: 3,
    };
    const middleware = rateLimitMiddleware(config);
    const mockReq: RateLimitRequest = {
      ip: '127.0.0.1',
      path: '/api/test',
    };
    const mockRes = {} as RateLimitResponse;
    const mockNext = jest.fn();

    // Should allow 3 requests
    middleware(mockReq, mockRes, mockNext);
    middleware(mockReq, mockRes, mockNext);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(3);

    // 4th request should throw
    expect(() => middleware(mockReq, mockRes, mockNext)).toThrow(
      TooManyRequestsError
    );
  });
});

describe('clearAllRateLimits', () => {
  it('should clear all rate limit records', () => {
    const limiter = getRateLimiter();

    // Create some rate limit records
    limiter.check('key-1');
    limiter.check('key-2');
    limiter.check('key-3');

    // All should be blocked on second attempt
    expect(limiter.check('key-1')).toBe(false);
    expect(limiter.check('key-2')).toBe(false);
    expect(limiter.check('key-3')).toBe(false);

    // Clear all limits
    clearAllRateLimits();

    // All should now pass
    expect(limiter.check('key-1')).toBe(true);
    expect(limiter.check('key-2')).toBe(true);
    expect(limiter.check('key-3')).toBe(true);
  });
});
