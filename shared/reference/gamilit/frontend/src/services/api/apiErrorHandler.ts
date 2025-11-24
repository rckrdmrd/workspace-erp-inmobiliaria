/**
 * API Error Handler
 *
 * Centralized error handling utilities for API requests
 */

import { AxiosError } from 'axios';
import type { ApiError } from './apiTypes';

// ============================================================================
// ERROR CLASSES
// ============================================================================

/**
 * Custom API Error class
 */
export class APIError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly data?: any;
  public readonly timestamp: string;

  constructor(
    statusCode: number,
    message: string,
    code: string = 'API_ERROR',
    data?: any
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
    this.data = data;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where error was thrown (if available)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): ApiError {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.data,
      },
      timestamp: this.timestamp,
    };
  }
}

/**
 * Network Error
 */
export class NetworkError extends APIError {
  constructor(message: string = 'Network error occurred', data?: any) {
    super(0, message, 'NETWORK_ERROR', data);
    this.name = 'NetworkError';
  }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication failed', data?: any) {
    super(401, message, 'AUTHENTICATION_ERROR', data);
    this.name = 'AuthenticationError';
  }
}

/**
 * Account Inactive Error
 */
export class AccountInactiveError extends APIError {
  constructor(message: string = 'Account has been deactivated', data?: any) {
    super(401, message, 'ACCOUNT_INACTIVE', data);
    this.name = 'AccountInactiveError';
  }
}

/**
 * Account Suspended Error
 */
export class AccountSuspendedError extends APIError {
  public readonly suspensionDetails?: {
    isPermanent: boolean;
    suspendedUntil?: string;
    reason?: string;
  };

  constructor(
    message: string = 'Account has been suspended',
    suspensionDetails?: { isPermanent: boolean; suspendedUntil?: string; reason?: string },
    data?: any
  ) {
    super(403, message, 'ACCOUNT_SUSPENDED', data);
    this.name = 'AccountSuspendedError';
    this.suspensionDetails = suspensionDetails;
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends APIError {
  constructor(message: string = 'Access forbidden', data?: any) {
    super(403, message, 'AUTHORIZATION_ERROR', data);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends APIError {
  constructor(message: string = 'Resource not found', data?: any) {
    super(404, message, 'NOT_FOUND_ERROR', data);
    this.name = 'NotFoundError';
  }
}

/**
 * Validation Error
 */
export class ValidationError extends APIError {
  constructor(message: string = 'Validation failed', data?: any) {
    super(422, message, 'VALIDATION_ERROR', data);
    this.name = 'ValidationError';
  }
}

/**
 * Rate Limit Error
 */
export class RateLimitError extends APIError {
  public readonly retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number, data?: any) {
    super(429, message, 'RATE_LIMIT_ERROR', data);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Server Error
 */
export class ServerError extends APIError {
  constructor(message: string = 'Internal server error', data?: any) {
    super(500, message, 'SERVER_ERROR', data);
    this.name = 'ServerError';
  }
}

/**
 * Timeout Error
 */
export class TimeoutError extends APIError {
  constructor(message: string = 'Request timeout', data?: any) {
    super(408, message, 'TIMEOUT_ERROR', data);
    this.name = 'TimeoutError';
  }
}

// ============================================================================
// ERROR HANDLERS
// ============================================================================

/**
 * Handle Axios errors and convert to APIError
 * @param error - The error to handle
 * @param contextMessage - Optional context message for better error descriptions
 */
export const handleAPIError = (error: unknown, contextMessage?: string): APIError => {
  // Check if it's already an APIError
  if (error instanceof APIError) {
    return error;
  }

  // Handle Axios errors
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    // Network error (no response)
    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED') {
        return new TimeoutError('Request timeout', {
          url: axiosError.config?.url,
        });
      }

      return new NetworkError('Network error - unable to reach server', {
        url: axiosError.config?.url,
        code: axiosError.code,
      });
    }

    const { status, data } = axiosError.response;
    const message = data?.error?.message || data?.message || axiosError.message;
    const errorData = data?.error?.details || data?.details;
    const errorCode = data?.error?.code || data?.code;

    // Map status codes to specific error types
    switch (status) {
      case 400:
        return new ValidationError(message || 'Bad request', errorData);

      case 401:
        // Check for specific account status errors
        if (errorCode === 'ACCOUNT_INACTIVE') {
          return new AccountInactiveError(message || 'Your account has been deactivated', errorData);
        }
        return new AuthenticationError(message || 'Authentication required', errorData);

      case 403:
        // Check for account suspension
        if (errorCode === 'ACCOUNT_SUSPENDED') {
          const suspensionDetails = errorData?.suspension || errorData;
          return new AccountSuspendedError(
            message || 'Your account has been suspended',
            suspensionDetails,
            errorData
          );
        }
        return new AuthorizationError(message || 'Access forbidden', errorData);

      case 404:
        return new NotFoundError(message || 'Resource not found', errorData);

      case 422:
        return new ValidationError(message || 'Validation failed', errorData);

      case 429:
        const retryAfter = axiosError.response.headers['retry-after'];
        return new RateLimitError(
          message || 'Rate limit exceeded',
          retryAfter ? parseInt(retryAfter) : undefined,
          errorData
        );

      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerError(message || 'Server error', errorData);

      default:
        return new APIError(status, message || 'Unknown error', 'UNKNOWN_ERROR', errorData);
    }
  }

  // Handle generic JavaScript errors
  if (error instanceof Error) {
    return new APIError(500, error.message, 'UNKNOWN_ERROR', {
      originalError: error.name,
    });
  }

  // Handle unknown error types
  return new APIError(500, 'An unknown error occurred', 'UNKNOWN_ERROR', error);
};

/**
 * Check if error is an Axios error
 */
export const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError).isAxiosError === true;
};

