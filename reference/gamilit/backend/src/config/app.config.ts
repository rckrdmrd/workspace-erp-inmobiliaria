import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  // Rate limiting
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10), // seconds
    limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // requests
  },

  // Pagination defaults
  pagination: {
    defaultPage: 1,
    defaultLimit: parseInt(process.env.PAGINATION_DEFAULT_LIMIT || '20', 10),
    maxLimit: parseInt(process.env.PAGINATION_MAX_LIMIT || '100', 10),
  },

  // File uploads
  uploads: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || String(5 * 1024 * 1024), 10), // 5MB
    allowedMimeTypes: (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/gif,application/pdf').split(','),
    destination: process.env.UPLOAD_DESTINATION || './uploads',
  },

  // Session
  session: {
    secret: process.env.SESSION_SECRET || 'session-secret-change-in-production',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || String(24 * 60 * 60 * 1000), 10), // 24 hours
  },

  // Email
  email: {
    from: process.env.EMAIL_FROM || 'noreply@gamilit.com',
    replyTo: process.env.EMAIL_REPLY_TO || 'support@gamilit.com',
  },

  // Frontend URLs (for email links, redirects, etc.)
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3005',

  // CORS Configuration
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3005,http://localhost:5173',

  // Maintenance mode
  maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
}));
