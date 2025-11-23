# 🎓 GAMILIT - Referencia Arquitectónica

**Proyecto:** Sistema Educativo Gamificado GAMILIT
**Fuente:** `/home/isem/workspace/workspace-gamilit/gamilit/projects/gamilit/apps`
**Fecha incorporación:** 2025-11-23
**Tipo:** Monorepo TypeScript (Backend + Frontend + Database)

---

## 🎯 PROPÓSITO DE ESTA REFERENCIA

Este proyecto se incluye como referencia porque implementa **prácticas arquitectónicas y de desarrollo modernas** que queremos adoptar y mejorar en el Sistema de Administración de Obra e INFONAVIT.

**Aspectos clave a estudiar:**
- ✅ Arquitectura de software moderna (TypeScript full-stack)
- ✅ Organización de base de datos multi-schema
- ✅ Sistema de constantes SSOT (Single Source of Truth)
- ✅ Sincronización automática Backend ↔ Frontend
- ✅ Path aliases y estructura modular
- ✅ Scripts de validación y calidad de código

---

## 📊 RESUMEN TÉCNICO

### Stack Tecnológico

**Backend:**
- Node.js 18+ con Express.js
- TypeScript 5+ (strict mode)
- PostgreSQL 15+ (node-postgres)
- Jest (testing)
- ESLint + Prettier

**Frontend:**
- React 18+ con Vite 5+
- TypeScript 5+ (strict mode)
- Tailwind CSS 3+
- Zustand (state management)
- React Hook Form + Zod
- Vitest + React Testing Library
- Storybook 7+

**Database:**
- PostgreSQL 16+
- 9 schemas separados por dominio
- 44 tablas principales
- 279+ índices optimizados
- 50+ funciones PL/pgSQL
- 35+ triggers
- 159 RLS policies (41 activas)

**DevOps:**
- Scripts TypeScript de validación
- Sincronización automática de ENUMs
- Detección de hardcoding
- Validación de contratos API

### Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| **LOC Total** | ~130,000 líneas |
| **Backend LOC** | ~45,000 líneas |
| **Frontend LOC** | ~85,000 líneas |
| **API Endpoints** | 470+ |
| **Componentes React** | 180+ |
| **Módulos Backend** | 11 módulos funcionales |
| **Tests** | ~55 (objetivo: 300) |
| **Coverage** | ~14% (objetivo: 70%) |

---

## 🗂️ ESTRUCTURA DEL PROYECTO

```
gamilit/
├── _MAP.md              # 📋 Mapa completo del proyecto (LEER PRIMERO)
├── backend/             # Backend Node.js + Express + TypeScript
│   ├── src/
│   │   ├── shared/      # Código compartido (constants SSOT, utils, types)
│   │   ├── middleware/  # Middleware Express
│   │   ├── config/      # Configuraciones
│   │   ├── database/    # Conexión DB
│   │   ├── modules/     # 11 módulos de negocio
│   │   └── main.ts      # Entry point
│   ├── __tests__/
│   ├── package.json
│   └── tsconfig.json
├── frontend/            # Frontend React + Vite + TypeScript
│   ├── src/
│   │   ├── shared/      # 180+ componentes reutilizables, hooks, utils
│   │   ├── services/    # API clients, WebSocket
│   │   ├── app/         # Providers, layouts, routing
│   │   ├── features/    # Features por rol (student, teacher, admin)
│   │   └── pages/       # Páginas/Vistas
│   ├── public/
│   ├── .storybook/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── database/            # PostgreSQL DDL, migrations, seeds
│   ├── ddl/
│   │   ├── schemas/     # 9 schemas con objetos DB
│   │   │   ├── auth_management/
│   │   │   ├── educational_content/
│   │   │   ├── gamification_system/
│   │   │   ├── progress_tracking/
│   │   │   ├── social_features/
│   │   │   ├── content_management/
│   │   │   ├── audit_logging/
│   │   │   ├── system_configuration/
│   │   │   └── public/
│   │   └── base-schema.sql
│   ├── migrations/
│   ├── seeds/
│   └── scripts/
└── devops/              # Scripts DevOps
    └── scripts/
        ├── sync-enums.ts
        ├── validate-constants-usage.ts
        └── validate-api-contract.ts
```