/**
 * Check if error is an API error
 */
export const isAPIError = (error: unknown): error is APIError => {
  return error instanceof APIError;
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  return error instanceof NetworkError || (isAxiosError(error) && !error.response);
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  return (
    error instanceof AuthenticationError ||
    (isAPIError(error) && error.statusCode === 401)
  );
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: unknown): boolean => {
  return (
    error instanceof ValidationError ||
    (isAPIError(error) && (error.statusCode === 400 || error.statusCode === 422))
  );
};

/**
 * Check if error is a rate limit error
 */
export const isRateLimitError = (error: unknown): boolean => {
  return (
    error instanceof RateLimitError ||
    (isAPIError(error) && error.statusCode === 429)
  );
};

// ============================================================================
// ERROR FORMATTING
// ============================================================================

/**
 * Format error for display to user
 */
export const formatErrorMessage = (error: unknown): string => {
  const apiError = handleAPIError(error);

  // User-friendly messages for common errors
  if (apiError instanceof NetworkError) {
    return 'No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.';
  }

  if (apiError instanceof TimeoutError) {
    return 'La solicitud tardó demasiado tiempo. Por favor, intenta de nuevo.';
  }

  if (apiError instanceof AccountInactiveError) {
    return 'Tu cuenta ha sido desactivada. Por favor, contacta a tu maestro.';
  }

  if (apiError instanceof AccountSuspendedError) {
    const details = apiError.suspensionDetails;
    if (details?.isPermanent) {
      return 'Tu cuenta ha sido suspendida permanentemente. Contacta al soporte.';
    }
    if (details?.suspendedUntil) {
      const suspendedUntil = new Date(details.suspendedUntil).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const reason = details.reason ? ` Razón: ${details.reason}` : '';
      return `Tu cuenta está suspendida hasta el ${suspendedUntil}.${reason}`;
    }
    return 'Tu cuenta ha sido suspendida. Contacta al soporte.';
  }

  if (apiError instanceof AuthenticationError) {
    return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
  }

  if (apiError instanceof AuthorizationError) {
    return 'No tienes permiso para realizar esta acción.';
  }

  if (apiError instanceof NotFoundError) {
    return 'El recurso solicitado no fue encontrado.';
  }

  if (apiError instanceof RateLimitError) {
    return 'Has realizado demasiadas solicitudes. Por favor, espera un momento e intenta de nuevo.';
  }

  if (apiError instanceof ServerError) {
    return 'Ocurrió un error en el servidor. Por favor, intenta más tarde.';
  }

  // Return the original message for other errors
  return apiError.message || 'Ocurrió un error inesperado.';
};

/**
 * Get error details for debugging
 */
export const getErrorDetails = (error: unknown): Record<string, any> => {
  const apiError = handleAPIError(error);

  return {
    name: apiError.name,
    message: apiError.message,
    code: apiError.code,
    statusCode: apiError.statusCode,
    timestamp: apiError.timestamp,
    data: apiError.data,
    stack: apiError.stack,
  };
};

// ============================================================================
// RETRY LOGIC
// ============================================================================

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: unknown): boolean => {
  const apiError = handleAPIError(error);

  // Retry on network errors, timeouts, and 5xx server errors
  return (
    error instanceof NetworkError ||
    error instanceof TimeoutError ||
    (apiError.statusCode >= 500 && apiError.statusCode < 600)
  );
};

/**
 * Get retry delay based on error
 */
export const getRetryDelay = (error: unknown, attempt: number): number => {
  // For rate limit errors, use retry-after header if available
  if (error instanceof RateLimitError && error.retryAfter) {
    return error.retryAfter * 1000;
  }

  // Exponential backoff: 1s, 2s, 4s, 8s, etc.
  return Math.min(1000 * Math.pow(2, attempt), 30000);
};

// ============================================================================
// EXPORTS
// ============================================================================

export default handleAPIError;
