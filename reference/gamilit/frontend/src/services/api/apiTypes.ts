/**
 * API Types
 *
 * Common TypeScript types and interfaces for API requests and responses
 */

// ============================================================================
// GENERIC RESPONSE TYPES
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

/**
 * Error response structure
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Pagination request parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// ============================================================================
// REQUEST/RESPONSE METADATA
// ============================================================================

/**
 * Request metadata
 */
export interface RequestMetadata {
  timestamp: Date;
  requestId?: string;
  userId?: string;
  tenantId?: string;
  clientVersion?: string;
}

/**
 * Response metadata
 */
export interface ResponseMetadata {
  timestamp: string;
  requestId?: string;
  executionTime?: number;
  cached?: boolean;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: ValidationError[];
}

// ============================================================================
// FILE UPLOAD TYPES
// ============================================================================

/**
 * File upload request
 */
export interface FileUploadRequest {
  file: File;
  category?: string;
  metadata?: Record<string, any>;
}

/**
 * File upload response
 */
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

// ============================================================================
// SEARCH & FILTER TYPES
// ============================================================================

/**
 * Generic search parameters
 */
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Filter option
 */
export interface FilterOption {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';
  value: any;
}

// ============================================================================
// TIME PERIOD TYPES
// ============================================================================

/**
 * Time period for analytics and leaderboards
 */
export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'all-time' | '7d' | '30d' | '90d';

/**
 * Date range
 */
export interface DateRange {
  from: Date | string;
  to: Date | string;
}

// ============================================================================
// STATUS TYPES
// ============================================================================

/**
 * Generic status type
 */
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'failed' | 'cancelled';

/**
 * Request status
 */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

// ============================================================================
// SORTING TYPES
// ============================================================================

/**
 * Sort configuration
 */
export interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Sort option
 */
export interface SortOption {
  label: string;
  value: string;
  field: string;
  order: 'asc' | 'desc';
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk operation request
 */
export interface BulkOperationRequest<T = any> {
  operation: 'create' | 'update' | 'delete';
  items: T[];
}

/**
 * Bulk operation response
 */
export interface BulkOperationResponse {
  success: boolean;
  successCount: number;
  failureCount: number;
  errors?: Array<{
    index: number;
    error: string;
  }>;
}

// ============================================================================
// CACHE TYPES
// ============================================================================

/**
 * Cache configuration
 */
export interface CacheConfig {
  key: string;
  ttl: number; // Time to live in seconds
  staleWhileRevalidate?: boolean;
}

/**
 * Cached response
 */
export interface CachedResponse<T> {
  data: T;
  cachedAt: string;
  expiresAt: string;
  isStale: boolean;
}

// ============================================================================
// WEBHOOK TYPES
// ============================================================================

/**
 * Webhook payload
 */
export interface WebhookPayload<T = any> {
  event: string;
  data: T;
  timestamp: string;
  signature?: string;
}

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Rate limit info
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * API health check response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  services: {
    database: 'up' | 'down';
    cache: 'up' | 'down';
    ai: 'up' | 'down';
  };
}

// All types are exported inline above
