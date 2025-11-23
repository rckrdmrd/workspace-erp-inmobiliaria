/**
 * Constants - Barrel Export
 *
 * @description Exporta todas las constantes desde un solo punto.
 * @usage import { DB_SCHEMAS, API_ROUTES, AuthProviderEnum } from '@/shared/constants';
 */

// Database constants (schemas and tables)
export * from './database.constants';

// API routes constants
export * from './routes.constants';

// ENUMs constants (shared with Frontend)
export * from './enums.constants';

// Regular expressions
export * from './regex';
