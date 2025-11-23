/**
 * Users Types
 * Types for user management and administration
 * Note: User is already exported from auth.types
 */

// Re-export User from auth.types to avoid conflicts
export type { User } from './auth.types';

export type UserRole =
  | 'student'
  | 'teacher'
  | 'admin'
  | 'super_admin'
  | 'content_creator';

export interface UserProfile {
  id: string;
  userId: string;
  avatarUrl?: string;
  bio?: string;
  school?: string;
  grade?: string;
  preferences?: Record<string, unknown>;
}

export interface UserGamificationData {
  userId: string;
  totalXP: number;
  level: number;
  mlCoins: number;
  rank: string;
  achievements: string[];
}

export interface TableRow {
  id: string;
  [key: string]: unknown;
}
