/**
 * Types Barrel Export
 * Centralized exports for all shared TypeScript types and interfaces
 */

// Export auth types (excluding Profile to avoid conflict)
export type { User, AuthResponse, LoginCredentials, RegisterData } from './auth.types';
// Export profile types (Profile comes from here)
export * from './profile.types';
export * from './progress.types';
export * from './educational.types';
export * from './achievement.types';
export * from './leaderboard.types';
export * from './gamification.types';
export * from './social.types';
export * from './media.types';
export * from './content.types';
export * from './users.types';
