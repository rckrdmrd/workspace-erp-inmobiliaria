import { registerAs } from '@nestjs/config';

/**
 * Database Configuration
 *
 * @description Configuración de conexión a PostgreSQL para GAMILIT Platform
 * @database gamilit_platform
 * @schemas Multiple schemas (auth_management, educational_content, gamification_system, etc.)
 */
const databaseConfig = registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'gamilit_user',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gamilit_platform',

  // TypeORM options
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
  logging: process.env.DB_LOGGING === 'true' || process.env.NODE_ENV === 'development',

  // Connection pool
  extra: {
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    min: parseInt(process.env.DB_POOL_MIN || '2', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
  },

  // SSL configuration (for production)
  ssl: process.env.DB_SSL === 'true'
    ? {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      }
    : false,

  // Migration options
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true' || false,
  migrationsTableName: 'migrations',
}));

export default databaseConfig;

// Export type for type safety
export type DatabaseConfig = ReturnType<typeof databaseConfig>;
