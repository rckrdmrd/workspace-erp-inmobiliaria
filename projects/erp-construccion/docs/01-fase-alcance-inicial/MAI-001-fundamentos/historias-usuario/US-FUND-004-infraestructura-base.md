# US-FUND-004: Infraestructura Técnica Base

**Epic:** MAI-001 - Fundamentos del Sistema
**Story Points:** 12
**Prioridad:** Alta
**Dependencias:**
- Ninguna (es la base del proyecto)

**Estado:** Pendiente
**Asignado a:** DevOps + Backend Lead + Frontend Lead

---

## 📋 Historia de Usuario

**Como** equipo de desarrollo
**Quiero** tener configurada toda la infraestructura técnica base del proyecto
**Para** poder comenzar a desarrollar las funcionalidades del sistema de construcción sobre una base sólida, escalable y mantenible.

---

## 🎯 Contexto y Objetivos

### Contexto

Esta historia cubre la configuración inicial completa del proyecto antes de comenzar el desarrollo de funcionalidades. Incluye:

- **Base de datos PostgreSQL** con schemas organizados
- **Backend NestJS** con estructura modular
- **Frontend React + Vite** con TypeScript
- **Herramientas de desarrollo** (linting, formatting, testing)
- **CI/CD pipeline** básico
- **Docker containers** para desarrollo local

### Objetivos

1. ✅ Proyecto ejecutable localmente en < 5 minutos (para nuevos devs)
2. ✅ Estructura modular lista para escalar
3. ✅ Database migrations automáticas
4. ✅ Hot reload en desarrollo (backend y frontend)
5. ✅ Code quality garantizada (pre-commit hooks)
6. ✅ Tests automatizados en CI/CD

---

## ✅ Criterios de Aceptación

### CA-1: Database Setup

**Dado** un PostgreSQL 15+ instalado localmente o en Docker
**Cuando** ejecuto el script de setup inicial
**Entonces**:

- ✅ Se crea la base de datos `gamilit_construction`
- ✅ Se crean los schemas: `auth_management`, `projects`, `budgets`, `purchases`, `hr`, `gamification_system`
- ✅ Se ejecutan todas las migraciones iniciales
- ✅ Se crean las funciones de utilidad (get_current_constructora_id, etc.)
- ✅ Se habilita RLS en todas las tablas de negocio

### CA-2: Backend Structure

**Dado** el proyecto de backend
**Cuando** examino la estructura de carpetas
**Entonces**:

- ✅ Existe una estructura modular clara:
  ```
  apps/backend/src/
  ├── modules/
  │   ├── auth/
  │   ├── users/
  │   ├── constructoras/
  │   ├── projects/
  │   └── ... (módulos por dominio)
  ├── common/
  │   ├── guards/
  │   ├── decorators/
  │   ├── interceptors/
  │   └── filters/
  ├── config/
  │   ├── database.config.ts
  │   ├── jwt.config.ts
  │   └── ...
  └── main.ts
  ```
- ✅ Cada módulo sigue el patrón: `module`, `controller`, `service`, `entity`, `dto`
- ✅ TypeORM configurado con migrations automáticas
- ✅ Swagger UI disponible en `/api/docs`

### CA-3: Frontend Structure

**Dado** el proyecto de frontend
**Cuando** examino la estructura de carpetas
**Entonces**:

- ✅ Existe una estructura clara:
  ```
  apps/frontend/src/
  ├── features/
  │   ├── auth/
  │   ├── dashboard/
  │   ├── projects/
  │   └── ... (features por módulo)
  ├── components/
  │   ├── ui/        (componentes reutilizables)
  │   └── layout/
  ├── stores/        (Zustand stores)
  ├── services/      (API clients)
  ├── hooks/
  ├── utils/
  └── App.tsx
  ```
- ✅ Vite configurado con hot reload
- ✅ TypeScript strict mode habilitado
- ✅ Path aliases configurados (`@/components`, `@/features`, etc.)

### CA-4: Development Tools

**Dado** el proyecto completo
**Cuando** un nuevo desarrollador clona el repo
**Entonces**:

