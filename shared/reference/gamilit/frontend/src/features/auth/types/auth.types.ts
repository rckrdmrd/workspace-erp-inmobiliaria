/**
 * User type definition - Synchronized with backend
 * Based on backend AuthResponse.user structure
 *
 * Backend source: /src/modules/auth/auth.types.ts
 */
export interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  /**
   * Computed full name from firstName/lastName/displayName
   * Optional - may be computed client-side
   */
  fullName?: string;
  /**
   * Account creation timestamp
   * May be returned by some API endpoints
   */
  createdAt?: string;
  /**
   * Whether the user account is active
   * May be returned by some API endpoints
   */
  isActive?: boolean;
  /**
   * Tenant ID for multi-tenant systems
   * May be returned by some API endpoints
   */
  tenantId?: string;
  /**
   * School ID - Links user to a school in social_features.schools
   * From backend Profile entity (auth_management.profiles.school_id)
   * May be returned by some API endpoints
   */
  schoolId?: string;
  /**
   * Email verification status
   * May be returned by some API endpoints
   */
  emailVerified?: boolean;
}

/**
 * Extended User type for frontend-specific fields
 * These fields are NOT returned by backend and must be handled separately or added to backend
 *
 * @see /docs-analisys/consistency-db-backend-frontend/correcciones/03-campos-faltantes-backend.md
 */
export interface UserExtended extends User {
  fullName: string;      // Derived from firstName/lastName/displayName
  tenantId?: string;     // TODO: Add to backend AuthResponse
  emailVerified: boolean; // TODO: Add to backend AuthResponse
  isActive?: boolean;    // TODO: Add to backend AuthResponse
  avatar?: string;       // TODO: Add to backend AuthResponse
  createdAt?: string;    // TODO: Add to backend AuthResponse
  updatedAt?: string;    // TODO: Add to backend AuthResponse
}

/**
 * User preferences configuration
 * Maps to JSONB column in auth_management.profiles.preferences
 *
 * Backend source: /src/modules/auth/entities/profile.entity.ts
 */
export interface PreferencesConfig {
  theme?: string;
  language?: string;
  timezone?: string;
  sound_enabled?: boolean;
  notifications_enabled?: boolean;
  [key: string]: any; // Allow additional dynamic preferences
}

/**
 * Profile type definition - Synchronized with backend Profile entity
 * Represents complete user profile data from auth_management.profiles table
 *
 * Backend source: /src/modules/auth/entities/profile.entity.ts
 * Database table: auth_management.profiles
 *
 * This interface maps 1:1 to the backend Profile entity with 25 fields.
 * Used for profile management, settings, and user data beyond basic auth.
 */
export interface Profile {
  /** Primary key UUID */
  id: string;

  /** Multi-tenancy: Links to auth_management.tenants */
  tenant_id: string;

  /** Links to auth.users (Supabase auth) - may be null for profiles without auth */
  user_id: string | null;

  /** Public display name - shown in UI, leaderboards */
  display_name: string | null;

  /** Complete name (may be computed from first_name + last_name) */
  full_name: string | null;

  /** Given name */
  first_name: string | null;

  /** Family name */
  last_name: string | null;

  /** Primary email (unique constraint) */
  email: string;

  /** Avatar/profile picture URL */
  avatar_url: string | null;

  /** User biography or description */
  bio: string | null;

  /** Contact phone number */
  phone: string | null;

  /** Date of birth (ISO date string) */
  date_of_birth: string | null;

  /** Academic level (e.g., "1", "2", "secondary") */
  grade_level: string | null;

  /** Student identification number */
  student_id: string | null;

  /** Links to social_features.schools */
  school_id: string | null;

  /** User role from GamilityRoleEnum (student, teacher, admin, etc.) */
  role: string;

  /** Account status from UserStatusEnum (active, inactive, suspended, etc.) */
  status: string;

  /** Email verification status */
  email_verified: boolean;

  /** Phone verification status */
  phone_verified: boolean;

  /** User preferences (theme, language, notifications, etc.) */
  preferences: PreferencesConfig;

  /** Last successful sign-in timestamp (ISO string) */
  last_sign_in_at: string | null;

  /** Last activity timestamp (ISO string) */
  last_activity_at: string | null;

  /** Additional custom metadata (flexible JSONB) */
  metadata: Record<string, any>;

  /** Profile creation timestamp (ISO string) */
  created_at: string;

  /** Profile last update timestamp (ISO string) */
  updated_at: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration data
 */
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  tenantId?: string;
}

/**
 * Authentication response from API
 * Updated to match EXACT backend response structure
 *
 * Backend source: /src/modules/auth/auth.types.ts - AuthResponse
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;  // Backend marks as optional
  expiresIn: string;      // Backend returns this as required
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset confirmation
 */
export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

/**
 * Session information (for session validation)
 */
export interface SessionInfo {
  expiresAt: number;
  isValid: boolean;
  needsRefresh: boolean;
}

/**
 * User session information (for session management list)
 * Maps to backend SessionInfoDto from auth.types.ts
 *
 * Backend source: /src/modules/auth/auth.types.ts - SessionInfoDto
 */
export interface UserSessionInfo {
  id: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;      // Backend uses 'location' instead of separate country/city
  createdAt: string;     // Backend returns as string
  lastActivity: string;  // Backend uses 'lastActivity' not 'lastActivityAt'
  isCurrent: boolean;
}

/**
 * Account suspension details
 */
export interface SuspensionDetails {
  isSuspended: boolean;
  isPermanent: boolean;
  suspendedUntil?: string; // ISO date string
  reason?: string;
}

/**
 * Account status error codes
 */
export type AccountErrorCode =
  | 'ACCOUNT_INACTIVE'
  | 'ACCOUNT_SUSPENDED'
  | 'INVALID_CREDENTIALS'
  | 'AUTHENTICATION_ERROR';

/**
 * Helper function to compute fullName from User data
 * Use this when you need fullName from backend User object
 *
 * @param user - User object from backend
 * @returns Computed full name
 */
export function getUserFullName(user: User): string {
  if (user.displayName) return user.displayName;

  const parts = [user.firstName, user.lastName].filter(Boolean);
  if (parts.length > 0) return parts.join(' ');

  return user.email;
}

/**
 * Helper function to get display name (username-like) from User
 * Uses email prefix when no name fields are available
 *
 * @param user - User object from backend
 * @returns Display name for UI (shorter than full name)
 */
export function getUserDisplayName(user: User): string {
  if (user.displayName) return user.displayName;
  if (user.firstName) return user.firstName;

  // Use email prefix as username fallback
  return user.email.split('@')[0];
}

/**
 * Convert backend User to UserExtended
 * Fills in missing fields with defaults
 *
 * @param user - User from backend
 * @param additionalData - Optional additional data not from backend
 * @returns UserExtended object
 */
export function toUserExtended(
  user: User,
  additionalData?: Partial<UserExtended>
): UserExtended {
  return {
    ...user,
    fullName: getUserFullName(user),
    tenantId: additionalData?.tenantId,
    emailVerified: additionalData?.emailVerified ?? false,
    isActive: additionalData?.isActive ?? true,
    avatar: additionalData?.avatar,
    createdAt: additionalData?.createdAt,
    updatedAt: additionalData?.updatedAt,
  };
}
