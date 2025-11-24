/**
 * Token Response Types
 *
 * ISSUE: #9 (P1) - Refresh Token Implementation
 * SPRINT: Sprint 0 - Día 2
 */

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Segundos
}

export interface AuthResponse extends TokenResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar_url?: string;
  };
}
