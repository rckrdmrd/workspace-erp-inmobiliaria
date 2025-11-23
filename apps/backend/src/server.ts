/**
 * Server Entry Point
 * MVP Sistema Administración de Obra e INFONAVIT
 *
 * @author Backend-Agent
 * @date 2025-11-20
 */

import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { AppDataSource } from './shared/database/typeorm.config';

// Cargar variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.APP_PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

/**
 * Middlewares
 */
app.use(helmet()); // Seguridad HTTP headers
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: process.env.CORS_CREDENTIALS === 'true',
}));
app.use(morgan(process.env.LOG_FORMAT || 'dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

/**
 * Health Check
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: API_VERSION,
  });
});

/**
 * API Routes
 * TODO: Agregar rutas de módulos aquí
 */
app.get(`/api/${API_VERSION}`, (req, res) => {
  res.status(200).json({
    message: 'API MVP Sistema Administración de Obra',
    version: API_VERSION,
    endpoints: {
      health: '/health',
      docs: `/api/${API_VERSION}/docs`,
      auth: `/api/${API_VERSION}/auth`,
      projects: `/api/${API_VERSION}/projects`,
      budgets: `/api/${API_VERSION}/budgets`,
    },
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

/**
 * Error Handler
 */
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

/**
 * Inicializar Base de Datos y Servidor
 */
async function bootstrap() {
  try {
    // Conectar a base de datos
    console.log('🔌 Conectando a base de datos...');
    await AppDataSource.initialize();
    console.log('✅ Base de datos conectada');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('🚀 Servidor iniciado');
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api/${API_VERSION}`);
      console.log(`📍 Health: http://localhost:${PORT}/health`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

// Iniciar aplicación
bootstrap();

export default app;
