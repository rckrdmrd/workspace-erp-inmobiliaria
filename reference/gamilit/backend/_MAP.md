# _MAP: apps/backend/

**Última actualización:** 2025-11-07
**Estado:** 🟢 En desarrollo activo
**Versión:** 2.0

---

## 📋 Propósito de esta Carpeta

Esta carpeta contiene el **backend API REST + WebSocket** de GAMILIT, implementado en Node.js + Express + TypeScript.

**Arquitectura:** API REST modular con 13 módulos funcionales

**Audiencia:**
- Desarrolladores Backend
- Tech Leads
- DevOps Engineers
- Agentes de IA

---

## 📁 Estructura de Contenido

### Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime |
| **Express.js** | 4.18+ | Framework web |
| **TypeScript** | 5+ | Lenguaje (strict mode) |
| **PostgreSQL** | 15+ | Base de datos (via node-postgres) |
| **Socket.IO** | 4.6+ | WebSocket server |
| **Jest** | 29+ | Testing framework |
| **ESLint** | 8+ | Linter |
| **Prettier** | 3+ | Code formatter |
| **PM2** | 5+ | Process manager |

---

## 🗂️ Estructura de Carpetas

```
backend/
├── src/                      # Código fuente
│   ├── __tests__/            # Tests (40+ tests)
│   │   ├── fixtures/         # Test fixtures
│   │   ├── helpers/          # Test helpers
│   │   ├── setup/            # Test setup
│   │   └── shared/           # Shared test utils
│   ├── config/               # Configuraciones
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── cors.config.ts
│   │   └── socket.config.ts
│   ├── database/             # DB connection
│   │   ├── pool.ts           # PostgreSQL pool
│   │   └── connection.ts     # Connection manager
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logging.middleware.ts
│   ├── modules/              # 13 módulos funcionales
│   │   ├── auth/             # Autenticación (JWT)
│   │   ├── admin/            # Portal admin
│   │   ├── teacher/          # Portal teacher
│   │   ├── educational/      # Contenido educativo
│   │   ├── gamification/     # Gamificación
│   │   ├── progress/         # Progress tracking
│   │   ├── social/           # Social features
│   │   ├── content/          # Content management
│   │   ├── notifications/    # Notificaciones
│   │   ├── mail/             # Email service
│   │   ├── missions/         # Misiones
│   │   ├── powerups/         # Power-ups
│   │   └── core/             # Core utilities
│   ├── shared/               # Código compartido
│   │   ├── constants/        # Constants SSOT
│   │   ├── types/            # Tipos TypeScript
│   │   ├── utils/            # Utilidades
│   │   ├── decorators/       # Decoradores custom
│   │   ├── guards/           # Auth guards
│   │   ├── filters/          # Exception filters
│   │   ├── interceptors/     # Interceptors
│   │   ├── pipes/            # Validation pipes
│   │   ├── middleware/       # Shared middleware
│   │   ├── mappers/          # DTO mappers
│   │   └── services/         # Shared services
│   ├── app.module.ts         # App module principal
│   └── main.ts               # Entry point
├── dist/                     # Build output
├── logs/                     # Application logs
├── coverage/                 # Test coverage reports
├── node_modules/             # Dependencies (~95 MB)
├── __tests__/                # Tests adicionales (root)
├── package.json              # NPM config
├── tsconfig.json             # TypeScript config
├── jest.config.js            # Jest config
├── .eslintrc.js              # ESLint config
├── .prettierrc               # Prettier config
├── .env.example              # Environment variables template
└── README.md                 # Documentación
```

---

## 🧩 Módulos Funcionales (13 módulos)

### auth/ - Autenticación

**Responsabilidad:** Login, registro, JWT tokens, refresh tokens

**Endpoints:** ~15
- POST /api/v1/auth/login
- POST /api/v1/auth/register
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout
- GET /api/v1/auth/me

**Archivos:**
- auth.controller.ts
- auth.service.ts
- auth.module.ts
- dto/login.dto.ts
- dto/register.dto.ts

**Tests:** ~8 tests

---

### educational/ - Contenido Educativo