- ✅ `npm install` instala todas las dependencias
- ✅ `npm run dev` levanta backend + frontend + database
- ✅ ESLint + Prettier configurados y funcionando
- ✅ Husky pre-commit hooks ejecutan lint + format
- ✅ Tests pueden ejecutarse con `npm test`

### CA-5: Docker Setup

**Dado** Docker instalado en el sistema
**Cuando** ejecuto `docker-compose up`
**Entonces**:

- ✅ Se levanta PostgreSQL en puerto 5432
- ✅ Se levanta backend en puerto 3000
- ✅ Se levanta frontend en puerto 5173
- ✅ Hot reload funciona dentro de los containers
- ✅ Migrations se ejecutan automáticamente al iniciar backend

### CA-6: CI/CD Pipeline

**Dado** un commit pusheado a GitHub
**Cuando** se activa el pipeline de CI
**Entonces**:

- ✅ Se ejecutan linters (ESLint)
- ✅ Se ejecutan formatters (Prettier)
- ✅ Se ejecutan tests unitarios
- ✅ Se ejecutan tests de integración
- ✅ Se genera reporte de cobertura
- ✅ El pipeline falla si cualquier check no pasa

---

## 🔧 Especificación Técnica Detallada

### 1. Database Setup

#### Script de Inicialización

**Archivo:** `apps/database/scripts/init-database.sh`

```bash
#!/bin/bash

# Configuración
DB_NAME="gamilit_construction"
DB_USER="gamilit_user"
DB_PASSWORD="secure_password_here"
DB_HOST="localhost"
DB_PORT="5432"

# Crear base de datos
psql -U postgres -h $DB_HOST -p $DB_PORT <<EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER WITH SUPERUSER; -- Para crear extensiones
EOF

# Conectar a la BD y crear schemas
psql -U $DB_USER -d $DB_NAME -h $DB_HOST -p $DB_PORT <<EOF
-- Crear extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear schemas
CREATE SCHEMA IF NOT EXISTS auth_management;
CREATE SCHEMA IF NOT EXISTS projects;
CREATE SCHEMA IF NOT EXISTS budgets;
CREATE SCHEMA IF NOT EXISTS purchases;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS hr;
CREATE SCHEMA IF NOT EXISTS post_sales;
CREATE SCHEMA IF NOT EXISTS gamification_system;
CREATE SCHEMA IF NOT EXISTS audit;

-- Otorgar permisos
GRANT ALL ON SCHEMA auth_management TO $DB_USER;
GRANT ALL ON SCHEMA projects TO $DB_USER;
GRANT ALL ON SCHEMA budgets TO $DB_USER;
GRANT ALL ON SCHEMA purchases TO $DB_USER;
GRANT ALL ON SCHEMA finance TO $DB_USER;
GRANT ALL ON SCHEMA hr TO $DB_USER;
GRANT ALL ON SCHEMA post_sales TO $DB_USER;
GRANT ALL ON SCHEMA gamification_system TO $DB_USER;
GRANT ALL ON SCHEMA audit TO $DB_USER;

-- Crear función de contexto (para RLS)
CREATE OR REPLACE FUNCTION auth_management.get_current_constructora_id()
RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_constructora_id', true), '')::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION auth_management.get_current_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_user_id', true), '')::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION auth_management.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_user_role', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Crear ENUM para roles
CREATE TYPE auth_management.construction_role AS ENUM (
  'director',
  'engineer',
  'resident',
  'purchases',
  'finance',
  'hr',
  'post_sales'
);

-- Crear ENUM para estados de cuenta
CREATE TYPE auth_management.account_status AS ENUM (
  'pending',
  'active',
  'inactive',
  'suspended',
  'banned'
);

COMMENT ON FUNCTION auth_management.get_current_constructora_id() IS 'Obtiene el ID de la constructora del contexto de la sesión';
COMMENT ON FUNCTION auth_management.get_current_user_id() IS 'Obtiene el ID del usuario del contexto de la sesión';
COMMENT ON FUNCTION auth_management.get_current_user_role() IS 'Obtiene el rol del usuario del contexto de la sesión';
EOF

echo "✅ Base de datos inicializada correctamente"
```

#### Migración Inicial - Tabla de Constructoras

