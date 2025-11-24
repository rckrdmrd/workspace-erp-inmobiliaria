# GUÍA COMPLETA: NOMENCLATURA Y ESTÁNDARES

**Proyecto:** MVP Sistema Administración de Obra e INFONAVIT
**Versión:** 1.0.0
**Fecha:** 2025-11-20
**Ámbito:** Todos los agentes y desarrolladores
**Tipo:** Guía de Referencia Obligatoria

---

## 🎯 PROPÓSITO

Esta guía define **TODOS** los estándares de nomenclatura del proyecto para garantizar:
- **Consistencia** en todo el codebase
- **Legibilidad** y comprensión inmediata
- **Mantenibilidad** a largo plazo
- **Evitar colisiones** de nombres
- **Facilitar búsquedas** y navegación de código

---

## 📁 NOMENCLATURA DE ARCHIVOS Y CARPETAS

### 1. Archivos de Base de Datos (.sql)

```yaml
Convención: {NN}-{nombre-descriptivo}.sql

Reglas:
  - Prefijo numérico secuencial (01, 02, 03...)
  - Nombres en snake_case
  - Descriptivo y claro
  - Extensión .sql

✅ Correcto:
  - 01-projects.sql
  - 02-developments.sql
  - 03-phases.sql
  - 10-functions-geo.sql

❌ Incorrecto:
  - projects.sql (sin prefijo)
  - 1-projects.sql (prefijo de 1 dígito)
  - Projects.sql (PascalCase)
  - 01_projects.sql (guión bajo en lugar de guión)
```

### 2. Archivos de Backend TypeScript

#### Entities (.entity.ts)

```yaml
Convención: {nombre}.entity.ts

Reglas:
  - Nombre en kebab-case
  - Sufijo .entity.ts
  - Singular (project, no projects)

✅ Correcto:
  - project.entity.ts
  - development.entity.ts
  - housing-unit.entity.ts
  - budget-item.entity.ts

❌ Incorrecto:
  - Project.entity.ts (PascalCase)
  - projects.entity.ts (plural)
  - projectEntity.ts (sin guión)
  - project.ts (sin sufijo)
```

#### Services (.service.ts)

```yaml
Convención: {nombre}.service.ts

✅ Correcto:
  - project.service.ts
  - development.service.ts
  - auth.service.ts

❌ Incorrecto:
  - ProjectService.ts
  - projects.service.ts
  - project-service.ts
```

#### Controllers (.controller.ts)

```yaml
Convención: {nombre}.controller.ts

✅ Correcto:
  - project.controller.ts
  - development.controller.ts
  - auth.controller.ts

❌ Incorrecto:
  - ProjectController.ts
  - projects.controller.ts
```

#### DTOs (.dto.ts)

```yaml
Convención: {acción}-{entidad}.dto.ts

✅ Correcto:
  - create-project.dto.ts
  - update-project.dto.ts
  - filter-project.dto.ts

❌ Incorrecto:
  - CreateProject.dto.ts
  - project.dto.ts (sin acción)
  - projectDto.ts
```

#### Módulos (.module.ts)

```yaml
Convención: {nombre}.module.ts

✅ Correcto:
  - project.module.ts
  - auth.module.ts
  - budget.module.ts

❌ Incorrecto:
  - ProjectModule.ts
  - projects.module.ts
```

### 3. Archivos de Frontend

#### Componentes React (.tsx)

```yaml
Convención: {Nombre}{Tipo}.tsx

Reglas:
  - PascalCase
  - Sufijo con tipo si aplica (Button, Card, Modal)
  - Singular

✅ Correcto:
  - ProjectCard.tsx
  - ProjectListItem.tsx
  - CreateProjectModal.tsx
  - ProjectFilters.tsx

❌ Incorrecto:
  - projectCard.tsx (camelCase)
  - project-card.tsx (kebab-case)
  - ProjectsCard.tsx (plural sin razón)
  - Card.tsx (muy genérico)
```

#### Páginas React (.tsx)

