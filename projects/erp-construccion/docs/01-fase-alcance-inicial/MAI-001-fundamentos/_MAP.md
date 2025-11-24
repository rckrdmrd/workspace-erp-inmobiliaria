# _MAP: MAI-001 - Fundamentos

**Épica:** MAI-001
**Nombre:** Fundamentos
**Fase:** 1 - Alcance Inicial
**Presupuesto:** $25,000 MXN
**Story Points:** 50 SP
**Estado:** 🚧 Planificado
**Sprint:** Sprint 0-2 (Semanas 1-2)
**Última actualización:** 2025-11-17

---

## 📋 Propósito

Establecer las bases técnicas y funcionales del Sistema de Administración de Obra:
- Autenticación y autorización (JWT, RBAC para construcción)
- Infraestructura base (DB, API, frontend) migrada de GAMILIT
- Perfiles de usuario con 7 roles específicos
- Dashboard principal por rol
- Multi-tenancy por constructora

**Reutilización GAMILIT:** 90% de componentes de infraestructura

---

## 📁 Contenido

### Requerimientos Funcionales (3)

| ID | Archivo | Título | Estado |
|----|---------|--------|--------|
| RF-AUTH-001 | [RF-AUTH-001-roles-construccion.md](./requerimientos/RF-AUTH-001-roles-construccion.md) | Sistema de Roles de Construcción | 🚧 Planificado |
| RF-AUTH-002 | [RF-AUTH-002-estados-cuenta.md](./requerimientos/RF-AUTH-002-estados-cuenta.md) | Estados de Cuenta de Usuario | 🚧 Planificado |
| RF-AUTH-003 | [RF-AUTH-003-multi-tenancy.md](./requerimientos/RF-AUTH-003-multi-tenancy.md) | Multi-tenancy por Constructora | 🚧 Planificado |

### Especificaciones Técnicas (3)

| ID | Archivo | Título | RF | Estado |
|----|---------|--------|-------|--------|
| ET-AUTH-001 | [ET-AUTH-001-rbac.md](./especificaciones/ET-AUTH-001-rbac.md) | RBAC Implementation | RF-AUTH-001 | 🚧 Planificado |
| ET-AUTH-002 | [ET-AUTH-002-estados-cuenta.md](./especificaciones/ET-AUTH-002-estados-cuenta.md) | Estados de Cuenta | RF-AUTH-002 | 🚧 Planificado |
| ET-AUTH-003 | [ET-AUTH-003-multi-tenancy.md](./especificaciones/ET-AUTH-003-multi-tenancy.md) | Multi-tenancy Implementation | RF-AUTH-003 | 🚧 Planificado |

### Historias de Usuario (8)

| ID | Archivo | Título | SP | Estado |
|----|---------|--------|----|--------|
| US-FUND-001 | [US-FUND-001-autenticacion-basica-jwt.md](./historias-usuario/US-FUND-001-autenticacion-basica-jwt.md) | Autenticación Básica JWT | 8 | 🚧 Planificado |
| US-FUND-002 | [US-FUND-002-perfiles-usuario-construccion.md](./historias-usuario/US-FUND-002-perfiles-usuario-construccion.md) | Perfiles de Usuario de Construcción | 5 | 🚧 Planificado |
| US-FUND-003 | [US-FUND-003-dashboard-por-rol.md](./historias-usuario/US-FUND-003-dashboard-por-rol.md) | Dashboard Principal por Rol | 8 | 🚧 Planificado |
| US-FUND-004 | [US-FUND-004-infraestructura-base.md](./historias-usuario/US-FUND-004-infraestructura-base.md) | Infraestructura Técnica Base | 12 | 🚧 Planificado |
| US-FUND-005 | [US-FUND-005-sistema-sesiones.md](./historias-usuario/US-FUND-005-sistema-sesiones.md) | Sistema de Sesiones y Estado | 6 | 🚧 Planificado |
| US-FUND-006 | [US-FUND-006-api-restful-base.md](./historias-usuario/US-FUND-006-api-restful-base.md) | API RESTful Básica | 8 | 🚧 Planificado |
| US-FUND-007 | [US-FUND-007-navegacion-routing.md](./historias-usuario/US-FUND-007-navegacion-routing.md) | Navegación y Routing | 5 | 🚧 Planificado |
| US-FUND-008 | [US-FUND-008-ui-ux-base.md](./historias-usuario/US-FUND-008-ui-ux-base.md) | UI/UX Base (migrada de GAMILIT) | 3 | 🚧 Planificado |

**Total Story Points:** 50 SP (reducidos vs 60 SP de GAMILIT por reutilización)

### Implementación

📊 **Inventarios de trazabilidad:**
- [TRACEABILITY.yml](./implementacion/TRACEABILITY.yml) - Matriz completa de trazabilidad
- [DATABASE.yml](./implementacion/DATABASE.yml) - Objetos de base de datos
- [BACKEND.yml](./implementacion/BACKEND.yml) - Módulos backend
- [FRONTEND.yml](./implementacion/FRONTEND.yml) - Componentes frontend

### Pruebas