**Archivo:** `apps/backend/src/migrations/1700000000001-CreateConstructoras.ts`

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConstructoras1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE auth_management.constructoras (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        rfc VARCHAR(13) UNIQUE NOT NULL,
        business_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100) DEFAULT 'México',
        postal_code VARCHAR(10),
        logo_url TEXT,
        settings JSONB DEFAULT '{}'::jsonb,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );

      -- Índices
      CREATE INDEX idx_constructoras_rfc ON auth_management.constructoras(rfc);
      CREATE INDEX idx_constructoras_is_active ON auth_management.constructoras(is_active) WHERE deleted_at IS NULL;

      -- Trigger de actualización
      CREATE TRIGGER set_constructoras_updated_at
        BEFORE UPDATE ON auth_management.constructoras
        FOR EACH ROW
        EXECUTE FUNCTION auth_management.update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE auth_management.constructoras CASCADE;`);
  }
}
```

---

### 2. Backend NestJS - Estructura

#### Main Application Bootstrap

**Archivo:** `apps/backend/src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: configService.get('CORS_ORIGINS')?.split(',') || ['http://localhost:5173'],
    credentials: true,
  });

  // Compression
  app.use(compression());

  // Global prefix
  app.setGlobalPrefix('api');

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global pipes
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

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger documentation
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Sistema de Gestión de Obra - API')
      .setDescription('API RESTful para gestión integral de proyectos de construcción')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Auth', 'Autenticación y autorización')
      .addTag('Users', 'Gestión de usuarios')
      .addTag('Constructoras', 'Gestión de constructoras (multi-tenancy)')
      .addTag('Projects', 'Gestión de proyectos')
      .addTag('Budgets', 'Gestión de presupuestos')
      .addTag('Purchases', 'Gestión de compras y proveedores')
      .addTag('HR', 'Recursos humanos y asistencias')
      .addTag('Finance', 'Finanzas y tesorería')
      .addTag('Post-Sales', 'Post-venta y garantías')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
```

#### Database Configuration

**Archivo:** `apps/backend/src/config/database.config.ts`

```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'gamilit_user'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE', 'gamilit_construction'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false, // SIEMPRE false en producción
  logging: configService.get('NODE_ENV') === 'development' ? ['query', 'error'] : ['error'],
  migrationsRun: true, // Auto-run migrations on startup
  ssl: configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
  extra: {
    max: 20, // Max pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
});
```

#### App Module

**Archivo:** `apps/backend/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { getDatabaseConfig } from './config/database.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConstructorasModule } from './modules/constructoras/constructoras.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { HrModule } from './modules/hr/hr.module';
import { FinanceModule } from './modules/finance/finance.module';
import { PostSalesModule } from './modules/post-sales/post-sales.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

// Common
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requests por minuto
      },
    ]),

    // Scheduled tasks
    ScheduleModule.forRoot(),

    // Event emitter
    EventEmitterModule.forRoot(),

    // Feature modules
    AuthModule,
    UsersModule,
    ConstructorasModule,
    ProjectsModule,
    BudgetsModule,
    PurchasesModule,
    HrModule,
    FinanceModule,
    PostSalesModule,
    DashboardModule,
    NotificationsModule,
  ],
  providers: [
    // Global JWT guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
```

---

### 3. Frontend React + Vite - Estructura

#### Vite Configuration