```yaml
Convención: {Nombre}Page.tsx

Reglas:
  - PascalCase
  - Sufijo Page obligatorio
  - Plural si lista, singular si detalle

✅ Correcto:
  - ProjectsPage.tsx (lista)
  - ProjectDetailPage.tsx (detalle)
  - CreateProjectPage.tsx (crear)
  - DashboardPage.tsx

❌ Incorrecto:
  - Projects.tsx (sin Page)
  - projectsPage.tsx (camelCase)
  - project-page.tsx (kebab-case)
```

#### Stores Zustand (.ts)

```yaml
Convención: {nombre}.store.ts o use{Nombre}Store.ts

Reglas:
  - camelCase para archivo
  - Sufijo .store.ts

✅ Correcto:
  - project.store.ts
  - auth.store.ts
  - useProjectStore.ts

❌ Incorrecto:
  - ProjectStore.ts (PascalCase en archivo)
  - projectStore.ts (sin .store)
```

#### Hooks Personalizados (.ts)

```yaml
Convención: use{Nombre}.ts

Reglas:
  - Prefijo use obligatorio
  - PascalCase después de use

✅ Correcto:
  - useProjects.ts
  - useAuth.ts
  - useProjectFilters.ts

❌ Incorrecto:
  - projects.ts (sin use)
  - useprojects.ts (sin PascalCase)
  - use-projects.ts (kebab-case)
```

#### Servicios API (.api.ts)

```yaml
Convención: {nombre}.api.ts

✅ Correcto:
  - project.api.ts
  - auth.api.ts
  - budget.api.ts

❌ Incorrecto:
  - ProjectApi.ts
  - projectAPI.ts
  - project-api.ts
```

#### Types (.types.ts)

```yaml
Convención: {nombre}.types.ts

✅ Correcto:
  - project.types.ts
  - common.types.ts
  - api.types.ts

❌ Incorrecto:
  - ProjectTypes.ts
  - project.type.ts (singular)
```

### 4. Archivos de Configuración

```yaml
✅ Correcto:
  - tsconfig.json
  - package.json
  - .env.example
  - .gitignore
  - README.md
  - vite.config.ts
  - jest.config.js

Reglas:
  - Seguir convenciones estándar de cada herramienta
  - lowercase para config files
  - UPPERCASE para archivos especiales (README, LICENSE)
```

### 5. Carpetas

#### Carpetas de Código

```yaml
Convención General: kebab-case o snake_case según contexto

Database:
  - snake_case para schemas: project_management
  - kebab-case para carpetas de código: schemas/project-management

Backend:
  - kebab-case: src/modules/project-management
  - camelCase para subcarpetas: entities, services, controllers

Frontend:
  - kebab-case: src/components/project-cards
  - PascalCase para componentes específicos: ProjectCard/

✅ Correcto (Database):
  - apps/database/ddl/schemas/project_management/
  - apps/database/ddl/schemas/financial_management/

✅ Correcto (Backend):
  - apps/backend/src/modules/project-management/
  - apps/backend/src/modules/auth/
  - apps/backend/src/shared/config/

✅ Correcto (Frontend):
  - apps/frontend/web/src/shared/components/
  - apps/frontend/web/src/apps/admin/
  - apps/frontend/mobile/src/screens/

❌ Incorrecto:
  - project-Management/ (mixto)
  - ProjectManagement/ (PascalCase en carpeta)
  - project_management/ en frontend (contexto incorrecto)
```

#### Carpetas de Orchestration

```yaml
Convención: kebab-case o UPPERCASE para archivos especiales

✅ Correcto:
  - orchestration/agentes/database/
  - orchestration/directivas/
  - orchestration/inventarios/
  - orchestration/templates/
  - orchestration/estados/

Archivos:
  - UPPERCASE-CON-GUIONES.md para documentos principales
  - kebab-case.md para templates

Ejemplos:
  - DIRECTIVA-DOCUMENTACION-OBLIGATORIA.md
  - TEMPLATE-PLAN.md
  - MASTER_INVENTORY.yml
```

---

## 🏷️ NOMENCLATURA DE IDENTIFICADORES EN CÓDIGO

### 1. Database (PostgreSQL + SQL)

#### Schemas