**Responsabilidad:** Módulos educativos, ejercicios (27 mecánicas), contenido

**Endpoints:** ~60
- GET /api/v1/educational/modules
- GET /api/v1/educational/exercises/:id
- POST /api/v1/educational/exercises/:id/submit
- GET /api/v1/educational/modules/:id/progress

**Archivos:**
- educational.controller.ts
- educational.service.ts
- exercises.controller.ts
- exercises.service.ts
- modules.controller.ts
- modules.service.ts

**Tests:** ~5 tests (insuficiente)

---

### gamification/ - Gamificación

**Responsabilidad:** ML Coins, rangos maya, achievements, power-ups, leaderboards

**Endpoints:** ~45
- GET /api/v1/gamification/ranking
- GET /api/v1/gamification/ml-coins/balance
- POST /api/v1/gamification/ml-coins/spend
- GET /api/v1/gamification/achievements
- POST /api/v1/gamification/achievements/:id/claim

**Archivos:**
- gamification.controller.ts
- gamification.service.ts
- ml-coins.controller.ts
- ml-coins.service.ts
- achievements.controller.ts
- achievements.service.ts
- leaderboards.controller.ts
- leaderboards.service.ts

**Tests:** ~6 tests

---

### progress/ - Progress Tracking

**Responsabilidad:** Tracking de progreso de estudiantes, intentos, sesiones

**Endpoints:** ~40
- GET /api/v1/progress/student/:id
- GET /api/v1/progress/module/:moduleId
- POST /api/v1/progress/exercise/:exerciseId/attempt
- GET /api/v1/progress/analytics

**Archivos:**
- progress.controller.ts
- progress.service.ts
- attempts.controller.ts
- attempts.service.ts

**Tests:** ~4 tests

---

### social/ - Social Features

**Responsabilidad:** Escuelas, aulas, teams, competencias, amigos

**Endpoints:** ~55
- GET /api/v1/social/schools
- GET /api/v1/social/classrooms
- POST /api/v1/social/friends/add
- GET /api/v1/social/teams
- GET /api/v1/social/competitions

**Archivos:**
- social.controller.ts
- social.service.ts
- schools.controller.ts
- classrooms.controller.ts
- friends.controller.ts

**Tests:** ~3 tests

---

### admin/ - Portal Admin

**Responsabilidad:** Gestión de usuarios, organizaciones, sistema

**Endpoints:** ~80
- GET /api/v1/admin/users
- POST /api/v1/admin/users
- PUT /api/v1/admin/users/:id
- DELETE /api/v1/admin/users/:id
- GET /api/v1/admin/organizations

**Archivos:**
- admin.controller.ts
- admin.service.ts
- users.controller.ts
- organizations.controller.ts

**Tests:** ~2 tests

---

### teacher/ - Portal Teacher

**Responsabilidad:** Classroom management, asignaciones, calificación

**Endpoints:** ~70
- GET /api/v1/teacher/classrooms
- POST /api/v1/teacher/assignments
- PUT /api/v1/teacher/grades/:id
- GET /api/v1/teacher/students/:id/progress

**Archivos:**
- teacher.controller.ts
- teacher.service.ts
- classrooms.controller.ts
- assignments.controller.ts
- grading.controller.ts

**Tests:** ~2 tests

---

### content/ - Content Management

**Responsabilidad:** Upload de archivos, gestión de media (MinIO/S3)

**Endpoints:** ~30
- POST /api/v1/content/upload
- GET /api/v1/content/files/:id
- DELETE /api/v1/content/files/:id

**Archivos:**
- content.controller.ts
- content.service.ts
- upload.controller.ts

**Tests:** ~1 test

---

### notifications/ - Notificaciones

**Responsabilidad:** Push notifications, in-app, email, real-time (Socket.IO)

**Endpoints:** ~25
- GET /api/v1/notifications
- PUT /api/v1/notifications/:id/read
- POST /api/v1/notifications/send

**WebSocket Events:**
- notification:new
- notification:read

**Archivos:**
- notifications.controller.ts
- notifications.service.ts
- socket.gateway.ts