📋 Documentación de testing:
- [TEST-PLAN.md](./pruebas/TEST-PLAN.md) - Plan de pruebas
- [TEST-CASES.md](./pruebas/TEST-CASES.md) - Casos de prueba

---

## 🔗 Referencias

- **README:** [README.md](./README.md) - Descripción detallada de la épica
- **Fase 1:** [../README.md](../README.md) - Información de la fase completa
- **Proyecto GAMILIT:** Referenciar [EAI-001](../../../workspace-gamilit/gamilit/projects/gamilit/docs/01-fase-alcance-inicial/EAI-001-fundamentos/)

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| **Presupuesto estimado** | $25,000 MXN |
| **Presupuesto target** | $25,000 MXN ±5% |
| **Story Points estimados** | 50 SP |
| **Duración estimada** | 10 días (vs 11 días GAMILIT) |
| **Reutilización GAMILIT** | 90% |
| **Ahorro estimado** | ~2.5 semanas vs desarrollo desde cero |
| **RF a implementar** | 3/3 |
| **ET a implementar** | 3/3 |
| **US a completar** | 8/8 |

---

## 🎯 Módulos Afectados

### Base de Datos
- **Schemas:** `auth`, `auth_management`, `audit_logging`, `public`
- **Tablas:** ~18 tablas (auth, profiles, constructoras, audit_logs, etc.)
- **Funciones:** Funciones de RBAC, verificación de permisos por constructora
- **ENUMs:**
  - `construction_role` (director, engineer, resident, purchases, finance, hr, post_sales)
  - `account_status` (active, suspended, banned, pending_verification)

### Backend
- **Módulo:** `auth`
- **Path:** `apps/backend/src/modules/auth/`
- **Services:** AuthService, JwtService, ConstructoraService
- **Guards:** JwtAuthGuard, RolesGuard, ConstructoraGuard
- **Middlewares:** ValidationMiddleware, ErrorMiddleware, LoggingMiddleware

### Frontend
- **Features:** `auth`, `dashboard`
- **Path:** `apps/frontend/src/features/`
- **Componentes:** Login, Register, Dashboard (7 variantes por rol), Profile
- **Guards:** AuthGuard, RoleGuard, ConstructoraGuard
- **Stores:** authStore, constructoraStore

---

## 🚀 Roles Específicos de Construcción

A diferencia de GAMILIT (student, admin_teacher, super_admin), este sistema tiene 7 roles:

| Rol | Código | Descripción | Permisos Clave |
|-----|--------|-------------|----------------|
| **Director** | `director` | Director general/proyectos | Visión global, márgenes, riesgos |
| **Ingeniero** | `engineer` | Ingeniería/Planeación | Presupuestos, programación, control |
| **Residente** | `resident` | Residente de obra/Supervisor | Avances, incidencias, checklists |
| **Compras** | `purchases` | Compras/Almacén | Órdenes de compra, inventarios |
| **Finanzas** | `finance` | Administración/Finanzas | Presupuestos, pagos, flujo |
| **RRHH** | `hr` | Recursos Humanos | Asistencias, costeo mano de obra |
| **Postventa** | `post_sales` | Postventa/Garantías | Incidencias, seguimiento clientes |

---

## 🔄 Migración desde GAMILIT

### Componentes a Migrar (Sprint 0)

**Backend:**
- [x] Sistema de autenticación JWT
- [x] Middleware de autenticación y autorización
- [x] Guards (JwtAuthGuard, RolesGuard)
- [x] Error handlers y validadores
- [x] Sistema de logging estructurado
- [x] Sistema de auditoría

**Frontend:**
- [x] Componentes UI base (Buttons, Inputs, Modales)
- [x] Layouts principales
- [x] Sistema de formularios (React Hook Form + Zod)
- [x] Hooks personalizados (useAuth, useApi)
- [x] Sistema de notificaciones

**Database:**
- [x] Schemas modulares
- [x] Funciones comunes (now_mexico, get_current_user_id)
- [x] Triggers de auditoría
- [x] Políticas RLS base

### Adaptaciones Requeridas

| Componente | Adaptación | Esfuerzo |
|------------|------------|----------|
| **Roles ENUM** | Cambiar 3 roles → 7 roles construcción | Bajo |
| **RLS Policies** | Adaptar filtros por constructora | Medio |
| **Dashboard** | Crear 7 variantes por rol | Medio |
| **Permisos** | Matriz de permisos por módulo | Alto |

---

## 💡 Lessons Learned (de GAMILIT)

1. **RLS desde día 1:** Implementar Row Level Security desde el inicio evita refactoring
2. **Tests rigurosos:** Coverage >80% = deployment tranquilo
3. **Modularización temprana:** Facilita desarrollo paralelo
4. **Documentación previa:** Especificar antes de implementar reduce cambios

---

## 🎯 Siguiente Paso

Completar Sprint 0 con migración de componentes GAMILIT, luego iniciar implementación de MAI-001.

---

**Generado:** 2025-11-17
**Mantenedores:** @tech-lead @backend-team @frontend-team @database-team
**Estado:** 🚧 Planificado
