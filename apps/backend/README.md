# Backend - MVP Sistema Administración de Obra

**Stack:** Node.js + Express + TypeScript + TypeORM
**Versión:** 1.0.0
**Fecha:** 2025-11-20

---

## 📋 DESCRIPCIÓN

API REST del sistema de administración de obra e INFONAVIT.

**Arquitectura:** Modular basada en dominios (DDD light)
**Base de datos:** PostgreSQL 15+ con PostGIS
**Autenticación:** JWT

---

## 🏗️ ESTRUCTURA

```
src/
├── shared/                     # Código compartido
│   ├── config/                 # Configuraciones
│   ├── constants/              # Constantes globales
│   ├── database/               # Configuración TypeORM
│   ├── types/                  # Tipos TypeScript compartidos
│   ├── utils/                  # Utilidades
│   └── middleware/             # Middlewares de Express
└── modules/                    # Módulos de negocio
    ├── auth/                   # Autenticación y autorización
    │   ├── entities/           # Entities TypeORM
    │   ├── services/           # Lógica de negocio
    │   ├── controllers/        # Controladores Express
    │   ├── dto/                # DTOs de validación
    │   └── auth.module.ts      # Módulo de NestJS style
    ├── projects/               # Gestión de proyectos
    ├── budgets/                # Presupuestos y control de costos
    └── [otros módulos]/
```

---

## 🚀 SETUP INICIAL

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env
# Editar .env con tus valores
```

### 3. Ejecutar Migraciones (si existen)

```bash
npm run migration:run
```

### 4. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

---

## 📝 SCRIPTS DISPONIBLES

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor en modo desarrollo (hot reload) |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Inicia servidor en producción (requiere build) |
| `npm run lint` | Ejecuta linter (ESLint) |
| `npm run lint:fix` | Ejecuta linter y corrige automáticamente |
| `npm test` | Ejecuta tests con Jest |
| `npm run test:watch` | Ejecuta tests en modo watch |
| `npm run test:coverage` | Ejecuta tests con cobertura |
| `npm run migration:generate` | Genera nueva migración |
| `npm run migration:run` | Ejecuta migraciones pendientes |
| `npm run migration:revert` | Revierte última migración |

---

## 🔧 CONFIGURACIÓN

### TypeORM

Configuración en `src/shared/database/typeorm.config.ts`

**Variables importantes:**
- `DATABASE_URL` - URL completa de conexión
- `DB_SYNCHRONIZE` - ⚠️ Siempre `false` en producción
- `DB_LOGGING` - Logs de queries SQL

### Path Aliases

Configurados en `tsconfig.json`:
```typescript
import { User } from '@modules/auth/entities/user.entity';
import { config } from '@config/database.config';
import { formatDate } from '@utils/date.utils';
```

---

## 📊 CONVENCIONES

### Nomenclatura

Seguir **ESTANDARES-NOMENCLATURA.md**:
- Archivos: `kebab-case.tipo.ts`
- Clases: `PascalCase` + sufijo (Entity, Service, Controller, Dto)
- Variables: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- Métodos: `camelCase` con verbo al inicio

### Estructura de Entity

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'project_management', name: 'projects' })
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date;
}
```

### Estructura de Service

```typescript
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepo: Repository<ProjectEntity>,
  ) {}

  async findAll(): Promise<ProjectEntity[]> {
    return await this.projectRepo.find();
  }
}
```

### Estructura de Controller

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('api/v1/projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  async findAll() {
    return await this.projectService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    return await this.projectService.create(dto);
  }
}
```

---

## 🔍 TESTING

### Ejecutar Tests

```bash
npm test                  # Todos los tests
npm run test:watch        # Modo watch
npm run test:coverage     # Con cobertura
```

### Estructura de Tests

```typescript
describe('ProjectService', () => {
  let service: ProjectService;
  let mockRepo: jest.Mocked<Repository<ProjectEntity>>;

  beforeEach(() => {
    mockRepo = createMockRepository();
    service = new ProjectService(mockRepo);
  });

  it('should find all projects', async () => {
    mockRepo.find.mockResolvedValue([mockProject]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
  });
});
```

---

## 📚 REFERENCIAS

- [DIRECTIVA-CALIDAD-CODIGO.md](../../orchestration/directivas/DIRECTIVA-CALIDAD-CODIGO.md)
- [ESTANDARES-NOMENCLATURA.md](../../orchestration/directivas/ESTANDARES-NOMENCLATURA.md)
- [TypeORM Documentation](https://typeorm.io/)
- [Express Documentation](https://expressjs.com/)

---

## 🔐 SEGURIDAD

- ✅ Helmet para HTTP headers
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ JWT para autenticación
- ✅ Bcrypt para passwords
- ✅ Validación de inputs con class-validator

---

## 🐛 DEBUGGING

### VS Code Launch Configuration

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "runtimeArgs": ["-r", "ts-node/register"],
  "args": ["${workspaceFolder}/src/server.ts"],
  "env": {
    "NODE_ENV": "development"
  }
}
```

---

**Mantenido por:** Backend-Agent
**Última actualización:** 2025-11-20
