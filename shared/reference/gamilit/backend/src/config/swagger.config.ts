import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('GAMILIT API')
  .setDescription('GAMILIT - Plataforma Educativa Gamificada API Documentation')
  .setVersion('1.0.0')
  .setContact(
    'GAMILIT Support',
    'https://gamilit.com',
    'support@gamilit.com',
  )
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .addServer('http://localhost:3000', 'Local Development')
  .addServer('https://api.gamilit.com', 'Production')

  // Authentication
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token',
      in: 'header',
    },
    'access-token',
  )

  // API Key (for service-to-service)
  .addApiKey(
    {
      type: 'apiKey',
      name: 'X-API-Key',
      in: 'header',
      description: 'API Key for service authentication',
    },
    'api-key',
  )

  // Tags
  .addTag('auth', 'Authentication endpoints')
  .addTag('users', 'User management')
  .addTag('modules', 'Educational modules')
  .addTag('gamification', 'Gamification features')
  .addTag('social', 'Social features')
  .addTag('admin', 'Administrative endpoints')

  .build();

// Swagger UI options
export const swaggerUiOptions = {
  customSiteTitle: 'GAMILIT API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true,
  },
};