**Ver detalle completo:** `_MAP.md` (19,403 bytes de documentación)

---

## ✨ ASPECTOS DESTACABLES PARA NUESTRO PROYECTO

### 1. Sistema de Constantes SSOT

**Qué es:**
Backend como "Single Source of Truth" para constantes, ENUMs y valores compartidos.

**Cómo funciona:**
- Backend define todas las constantes en `src/shared/constants/`
- Script `sync-enums.ts` sincroniza automáticamente a Frontend
- Validación automática detecta hardcoding

**Aplicabilidad al Sistema de Obra e INFONAVIT:** ⭐⭐⭐⭐⭐ (Alta)
- Evita duplicación de constantes DB/Backend/Frontend
- Garantiza sincronización automática
- Reduce errores por valores inconsistentes

**Ubicación para analizar:**
- `backend/src/shared/constants/`
- `devops/scripts/sync-enums.ts`
- `devops/scripts/validate-constants-usage.ts`

---

### 2. Arquitectura de Base de Datos Multi-Schema

**Qué es:**
PostgreSQL con 9 schemas separados por dominio de negocio.

**Estructura:**
```sql
-- Cada schema agrupa objetos relacionados
auth_management        -- Todo lo de autenticación
educational_content    -- Contenido educativo
gamification_system    -- Sistema de gamificación
progress_tracking      -- Tracking de progreso
social_features        -- Features sociales
content_management     -- CMS
audit_logging          -- Auditoría
system_configuration   -- Configuración
public                 -- Compartido
```

**Ventajas:**
- Separación lógica clara
- Facilita permisos granulares
- Mejor organización y mantenibilidad
- Row Level Security (RLS) por schema

**Aplicabilidad al Sistema de Obra e INFONAVIT:** ⭐⭐⭐⭐⭐ (Alta)
- Podríamos usar: `proyectos`, `presupuestos`, `compras`, `obra`, `rrhh`, `infonavit`, `admin`, `auditoria`

**Ubicación para analizar:**
- `database/ddl/schemas/`
- `database/ddl/base-schema.sql`

---

### 3. Path Aliases Consistentes

**Qué es:**
Uso de aliases para imports en lugar de rutas relativas.

**Backend:**
```typescript
// ❌ Sin aliases (malo)
import { UserEntity } from '../../../entities/user.entity';

// ✅ Con aliases (bueno)
import { UserEntity } from '@modules/auth/entities/user.entity';
```

**Frontend:**
```typescript
// ❌ Sin aliases (malo)
import { Button } from '../../../shared/components/Button';

// ✅ Con aliases (bueno)
import { Button } from '@components/Button';
```

**Configuración:**
- Backend: `backend/tsconfig.json` → paths
- Frontend: `frontend/tsconfig.json` + `vite.config.ts` → resolve.alias

**Aplicabilidad:** ⭐⭐⭐⭐⭐ (Alta)
- Mejora legibilidad
- Facilita refactoring
- Reduce errores en imports

**Ubicación para analizar:**
- `backend/tsconfig.json` (líneas con "paths")
- `frontend/tsconfig.json` + `frontend/vite.config.ts`

---

### 4. Estructura Modular del Backend

**Qué es:**
11 módulos funcionales independientes en `backend/src/modules/`

**Módulos:**
- `auth/` - Autenticación y autorización
- `educational/` - Contenido educativo
- `gamification/` - Sistema de gamificación
- `progress/` - Tracking de progreso
- `social/` - Features sociales
- `content/` - Content management
- `admin/` - Administración
- `teacher/` - Portal profesor
- `analytics/` - Analytics
- `notifications/` - Notificaciones
- `system/` - Sistema

**Patrón típico de módulo:**
```
modules/auth/
├── entities/        # Entidades DB
├── dtos/            # Data Transfer Objects
├── services/        # Lógica de negocio
├── controllers/     # Controllers Express
├── routes/          # Definición de rutas
├── middleware/      # Middleware específico
└── validators/      # Validadores
```

**Aplicabilidad:** ⭐⭐⭐⭐⭐ (Alta)
- Organización clara por funcionalidad
- Facilita trabajo en equipo
- Módulos reutilizables

