# _MAP: apps/

**Última actualización:** 2025-11-07
**Estado:** 🟢 En desarrollo activo
**Versión:** 2.0 (RFC-0001)

---

## 📋 Propósito de esta Carpeta

Esta carpeta contiene **todo el código fuente** de las aplicaciones GAMILIT, incluyendo backend (API), frontend (SPA), base de datos (DDL/migrations), y scripts de DevOps.

**Arquitectura:** Monorepo con 4 aplicaciones principales

**Audiencia:**
- Desarrolladores Backend (Node.js/TypeScript)
- Desarrolladores Frontend (React/TypeScript)
- Database Administrators (PostgreSQL)
- DevOps Engineers
- Tech Leads

---

## 📁 Estructura de Contenido

### Aplicaciones Principales

| Aplicación | Propósito | Tecnología | Tamaño | Owner | Estado | _MAP.md |
|------------|-----------|------------|--------|-------|--------|---------|
| **backend/** | API REST + WebSocket | Node.js + Express + TypeScript | 108 MB | @backend-team | 🟢 Activo | ⚪ Pendiente |
| **frontend/** | SPA Multi-portal | React + Vite + TypeScript | 15 MB | @frontend-team | 🟢 Activo | ⚪ Pendiente |
| **database/** | Esquema DB + Migrations | PostgreSQL DDL + SQL | 3.8 MB | @database-team | 🟢 Activo | ⚪ Pendiente |
| **devops/** | Scripts DevOps + Validación | TypeScript scripts | 60 KB | @devops-team | 🟡 Parcial | ⚪ Pendiente |

---

## 🗂️ Detalle por Aplicación

### backend/ (108 MB)

**Descripción:** API REST + WebSocket para GAMILIT

**Tecnologías:**
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript 5+ (strict mode)
- **Database:** PostgreSQL 15+ (via node-postgres)
- **Testing:** Jest
- **Linting:** ESLint + Prettier
- **Process Manager:** PM2

**Estructura:**
```
backend/
├── src/
│   ├── shared/         # Código compartido (utils, decorators, types)
│   │   ├── constants/  # Constants SSOT (database, routes, enums)
│   │   ├── types/      # Tipos TypeScript compartidos
│   │   ├── utils/      # Utilidades generales
│   │   └── decorators/ # Decoradores personalizados
│   ├── middleware/     # Middleware de Express
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logging.middleware.ts
│   ├── config/         # Configuraciones
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── cors.config.ts
│   ├── database/       # Conexión DB, migrations, seeds
│   │   ├── connection.ts
│   │   └── pool.ts
│   ├── modules/        # Módulos de negocio (11 módulos)
│   │   ├── auth/
│   │   ├── educational/
│   │   ├── gamification/
│   │   ├── progress/
│   │   ├── social/
│   │   ├── content/
│   │   ├── admin/
│   │   ├── teacher/
│   │   ├── analytics/
│   │   ├── notifications/
│   │   └── system/
│   └── main.ts         # Entry point
├── __tests__/          # Tests
├── dist/               # Build output
├── logs/               # Application logs
├── node_modules/       # Dependencies (largest folder)
├── package.json        # NPM config
├── tsconfig.json       # TypeScript config
├── jest.config.js      # Jest config
├── .eslintrc.js        # ESLint config
└── README.md           # Documentación
```

**Scripts:**
```bash
npm run dev         # Desarrollo con hot reload (ts-node-dev)
npm run build       # Build producción
npm run start       # Iniciar producción
npm test            # Ejecutar tests (Jest)
npm run test:cov    # Tests con coverage
npm run lint        # Linter (ESLint)
npm run format      # Formatear código (Prettier)
```

**Path Aliases:**
- `@shared/*` → `src/shared/*`
- `@middleware/*` → `src/middleware/*`
- `@config/*` → `src/config/*`
- `@database/*` → `src/database/*`
- `@modules/*` → `src/modules/*`

**Métricas:**
- **LOC:** ~45,000 líneas
- **Módulos:** 11 módulos funcionales
- **Endpoints:** 470+ API endpoints
- **Tests:** ~40 tests (objetivo: 210)
- **Coverage:** ~15% (objetivo: 70%)

**Port:** 3000 (default)

**Estado:** ✅ En producción (desarrollo activo)
**_MAP.md:** ⚪ Pendiente creación

**Ver documentación:** [docs/03-desarrollo/backend/](../docs/03-desarrollo/backend/)

---

### frontend/ (15 MB)

**Descripción:** SPA Multi-portal con 3 aplicaciones (Student, Teacher, Admin)

**Tecnologías:**
- **Framework:** React 18+
- **Build Tool:** Vite 5+
- **Language:** TypeScript 5+ (strict mode)
- **Styling:** Tailwind CSS 3+
- **Router:** React Router v6
- **State Management:** Zustand (8 stores)
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Testing:** Vitest + React Testing Library
- **Storybook:** 7+ (component documentation)

**Arquitectura:** Feature-Sliced Design (FSD)

**Estructura:**
```
frontend/
├── src/
│   ├── shared/         # Código compartido (components, hooks, utils)
│   │   ├── components/  # 180+ componentes UI reutilizables
│   │   ├── hooks/       # Custom React hooks
│   │   ├── utils/       # Utilidades generales
│   │   ├── types/       # Tipos TypeScript (sincronizados con backend)
│   │   └── constants/   # Constantes (API endpoints, ENUMs)
│   ├── services/       # API clients, WebSocket
│   │   ├── api/         # API REST clients
│   │   └── websocket/   # Socket.IO client
│   ├── app/            # Providers, layouts, routing
│   │   ├── providers/   # Context providers
│   │   ├── layouts/     # Layout components
│   │   └── router/      # React Router config
│   ├── features/       # Features de negocio (por rol)
│   │   ├── student/     # Portal estudiante
│   │   ├── teacher/     # Portal profesor
│   │   └── admin/       # Portal administrador
│   └── pages/          # Páginas/Vistas
│       ├── student/
│       ├── teacher/
│       └── admin/
├── public/             # Assets estáticos
├── node_modules/       # Dependencies
├── dist/               # Build output
├── package.json        # NPM config
├── vite.config.ts      # Vite config
├── tsconfig.json       # TypeScript config
├── tailwind.config.js  # Tailwind config
├── .storybook/         # Storybook config
└── README.md           # Documentación
```

**Scripts:**
```bash
npm run dev         # Desarrollo (Vite)
npm run build       # Build producción
npm run preview     # Preview build
npm test            # Tests (Vitest)
npm run test:ui     # Tests con UI
npm run lint        # Linter (ESLint)
npm run format      # Formatear (Prettier)
npm run storybook   # Storybook dev server
```

**Path Aliases:**
- `@/*` → `src/*`
- `@shared/*` → `src/shared/*`
- `@components/*` → `src/shared/components/*`
- `@hooks/*` → `src/shared/hooks/*`
- `@utils/*` → `src/shared/utils/*`
- `@types/*` → `src/shared/types/*`
- `@services/*` → `src/services/*`
- `@app/*` → `src/app/*`
- `@features/*` → `src/features/*`
- `@pages/*` → `src/pages/*`

**Métricas:**
- **LOC:** ~85,000 líneas
- **Componentes:** 180+ componentes
- **Mecánicas educativas:** 33 implementadas
- **Zustand stores:** 8 (auth, gamification, progress, exercise, notification, social, tenant, ui)
- **Tests:** ~15 tests (objetivo: 60)
- **Coverage:** ~13% (objetivo: 70%)

**Port:** 5173 (Vite default)

**Features:**
- Mobile-first responsive design
- Dark mode support
- Accesibilidad WCAG 2.1 AA
- PWA ready

**Estado:** ✅ En producción (desarrollo activo)
**_MAP.md:** ⚪ Pendiente creación

**Ver documentación:** [docs/03-desarrollo/frontend/](../docs/03-desarrollo/frontend/)

---

### database/ (3.8 MB)

**Descripción:** Esquema completo de PostgreSQL, DDL, migrations y seeds

**Tecnologías:**
- **Database:** PostgreSQL 16+
- **SQL:** Pure SQL (DDL)
- **Migrations:** Custom versioning
- **Scripts:** Bash + psql

**Estructura:**
```
database/
├── ddl/                # Definiciones de esquema (DDL)
│   ├── schemas/        # 9 schemas con objetos DB
│   │   ├── auth_management/      # Autenticación
│   │   │   ├── tables/           # 12 tablas
│   │   │   ├── indexes/          # Índices
│   │   │   ├── functions/        # Funciones
│   │   │   ├── triggers/         # Triggers
│   │   │   └── rls-policies/     # RLS policies
│   │   ├── educational_content/  # Contenido educativo
│   │   ├── gamification_system/  # Gamificación
│   │   ├── progress_tracking/    # Progress tracking
│   │   ├── social_features/      # Social
│   │   ├── content_management/   # CMS
│   │   ├── audit_logging/        # Auditoría
│   │   ├── system_configuration/ # Config
│   │   └── public/               # Schema público
│   ├── base-schema.sql           # Schema base inicial
│   └── README.md                 # Guía de DDL
├── migrations/         # Migraciones versionadas
│   ├── 001_initial_schema.sql
│   ├── 002_add_rls_policies.sql
│   └── ...
├── seeds/              # Datos de prueba
│   ├── dev/            # Seeds para desarrollo
│   └── test/           # Seeds para testing
└── scripts/            # Scripts de mantenimiento
    ├── backup.sh
    ├── restore.sh
    └── migrate.sh
```

**Esquema DB:**
- **Schemas:** 9 (auth_management, educational_content, gamification_system, etc.)
- **Tablas:** 44 tablas principales
- **Índices:** 279+ índices (optimización)
- **Funciones:** 50+ funciones PL/pgSQL
- **Triggers:** 35+ triggers
- **RLS Policies:** 159 policies planeadas (41 activas)
- **Views:** 15+ vistas
- **Materialized Views:** 5+ (performance)

**Sistema de Archivos DDL:**
Cada schema tiene:
- `tables/_MAP.md` - Lista de tablas
- `indexes/_MAP.md` - Índices
- `functions/_MAP.md` - Funciones
- `triggers/_MAP.md` - Triggers
- `rls-policies/_MAP.md` - Políticas RLS
- `views/_MAP.md` - Vistas

**Total _MAP.md en database/:** 85+ archivos (sistema SIMCO ejemplar)

**Estado:** ✅ Bien estructurado y documentado
**_MAP.md:** ⚪ Pendiente creación (raíz de database/)

**Ver documentación:** [docs/03-desarrollo/base-de-datos/](../docs/03-desarrollo/base-de-datos/)

---

### devops/ (60 KB)

**Descripción:** Scripts de DevOps y validación

**Tecnologías:**
- **Language:** TypeScript + Bash
- **Validaciones:** ts-node scripts

**Estructura:**
```
devops/
└── scripts/            # Scripts de automatización
    ├── sync-enums.ts               # Sincronizar ENUMs Backend → Frontend
    ├── validate-constants-usage.ts # Detectar hardcoding (33 patrones)
    └── validate-api-contract.ts    # Validar Backend ↔ Frontend sync
```

**Scripts Disponibles (desde root):**
```bash
npm run sync:enums          # Sincronizar ENUMs Backend → Frontend
npm run validate:constants  # Detectar hardcoding (33 patrones)
npm run validate:api-contract  # Validar Backend ↔ Frontend sync
npm run validate:all        # Todas las validaciones
npm run postinstall         # Auto-sync ENUMs (automático)
```

**Constants SSOT (Single Source of Truth):**
- Sistema de constantes centralizadas
- Backend como source of truth
- Sincronización automática a Frontend
- Validación en CI/CD

**Estado:** 🟡 Funcional pero incompleto
**Pendiente:**
- Docker configs
- CI/CD workflows
- Kubernetes manifests
- Deployment scripts

**_MAP.md:** ⚪ Pendiente creación

**Ver documentación:** [README.md (root)](../README.md#constants-ssot)

---

## 🔗 Interdependencias

### Flujo de Datos

```
┌────────────────────────────────────────────────────────┐
│                      frontend/                         │
│  React SPA (Student, Teacher, Admin)                   │
│  Port 5173                                             │
└────────────────────┬───────────────────────────────────┘
                     │
                     │ REST API (Axios)
                     │ WebSocket (Socket.IO)
                     │
┌────────────────────▼───────────────────────────────────┐
│                     backend/                            │
│  Express.js API + WebSocket Server                      │
│  Port 3000                                              │
└────────────────────┬───────────────────────────────────┘
                     │
                     │ node-postgres (pg)
                     │ TypeORM (planeado)
                     │
┌────────────────────▼───────────────────────────────────┐
│                    database/                            │
│  PostgreSQL 16+ (9 schemas, 44 tablas)                 │
│  Port 5432                                              │
└────────────────────────────────────────────────────────┘
           ▲
           │ DDL, Migrations, Seeds
           │
     database/ddl/
```

### Interdependencias Entre Apps

**backend/ ↔ database/**
- Backend consume DDL de database/
- Constants referencian schemas/tablas
- Queries usan funciones PL/pgSQL
- RLS policies enforced en queries

**frontend/ ↔ backend/**
- Frontend consume API endpoints
- Tipos compartidos (ENUMs sincronizados)
- WebSocket para real-time notifications
- Axios interceptors para auth (JWT)

**devops/ → backend/ + frontend/**
- Scripts validan consistencia
- Sincronización automática de ENUMs
- Detección de hardcoding
- Validación de contratos API

---

## 📊 Métricas Globales

### Líneas de Código

| Aplicación | LOC | Porcentaje |
|------------|-----|------------|
| **Frontend** | ~85,000 | 65% |
| **Backend** | ~45,000 | 35% |
| **Database** | ~10,000 (SQL) | - |
| **DevOps** | ~500 | - |
| **TOTAL** | **~130,000** | 100% |

### Test Coverage

| Aplicación | Tests | Coverage | Objetivo |
|------------|-------|----------|----------|
| **Backend** | ~40 | ~15% | 70% |
| **Frontend** | ~15 | ~13% | 70% |
| **TOTAL** | **~55** | **~14%** | **70%** |

**Gap crítico:** 55 tests vs 300 objetivo (🔴 81.7% faltante)

### Tamaño de Aplicaciones

| Aplicación | Tamaño | node_modules | Código |
|------------|--------|--------------|--------|
| **Backend** | 108 MB | ~95 MB | ~13 MB |
| **Frontend** | 15 MB | ~10 MB | ~5 MB |
| **Database** | 3.8 MB | - | 3.8 MB |
| **DevOps** | 60 KB | - | 60 KB |

---

## 🚨 Issues Conocidos

### P0 (Crítico)

- **P0-001:** Test coverage crítico (14% vs 70% objetivo)
  - Backend: 40 tests (objetivo: 210)
  - Frontend: 15 tests (objetivo: 60)
  - **Impacto:** Alto riesgo de bugs en producción
  - **Esfuerzo:** 20-30 horas

### P1 (Alto)

- **P1-001:** Falta _MAP.md en apps principales
  - backend/, frontend/, database/, devops/ sin _MAP.md
  - **Impacto:** Navegación para agentes incompleta
  - **Esfuerzo:** 4-6 horas

- **P1-002:** DevOps incompleto
  - Falta: Docker, CI/CD, Kubernetes
  - **Impacto:** Deployment manual y propenso a errores
  - **Esfuerzo:** 10-15 horas

### P2 (Medio)

- **P2-001:** Backend no usa TypeORM
  - Usa node-postgres (pg) directamente
  - Queries SQL manuales propensas a errores
  - Recomendación: Migrar a TypeORM o Prisma

- **P2-002:** Frontend no implementa PWA
  - PWA ready pero no configurado
  - Service workers no implementados

---

## 📐 Estándares Aplicables

### Nomenclatura de Archivos

**Backend/Frontend:**
- `kebab-case.ts` - Archivos de código
- `PascalCase.tsx` - Componentes React
- `camelCase` - Variables y funciones
- `UPPER_SNAKE_CASE` - Constantes

**Database:**
- `kebab-case.sql` - Archivos SQL
- `01-nombre-tabla.sql` - Con prefijo numérico
- `snake_case` - Nombres de tablas/columnas

### Path Aliases

✅ **Todos los proyectos usan path aliases**
- Evitar imports relativos (`../../../`)
- Usar aliases (`@shared/*`, `@modules/*`)
- Configurado en tsconfig.json

### Linting y Formatting

✅ **ESLint + Prettier en todos los proyectos**
- Configuración compartida desde root
- Consistent code style
- Pre-commit hooks (planeado)

---

## 🔍 Validación (Go/No-Go)

### Criterios de Aceptación - Apps

- [x] Backend funcional y desplegado
- [x] Frontend funcional y desplegado
- [x] Database schema completo
- [x] Constants SSOT implementado
- [ ] Test coverage ≥70% (14% actual) 🔴
- [ ] _MAP.md en aplicaciones principales (0/4) 🔴
- [ ] DevOps completo (Docker, CI/CD) 🔴
- [ ] PWA configurado 🟡

**Decisión:** 🟡 **Parcial GO** - Funcional pero con deuda técnica

---

## 📞 Contacto y Soporte

**Owner principal:** @tech-lead
**Maintainers:**
- Backend: @backend-team
- Frontend: @frontend-team
- Database: @database-team
- DevOps: @devops-team

**Reporte de issues:**
- GitHub Issues: [GAMILIT Apps]
- Slack: #gamilit-dev

---

## 🎯 Próximos Pasos

### Fase 1 - Urgente (Esta Semana)

1. ✅ _MAP.md creado (este archivo)
2. ⬜ Crear _MAP.md en 4 aplicaciones principales
3. ⬜ Implementar tests críticos (exercise engine)
4. ⬜ Configurar Docker para desarrollo

### Fase 2 - Alta Prioridad (Próximas 2 Semanas)

5. ⬜ Aumentar test coverage a 40%
6. ⬜ Implementar CI/CD básico
7. ⬜ Configurar PWA
8. ⬜ Documentar APIs faltantes

### Fase 3 - Media Prioridad (Próximo Mes)

9. ⬜ Test coverage 70%
10. ⬜ Kubernetes manifests
11. ⬜ Migrar a TypeORM (considerar)
12. ⬜ Storybook completo

---

## 🚀 Quick Start

### Desarrollo Local

```bash
# 1. Instalar dependencias
npm install  # En root (instala todas las apps)

# 2. Setup database
cd apps/database
psql -U postgres -f ddl/base-schema.sql
# Ejecutar migrations y seeds

# 3. Variables de entorno
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
# Configurar variables

# 4. Iniciar todo
cd ../..  # Volver a root
npm run dev  # Backend + Frontend concurrentemente

# O iniciar por separado:
npm run backend:dev   # Solo backend (port 3000)
npm run frontend:dev  # Solo frontend (port 5173)
```

### Scripts Globales

```bash
# Desde root del monorepo:
npm run dev                 # Backend + Frontend
npm run build               # Build completo
npm run test                # Tests completos
npm run lint                # Lint completo
npm run validate:all        # Validaciones SSOT
```

---

**Generado:** 2025-11-07
**Método:** Sistema SIMCO - Fase 1 (Mapas P0)
**Próxima actualización:** Tras crear submapas
**Versión:** 1.0.0
