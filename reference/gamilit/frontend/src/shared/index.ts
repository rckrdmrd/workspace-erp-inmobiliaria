/**
 * Shared Module Barrel Export
 *
 * Main entry point for all shared resources.
 * Import everything from here for cleaner imports throughout the app.
 *
 * @example
 * // Instead of:
 * import { Button } from '@shared/components/Button';
 * import { useAuth } from '@shared/hooks/useAuth';
 *
 * // You can do:
 * import { Button, useAuth } from '@shared';
 */

// Components
export * from './components';

// Hooks
export * from './hooks';

// Utils
export * from './utils';

// Constants
export * from './constants';

// Themes
export * from './themes';
