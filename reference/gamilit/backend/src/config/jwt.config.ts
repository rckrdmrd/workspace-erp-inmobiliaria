import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  () => ({
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      issuer: process.env.JWT_ISSUER || 'gamilit-api',
      audience: process.env.JWT_AUDIENCE || 'gamilit-app',
    },
    verifyOptions: {
      issuer: process.env.JWT_ISSUER || 'gamilit-api',
      audience: process.env.JWT_AUDIENCE || 'gamilit-app',
    },
  }),
);

// Refresh token configuration
export const refreshTokenConfig = registerAs('refreshToken', () => ({
  secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
  expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));