**Tests:** ~2 tests

---

### mail/ - Email Service

**Responsabilidad:** Envío de emails (SendGrid)

**Archivos:**
- mail.service.ts
- templates/

**Tests:** ~1 test

---

### missions/ - Misiones

**Responsabilidad:** Sistema de misiones diarias/semanales

**Endpoints:** ~15
- GET /api/v1/missions
- POST /api/v1/missions/:id/start
- POST /api/v1/missions/:id/complete

**Archivos:**
- missions.controller.ts
- missions.service.ts

**Tests:** ~1 test

---

### powerups/ - Power-ups

**Responsabilidad:** Power-ups temporales (2x XP, skip exercise, etc)

**Endpoints:** ~10
- GET /api/v1/powerups
- POST /api/v1/powerups/:id/use

**Archivos:**
- powerups.controller.ts
- powerups.service.ts

**Tests:** ~1 test

---

### core/ - Core Utilities

**Responsabilidad:** Utilidades core del sistema

**Archivos:**
- health.controller.ts
- system.controller.ts

**Endpoints:**
- GET /api/health
- GET /api/health/db
- GET /api/system/info

**Tests:** ~2 tests

---

## 📊 Métricas del Backend

### Código

| Métrica | Valor |
|---------|-------|
| **Archivos TypeScript** | 375 |
| **LOC** | ~45,000 |
| **Módulos** | 13 |
| **Controllers** | 33 |
| **Services** | 43 |
| **Endpoints API** | ~470+ |

### Testing

| Métrica | Actual | Objetivo | Gap |
|---------|--------|----------|-----|
| **Tests totales** | 40 | 210 | 🔴 81% |
| **Coverage** | ~15% | 70% | 🔴 55% |
| **Tests unitarios** | 35 | 150 | 🔴 77% |
| **Tests integración** | 5 | 60 | 🔴 92% |

### Tamaño

| Componente | Tamaño |
|------------|--------|
| **Total** | 108 MB |
| **node_modules** | ~95 MB |
| **src** | ~10 MB |
| **dist** | ~2 MB |
| **logs** | ~500 KB |
| **coverage** | ~500 KB |

---

## 🔗 Interdependencias

### Database (apps/database/)

- Consume DDL de `apps/database/ddl/`
- Constants referencian schemas y tablas
- Queries usan funciones PL/pgSQL
- RLS policies enforced en queries

### Frontend (apps/frontend/)

- Provee API REST endpoints
- WebSocket para real-time
- ENUMs sincronizados (Constants SSOT)
- CORS configurado para frontend

### DevOps (apps/devops/)

- Scripts de validación (Constants SSOT)
- Sincronización de ENUMs
- Validación de hardcoding

---

## 🚨 Issues Conocidos

### P0 (Crítico)

- **P0-001:** Test coverage bajo (15% vs 70% objetivo)
  - Exercise engine sin tests (27 mecánicas)
  - Gamification system sin tests
  - **Esfuerzo:** 20-30 horas

### P1 (Alto)

- **P1-001:** No usa TypeORM/Prisma
  - Usa node-postgres directo
  - Queries SQL manuales propensas a errores
  - **Recomendación:** Considerar migración

- **P1-002:** WebSocket no documentado completamente
  - Eventos sin tipado fuerte
  - **Esfuerzo:** 4-6 horas

### P2 (Medio)

- **P2-001:** Logging básico
  - Winston configurado pero sin estructura
  - Falta ELK Stack integration
  - **Esfuerzo:** 6-8 horas

- **P2-002:** Sin rate limiting por usuario
  - Solo rate limiting global
  - **Esfuerzo:** 2-3 horas

---

## 📐 Estándares Aplicables

### Path Aliases

Configurados en `tsconfig.json`:
```json
{
  "@shared/*": ["src/shared/*"],
  "@modules/*": ["src/modules/*"],
  "@config/*": ["src/config/*"],
  "@database/*": ["src/database/*"],
  "@middleware/*": ["src/middleware/*"]
}
```

### Nomenclatura