**Ubicación para analizar:**
- `backend/src/modules/`

---

### 5. Feature-Sliced Design en Frontend

**Qué es:**
Arquitectura FSD para organizar features por dominio.

**Estructura:**
```
frontend/src/
├── shared/          # Componentes reutilizables (180+)
│   ├── components/  # UI components
│   ├── hooks/       # Custom hooks
│   ├── utils/       # Utilidades
│   └── types/       # Tipos compartidos
├── features/        # Features por rol
│   ├── student/
│   ├── teacher/
│   └── admin/
├── pages/           # Páginas (vistas)
├── services/        # API clients
└── app/             # App-level (providers, routing)
```

**Ventajas:**
- Separación clara de responsabilidades
- Componentes altamente reutilizables
- Facilita testing
- Escalable para equipos grandes

**Aplicabilidad:** ⭐⭐⭐⭐ (Alta)
- Útil para portales multi-rol (Administrador, Supervisor, etc.)

**Ubicación para analizar:**
- `frontend/src/shared/components/`
- `frontend/src/features/`

---

### 6. Scripts de Validación Automática

**Qué es:**
Scripts TypeScript que validan consistencia del código.

**Scripts disponibles:**

1. **sync-enums.ts** - Sincroniza ENUMs Backend → Frontend
2. **validate-constants-usage.ts** - Detecta hardcoding (33 patrones)
3. **validate-api-contract.ts** - Valida Backend ↔ Frontend sync

**Ejecución:**
```bash
npm run sync:enums              # Sincronizar ENUMs
npm run validate:constants      # Detectar hardcoding
npm run validate:api-contract   # Validar contratos
npm run validate:all            # Todas las validaciones
npm run postinstall             # Auto-sync (automático)
```

**Aplicabilidad:** ⭐⭐⭐⭐⭐ (Alta)
- Previene errores en tiempo de desarrollo
- Asegura consistencia Backend ↔ Frontend
- Automatizable en CI/CD

**Ubicación para analizar:**
- `devops/scripts/sync-enums.ts`
- `devops/scripts/validate-constants-usage.ts`
- `devops/scripts/validate-api-contract.ts`

---

### 7. Sistema de _MAP.md para Documentación

**Qué es:**
Sistema SIMCO de mapas jerárquicos para documentar estructura.

**Ejemplos:**
- `_MAP.md` (raíz) - Mapa completo del proyecto
- `database/ddl/schemas/auth_management/tables/_MAP.md` - Lista de tablas
- `database/ddl/schemas/auth_management/indexes/_MAP.md` - Lista de índices

**Total:** 85+ archivos _MAP.md en el proyecto

**Ventajas:**
- Navegación rápida para agentes AI
- Documentación estructurada
- Actualización incremental

**Aplicabilidad:** ⭐⭐⭐⭐⭐ (Alta)
- Ya adoptado en este proyecto

**Ubicación para analizar:**
- `_MAP.md` (raíz)
- `database/ddl/schemas/*/tables/_MAP.md`

---

## 🔍 ÁREAS DE ANÁLISIS RECOMENDADAS

### Prioridad P0 (Analizar Primero)

1. **Sistema de Constantes SSOT**
   - Archivos: `backend/src/shared/constants/`, `devops/scripts/sync-enums.ts`
   - Beneficio: Eliminar duplicación Backend/Frontend/Database

2. **Arquitectura Multi-Schema**
   - Archivos: `database/ddl/schemas/`
   - Beneficio: Organización lógica de base de datos

3. **Path Aliases**
   - Archivos: `backend/tsconfig.json`, `frontend/tsconfig.json`, `frontend/vite.config.ts`
   - Beneficio: Imports limpios y mantenibles

### Prioridad P1 (Analizar Después)

4. **Estructura Modular Backend**
   - Archivos: `backend/src/modules/`
   - Beneficio: Organización escalable

5. **Feature-Sliced Design Frontend**
   - Archivos: `frontend/src/shared/`, `frontend/src/features/`
   - Beneficio: Componentes reutilizables

### Prioridad P2 (Opcional)

