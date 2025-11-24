/**
 * Auth Types
 * Re-exports from canonical features/auth/types/auth.types.ts
 * This file exists for backward compatibility and will be deprecated
 *
 * @deprecated Use @features/auth/types/auth.types instead
 */

// Re-export everything from the canonical auth types
export type {
  User,
  UserExtended,
  PreferencesConfig,
  Profile,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  SessionInfo,
  UserSessionInfo,
  SuspensionDetails,
  AccountErrorCode,
} from '../../features/auth/types/auth.types';

export {
  getUserFullName,
  getUserDisplayName,
  toUserExtended,
} from '../../features/auth/types/auth.types';

/**
 * Auth State and Context types
 */
export interface AuthState {
  user: import('../../features/auth/types/auth.types').User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: import('../../features/auth/types/auth.types').LoginCredentials) => Promise<void>;
  register: (userData: import('../../features/auth/types/auth.types').RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}