```yaml
Convención: {contexto}_management

Reglas:
  - snake_case
  - Sufijo _management para contextos de negocio
  - Singular o plural según convención del dominio

✅ Correcto:
  - auth_management
  - project_management
  - financial_management
  - purchasing_management

❌ Incorrecto:
  - authManagement (camelCase)
  - auth-management (kebab-case)
  - AUTH_MANAGEMENT (uppercase)
  - projects (sin contexto claro)
```

#### Tablas

```yaml
Convención: {nombre}_en_plural

Reglas:
  - snake_case
  - Plural (projects, users, budgets)
  - Descriptivo y claro

✅ Correcto:
  - projects
  - developments
  - housing_units
  - budget_items
  - project_status_history

❌ Incorrecto:
  - project (singular)
  - Projects (PascalCase)
  - project-developments (kebab-case)
  - tbl_projects (prefijo innecesario)
```

#### Columnas

```yaml
Convención: {nombre}_descriptivo

Reglas:
  - snake_case
  - Singular
  - Evitar abreviaciones
  - Sufijos estándar: _id, _at, _by_id

✅ Correcto:
  - id
  - code
  - name
  - description
  - created_at
  - updated_at
  - created_by_id
  - parent_project_id
  - total_budget_amount

❌ Incorrecto:
  - createdAt (camelCase)
  - created_date (ambiguo, usar created_at)
  - desc (abreviación)
  - proj_id (abreviación)
```

#### Primary Keys

```yaml
Convención: id

Reglas:
  - SIEMPRE se llama "id"
  - Tipo UUID
  - DEFAULT gen_random_uuid()

✅ Correcto:
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ...
);

❌ Incorrecto:
  - project_id como PK (usar id)
  - pk_projects (nombre complejo)
  - uuid (genérico)
```

#### Foreign Keys

```yaml
Convención:
  - Columna: {tabla_referenciada_singular}_id
  - Constraint: fk_{tabla_origen}_to_{tabla_destino}

✅ Correcto:
  - Columna: project_id, user_id, created_by_id
  - Constraint: fk_developments_to_projects
  - Constraint: fk_projects_to_users

❌ Incorrecto:
  - Columna: project (sin _id)
  - Columna: projectId (camelCase)
  - Constraint: fk_project (incompleto)
  - Constraint: projects_developments_fk (orden invertido)
```

#### Índices

```yaml
Convención: idx_{tabla}_{columnas}_{tipo_opcional}

Reglas:
  - Prefijo idx_
  - snake_case
  - Incluir tipo si no es BTREE: _gist, _gin, _hash

✅ Correcto:
  - idx_projects_code
  - idx_projects_status
  - idx_projects_created_at
  - idx_projects_coordinates_gist
  - idx_projects_metadata_gin
  - idx_projects_status_created_at (compuesto)

❌ Incorrecto:
  - index_projects_code (prefijo largo)
  - projects_code_idx (orden invertido)
  - idx_code (sin tabla)
  - idx_ProjectsCode (PascalCase)
```

#### Unique Constraints

```yaml
Convención: uq_{tabla}_{columna(s)}

✅ Correcto:
  - uq_projects_code
  - uq_users_email
  - uq_project_budgets_project_version

❌ Incorrecto:
  - unique_projects_code (prefijo largo)
  - projects_code_uq (orden invertido)
  - uq_code (sin tabla)
```

#### Check Constraints

```yaml
Convención: chk_{tabla}_{columna}_{descripción}

✅ Correcto:
  - chk_projects_status_valid
  - chk_projects_progress_range
  - chk_budgets_amount_positive

❌ Incorrecto:
  - check_projects_status (prefijo largo)
  - projects_status_chk (orden invertido)
  - chk_status (sin tabla)
```

#### Funciones

```yaml
Convención: {verbo}_{nombre_descriptivo}

Reglas:
  - snake_case
  - Verbo al inicio (get, update, calculate, validate)

✅ Correcto:
  - update_updated_at_column()
  - calculate_project_progress()
  - validate_budget_amount()
  - get_active_projects()

❌ Incorrecto:
  - UpdatedAtUpdate() (PascalCase)
  - updated_at() (sin verbo)
  - fn_update_updated_at (prefijo innecesario)
```

#### Triggers

