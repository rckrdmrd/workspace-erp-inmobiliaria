# GAMILIT Backend

Backend para la plataforma educativa gamificada GAMILIT.

## Stack Técnico

- **Runtime:** Node.js 18+
- **Framework:** NestJS 11.1.8
- **Language:** TypeScript 5.x (strict mode)
- **ORM:** TypeORM 0.3.x (multi-datasource architecture)
- **Database:** PostgreSQL 14+ (multi-schema: 11 schemas)
- **Auth:** Supabase Auth + JWT
- **Validation:** class-validator + class-transformer
- **Testing:** Jest
- **Linting:** ESLint + Prettier

## Estructura

```
src/
├── shared/                  # Código compartido
│   ├── constants/          # Constantes (database.constants.ts, routes.constants.ts)
│   ├── database/           # TypeORM data sources (6 conexiones)
│   ├── decorators/         # Decoradores custom
│   ├── guards/             # Guards de autenticación/autorización
│   ├── interceptors/       # Interceptors de NestJS
│   └── types/              # TypeScript types compartidos
├── modules/                # Módulos de negocio (15 módulos)
│   ├── auth/               # Autenticación y autorización
│   ├── educational/        # Contenido educativo y ejercicios
│   ├── gamification/       # Sistema de gamificación
│   ├── progress/           # Tracking de progreso
│   ├── admin/              # Dashboard administrativo
│   ├── assignments/        # Sistema de asignaciones
│   ├── social/             # Features sociales (classrooms, teams, friendships)
│   ├── content/            # Gestión de contenido
│   ├── notifications/      # Notificaciones multi-canal
│   └── ...                 # Otros módulos
└── main.ts                 # Entry point NestJS
```

## Arquitectura Multi-Datasource

El backend usa **6 conexiones TypeORM separadas** para manejar la arquitectura multi-schema de PostgreSQL:

- **auth** → schemas: `auth`, `auth_management`
- **educational** → schema: `educational_content`
- **progress** → schema: `progress_tracking`
- **social** → schema: `social_features`
- **gamification** → schema: `gamification_system`
- **content** → schema: `content_management`

**⚠️ Limitación importante:** TypeORM NO soporta relaciones (`@ManyToOne`, `@OneToMany`, `@OneToOne`) entre entidades de diferentes data sources. Se deben usar UUIDs y hacer joins manuales en los services.

Ver documentación completa en: `docs/90-transversal/inventarios/BACKEND_INVENTORY.yml` (sección `multi_datasource_architecture`)

## Scripts

```bash
npm run dev         # Desarrollo con hot reload (NestJS watch mode)
npm run build       # Build producción (TypeScript compilation)
npm run start       # Iniciar producción (dist/main.js)
npm run prod        # Producción con NODE_ENV=production
npm test            # Ejecutar tests (Jest)
npm run test:cov    # Tests con coverage
npm run lint        # Linter (ESLint)
npm run format      # Formatear código (Prettier)
```

## Path Aliases (tsconfig.json)

- `@shared/*` → `src/shared/*`
- `@modules/*` → `src/modules/*`

Ejemplos:
```typescript
import { DB_TABLES } from '@shared/constants/database.constants';
import { AuthService } from '@modules/auth/auth.service';
```

## Endpoints API

- **Base URL:** `http://localhost:3006`
- **Global Prefix:** `/api`
- **Swagger Docs:** `http://localhost:3006/api/docs`

Ejemplos:
- `POST /api/auth/login` - Autenticación
- `GET /api/educational/modules` - Listar módulos educativos
- `GET /api/educational/exercises` - Listar ejercicios
- `GET /api/gamification/achievements` - Achievements del usuario

## Coverage Objetivo

- **Meta:** ≥70% en branches, functions, lines, statements
- **Actual:** ~30% (necesita mejora urgente)
- **Tests:** 11 archivos de test actualmente

Ver más detalles en: `docs/90-transversal/inventarios/BACKEND_INVENTORY.yml`

## Documentación Adicional

- **Inventario completo:** `docs/90-transversal/inventarios/BACKEND_INVENTORY.yml`
- **Guía multi-datasource:** Ver sección `multi_datasource_architecture` en inventario
- **Usuarios de prueba:** `apps/database/docs/GUIA-CARGA-USUARIOS-Y-PERFILES.md`
- **Swagger API:** http://localhost:3006/api/docs (cuando el servidor esté corriendo)