**Archivo:** `apps/frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'zustand-vendor': ['zustand'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

#### TypeScript Configuration

**Archivo:** `apps/frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/services/*": ["./src/services/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### Main App Component

**Archivo:** `apps/frontend/src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

// Layouts
import { AuthLayout } from '@/components/layout/AuthLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// Features
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { ProjectsPage } from '@/features/projects/pages/ProjectsPage';
import { BudgetsPage } from '@/features/budgets/pages/BudgetsPage';

// Guards
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Projects - Director, Engineer, Resident */}
            <Route
              path="/projects"
              element={
                <RoleGuard allowedRoles={['director', 'engineer', 'resident']}>
                  <ProjectsPage />
                </RoleGuard>
              }
            />

            {/* Budgets - Director, Engineer */}
            <Route
              path="/budgets"
              element={
                <RoleGuard allowedRoles={['director', 'engineer']}>
                  <BudgetsPage />
                </RoleGuard>
              }
            />

            {/* More routes... */}
          </Route>

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Toasts */}
      <Toaster position="top-right" richColors />

      {/* React Query Devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
```

#### API Client Service

**Archivo:** `apps/frontend/src/services/api.service.ts`

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Agregar token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor - Manejo de errores
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('accessToken');
          localStorage.removeItem('constructora-storage');
          window.location.href = '/login';
          toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        } else if (error.response?.status === 403) {
          toast.error('No tienes permisos para realizar esta acción.');
        } else if (error.response?.status >= 500) {
          toast.error('Error del servidor. Intenta nuevamente más tarde.');
        }

        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();
```

---

### 4. Docker Setup

#### Docker Compose

**Archivo:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: gamilit-construction-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: gamilit_user
      POSTGRES_PASSWORD: secure_password_here
      POSTGRES_DB: gamilit_construction
      PGDATA: /var/lib/postgresql/data/pgdata
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./apps/database/scripts:/docker-entrypoint-initdb.d
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U gamilit_user -d gamilit_construction']
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend NestJS
  backend:
    build:
      context: .
      dockerfile: ./apps/backend/Dockerfile
      target: development
    container_name: gamilit-construction-backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: development
      PORT: 3000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: gamilit_user
      DB_PASSWORD: secure_password_here
      DB_DATABASE: gamilit_construction
      JWT_SECRET: your_jwt_secret_key_here
      JWT_EXPIRES_IN: 15m
    ports:
      - '3000:3000'
    volumes:
      - ./apps/backend:/app/apps/backend
      - /app/apps/backend/node_modules
      - /app/node_modules
    command: npm run start:dev

  # Frontend React
  frontend:
    build:
      context: .
      dockerfile: ./apps/frontend/Dockerfile
      target: development
    container_name: gamilit-construction-frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://localhost:3000/api
    ports:
      - '5173:5173'
    volumes:
      - ./apps/frontend:/app/apps/frontend
      - /app/apps/frontend/node_modules
      - /app/node_modules
    command: npm run dev

volumes:
  postgres_data:
    driver: local
```

#### Backend Dockerfile

**Archivo:** `apps/backend/Dockerfile`

```dockerfile
# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "start:dev"]

# ===============================

# Production build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

RUN npm ci --only=production

COPY . .

RUN npm run build

# ===============================

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
```

---

### 5. Code Quality Tools

#### ESLint Configuration

**Archivo:** `.eslintrc.json`

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint", "import", "prettier"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "prettier/prettier": "error"
  },
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true
      }
    }
  }
}
```

#### Prettier Configuration

**Archivo:** `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

#### Husky Pre-commit Hook

**Archivo:** `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged
npx lint-staged

# Run type check
npm run type-check
```

**Archivo:** `package.json` (lint-staged config)

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

---

### 6. CI/CD Pipeline

#### GitHub Actions Workflow

**Archivo:** `.github/workflows/ci.yml`

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    name: Lint and Test
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: gamilit_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: gamilit_construction_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run Prettier check
        run: npm run format:check

      - name: Run TypeScript type check
        run: npm run type-check

      - name: Run backend unit tests
        run: npm run test:backend
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_USERNAME: gamilit_user
          DB_PASSWORD: test_password
          DB_DATABASE: gamilit_construction_test
          JWT_SECRET: test_secret_key
          NODE_ENV: test

      - name: Run frontend tests
        run: npm run test:frontend

      - name: Run e2e tests
        run: npm run test:e2e
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_USERNAME: gamilit_user
          DB_PASSWORD: test_password
          DB_DATABASE: gamilit_construction_test
          JWT_SECRET: test_secret_key
          NODE_ENV: test

      - name: Generate coverage report
        run: npm run test:cov

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: lint-and-test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build backend
        run: npm run build:backend

      - name: Build frontend
        run: npm run build:frontend

      - name: Archive production artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            apps/backend/dist
            apps/frontend/dist
```

---

## 🧪 Test Cases

### TC-INFRA-001: Instalación Limpia

**Pre-condiciones:**
- Sistema con Node.js 20+ y Docker instalados
- Puerto 5432, 3000, 5173 disponibles

**Pasos:**
1. Clonar repositorio: `git clone <repo-url>`
2. Ejecutar: `npm install`
3. Ejecutar: `docker-compose up -d postgres`
4. Esperar a que PostgreSQL esté healthy
5. Ejecutar: `npm run migrate`
6. Ejecutar: `npm run dev`

**Resultado esperado:**
- ✅ Backend corriendo en http://localhost:3000
- ✅ Frontend corriendo en http://localhost:5173
- ✅ Swagger docs en http://localhost:3000/api/docs
- ✅ No hay errores en consola

---

### TC-INFRA-002: Hot Reload Backend

**Pre-condiciones:**
- Backend corriendo en modo desarrollo

**Pasos:**
1. Abrir archivo `apps/backend/src/modules/users/users.controller.ts`
2. Modificar el mensaje de retorno de un endpoint
3. Guardar archivo
4. Observar la consola del backend

**Resultado esperado:**
- ✅ NestJS detecta el cambio
- ✅ Recompila automáticamente
- ✅ Servidor se reinicia en < 3 segundos
- ✅ Endpoint refleja el cambio sin reinicio manual

---

### TC-INFRA-003: Hot Reload Frontend

**Pre-condiciones:**
- Frontend corriendo en modo desarrollo

**Pasos:**
1. Abrir archivo `apps/frontend/src/features/dashboard/pages/DashboardPage.tsx`
2. Modificar un texto en el componente
3. Guardar archivo
4. Observar el navegador

**Resultado esperado:**
- ✅ Vite detecta el cambio
- ✅ Hot Module Replacement (HMR) se ejecuta
- ✅ Componente se actualiza sin recargar la página
- ✅ El cambio es visible instantáneamente

---

### TC-INFRA-004: Pre-commit Hooks

**Pre-condiciones:**
- Husky instalado y configurado
- Archivo con errores de lint

**Pasos:**
1. Modificar un archivo TypeScript introduciendo errores de lint:
   ```typescript
   // Agregar variable no utilizada
   const unusedVar = 'test';

   // Agregar línea sin punto y coma
   const x = 5
   ```
2. Stage el archivo: `git add .`
3. Intentar commit: `git commit -m "Test commit"`

**Resultado esperado:**
- ✅ Pre-commit hook se ejecuta
- ✅ ESLint detecta errores
- ✅ El commit es rechazado
- ✅ Se muestra mensaje con los errores encontrados

---

### TC-INFRA-005: Database Migrations

**Pre-condiciones:**
- PostgreSQL corriendo
- Backend configurado

**Pasos:**
1. Crear nueva migración: `npm run migration:create CreateTestTable`
2. Implementar migración:
   ```typescript
   public async up(queryRunner: QueryRunner): Promise<void> {
     await queryRunner.query(`
       CREATE TABLE test (
         id SERIAL PRIMARY KEY,
         name VARCHAR(255)
       );
     `);
   }
   ```
3. Ejecutar: `npm run migration:run`
4. Conectar a la base de datos y verificar

**Resultado esperado:**
- ✅ Migración se crea correctamente
- ✅ Migración se ejecuta sin errores
- ✅ Tabla `test` existe en la base de datos
- ✅ Entry en tabla `migrations` registra la ejecución

---

### TC-INFRA-006: CI Pipeline

**Pre-condiciones:**
- Código pusheado a GitHub
- GitHub Actions configurado

**Pasos:**
1. Crear PR con cambios
2. Observar GitHub Actions

**Resultado esperado:**
- ✅ Pipeline de CI se ejecuta automáticamente
- ✅ Job de lint pasa
- ✅ Job de type-check pasa
- ✅ Job de tests pasa
- ✅ Job de build pasa
- ✅ Reporte de cobertura se genera
- ✅ PR muestra status check verde

---

### TC-INFRA-007: RLS Context Injection

**Pre-condiciones:**
- Backend corriendo
- Usuario autenticado
- Constructora activa

**Pasos:**
1. Hacer request a cualquier endpoint protegido con token JWT válido
2. Inspeccionar logs de PostgreSQL (query log habilitado)
3. Verificar que se ejecuten los `set_config` antes de la query principal

**Resultado esperado:**
- ✅ `set_config('app.current_user_id', '...', true)` se ejecuta
- ✅ `set_config('app.current_constructora_id', '...', true)` se ejecuta
- ✅ `set_config('app.current_user_role', '...', true)` se ejecuta
- ✅ Query principal usa estas variables en RLS policies

---

### TC-INFRA-008: Swagger Documentation

**Pre-condiciones:**
- Backend corriendo en modo desarrollo

**Pasos:**
1. Abrir navegador en http://localhost:3000/api/docs
2. Explorar endpoints documentados
3. Intentar ejecutar endpoint `/api/auth/login` desde Swagger UI

**Resultado esperado:**
- ✅ Swagger UI carga correctamente
- ✅ Todos los módulos están listados con sus tags
- ✅ Schemas de DTOs están documentados
- ✅ Es posible ejecutar requests desde la UI
- ✅ Bearer token puede configurarse para endpoints protegidos

---

## 📋 Tareas de Implementación

### Sprint 0 - Semana 1

#### Backend

- [ ] **INFRA-BE-001:** Crear estructura de carpetas del proyecto NestJS
  - Estimado: 1h
  - Asignado a: Backend Lead

- [ ] **INFRA-BE-002:** Configurar TypeORM con migraciones
  - Estimado: 2h
  - Asignado a: Backend Lead

- [ ] **INFRA-BE-003:** Crear script de inicialización de base de datos
  - Estimado: 2h
  - Asignado a: DevOps

- [ ] **INFRA-BE-004:** Implementar main.ts con configuración completa
  - Estimado: 2h
  - Asignado a: Backend Lead

- [ ] **INFRA-BE-005:** Crear módulos base (Auth, Users, Constructoras)
  - Estimado: 3h
  - Asignado a: Backend Dev

- [ ] **INFRA-BE-006:** Configurar Swagger documentation
  - Estimado: 1h
  - Asignado a: Backend Dev

- [ ] **INFRA-BE-007:** Implementar guards globales (JWT, Roles)
  - Estimado: 2h
  - Asignado a: Backend Dev

- [ ] **INFRA-BE-008:** Crear interceptors (Logging, Transform, RLS Context)
  - Estimado: 2h
  - Asignado a: Backend Dev

#### Frontend

- [ ] **INFRA-FE-001:** Crear estructura de carpetas del proyecto React
  - Estimado: 1h
  - Asignado a: Frontend Lead

- [ ] **INFRA-FE-002:** Configurar Vite con path aliases
  - Estimado: 1h
  - Asignado a: Frontend Lead

- [ ] **INFRA-FE-003:** Configurar React Router con layouts
  - Estimado: 2h
  - Asignado a: Frontend Dev

- [ ] **INFRA-FE-004:** Implementar API service con interceptors
  - Estimado: 2h
  - Asignado a: Frontend Dev

- [ ] **INFRA-FE-005:** Crear guards de navegación (ProtectedRoute, RoleGuard)
  - Estimado: 2h
  - Asignado a: Frontend Dev

- [ ] **INFRA-FE-006:** Configurar React Query
  - Estimado: 1h
  - Asignado a: Frontend Dev

- [ ] **INFRA-FE-007:** Crear componentes de layout base
  - Estimado: 2h
  - Asignado a: Frontend Dev

#### DevOps

- [ ] **INFRA-DO-001:** Configurar Docker Compose para desarrollo
  - Estimado: 2h
  - Asignado a: DevOps

- [ ] **INFRA-DO-002:** Crear Dockerfiles (backend y frontend)
  - Estimado: 2h
  - Asignado a: DevOps

- [ ] **INFRA-DO-003:** Configurar variables de entorno (.env templates)
  - Estimado: 1h
  - Asignado a: DevOps

- [ ] **INFRA-DO-004:** Configurar GitHub Actions CI pipeline
  - Estimado: 3h
  - Asignado a: DevOps

#### Code Quality

- [ ] **INFRA-CQ-001:** Configurar ESLint para backend y frontend
  - Estimado: 1h
  - Asignado a: Tech Lead

- [ ] **INFRA-CQ-002:** Configurar Prettier
  - Estimado: 0.5h
  - Asignado a: Tech Lead

- [ ] **INFRA-CQ-003:** Configurar Husky + lint-staged
  - Estimado: 1h
  - Asignado a: Tech Lead

- [ ] **INFRA-CQ-004:** Configurar Jest para testing (backend y frontend)
  - Estimado: 2h
  - Asignado a: QA Lead

#### Documentation

- [ ] **INFRA-DOC-001:** Crear README.md con instrucciones de instalación
  - Estimado: 1h
  - Asignado a: Tech Lead

- [ ] **INFRA-DOC-002:** Documentar estructura de carpetas
  - Estimado: 1h
  - Asignado a: Tech Lead

- [ ] **INFRA-DOC-003:** Crear CONTRIBUTING.md con guía de desarrollo
  - Estimado: 1h
  - Asignado a: Tech Lead

**Total estimado:** ~40 horas (distribuidas en equipo de 4 devs = 2 semanas)

---

## 🔗 Dependencias

### Dependencias Externas

- **Ninguna** (esta es la base del proyecto)

### Bloqueantes para

- ✅ Todas las demás historias de usuario
- ✅ MAI-002 (Gestión de Proyectos)
- ✅ MAI-003 (Gestión de Presupuestos)
- ✅ MAI-004 (Gestión de Compras)
- ✅ MAI-005 (Gamificación)
- ✅ MAI-006 (RRHH)

---

## 📊 Definición de Hecho (DoD)

- ✅ Backend ejecutable localmente en < 5 minutos
- ✅ Frontend ejecutable localmente en < 5 minutos
- ✅ Base de datos PostgreSQL configurada con schemas
- ✅ Migrations funcionando correctamente
- ✅ Hot reload funcional en backend y frontend
- ✅ Docker Compose levanta todos los servicios
- ✅ ESLint + Prettier configurados y funcionando
- ✅ Pre-commit hooks funcionando
- ✅ CI pipeline ejecutándose en GitHub Actions
- ✅ Swagger documentation accesible en `/api/docs`
- ✅ Todos los test cases (TC-INFRA-001 a TC-INFRA-008) pasan
- ✅ README.md con instrucciones de instalación completas
- ✅ Variables de entorno documentadas (`.env.example`)
- ✅ No hay warnings ni errores en consola (dev mode)

---

## 📝 Notas Adicionales

### Performance Targets

- **Backend startup:** < 5 segundos
- **Frontend startup:** < 3 segundos
- **Hot reload backend:** < 3 segundos
- **Hot reload frontend:** < 1 segundo
- **Build backend:** < 30 segundos
- **Build frontend:** < 20 segundos

### Security Considerations

- ✅ No commits de archivos `.env` (usar `.env.example`)
- ✅ Secrets en variables de entorno, no hardcoded
- ✅ PostgreSQL password fuerte en producción
- ✅ JWT secret diferente por ambiente
- ✅ Helmet configurado para seguridad HTTP
- ✅ CORS configurado restrictivamente

### Monitoring & Logging

- ✅ Winston logger configurado (backend)
- ✅ Request logging con timestamps
- ✅ Error logging con stack traces
- ✅ Query logging en desarrollo (deshabilitado en prod)

---

## 🎓 Lecciones de GAMILIT

### Qué Reutilizar (80%)

✅ **Estructura completa del proyecto:**
- Organización de carpetas backend/frontend
- Configuración de TypeORM
- Guards, decorators, interceptors
- API service con interceptors
- Docker setup

✅ **Herramientas de desarrollo:**
- ESLint + Prettier config
- Husky hooks
- GitHub Actions CI
- Swagger configuration

### Qué Adaptar (20%)

🔄 **Schemas de base de datos:**
- GAMILIT: `auth_management`, `gamification_system`, `educational_content`
- Construcción: `auth_management`, `projects`, `budgets`, `purchases`, `hr`, `finance`

🔄 **Módulos de negocio:**
- GAMILIT: Students, Teachers, Courses
- Construcción: Projects, Budgets, Employees

---

**Fecha de creación:** 2025-11-17
**Última actualización:** 2025-11-17
**Versión:** 1.0