```yaml
Convención: trg_{tabla}_{acción}

✅ Correcto:
  - trg_projects_updated_at
  - trg_budgets_validate_amount
  - trg_developments_sync_count

❌ Incorrecto:
  - trigger_projects_updated_at (prefijo largo)
  - projects_updated_at_trg (orden invertido)
  - trg_updated_at (sin tabla)
```

---

### 2. Backend (TypeScript + Node.js)

#### Classes

```yaml
Convención: {Nombre}{Sufijo}

Reglas:
  - PascalCase
  - Sufijo según tipo: Entity, Service, Controller, Dto, Module

✅ Correcto:
  - ProjectEntity
  - ProjectService
  - ProjectController
  - CreateProjectDto
  - ProjectModule

❌ Incorrecto:
  - projectEntity (camelCase)
  - Project_Entity (snake_case)
  - ProjectEnt (abreviación)
  - Entity (sin nombre)
```

#### Interfaces

```yaml
Convención: I{Nombre} o {Nombre} (sin I según preferencia)

Reglas:
  - PascalCase
  - Descriptivo y claro
  - Prefijo I opcional (proyecto por proyecto)

✅ Correcto (con I):
  - IProjectService
  - IUserRepository
  - IAuthProvider

✅ Correcto (sin I):
  - ProjectService
  - UserRepository
  - AuthProvider

❌ Incorrecto:
  - iProjectService (lowercase i)
  - project_service (snake_case)
  - ProjectServiceInterface (sufijo redundante)
```

#### Types

```yaml
Convención: {Nombre}Type o {Nombre}

Reglas:
  - PascalCase
  - Descriptivo

✅ Correcto:
  - ProjectStatus
  - UserRole
  - ApiResponse
  - ProjectWithDevelopments

❌ Incorrecto:
  - projectStatus (camelCase)
  - project_status (snake_case)
  - TProjectStatus (prefijo T redundante si ya está en .types.ts)
```

#### Enums

```yaml
Convención: {Nombre}Enum o {Nombre}

Reglas:
  - PascalCase para nombre
  - UPPER_SNAKE_CASE para valores

✅ Correcto:
enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}

enum UserRole {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  WORKER = 'worker',
}

❌ Incorrecto:
enum projectStatus { ... } (camelCase)
enum ProjectStatus {
  draft = 'draft', (lowercase)
  Active = 'active', (PascalCase)
}
```

#### Variables

```yaml
Convención: camelCase

Reglas:
  - camelCase
  - Descriptivo
  - Evitar abreviaciones
  - Booleanos con prefijo is/has/can

✅ Correcto:
  - project
  - projectList
  - totalBudgetAmount
  - isActive
  - hasPermission
  - canDelete

❌ Incorrecto:
  - Project (PascalCase)
  - project_list (snake_case)
  - prj (abreviación)
  - active (booleano sin is/has)
  - temp (no descriptivo)
```

#### Constantes

```yaml
Convención: UPPER_SNAKE_CASE

Reglas:
  - UPPERCASE
  - Snake_case con guiones bajos
  - Agrupadas en objetos/archivos

✅ Correcto:
const MAX_UPLOAD_SIZE = 5242880; // 5MB
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_PAGE_SIZE = 20;

const DB_TABLES = {
  PROJECTS: 'projects',
  DEVELOPMENTS: 'developments',
  USERS: 'users',
};

❌ Incorrecto:
const maxUploadSize = 5242880; (camelCase)
const Max_Upload_Size = 5242880; (mixto)
const MAX_UPLOAD (sin valor)
```

#### Funciones/Métodos

```yaml
Convención: {verbo}{Complemento}

Reglas:
  - camelCase
  - Verbo al inicio (get, set, create, update, delete, fetch, calculate)
  - Descriptivo

✅ Correcto:
  - getProjects()
  - createProject()
  - updateProject()
  - deleteProject()
  - fetchProjectById()
  - calculateTotalBudget()
  - validateProjectCode()
  - isProjectActive()

❌ Incorrecto:
  - GetProjects() (PascalCase)
  - get_projects() (snake_case)
  - projects() (sin verbo)
  - get() (no descriptivo)
  - getProjectsFromDatabaseAndFormatThem() (demasiado largo)
```

#### Decoradores

