import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS configuration - Supports multiple origins separated by comma
  const corsOrigin = configService.get<string>('app.corsOrigin') || 'http://localhost:3005,http://localhost:5173';
  const allowedOrigins = corsOrigin.split(',').map(origin => origin.trim());

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, Postman, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin is in the allowed list
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS blocked request from origin: ${origin}`);
        console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
  });

  // Security
  app.use(helmet());

  // Compression
  app.use(compression());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('GAMILIT API')
    .setDescription(
      'Educational Gamification Platform - Marie Curie Reading Comprehension',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication and authorization endpoints')
    .addTag('Educational', 'Educational content (modules, exercises)')
    .addTag('Progress', 'Student progress tracking')
    .addTag('Social', 'Social features (classrooms, teams, friendships)')
    .addTag('Content', 'Content management and templates')
    .addTag('Gamification', 'Gamification system (XP, ML Coins, Ranks, Achievements)')
    .addTag('Admin - Users', 'Admin user management')
    .addTag('Admin - Organizations', 'Admin organization/tenant management')
    .addTag('Admin - Content', 'Admin content approval')
    .addTag('Admin - System', 'Admin system monitoring and configuration')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'GAMILIT API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // Get port from environment
  const port = configService.get('env.port', 3006);
  const nodeEnv = configService.get('env.nodeEnv', 'development');

  await app.listen(port);

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 GAMILIT Backend API Server                              ║
║                                                               ║
║   🌍 Server running at: http://localhost:${port}                 ║
║   📚 API Docs: http://localhost:${port}/api/docs               ║
║   🔧 Environment: ${nodeEnv.padEnd(11)}                            ║
║   🔒 CORS Origins: ${allowedOrigins.length} configured                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  // Log CORS configuration
  console.log('🔒 CORS Configuration:');
  allowedOrigins.forEach(origin => {
    console.log(`   ✅ ${origin}`);
  });
  console.log('');

  // Log available modules
  console.log('📦 Loaded modules:');
  console.log('   ✅ AuthModule');
  console.log('   ✅ EducationalModule');
  console.log('   ✅ ProgressModule');
  console.log('   ✅ SocialModule');
  console.log('   ✅ ContentModule');
  console.log('   ✅ GamificationModule');
  console.log('   ✅ AdminModule');
  console.log('');
}

bootstrap().catch((error) => {
  console.error('❌ Application failed to start:');
  console.error(error);
  process.exit(1);
});
