import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://gamilit.com',
      'https://www.gamilit.com',
    ];

    // Check environment variable for additional origins
    const envOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    const allAllowedOrigins = [...allowedOrigins, ...envOrigins];

    if (allAllowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Request-ID',
    'X-Tenant-ID',
  ],
  exposedHeaders: ['X-Request-ID', 'X-Total-Count'],
  maxAge: 3600, // 1 hour
};