6. **Scripts de Validación**
   - Archivos: `devops/scripts/`
   - Beneficio: Automatización de calidad

7. **Testing Patterns**
   - Archivos: `backend/__tests__/`, `frontend/src/**/*.test.tsx`
   - Beneficio: Estrategias de testing

---

## 🚨 ASPECTOS A EVITAR

### ⚠️ Gaps Identificados en GAMILIT

1. **Test Coverage Bajo** (14% actual vs 70% objetivo)
   - ❌ NO copiar: ~55 tests para 130,000 LOC
   - ✅ SÍ implementar: Coverage desde el inicio

2. **DevOps Incompleto**
   - ❌ NO copiar: Falta Docker, CI/CD, Kubernetes
   - ✅ SÍ implementar: DevOps completo desde el inicio

3. **Backend sin ORM**
   - ❌ NO copiar: Uso de node-postgres (pg) directamente
   - ✅ SÍ considerar: TypeORM o Prisma para nuestro proyecto

---

## 📚 DOCUMENTACIÓN INTERNA

**Mapa completo:** `_MAP.md` (LEER PRIMERO - 19,403 bytes)

**Documentación detallada:**
- Backend: (referenciada en _MAP.md)
- Frontend: (referenciada en _MAP.md)
- Database: `database/ddl/` (85+ _MAP.md files)

**READMEs específicos:**
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- Database: `database/README.md`

---

## 🎯 PLAN DE ANÁLISIS SUGERIDO

### Fase 1: Análisis Arquitectónico (Architecture-Analyst)

**Tareas:**
1. Leer `_MAP.md` completo
2. Analizar estructura multi-schema de database
3. Analizar sistema de constantes SSOT
4. Documentar patrones aplicables al Sistema de Obra e INFONAVIT
5. Crear gap analysis entre GAMILIT y nuestro proyecto
6. Generar recomendaciones priorizadas

**Ubicación output:**
- `orchestration/agentes/architecture-analyst/reference-gamilit/`
- `docs/reference-analysis/gamilit-analysis.md`

**Entregables:**
- Análisis de código de referencia (template en PROMPT-ARCHITECTURE-ANALYST.md)
- Matriz de gaps
- Recomendaciones para adoptar/adaptar/evitar

---

### Fase 2: Extracción de Mejores Prácticas

**Tareas:**
1. Extraer patrones de path aliases
2. Extraer estructura de constantes SSOT
3. Extraer scripts de validación
4. Extraer organización multi-schema
5. Adaptar patrones al contexto de Sistema de Obra e INFONAVIT

**Entregables:**
- ADRs (Architecture Decision Records)
- Actualización de directivas
- Actualización de estándares

---

### Fase 3: Implementación Incremental

**Tareas:**
1. Implementar path aliases en backend/frontend
2. Implementar sistema de constantes SSOT
3. Implementar scripts de validación
4. Refactorizar database a multi-schema
5. Validar coherencia arquitectónica

**Entregables:**
- Código refactorizado
- Tests de validación
- Documentación actualizada

---

## 🔗 RECURSOS ADICIONALES

**Documentación oficial del proyecto:**
- Ver `_MAP.md` para referencias a documentación interna

**Tecnologías utilizadas:**
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [Feature-Sliced Design](https://feature-sliced.design/)

---

## ✅ CHECKLIST DE USO

Antes de usar esta referencia:

- [ ] Leer `_MAP.md` completo (visión general del proyecto)
- [ ] Identificar área de interés específica
- [ ] Analizar código relevante (no todo el proyecto)
- [ ] Documentar hallazgos en `orchestration/agentes/architecture-analyst/`
- [ ] Crear gap analysis vs nuestro proyecto
- [ ] Proponer adaptaciones (no copias directas)
- [ ] Validar aplicabilidad al contexto de construcción/INFONAVIT

---

**Fecha incorporación:** 2025-11-23
**Analista:** Architecture-Analyst
**Estado:** ✅ Listo para análisis
**Prioridad:** P0 - Análisis arquitectónico crítico

**Próximo paso:** Leer `_MAP.md` y ejecutar análisis de referencia (PROMPT-ARCHITECTURE-ANALYST.md sección 2)