- **Archivos:** `kebab-case.ts`
- **Clases:** `PascalCase`
- **Funciones:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`

### Estructura de Módulos

```
modules/[nombre]/
├── [nombre].controller.ts      # Controller (endpoints)
├── [nombre].service.ts         # Service (business logic)
├── [nombre].module.ts          # Module (dependency injection)
├── dto/                        # Data Transfer Objects
│   ├── create-[nombre].dto.ts
│   └── update-[nombre].dto.ts
├── entities/                   # Database entities (si usa TypeORM)
└── __tests__/                  # Tests
    ├── [nombre].controller.spec.ts
    └── [nombre].service.spec.ts
```

---

## 🎯 Próximos Pasos

### Fase 1 - Urgente (Esta Semana)

1. ✅ _MAP.md creado (este archivo)
2. ⬜ Implementar tests exercise engine (27 mecánicas)
3. ⬜ Aumentar coverage a 40%
4. ⬜ Documentar WebSocket events

**Esfuerzo:** 15-20 horas

### Fase 2 - Alta Prioridad (Próximas 2 Semanas)

5. ⬜ Implementar tests gamification (ML Coins, achievements)
6. ⬜ Mejorar logging estructurado
7. ⬜ Rate limiting por usuario
8. ⬜ Coverage 70%

**Esfuerzo:** 20-25 horas

### Fase 3 - Media Prioridad (Próximo Mes)

9. ⬜ Evaluar migración a TypeORM/Prisma
10. ⬜ Integrar ELK Stack
11. ⬜ Swagger UI para API docs
12. ⬜ APM (New Relic/Datadog)

**Esfuerzo:** 25-30 horas

---

## 🚀 Scripts NPM

```bash
# Desarrollo
npm run dev              # Hot reload con ts-node-dev
npm run dev:debug        # Debug mode

# Build
npm run build            # Build production (tsc)
npm run start            # Start production (node dist/main.js)

# Testing
npm test                 # Run tests (Jest)
npm run test:watch       # Tests en modo watch
npm run test:cov         # Tests con coverage
npm run test:e2e         # E2E tests (Supertest)

# Calidad
npm run lint             # ESLint
npm run lint:fix         # ESLint autofix
npm run format           # Prettier
npm run format:check     # Prettier check

# Validaciones (Constants SSOT)
npm run sync:enums       # Sincronizar ENUMs con frontend
npm run validate:constants  # Detectar hardcoding
```

---

## 📚 Documentación Relacionada

**Guías de desarrollo:**
- [docs/03-desarrollo/backend/](../../docs/03-desarrollo/backend/)
- [docs/03-desarrollo/backend/ESTRUCTURA-Y-MODULOS.md](../../docs/03-desarrollo/backend/ESTRUCTURA-Y-MODULOS.md)
- [docs/03-desarrollo/backend/API-ENDPOINTS.md](../../docs/03-desarrollo/backend/API-ENDPOINTS.md)
- [docs/03-desarrollo/backend/SERVICIOS-PRINCIPALES.md](../../docs/03-desarrollo/backend/SERVICIOS-PRINCIPALES.md)

**Especificaciones técnicas:**
- [docs/02-especificaciones-tecnicas/apis/](../../docs/02-especificaciones-tecnicas/apis/)
- [docs/02-especificaciones-tecnicas/arquitectura/BACKEND-ARCHITECTURE.md](../../docs/02-especificaciones-tecnicas/arquitectura/BACKEND-ARCHITECTURE.md)

**Testing:**
- [docs/03-desarrollo/TESTING-GUIDE.md](../../docs/03-desarrollo/TESTING-GUIDE.md)
- [docs/02-especificaciones-tecnicas/testing-strategy/](../../docs/02-especificaciones-tecnicas/testing-strategy/)

---

## 📞 Contacto

**Owner:** @backend-team
**Tech Lead:** @tech-lead

**Reportar issues:**
- GitHub Issues: [GAMILIT Backend]
- Slack: #gamilit-backend

---

**Generado:** 2025-11-07
**Método:** Sistema SIMCO - Fase 3 (Submapas apps/)
**Versión:** 1.0.0