```yaml
Convención: @{Nombre}

Reglas:
  - PascalCase después de @
  - Sin prefijo especial

✅ Correcto:
  @Entity()
  @Column()
  @Injectable()
  @Controller()
  @Get()
  @Post()

❌ Incorrecto:
  @entity() (lowercase)
  @Entity_Decorator() (sufijo redundante)
```

---

### 3. Frontend (React + TypeScript)

#### Componentes React

```yaml
Convención: {Nombre}{Tipo_opcional}

Reglas:
  - PascalCase
  - Descriptivo
  - Sufijo con tipo si ayuda claridad

✅ Correcto:
  - ProjectCard
  - ProjectListItem
  - CreateProjectModal
  - ProjectFilters
  - Button
  - Input

❌ Incorrecto:
  - projectCard (camelCase)
  - project-card (kebab-case)
  - Card (muy genérico sin contexto)
  - PC (abreviación)
```

#### Props de Componentes

```yaml
Convención: {Componente}Props

✅ Correcto:
interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

interface ButtonProps {
  label: string;
  variant: 'primary' | 'secondary';
}

❌ Incorrecto:
interface IProjectCardProps { ... } (prefijo I redundante)
interface ProjectCard_Props { ... } (snake_case)
interface Props { ... } (muy genérico)
```

#### Hooks Personalizados

```yaml
Convención: use{Nombre}

Reglas:
  - Prefijo use obligatorio
  - PascalCase después de use
  - Retorna objeto o array

✅ Correcto:
const useProjects = () => { ... }
const useAuth = () => { ... }
const useProjectFilters = () => { ... }

❌ Incorrecto:
const projects = () => { ... } (sin use)
const useprojects = () => { ... } (sin PascalCase)
const getProjects = () => { ... } (no es hook)
```

#### Estados (useState)

```yaml
Convención: {nombre} y set{Nombre}

✅ Correcto:
const [project, setProject] = useState<Project | null>(null);
const [projects, setProjects] = useState<Project[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);

❌ Incorrecto:
const [Project, SetProject] = useState(); (PascalCase)
const [project, updateProject] = useState(); (no usa set)
const [prj, setPrj] = useState(); (abreviación)
```

#### Stores (Zustand)

```yaml
Convención: use{Nombre}Store

✅ Correcto:
const useProjectStore = create<ProjectState>(() => ({ ... }));
const useAuthStore = create<AuthState>(() => ({ ... }));

Uso:
const { projects, fetchProjects } = useProjectStore();

❌ Incorrecto:
const projectStore = create(); (sin use)
const useProjects = create(); (sin Store)
const useProjectsStore = create(); (plural incorrecto)
```

#### Acciones de Stores

```yaml
Convención: {verbo}{Complemento}

✅ Correcto (en store):
{
  fetchProjects: async () => { ... },
  createProject: async (data) => { ... },
  updateProject: async (id, data) => { ... },
  deleteProject: async (id) => { ... },
  setSelectedProject: (project) => { ... },
}

❌ Incorrecto:
{
  FetchProjects: () => { ... }, (PascalCase)
  fetch_projects: () => { ... }, (snake_case)
  get: () => { ... }, (no descriptivo)
}
```

#### Event Handlers

```yaml
Convención: handle{Evento} o on{Evento}

✅ Correcto:
const handleClick = () => { ... };
const handleSubmit = (e: FormEvent) => { ... };
const handleProjectSelect = (project: Project) => { ... };
const onProjectCreate = (project: Project) => { ... };

❌ Incorrecto:
const click = () => { ... }; (sin handle/on)
const HandleClick = () => { ... }; (PascalCase)
const handle_click = () => { ... }; (snake_case)
const clickHandler = () => { ... }; (sufijo en lugar de prefijo)
```

#### CSS Classes (si usan CSS Modules)

```yaml
Convención: kebab-case

✅ Correcto:
.project-card { ... }
.project-list-item { ... }
.button-primary { ... }
.is-active { ... }

❌ Incorrecto:
.ProjectCard { ... } (PascalCase)
.project_card { ... } (snake_case)
.projectCard { ... } (camelCase)
```

---

## 📦 NOMENCLATURA DE MÓDULOS Y PAQUETES

### 1. Módulos de Backend

