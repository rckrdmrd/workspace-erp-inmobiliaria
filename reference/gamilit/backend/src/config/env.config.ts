import { registerAs } from '@nestjs/config';

const envConfig = registerAs('env', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3006', 10),
  apiPrefix: process.env.API_PREFIX || 'api',

  // Logger configuration
  logLevel: process.env.LOG_LEVEL || 'info',
  logToFile: process.env.LOG_TO_FILE === 'true',

  // Application metadata
  appName: process.env.APP_NAME || 'GAMILIT',
  appVersion: process.env.APP_VERSION || '1.0.0',

  // Security
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],

  // Database (reference only, detailed config in database.config.ts)
  databaseUrl: process.env.DATABASE_URL,

  // JWT (reference only, detailed config in jwt.config.ts)
  jwtSecret: process.env.JWT_SECRET,

  // Feature flags
  enableSwagger: process.env.ENABLE_SWAGGER !== 'false',
  enableCors: process.env.ENABLE_CORS !== 'false',
}));

export default envConfig;

// Export type for type safety
export type EnvConfig = ReturnType<typeof envConfig>;
