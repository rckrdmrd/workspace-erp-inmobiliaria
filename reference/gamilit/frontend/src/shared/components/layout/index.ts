/**
 * Layout Components - Detective Theme
 *
 * Critical layout components for the GAMILIT platform.
 * These components provide the main navigation and structure.
 */

// Header
export { GamifiedHeader } from './GamifiedHeader';
// Re-export User and UserGamificationData from @shared/types for consistency
export type { User, UserGamificationData } from '@shared/types';
export type {
  GamifiedHeaderProps,
  Notification,
} from './GamifiedHeader';

// Sidebar
export { GamilitSidebar } from './GamilitSidebar';
export type {
  GamilitSidebarProps,
  NavigationItem,
  SidebarModuleProgress,
} from './GamilitSidebar';