```yaml
Convención: kebab-case

✅ Correcto:
  - project-management
  - auth
  - budget-management
  - user-management

❌ Incorrecto:
  - projectManagement (camelCase)
  - project_management (snake_case en backend)
  - ProjectManagement (PascalCase)
```

### 2. Paquetes npm

```yaml
Convención: kebab-case con scope opcional

✅ Correcto:
  - @myapp/shared
  - @myapp/components
  - myapp-utils

❌ Incorrecto:
  - @myApp/shared (camelCase)
  - @myapp/Shared (PascalCase)
```

---

## 🗂️ NOMENCLATURA DE TAREAS Y DOCUMENTACIÓN

### 1. IDs de Tareas de Agentes

```yaml
Convención: {AGENTE}-{NNN}

Reglas:
  - AGENTE en mayúsculas: DB, BE, FE
  - Número de 3 dígitos con ceros leading

✅ Correcto:
  - DB-001
  - DB-042
  - BE-015
  - FE-008

❌ Incorrecto:
  - db-001 (lowercase)
  - DB-1 (sin ceros)
  - DATABASE-001 (nombre completo)
  - DB001 (sin guión)
```

### 2. IDs de Subtareas de Subagentes

```yaml
Convención: {TAREA-PRINCIPAL}-SUB-{NN}

✅ Correcto:
  - DB-042-SUB-01
  - DB-042-SUB-02
  - BE-015-SUB-01

❌ Incorrecto:
  - DB-042-01 (sin SUB)
  - DB-042-SUBAGENT-01 (nombre largo)
  - DB-042-sub-01 (lowercase)
```

### 3. Tipos de Tareas

```yaml
Nomenclatura para carpetas de tareas:

Historia de Usuario:
  US-{NNN}-{nombre-corto}
  Ejemplo: US-001-gestion-proyectos

Feature:
  FEAT-{NNN}-{nombre-corto}
  Ejemplo: FEAT-042-dashboard-proyectos

Bugfix:
  FIX-{NNN}-{nombre-corto}
  Ejemplo: FIX-015-validacion-presupuesto

Tarea Extra:
  TASK-{NNN}-{nombre-corto}
  Ejemplo: TASK-008-migracion-datos

Refactor:
  REFACTOR-{NNN}-{nombre-corto}
  Ejemplo: REFACTOR-023-services-layer
```

### 4. Archivos de Documentación

```yaml
Convención: UPPERCASE-CON-GUIONES.md o {numero}-{nombre}.md

✅ Correcto (documentos principales):
  - README.md
  - CHANGELOG.md
  - CONTRIBUTING.md
  - DIRECTIVA-CONTROL-VERSIONES.md
  - PROMPT-AGENTES-PRINCIPALES.md

✅ Correcto (documentos secuenciales):
  - 01-ANALISIS.md
  - 02-PLAN.md
  - 03-EJECUCION.md
  - 04-VALIDACION.md
  - 05-DOCUMENTACION.md

✅ Correcto (templates):
  - TEMPLATE-PLAN.md
  - TEMPLATE-CONTEXTO-SUBAGENTE.md

❌ Incorrecto:
  - readme.md (lowercase)
  - Readme.md (mixto)
  - ANALISIS.md (sin número si es secuencial)
```

---

## 🌐 NOMENCLATURA DE ENDPOINTS API

### Convención REST

```yaml
Formato: /{version}/{recurso}/{id}/{sub-recurso}

Reglas:
  - lowercase
  - kebab-case para recursos compuestos
  - Plural para colecciones
  - Singular para detalle

✅ Correcto:
  GET    /api/v1/projects
  GET    /api/v1/projects/:id
  POST   /api/v1/projects
  PUT    /api/v1/projects/:id
  DELETE /api/v1/projects/:id
  GET    /api/v1/projects/:id/developments
  GET    /api/v1/projects/:id/budget-items

❌ Incorrecto:
  GET /api/v1/Projects (PascalCase)
  GET /api/v1/project (singular para colección)
  GET /api/v1/projects_list (snake_case)
  GET /api/v1/getProjects (verbo en URL)
  GET /api/v1/projects/:id/getDevelopments (verbo)
```

---

## 🔤 NOMENCLATURA DE VARIABLES DE ENTORNO

