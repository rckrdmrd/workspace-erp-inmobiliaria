/**
 * TypeORM Configuration
 * Configuración de conexión a PostgreSQL
 *
 * @see https://typeorm.io/data-source-options
 */

import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'construccion_mvp',
  synchronize: process.env.DB_SYNCHRONIZE === 'true', // ⚠️ NUNCA en producción
  logging: process.env.DB_LOGGING === 'true',
  entities: [
    __dirname + '/../../modules/**/entities/*.entity{.ts,.js}',
  ],
  migrations: [
    __dirname + '/../../../migrations/*{.ts,.js}',
  ],
  subscribers: [],
  // Configuración de pool
  extra: {
    max: 20, // Máximo de conexiones
    min: 5,  // Mínimo de conexiones
    idleTimeoutMillis: 30000,
  },
});

/**
 * Inicializar conexión
 */
export async function initializeDatabase(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('✅ TypeORM conectado a PostgreSQL');
  } catch (error) {
    console.error('❌ Error al conectar TypeORM:', error);
    throw error;
  }
}

/**
 * Cerrar conexión
 */
export async function closeDatabase(): Promise<void> {
  try {
    await AppDataSource.destroy();
    console.log('✅ Conexión TypeORM cerrada');
  } catch (error) {
    console.error('❌ Error al cerrar TypeORM:', error);
    throw error;
  }
}