```yaml
Convención: UPPER_SNAKE_CASE con prefijo

Reglas:
  - UPPERCASE
  - Snake_case
  - Prefijo por categoría: DB_, API_, APP_, AUTH_

✅ Correcto:
  - DATABASE_URL
  - DB_HOST
  - DB_PORT
  - API_BASE_URL
  - APP_PORT
  - AUTH_JWT_SECRET
  - NODE_ENV

❌ Incorrecto:
  - databaseUrl (camelCase)
  - database-url (kebab-case)
  - DATABASEURL (sin separador)
  - url (no descriptivo)
```

---

## ✅ TABLA DE REFERENCIA RÁPIDA

| Contexto | Convención | Ejemplo |
|----------|-----------|---------|
| **Database** |
| Schema | snake_case + _management | `project_management` |
| Tabla | snake_case plural | `projects` |
| Columna | snake_case singular | `created_at` |
| FK columna | {tabla}_id | `project_id` |
| FK constraint | fk_{origen}_to_{destino} | `fk_developments_to_projects` |
| Índice | idx_{tabla}_{columnas} | `idx_projects_status` |
| Función | {verbo}_{nombre} | `update_updated_at_column` |
| **Backend** |
| Clase | PascalCase + Sufijo | `ProjectEntity` |
| Interface | PascalCase (I opcional) | `IProjectService` |
| Variable | camelCase | `projectList` |
| Constante | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE` |
| Método | camelCase con verbo | `getProjects()` |
| Archivo | kebab-case.sufijo.ts | `project.service.ts` |
| **Frontend** |
| Componente | PascalCase | `ProjectCard` |
| Hook | use + PascalCase | `useProjects` |
| Store | use + PascalCase + Store | `useProjectStore` |
| Props | PascalCase + Props | `ProjectCardProps` |
| Handler | handle + PascalCase | `handleClick` |
| Archivo | PascalCase.tsx | `ProjectCard.tsx` |
| **Otros** |
| Endpoint | /lowercase/kebab-case | `/api/v1/projects` |
| Env var | UPPER_SNAKE_CASE | `DATABASE_URL` |
| Tarea | {AGENTE}-{NNN} | `DB-042` |
| Carpeta | kebab-case | `project-management` |

---

## 📖 CASOS ESPECIALES

### 1. Acrónimos

```yaml
Regla: Tratar acrónimos como palabras

✅ Correcto:
  - ApiService (no APIService)
  - HttpClient (no HTTPClient)
  - UrlParser (no URLParser)

Excepción en constantes:
  - API_BASE_URL (OK en UPPER_CASE)
  - HTTP_TIMEOUT (OK en UPPER_CASE)
```

### 2. Números en Nombres

```yaml
Evitar números excepto en:
  - Archivos secuenciales: 01-projects.sql
  - Versiones: v1, v2
  - IDs de tareas: DB-042

❌ Evitar:
  - project2Service
  - user1Repository
```

### 3. Booleanos

```yaml
Prefijos obligatorios: is, has, can, should

✅ Correcto:
  - isActive
  - hasPermission
  - canDelete
  - shouldValidate

❌ Incorrecto:
  - active (sin prefijo)
  - permission (sin has)
  - deleted (ambiguo)
```

---

## 🔍 VALIDACIÓN DE NOMENCLATURA

### Checklist Pre-Commit

```markdown
- [ ] Nombres de archivos siguen convenciones
- [ ] Nombres de clases/interfaces en PascalCase
- [ ] Variables en camelCase
- [ ] Constantes en UPPER_SNAKE_CASE
- [ ] Database objects en snake_case
- [ ] Sin abreviaciones ambiguas
- [ ] Nombres descriptivos (no temp, data, item)
- [ ] Booleanos con prefijo is/has/can
- [ ] Métodos con verbo al inicio
```

---

## 📚 REFERENCIAS

- ESTANDARES-NOMENCLATURA.md (estándares por capa)
- DIRECTIVA-CALIDAD-CODIGO.md (principios SOLID)
- DIRECTIVA-DISENO-BASE-DATOS.md (normalización)

---

**Versión:** 1.0.0
**Fecha:** 2025-11-20
**Próxima revisión:** Mensual
**Responsable:** Todos los agentes y desarrolladores
