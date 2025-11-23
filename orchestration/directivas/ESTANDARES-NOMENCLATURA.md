# ESTÁNDARES DE NOMENCLATURA

**Proyecto:** MVP Sistema Administración de Obra e INFONAVIT
**Versión:** 1.0.0
**Fecha:** 2025-11-17
**Audiencia:** Todos los agentes (Database, Backend, Frontend) y subagentes

---

## PROPÓSITO

Este documento establece las **convenciones de nomenclatura obligatorias** para todos los elementos del proyecto:

- Archivos y carpetas
- Objetos de base de datos
- Código Backend (TypeScript)
- Código Frontend (React/React Native)
- Constantes y configuraciones

**Objetivo:** Mantener consistencia, legibilidad y predictibilidad en todo el codebase.

---

## PRINCIPIOS GENERALES

### 1. Consistencia Absoluta

```markdown
✅ Usar SIEMPRE la misma convención para elementos del mismo tipo
❌ NO mezclar convenciones (ej: user_name y userName en mismo contexto)
```

### 2. Claridad sobre Brevedad

```markdown
✅ `projectDevelopmentPhase` (claro)
❌ `pdp` (ambiguo)

✅ `calculateMonthlyBudget()` (claro)
❌ `calcMoBud()` (ambiguo)
```

### 3. Predictibilidad

```markdown
Si existe `ProjectEntity`, entonces:
- Service: `ProjectService` (NO `ProjectsService`, `ProjService`)
- Controller: `ProjectController` (NO `ProjectsController`)
- DTO Create: `CreateProjectDto` (NO `ProjectCreateDto`, `NewProjectDto`)
- DTO Update: `UpdateProjectDto`
```

### 4. Evitar Ambigüedad

```markdown
❌ `data` (¿qué data?)
✅ `projectData`, `userData`, `contractData`

❌ `temp` (¿temporal de qué?)
✅ `tempFileName`, `tempContract`, `tempCalculation`

❌ `result` (¿resultado de qué?)
✅ `calculationResult`, `queryResult`, `validationResult`
```

---

## CONVENCIONES POR CAPA

## 1. BASE DE DATOS (PostgreSQL)

### 1.1. Schemas

**Convención:** `snake_case` + sufijo `_management`

```sql
-- ✅ CORRECTO
auth_management
project_management
budget_management
contract_management

-- ❌ INCORRECTO
Auth              -- Pascal case
auth_mgmt         -- Abreviatura no estándar
authentication    -- Sin sufijo
```

**Patrón:**
```
{dominio}_management
```

**Ejemplos:**
```sql
-- Schemas del MVP
auth_management          -- Autenticación y usuarios
project_management       -- Proyectos y obras
budget_management        -- Presupuestos y partidas
contract_management      -- Contratos y subcontratos
purchase_management      -- Compras y proveedores
inventory_management     -- Almacenes e inventarios
progress_management      -- Avances y números generador
quality_management       -- Calidad postventa
crm_management          -- CRM derechohabientes
infonavit_management    -- INFONAVIT cumplimiento
preconstruction_management  -- Preconstrucción y licitaciones
security_management     -- Seguridad de obra
```

### 1.2. Tablas

**Convención:** `snake_case`, plural cuando representan colecciones

```sql
-- ✅ CORRECTO
users
projects
project_developments
budget_items
contracts

-- ❌ INCORRECTO
Users              -- Pascal case
user               -- Singular (excepción: tablas de configuración)
project_development -- Singular cuando debería ser plural
projectDevelopments -- Camel case
```

**Reglas:**
1. **Plural para entidades de negocio:** `users`, `projects`, `contracts`
2. **Singular para tablas de configuración/metadata:** `configuration`, `audit_log`
3. **Tablas de relación muchos-a-muchos:** `{tabla1}_{tabla2}` (ambas en plural)

**Ejemplos:**

```sql
-- Entidades de negocio (plural)
users
projects
developments
phases
houses
budgets
budget_items
contracts
subcontracts
suppliers
purchase_orders
materials
warehouses
work_progresses

-- Configuración (singular)
system_configuration
application_settings

-- Tablas de auditoría (singular)
audit_log
change_history

-- Relaciones muchos-a-muchos
users_roles              -- users M:N roles
contracts_suppliers      -- contracts M:N suppliers
projects_stakeholders    -- projects M:N stakeholders
```

### 1.3. Columnas

**Convención:** `snake_case`

```sql
-- ✅ CORRECTO
id
user_id
created_at
full_name
email_address
phone_number
is_active
total_amount

-- ❌ INCORRECTO
Id                  -- Pascal case
userId              -- Camel case
createdAt           -- Camel case
full_Name           -- Mezcla
```

**Patrones estándar:**

```sql
-- Primary Key
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- Foreign Keys
{tabla_singular}_id UUID NOT NULL
-- Ejemplos:
user_id             -- Referencia a users
project_id          -- Referencia a projects
created_by_id       -- Referencia a users (creador)
updated_by_id       -- Referencia a users (modificador)

-- Timestamps
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
deleted_at TIMESTAMP  -- Para soft delete

-- Booleanos (prefijo is_, has_, can_)
is_active BOOLEAN NOT NULL DEFAULT true
is_deleted BOOLEAN NOT NULL DEFAULT false
has_access BOOLEAN NOT NULL DEFAULT false
can_edit BOOLEAN NOT NULL DEFAULT false

-- Estados (sufijo _status)
project_status VARCHAR(20) NOT NULL
contract_status VARCHAR(20) NOT NULL
payment_status VARCHAR(20) NOT NULL

-- Montos
total_amount DECIMAL(15,2) NOT NULL
unit_price DECIMAL(15,2) NOT NULL
subtotal DECIMAL(15,2) NOT NULL
tax_amount DECIMAL(15,2) NOT NULL

-- Códigos (sufijo _code)
project_code VARCHAR(50) NOT NULL UNIQUE
contract_code VARCHAR(50) NOT NULL UNIQUE
invoice_code VARCHAR(50) NOT NULL UNIQUE

-- Geo (PostGIS)
coordinates GEOGRAPHY(POINT, 4326)
boundary GEOGRAPHY(POLYGON, 4326)
```

### 1.4. Índices

**Convención:** `idx_{tabla}_{columna(s)}`

```sql
-- ✅ CORRECTO - Índice simple
CREATE INDEX idx_users_email ON auth_management.users(email);
CREATE INDEX idx_projects_code ON project_management.projects(code);
CREATE INDEX idx_contracts_status ON contract_management.contracts(status);

-- ✅ CORRECTO - Índice compuesto
CREATE INDEX idx_projects_status_created_at
    ON project_management.projects(status, created_at);

CREATE INDEX idx_budget_items_budget_category
    ON budget_management.budget_items(budget_id, category_id);

-- ✅ CORRECTO - Índice GiST (geo)
CREATE INDEX idx_projects_coordinates
    ON project_management.projects USING GIST(coordinates);

-- ✅ CORRECTO - Índice parcial
CREATE INDEX idx_users_active_email
    ON auth_management.users(email) WHERE is_active = true;

-- ❌ INCORRECTO
CREATE INDEX users_email_idx         -- Orden incorrecto
CREATE INDEX ix_users_email          -- Prefijo no estándar
CREATE INDEX index_on_users_email    -- Nombre largo
CREATE INDEX idx_email               -- Falta nombre tabla
```

**Reglas:**
1. Prefijo: `idx_`
2. Nombre tabla (sin schema)
3. Columna(s) separadas por guión bajo
4. Para índices GiST: agregar al final (ej: `idx_projects_coordinates`)
5. Para índices parciales: agregar sufijo descriptivo (ej: `idx_users_active_email`)

### 1.5. Constraints

#### Foreign Keys

**Convención:** `fk_{tabla_origen}_to_{tabla_destino}`

```sql
-- ✅ CORRECTO
ALTER TABLE project_management.projects
ADD CONSTRAINT fk_projects_to_users
FOREIGN KEY (created_by_id)
REFERENCES auth_management.users(id);

ALTER TABLE project_management.developments
ADD CONSTRAINT fk_developments_to_projects
FOREIGN KEY (project_id)
REFERENCES project_management.projects(id);

-- ✅ CORRECTO - Mismo nombre tabla destino pero columna diferente
ALTER TABLE contract_management.contracts
ADD CONSTRAINT fk_contracts_to_users_creator
FOREIGN KEY (created_by_id)
REFERENCES auth_management.users(id);

ALTER TABLE contract_management.contracts
ADD CONSTRAINT fk_contracts_to_users_approver
FOREIGN KEY (approved_by_id)
REFERENCES auth_management.users(id);

-- ❌ INCORRECTO
fk_project_user              -- Faltan plurales/singulares consistentes
projects_created_by_fk       -- Orden incorrecto
fk_created_by                -- No especifica tablas
```

#### Check Constraints

**Convención:** `chk_{tabla}_{columna}` o `chk_{tabla}_{descripción}`

```sql
-- ✅ CORRECTO - Constraint simple
ALTER TABLE project_management.projects
ADD CONSTRAINT chk_projects_status
CHECK (status IN ('PLANNING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'));

ALTER TABLE budget_management.budget_items
ADD CONSTRAINT chk_budget_items_amount
CHECK (total_amount >= 0);

-- ✅ CORRECTO - Constraint multi-columna
ALTER TABLE contract_management.contracts
ADD CONSTRAINT chk_contracts_dates
CHECK (end_date >= start_date);

-- ✅ CORRECTO - Constraint complejo
ALTER TABLE purchase_management.purchase_orders
ADD CONSTRAINT chk_purchase_orders_total
CHECK (total_amount = subtotal + tax_amount);

-- ❌ INCORRECTO
chk_status                   -- No especifica tabla
projects_status_check        -- Orden incorrecto
check_projects_status        -- Prefijo incorrecto
```

#### Unique Constraints

**Convención:** `uq_{tabla}_{columna(s)}`

```sql
-- ✅ CORRECTO
ALTER TABLE auth_management.users
ADD CONSTRAINT uq_users_email UNIQUE (email);

ALTER TABLE project_management.projects
ADD CONSTRAINT uq_projects_code UNIQUE (code);

-- ✅ CORRECTO - Unique compuesto
ALTER TABLE budget_management.budget_items
ADD CONSTRAINT uq_budget_items_budget_code
UNIQUE (budget_id, item_code);

-- ❌ INCORRECTO
uq_email                     -- No especifica tabla
users_email_unique           -- Orden incorrecto
unique_users_email           -- Prefijo incorrecto
```

### 1.6. Functions

**Convención:** `snake_case`, verbo + sustantivo

```sql
-- ✅ CORRECTO
CREATE FUNCTION calculate_budget_total(budget_id UUID)
RETURNS DECIMAL AS $$...$$;

CREATE FUNCTION get_project_summary(project_id UUID)
RETURNS TABLE(...) AS $$...$$;

CREATE FUNCTION update_contract_status(
    contract_id UUID,
    new_status VARCHAR
) RETURNS VOID AS $$...$$;

-- ❌ INCORRECTO
calculateBudgetTotal         -- Camel case
CalcBudgetTotal             -- Pascal case
budget_total_calc           -- Sustantivo + verbo (orden incorrecto)
```

### 1.7. Views

**Convención:** `snake_case`, prefijo `v_` o `vw_`

```sql
-- ✅ CORRECTO
CREATE VIEW project_management.v_active_projects AS ...;
CREATE VIEW budget_management.v_budget_summary AS ...;
CREATE VIEW contract_management.vw_contract_details AS ...;

-- ❌ INCORRECTO
CREATE VIEW active_projects AS ...;     -- Sin prefijo
CREATE VIEW ActiveProjects AS ...;       -- Pascal case
CREATE VIEW view_active_projects AS ...; -- Prefijo redundante
```

### 1.8. Triggers

**Convención:** `trg_{tabla}_{evento}_{acción}`

```sql
-- ✅ CORRECTO
CREATE TRIGGER trg_projects_before_update_timestamp
BEFORE UPDATE ON project_management.projects
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_contracts_after_insert_audit
AFTER INSERT ON contract_management.contracts
FOR EACH ROW EXECUTE FUNCTION audit_log_insert();

-- ❌ INCORRECTO
projects_update_trigger      -- Orden incorrecto
trigger_projects_update      -- Prefijo redundante
trg_update                   -- No especifica tabla
```

### 1.9. Sequences

**Convención:** `seq_{tabla}_{propósito}`

```sql
-- ✅ CORRECTO
CREATE SEQUENCE contract_management.seq_contracts_number
START 1 INCREMENT 1;

CREATE SEQUENCE purchase_management.seq_purchase_orders_year
START 1 INCREMENT 1;

-- ❌ INCORRECTO
contracts_seq                -- Orden incorrecto
contract_number_sequence     -- Prefijo incorrecto
seq_number                   -- No especifica tabla
```

---

## 2. BACKEND (Node.js + TypeScript + TypeORM)

### 2.1. Entities

**Convención:** `PascalCase` + sufijo `Entity`

```typescript
// ✅ CORRECTO
export class UserEntity { ... }
export class ProjectEntity { ... }
export class ProjectDevelopmentEntity { ... }
export class BudgetItemEntity { ... }
export class ContractEntity { ... }

// ❌ INCORRECTO
export class User { ... }              // Sin sufijo
export class userEntity { ... }        // Camel case
export class Users { ... }             // Plural
export class project_entity { ... }    // Snake case
```

**Estructura de archivo:**

```typescript
// apps/backend/src/modules/projects/entities/project.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ... } from 'typeorm';

/**
 * Entity representing a construction project
 * Maps to table: project_management.projects
 */
@Entity('projects', { schema: 'project_management' })
export class ProjectEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    code: string;

    @Column({ type: 'varchar', length: 200 })
    name: string;

    // ...más properties
}
```

**Nombre de archivo:** `{nombre}.entity.ts` (singular, kebab-case si multi-palabra)

```
project.entity.ts                    // ✅
project-development.entity.ts        // ✅
budget-item.entity.ts               // ✅

projects.entity.ts                  // ❌ (plural)
ProjectEntity.ts                    // ❌ (Pascal case en archivo)
project_entity.ts                   // ❌ (snake case)
```

### 2.2. Properties de Entity

**Convención:** `camelCase`

```typescript
// ✅ CORRECTO
export class ProjectEntity {
    id: string;
    code: string;
    name: string;
    description: string;
    projectStatus: string;          // Mapea a project_status en DB
    totalBudget: number;            // Mapea a total_budget
    createdById: string;            // Mapea a created_by_id
    createdAt: Date;                // Mapea a created_at
    updatedAt: Date;
    isActive: boolean;
    coordinates: Point;             // PostGIS
}

// ❌ INCORRECTO
export class ProjectEntity {
    Id: string;                     // Pascal case
    project_status: string;         // Snake case (usar camelCase)
    created_at: Date;               // Snake case
}
```

**Nota:** TypeORM mapea automáticamente camelCase ↔ snake_case

### 2.3. Relaciones

**Convención:** `camelCase`, singular para `@ManyToOne`, plural para `@OneToMany`/`@ManyToMany`

```typescript
export class ProjectEntity {
    // ✅ CORRECTO - ManyToOne (singular)
    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: 'created_by_id' })
    createdBy: UserEntity;

    // ✅ CORRECTO - OneToMany (plural)
    @OneToMany(() => DevelopmentEntity, dev => dev.project)
    developments: DevelopmentEntity[];

    // ✅ CORRECTO - ManyToMany (plural)
    @ManyToMany(() => StakeholderEntity)
    @JoinTable({ name: 'projects_stakeholders' })
    stakeholders: StakeholderEntity[];
}

// ❌ INCORRECTO
export class ProjectEntity {
    @ManyToOne(() => UserEntity)
    user: UserEntity;               // Ambiguo (¿cuál user?)

    @OneToMany(() => DevelopmentEntity, ...)
    development: DevelopmentEntity[];  // Singular cuando debería ser plural

    @ManyToMany(() => StakeholderEntity)
    stakeholder: StakeholderEntity[];  // Singular
}
```

### 2.4. Services

**Convención:** `PascalCase` + sufijo `Service`

```typescript
// ✅ CORRECTO
export class ProjectService { ... }
export class UserService { ... }
export class BudgetItemService { ... }
export class ContractService { ... }

// ❌ INCORRECTO
export class ProjectsService { ... }    // Plural
export class projectService { ... }     // Camel case
export class ProjectServ { ... }        // Abreviatura
```

**Nombre de archivo:** `{nombre}.service.ts`

```
project.service.ts                  // ✅
user.service.ts                     // ✅
budget-item.service.ts              // ✅

projects.service.ts                 // ❌
ProjectService.ts                   // ❌
```

**Métodos de Service:**

**Convención:** `camelCase`, verbo + sustantivo/contexto

```typescript
export class ProjectService {
    // ✅ CORRECTO - CRUD
    async findAll(): Promise<ProjectEntity[]> { ... }
    async findById(id: string): Promise<ProjectEntity> { ... }
    async findByCode(code: string): Promise<ProjectEntity> { ... }
    async create(dto: CreateProjectDto): Promise<ProjectEntity> { ... }
    async update(id: string, dto: UpdateProjectDto): Promise<ProjectEntity> { ... }
    async delete(id: string): Promise<void> { ... }
    async softDelete(id: string): Promise<void> { ... }

    // ✅ CORRECTO - Queries específicas
    async findActiveProjects(): Promise<ProjectEntity[]> { ... }
    async findProjectsByStatus(status: string): Promise<ProjectEntity[]> { ... }
    async findProjectsCreatedBy(userId: string): Promise<ProjectEntity[]> { ... }

    // ✅ CORRECTO - Business logic
    async calculateProjectBudget(projectId: string): Promise<number> { ... }
    async validateProjectCode(code: string): Promise<boolean> { ... }
    async changeProjectStatus(projectId: string, newStatus: string): Promise<void> { ... }
    async archiveProject(projectId: string): Promise<void> { ... }

    // ❌ INCORRECTO
    async getAll() { ... }              // Usar findAll
    async GetById(id: string) { ... }   // Pascal case
    async find_by_code(code) { ... }    // Snake case
    async projects() { ... }            // Sustantivo solo
}
```

**Patrones de nombres de métodos:**

```typescript
// Queries
find{Criterio}           // findAll, findById, findByCode, findActive
get{Recurso}             // getProjectSummary, getUserPermissions

// Mutations
create{Recurso}          // createProject, createBudget
update{Recurso}          // updateProject, updateContract
delete{Recurso}          // deleteProject (hard delete)
softDelete{Recurso}      // softDeleteProject

// Business logic
calculate{Algo}          // calculateBudget, calculateTotal
validate{Algo}           // validateCode, validateDates
change{Propiedad}        // changeStatus, changeOwner
archive{Recurso}         // archiveProject, archiveContract
approve{Recurso}         // approveContract, approveBudget
reject{Recurso}          // rejectContract, rejectPayment
```

### 2.5. Controllers

**Convención:** `PascalCase` + sufijo `Controller`

```typescript
// ✅ CORRECTO
export class ProjectController { ... }
export class UserController { ... }
export class BudgetItemController { ... }

// ❌ INCORRECTO
export class ProjectsController { ... }   // Plural
export class projectController { ... }    // Camel case
```

**Nombre de archivo:** `{nombre}.controller.ts`

```
project.controller.ts               // ✅
user.controller.ts                  // ✅
budget-item.controller.ts           // ✅
```

**Métodos de Controller:**

**Convención:** `camelCase`, mapean a verbos HTTP

```typescript
@Controller('projects')
export class ProjectController {
    // ✅ CORRECTO
    @Get()
    async findAll(): Promise<ProjectEntity[]> { ... }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ProjectEntity> { ... }

    @Post()
    async create(@Body() dto: CreateProjectDto): Promise<ProjectEntity> { ... }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateProjectDto
    ): Promise<ProjectEntity> { ... }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> { ... }

    // ✅ CORRECTO - Endpoints custom
    @Get('active')
    async findActive(): Promise<ProjectEntity[]> { ... }

    @Get(':id/summary')
    async getProjectSummary(@Param('id') id: string): Promise<any> { ... }

    @Post(':id/archive')
    async archiveProject(@Param('id') id: string): Promise<void> { ... }

    // ❌ INCORRECTO
    @Get()
    async GetAll() { ... }              // Pascal case

    @Post()
    async CreateProject() { ... }       // Redundante (ya está en ruta)
}
```

### 2.6. DTOs (Data Transfer Objects)

**Convención:** `PascalCase` + prefijo de acción + sufijo `Dto`

```typescript
// ✅ CORRECTO
export class CreateProjectDto { ... }
export class UpdateProjectDto { ... }
export class ProjectResponseDto { ... }
export class ProjectSummaryDto { ... }
export class CreateBudgetItemDto { ... }
export class UpdateContractStatusDto { ... }

// ❌ INCORRECTO
export class ProjectDto { ... }            // Sin prefijo de acción
export class ProjectCreateDto { ... }      // Orden incorrecto
export class NewProject { ... }            // Sin sufijo Dto
export class project_dto { ... }           // Snake case
```

**Nombre de archivo:** `{accion}-{nombre}.dto.ts` o `{nombre}-{tipo}.dto.ts`

```
create-project.dto.ts               // ✅
update-project.dto.ts               // ✅
project-response.dto.ts             // ✅
project-summary.dto.ts              // ✅

project.dto.ts                      // ❌ (sin prefijo)
ProjectDto.ts                       // ❌ (Pascal case en archivo)
```

**Estructura:**

```typescript
// create-project.dto.ts
import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    code: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 200)
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    // ... más properties
}
```

### 2.7. Interfaces

**Convención:** `PascalCase` + prefijo `I` (opcional) o sufijo descriptivo

```typescript
// ✅ CORRECTO - Con prefijo I
export interface IProjectRepository { ... }
export interface IAuthService { ... }
export interface ILogger { ... }

// ✅ CORRECTO - Con sufijo descriptivo
export interface ProjectFilters { ... }
export interface ProjectSummary { ... }
export interface BudgetCalculation { ... }

// ✅ CORRECTO - Sin prefijo (TypeScript style)
export interface ProjectRepository { ... }
export interface AuthService { ... }

// ❌ INCORRECTO
export interface projectRepository { ... }  // Camel case
export interface project_filters { ... }    // Snake case
```

**Nombre de archivo:** `{nombre}.interface.ts`

```
project-repository.interface.ts     // ✅
auth-service.interface.ts           // ✅
project-filters.interface.ts        // ✅
```

### 2.8. Enums

**Convención:** `PascalCase` + sufijo `Enum` (opcional), valores `UPPER_SNAKE_CASE`

```typescript
// ✅ CORRECTO
export enum ProjectStatus {
    PLANNING = 'PLANNING',
    ACTIVE = 'ACTIVE',
    PAUSED = 'PAUSED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum ContractType {
    MAIN_CONTRACT = 'MAIN_CONTRACT',
    SUBCONTRACT = 'SUBCONTRACT'
}

export enum UserRole {
    ADMIN = 'ADMIN',
    PROJECT_MANAGER = 'PROJECT_MANAGER',
    SUPERVISOR = 'SUPERVISOR',
    CONTRACTOR = 'CONTRACTOR'
}

// ❌ INCORRECTO
export enum ProjectStatus {
    planning = 'planning',          // Lowercase
    Active = 'Active',              // Pascal case
}

export enum projectStatus { ... }   // Camel case en nombre
```

**Nombre de archivo:** `{nombre}.enum.ts`

```
project-status.enum.ts              // ✅
contract-type.enum.ts               // ✅
user-role.enum.ts                   // ✅
```

### 2.9. Constantes

**Convención:** `UPPER_SNAKE_CASE`

```typescript
// ✅ CORRECTO
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const DEFAULT_PAGE_SIZE = 20;
export const API_VERSION = 'v1';

// Constantes agrupadas
export const DB_TABLES = {
    AUTH: {
        USERS: 'users',
        ROLES: 'roles',
        PERMISSIONS: 'permissions'
    },
    PROJECT: {
        PROJECTS: 'projects',
        DEVELOPMENTS: 'developments',
        PHASES: 'phases'
    }
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404
} as const;

// ❌ INCORRECTO
export const databaseUrl = '...';   // Camel case
export const Database_Url = '...';  // Mezcla
export const database_url = '...';  // Lowercase
```

**Nombre de archivo:** `{contexto}.constants.ts`

```
database.constants.ts               // ✅
http.constants.ts                   // ✅
validation.constants.ts             // ✅
```

### 2.10. Variables y Parámetros

**Convención:** `camelCase`

```typescript
// ✅ CORRECTO
const projectId = '...';
const userName = 'John Doe';
let totalAmount = 1000;
const budgetItems = [...];
const isActive = true;

function calculateProjectBudget(projectId: string, includeSubcontracts: boolean) {
    const baseAmount = 1000;
    const taxRate = 0.16;
    let totalBudget = baseAmount;

    // ...
}

// ❌ INCORRECTO
const ProjectId = '...';            // Pascal case
const project_id = '...';           // Snake case
const TOTAL_AMOUNT = 1000;          // Uppercase (reservado para constantes)
```

---

## 3. FRONTEND (React + TypeScript)

### 3.1. Componentes

**Convención:** `PascalCase`, sin sufijo

```typescript
// ✅ CORRECTO
export const ProjectCard = () => { ... };
export const UserAvatar = () => { ... };
export const BudgetItemList = () => { ... };
export const ContractForm = () => { ... };

// ❌ INCORRECTO
export const projectCard = () => { ... };     // Camel case
export const ProjectCardComponent = () => { ... }; // Sufijo redundante
export const project_card = () => { ... };    // Snake case
```

**Nombre de archivo:** `{NombreComponente}.tsx` (PascalCase)

```
ProjectCard.tsx                     // ✅
UserAvatar.tsx                      // ✅
BudgetItemList.tsx                  // ✅

project-card.tsx                    // ❌
projectCard.tsx                     // ❌
ProjectCardComponent.tsx            // ❌
```

**Estructura:**

```typescript
// ProjectCard.tsx
import React from 'react';

interface ProjectCardProps {
    project: Project;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

/**
 * Displays a project card with summary information
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    onEdit,
    onDelete
}) => {
    return (
        <div className="project-card">
            {/* ... */}
        </div>
    );
};
```

### 3.2. Páginas

**Convención:** `PascalCase` + sufijo `Page`

```typescript
// ✅ CORRECTO
export const ProjectsPage = () => { ... };
export const ProjectDetailPage = () => { ... };
export const LoginPage = () => { ... };
export const DashboardPage = () => { ... };

// ❌ INCORRECTO
export const Projects = () => { ... };        // Sin sufijo
export const ProjectsView = () => { ... };    // Sufijo diferente
export const projectsPage = () => { ... };    // Camel case
```

**Nombre de archivo:** `{NombrePage}.tsx` (PascalCase)

```
ProjectsPage.tsx                    // ✅
ProjectDetailPage.tsx               // ✅
LoginPage.tsx                       // ✅
DashboardPage.tsx                   // ✅

projects.tsx                        // ❌
projects-page.tsx                   // ❌
```

### 3.3. Hooks Personalizados

**Convención:** `camelCase` + prefijo `use`

```typescript
// ✅ CORRECTO
export const useProjects = () => { ... };
export const useAuth = () => { ... };
export const useBudgetCalculation = () => { ... };
export const useDebounce = () => { ... };
export const useLocalStorage = () => { ... };

// ❌ INCORRECTO
export const projects = () => { ... };        // Sin prefijo
export const Projects = () => { ... };        // Pascal case
export const use_projects = () => { ... };    // Snake case
export const UseProjects = () => { ... };     // Pascal case
```

**Nombre de archivo:** `{hookName}.ts` (camelCase)

```
useProjects.ts                      // ✅
useAuth.ts                          // ✅
useBudgetCalculation.ts             // ✅

projects.ts                         // ❌
use-projects.ts                     // ❌
UseProjects.ts                      // ❌
```

**Estructura:**

```typescript
// useProjects.ts
import { useState, useEffect } from 'react';
import { projectService } from '@/services/projectService';
import type { Project } from '@/types/project';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await projectService.findAll();
            setProjects(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return { projects, loading, error, refetch: fetchProjects };
};
```

### 3.4. Stores (Zustand)

**Convención:** `camelCase` + sufijo `Store`

```typescript
// ✅ CORRECTO
export const useProjectStore = create(() => { ... });
export const useAuthStore = create(() => { ... });
export const useUserStore = create(() => { ... });

// ❌ INCORRECTO
export const projectStore = create(() => { ... }); // Sin prefijo use
export const useProjects = create(() => { ... });  // Sin sufijo Store
export const useProjectsStore = create(() => { ... }); // Plural
```

**Nombre de archivo:** `{nombre}Store.ts` (camelCase + Store)

```
projectStore.ts                     // ✅
authStore.ts                        // ✅
userStore.ts                        // ✅

project-store.ts                    // ❌
projects-store.ts                   // ❌
```

**Estructura:**

```typescript
// projectStore.ts
import { create } from 'zustand';
import type { Project } from '@/types/project';

interface ProjectStore {
    projects: Project[];
    selectedProject: Project | null;
    loading: boolean;
    error: Error | null;

    // Actions
    setProjects: (projects: Project[]) => void;
    selectProject: (project: Project | null) => void;
    addProject: (project: Project) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
    projects: [],
    selectedProject: null,
    loading: false,
    error: null,

    setProjects: (projects) => set({ projects }),
    selectProject: (project) => set({ selectedProject: project }),
    addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
    })),
    updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p =>
            p.id === id ? { ...p, ...updates } : p
        )
    })),
    deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
    }))
}));
```

### 3.5. Services (API)

**Convención:** `camelCase` + sufijo `Service`

```typescript
// ✅ CORRECTO
export const projectService = { ... };
export const authService = { ... };
export const userService = { ... };

// ❌ INCORRECTO
export const ProjectService = { ... };        // Pascal case
export const project_service = { ... };       // Snake case
export const projects = { ... };              // Sin sufijo
```

**Nombre de archivo:** `{nombre}Service.ts` (camelCase)

```
projectService.ts                   // ✅
authService.ts                      // ✅
userService.ts                      // ✅

project-service.ts                  // ❌
ProjectService.ts                   // ❌
```

**Estructura:**

```typescript
// projectService.ts
import { apiClient } from '@/lib/apiClient';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/types/project';

export const projectService = {
    async findAll(): Promise<Project[]> {
        const response = await apiClient.get<Project[]>('/projects');
        return response.data;
    },

    async findById(id: string): Promise<Project> {
        const response = await apiClient.get<Project>(`/projects/${id}`);
        return response.data;
    },

    async create(dto: CreateProjectDto): Promise<Project> {
        const response = await apiClient.post<Project>('/projects', dto);
        return response.data;
    },

    async update(id: string, dto: UpdateProjectDto): Promise<Project> {
        const response = await apiClient.put<Project>(`/projects/${id}`, dto);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/projects/${id}`);
    }
};
```

### 3.6. Types e Interfaces

**Convención:** `PascalCase`, sin prefijo `I` (TypeScript style)

```typescript
// ✅ CORRECTO
export interface Project { ... }
export interface User { ... }
export interface BudgetItem { ... }
export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'PAUSED';
export type ProjectFilters = { ... };

// ❌ INCORRECTO
export interface IProject { ... }          // Prefijo I (C# style, evitar)
export interface project { ... }           // Camel case
export interface ProjectInterface { ... }  // Sufijo redundante
```

**Nombre de archivo:** `{contexto}.ts` o `{nombre}.types.ts`

```
project.ts                          // ✅
project.types.ts                    // ✅
user.types.ts                       // ✅
api.types.ts                        // ✅

Project.ts                          // ❌
project-types.ts                    // ❌
```

### 3.7. Variables y Estados

**Convención:** `camelCase`

```typescript
// ✅ CORRECTO
const [projects, setProjects] = useState<Project[]>([]);
const [selectedProject, setSelectedProject] = useState<Project | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState('');

const userName = 'John Doe';
const totalAmount = 1000;
let currentPage = 1;

// ❌ INCORRECTO
const [Projects, setProjects] = useState([]);       // Pascal case
const [selected_project, setSelectedProject] = useState(null); // Snake case
const [is_loading, setIsLoading] = useState(false); // Snake case
```

### 3.8. CSS Classes

**Convención:** `kebab-case` (BEM opcional)

```css
/* ✅ CORRECTO */
.project-card { ... }
.user-avatar { ... }
.budget-item-list { ... }

/* ✅ CORRECTO - BEM */
.project-card { ... }
.project-card__header { ... }
.project-card__body { ... }
.project-card__footer { ... }
.project-card--active { ... }
.project-card--archived { ... }

/* ❌ INCORRECTO */
.ProjectCard { ... }            /* Pascal case */
.project_card { ... }           /* Snake case */
.projectCard { ... }            /* Camel case */
```

---

## 4. ARCHIVOS Y CARPETAS

### 4.1. Carpetas

**Convención:** `kebab-case` (lowercase con guiones)

```
✅ CORRECTO
apps/
  database/
    ddl/
      schemas/
        project-management/
        budget-management/
  backend/
    src/
      modules/
        projects/
        budget-items/
  frontend/
    web/
      src/
        apps/
          project-manager/
        shared/
          components/

❌ INCORRECTO
ProjectManagement/        -- Pascal case
project_management/       -- Snake case
projectManagement/        -- Camel case
```

### 4.2. Archivos Database (SQL)

**Convención:** `{NN}-{nombre}.sql` (dos dígitos + guión + nombre en kebab-case)

```
✅ CORRECTO
01-users.sql
02-roles.sql
03-permissions.sql
10-projects.sql
11-developments.sql
20-budgets.sql

❌ INCORRECTO
users.sql                 -- Sin prefijo numérico
1-users.sql               -- Un solo dígito
Users.sql                 -- Pascal case
01_users.sql              -- Underscore en vez de guión
```

**Propósito del prefijo numérico:** Controlar orden de ejecución

### 4.3. Archivos Backend (TypeScript)

**Convención:** `{nombre}.{tipo}.ts` (kebab-case + tipo)

```
✅ CORRECTO
project.entity.ts
project.service.ts
project.controller.ts
create-project.dto.ts
update-project.dto.ts
project-status.enum.ts
project-filters.interface.ts
database.config.ts
auth.middleware.ts
logger.util.ts

❌ INCORRECTO
ProjectEntity.ts          -- Pascal case en archivo
project_entity.ts         -- Snake case
projectEntity.ts          -- Camel case
project.ts                -- Sin tipo
```

### 4.4. Archivos Frontend

**Convención según tipo:**

```
✅ CORRECTO - Componentes/Páginas (PascalCase)
ProjectCard.tsx
ProjectsPage.tsx
UserAvatar.tsx
LoginPage.tsx

✅ CORRECTO - Hooks/Services/Stores (camelCase)
useProjects.ts
projectService.ts
projectStore.ts

✅ CORRECTO - Types/Utils (kebab-case)
project.types.ts
project-filters.ts
api-client.ts
date-utils.ts

❌ INCORRECTO
project-card.tsx          -- Kebab case para componente
Projects-Page.tsx         -- Mezcla
use-projects.ts           -- Kebab case para hook
project_service.ts        -- Snake case
```

### 4.5. Archivos de Configuración

**Convención:** `{nombre}.config.{ext}` (kebab-case)

```
✅ CORRECTO
database.config.ts
jwt.config.ts
email.config.ts
vite.config.ts
tsconfig.json
eslint.config.js

❌ INCORRECTO
DatabaseConfig.ts         -- Pascal case
database_config.ts        -- Snake case
configDatabase.ts         -- Orden incorrecto
```

### 4.6. Archivos de Documentación

**Convención:** `UPPER-CASE.md` o `kebab-case.md` según contexto

```
✅ CORRECTO - Documentos principales (mayúsculas)
README.md
CHANGELOG.md
CONTRIBUTING.md
LICENSE.md

✅ CORRECTO - Documentos de orchestration (mayúsculas)
PROMPT-AGENTES-PRINCIPALES.md
DIRECTIVA-VALIDACION-SUBAGENTES.md
ESTANDARES-NOMENCLATURA.md
TEMPLATE-CONTEXTO-SUBAGENTE.md

✅ CORRECTO - Documentos específicos (kebab-case)
installation-guide.md
api-documentation.md
architecture-decisions.md

❌ INCORRECTO
Readme.md                 -- Mezcla de mayúsculas/minúsculas
prompt_agentes.md         -- Snake case
PromptAgentes.md          -- Pascal case
```

### 4.7. Archivos de Orchestration

**Convención según tipo:**

```
✅ CORRECTO - Prompts (MAYÚSCULAS con guiones)
PROMPT-AGENTES-PRINCIPALES.md
PROMPT-SUBAGENTES.md
PROMPT-REQUIREMENTS-ANALYST.md

✅ CORRECTO - Directivas (MAYÚSCULAS con guiones)
DIRECTIVA-VALIDACION-SUBAGENTES.md
DIRECTIVA-DOCUMENTACION-OBLIGATORIA.md
POLITICAS-USO-AGENTES.md

✅ CORRECTO - Templates (MAYÚSCULAS con guiones)
TEMPLATE-CONTEXTO-SUBAGENTE.md
TEMPLATE-ANALISIS.md
TEMPLATE-VALIDACION.md
TEMPLATE-PLAN.md

✅ CORRECTO - Trazas (MAYÚSCULAS con guiones)
TRAZA-TAREAS-DATABASE.md
TRAZA-TAREAS-BACKEND.md
TRAZA-REQUERIMIENTOS.md

✅ CORRECTO - Inventarios (MAYÚSCULAS con guiones, extensión yml)
MASTER_INVENTORY.yml
DATABASE_INVENTORY.yml
BACKEND_INVENTORY.yml

✅ CORRECTO - Estados (MAYÚSCULAS con guiones, extensión json)
ESTADO-GENERAL.json
METRICAS-VALIDACION.yml
FEEDBACK-SUBAGENTES.jsonl

❌ INCORRECTO
prompt-agentes.md         -- Minúsculas
Prompt_Agentes.md         -- Mezcla + snake case
promptAgentes.md          -- Camel case
```

**Razón:** Archivos de orchestration en MAYÚSCULAS para distinguirlos visualmente como documentos del sistema (no código).

---

## 5. CASOS ESPECIALES

### 5.1. Acrónimos

**Regla:** Tratar como palabra normal según contexto

```typescript
// ✅ CORRECTO - Backend
export class CrmEntity { ... }        // NO CRMEntity
export class ApiService { ... }       // NO APIService
const urlBase = '...';                 // NO URLBase
const httpStatus = 200;                // NO HTTPStatus

// ✅ CORRECTO - SQL
crm_clients                            // NO CRM_clients
api_keys                               // NO API_keys

// EXCEPCIÓN: Constantes (todo mayúsculas)
export const API_BASE_URL = '...';     // ✅
export const JWT_SECRET = '...';       // ✅
export const HTTP_TIMEOUT_MS = 5000;   // ✅

// ❌ INCORRECTO
export class CRMEntity { ... }
export class APIService { ... }
const URLBase = '...';
```

### 5.2. Números en Nombres

**Regla:** Usar números solo cuando sean parte inherente del concepto

```typescript
// ✅ CORRECTO
export class Oauth2Service { ... }
const ipv4Address = '...';
const md5Hash = '...';

// SQL
oauth2_tokens
ipv4_addresses

// ❌ EVITAR (usar nombres descriptivos)
const value1 = ...;         // ¿Qué es value1?
const temp2 = ...;          // ¿Qué es temp2?

// ✅ MEJOR
const baseValue = ...;
const adjustedValue = ...;
const tempFileName = ...;
const tempCalculation = ...;
```

### 5.3. Prefijos/Sufijos Booleanos

**Regla:** Usar `is`, `has`, `can`, `should` para booleanos

```typescript
// ✅ CORRECTO
const isActive = true;
const hasAccess = false;
const canEdit = true;
const shouldValidate = false;

// SQL
is_active BOOLEAN
has_access BOOLEAN
can_edit BOOLEAN

// ❌ INCORRECTO
const active = true;        // Ambiguo (¿es boolean o string?)
const access = false;       // Ambiguo
const edit = true;          // Ambiguo
```

### 5.4. Fechas y Timestamps

**Regla:** Sufijos `_at` para timestamps, `_date` para fechas

```typescript
// ✅ CORRECTO - SQL
created_at TIMESTAMP
updated_at TIMESTAMP
deleted_at TIMESTAMP
birth_date DATE
start_date DATE
end_date DATE

// ✅ CORRECTO - TypeScript
createdAt: Date;
updatedAt: Date;
deletedAt: Date | null;
birthDate: Date;
startDate: Date;
endDate: Date;

// ❌ INCORRECTO
created TIMESTAMP           // Sin sufijo
creation_date TIMESTAMP     // Mezcla de convenciones
date_created DATE           // Orden incorrecto
```

### 5.5. Prefijos de Testing

**Regla:** Sufijo `.spec.ts` o `.test.ts`

```
✅ CORRECTO
project.service.spec.ts
project.controller.spec.ts
user.entity.spec.ts

// O con .test
project.service.test.ts
project.controller.test.ts

❌ INCORRECTO
test-project-service.ts
project-service-test.ts
projectServiceTest.ts
```

---

## 6. QUICK REFERENCE

### Resumen por Capa

| Capa | Archivos | Clases/Objetos | Variables | Constantes |
|------|----------|----------------|-----------|------------|
| **Database** | `kebab-case.sql` | `snake_case` | N/A | N/A |
| **Backend** | `kebab-case.{tipo}.ts` | `PascalCase` + sufijo | `camelCase` | `UPPER_SNAKE_CASE` |
| **Frontend** | Componentes: `PascalCase.tsx`<br>Otros: `camelCase.ts` | `PascalCase` | `camelCase` | `UPPER_SNAKE_CASE` |
| **Docs** | `UPPER-CASE.md` o `kebab-case.md` | N/A | N/A | N/A |

### Sufijos Comunes

| Tipo | Backend | Frontend |
|------|---------|----------|
| Entity | `ProjectEntity` | N/A |
| Service | `ProjectService` | `projectService` |
| Controller | `ProjectController` | N/A |
| DTO | `CreateProjectDto` | N/A |
| Componente | N/A | `ProjectCard` |
| Página | N/A | `ProjectsPage` |
| Hook | N/A | `useProjects` |
| Store | N/A | `useProjectStore` |

### Prefijos Comunes

| Contexto | Prefijo | Ejemplo |
|----------|---------|---------|
| Índice DB | `idx_` | `idx_projects_code` |
| Foreign Key | `fk_` | `fk_projects_to_users` |
| Check Constraint | `chk_` | `chk_projects_status` |
| Unique Constraint | `uq_` | `uq_users_email` |
| View | `v_` o `vw_` | `v_active_projects` |
| Trigger | `trg_` | `trg_projects_before_update` |
| Sequence | `seq_` | `seq_contracts_number` |
| Boolean | `is_`, `has_`, `can_` | `isActive`, `hasAccess` |
| Hook | `use` | `useProjects` |

---

## 7. VALIDACIÓN

### Checklist de Auto-Validación

**Antes de crear cualquier archivo/objeto, verificar:**

- [ ] ¿Usé la convención correcta para la capa (DB/Backend/Frontend)?
- [ ] ¿El nombre es claro y no ambiguo?
- [ ] ¿Sigue el patrón establecido para su tipo?
- [ ] ¿Es consistente con otros elementos similares?
- [ ] ¿Usé el sufijo/prefijo correcto?
- [ ] ¿El caso (camel/Pascal/snake/kebab) es correcto?
- [ ] ¿El nombre del archivo coincide con el contenido?
- [ ] ¿Consulté este documento antes de decidir?

### Herramientas de Validación

```bash
# Buscar violaciones de nomenclatura en Database
psql $DATABASE_URL -c "
SELECT table_name
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
  AND table_name != lower(table_name);
"
# Resultado esperado: vacío (todas lowercase)

# Buscar violaciones en Backend (archivos)
find apps/backend/src -name "*.ts" | grep -vE '^[a-z-]+\.(entity|service|controller|dto|interface|enum|config|middleware|util|spec|test)\.ts$'

# Buscar violaciones en Frontend (componentes)
find apps/frontend/web/src -name "*.tsx" | grep -vE '^[A-Z][a-zA-Z]*\.tsx$'
```

---

## APLICACIÓN OBLIGATORIA

```markdown
⚠️ TODOS los agentes y subagentes DEBEN:

1. ✅ CONSULTAR este documento ANTES de crear cualquier archivo/objeto
2. ✅ VALIDAR nombres contra este estándar ANTES de reportar
3. ✅ RECHAZAR trabajo si nombres no cumplen estándar
4. ✅ CORREGIR nombres si se detectan violaciones

❌ PROHIBIDO:
- Asumir convenciones sin consultar
- Mezclar convenciones de diferentes lenguajes
- Usar abreviaturas no estándar
- Ignorar este documento "para ir más rápido"
```

---

## 8. NOMENCLATURA DE TAREAS DE AGENTES

### 8.1. IDs de Tareas Principales

**Convención:** `{AGENTE}-{NNN}`

```yaml
Reglas:
  - AGENTE en mayúsculas: DB, BE, FE
  - Número secuencial de 3 dígitos (001, 042, 125)
  - Guión separador
```

```markdown
✅ CORRECTO
DB-001           -- Primera tarea de Database-Agent
DB-042           -- Tarea 42 de Database-Agent
BE-015           -- Tarea 15 de Backend-Agent
FE-008           -- Tarea 8 de Frontend-Agent

❌ INCORRECTO
db-001           -- Minúsculas
DB-1             -- Sin ceros leading
DATABASE-001     -- Nombre completo
DB001            -- Sin guión
DB_001           -- Underscore
```

### 8.2. IDs de Subtareas de Subagentes

**Convención:** `{TAREA-PRINCIPAL}-SUB-{NN}`

```markdown
✅ CORRECTO
DB-042-SUB-01    -- Primera subtarea de DB-042
DB-042-SUB-02    -- Segunda subtarea de DB-042
BE-015-SUB-01    -- Primera subtarea de BE-015
FE-008-SUB-03    -- Tercera subtarea de FE-008

❌ INCORRECTO
DB-042-01        -- Sin identificador SUB
DB-042-SUBAGENT-01 -- Nombre demasiado largo
DB-042-sub-01    -- Minúsculas en SUB
DB-042-S01       -- Abreviación no estándar
```

### 8.3. Tipos de Tareas

**Convención según tipo:**

```yaml
Historia de Usuario:
  Formato: US-{NNN}-{nombre-corto}
  Ejemplo: US-001-gestion-proyectos
  Uso: Para implementar features completas descritas en historias de usuario

Feature Nueva:
  Formato: FEAT-{NNN}-{nombre-corto}
  Ejemplo: FEAT-042-dashboard-proyectos
  Uso: Para agregar nueva funcionalidad no planeada originalmente

Bugfix:
  Formato: FIX-{NNN}-{nombre-corto}
  Ejemplo: FIX-015-validacion-presupuesto
  Uso: Para corregir errores o bugs

Tarea Extra:
  Formato: TASK-{NNN}-{nombre-corto}
  Ejemplo: TASK-008-migracion-datos
  Uso: Para tareas técnicas que no son features ni bugs

Refactor:
  Formato: REFACTOR-{NNN}-{nombre-corto}
  Ejemplo: REFACTOR-023-services-layer
  Uso: Para mejoras de código sin cambio funcional

Hotfix:
  Formato: HOTFIX-{NNN}-{nombre-corto}
  Ejemplo: HOTFIX-001-error-critico-prod
  Uso: Para correcciones urgentes en producción

Spike/Research:
  Formato: SPIKE-{NNN}-{nombre-corto}
  Ejemplo: SPIKE-005-analisis-performance
  Uso: Para investigación o análisis técnico

Documentación:
  Formato: DOCS-{NNN}-{nombre-corto}
  Ejemplo: DOCS-012-api-endpoints
  Uso: Para tareas exclusivamente de documentación

Testing:
  Formato: TEST-{NNN}-{nombre-corto}
  Ejemplo: TEST-007-e2e-proyectos
  Uso: Para implementar o mejorar tests
```

### 8.4. Carpetas de Tareas en Orchestration

**Estructura obligatoria:**

```
orchestration/agentes/
├── database/
│   ├── DB-001-inicializar-schemas/
│   ├── DB-042-modulo-proyectos/
│   └── US-001-gestion-proyectos/
├── backend/
│   ├── BE-015-api-proyectos/
│   ├── FIX-003-validacion-dto/
│   └── FEAT-042-dashboard/
└── frontend/
    ├── FE-008-pagina-proyectos/
    ├── REFACTOR-010-components/
    └── TEST-005-unit-tests/
```

**Convención de nombres de carpetas:**

```yaml
Formato: {TIPO-ID}-{nombre-descriptivo-kebab-case}

Reglas:
  - Usar tipo apropiado (US, FEAT, FIX, TASK, etc.)
  - Número secuencial con ceros
  - Nombre descriptivo en kebab-case
  - Sin espacios, sin underscores
```

```markdown
✅ CORRECTO
US-001-gestion-proyectos
FEAT-042-dashboard-proyectos
FIX-015-validacion-presupuesto
TASK-008-migracion-datos
REFACTOR-023-services-layer

❌ INCORRECTO
us-001-gestion-proyectos      -- Minúsculas en tipo
US-1-gestion-proyectos        -- Sin ceros
US_001_gestion_proyectos      -- Underscores
US-001-GestionProyectos       -- PascalCase
US-001 Gestion Proyectos      -- Espacios
```

### 8.5. Archivos de Tarea

**Estructura estándar dentro de cada carpeta de tarea:**

```
{TAREA-ID}/
├── 01-ANALISIS.md
├── 02-PLAN.md
├── 03-EJECUCION.md
├── 04-VALIDACION.md
├── 05-DOCUMENTACION.md
├── 03-SUBAGENTES/                    (si usa subagentes)
│   ├── CONTEXTO-SUB-001.md
│   ├── REPORTE-SUB-001.md
│   ├── CONTEXTO-SUB-002.md
│   └── REPORTE-SUB-002.md
└── CONSULTA-PO-001.md                (si requiere consulta a PO)
```

**Nomenclatura de archivos en tareas:**

```yaml
Fases principales:
  - 01-ANALISIS.md
  - 02-PLAN.md
  - 03-EJECUCION.md
  - 04-VALIDACION.md
  - 05-DOCUMENTACION.md

Subcarpeta de subagentes:
  - 03-SUBAGENTES/

Archivos de subagentes:
  - CONTEXTO-SUB-{NN}.md
  - REPORTE-SUB-{NN}.md

Consultas al PO:
  - CONSULTA-PO-{NN}.md

Log de consultas:
  - LOG-CONSULTAS-PO.md
```

### 8.6. Prefijos por Agente

```yaml
Database-Agent:
  Prefijo: DB-
  Ejemplos: DB-001, DB-042, DB-125

Backend-Agent:
  Prefijo: BE-
  Ejemplos: BE-001, BE-015, BE-089

Frontend-Agent:
  Prefijo: FE-
  Ejemplos: FE-001, FE-008, FE-052
```

### 8.7. Mapeo de Tareas

**Referencia cruzada obligatoria:**

```yaml
En documentos de tarea, incluir:
  - Relacionado con: [REQ-XXX] (si existe requerimiento)
  - Relacionado con: [US-XXX] (si es parte de US)
  - Depende de: [DB-XXX] (si hay dependencia)
  - Bloquea: [BE-XXX] (si bloquea otra tarea)

Ejemplos:
  Relacionado con: [REQ-001-Gestión-Proyectos]
  Depende de: [DB-042]
  Bloquea: [BE-015], [FE-008]
```

### 8.8. Prioridades

**Convención para indicar prioridad:**

```yaml
Formato: P0, P1, P2, P3

P0: Crítico / Bloqueante
  - Ejemplos: DB-042-P0-schema-auth, FIX-001-P0-error-critico

P1: Alta / Importante
  - Ejemplos: FEAT-015-P1-dashboard

P2: Media / Normal
  - Ejemplos: TASK-008-P2-refactor-utils

P3: Baja / Nice to have
  - Ejemplos: DOCS-005-P3-update-readme
```

---

## REFERENCIAS

- [PROMPT-AGENTES-PRINCIPALES.md](../prompts/PROMPT-AGENTES-PRINCIPALES.md) - Prompt de agentes
- [DIRECTIVA-VALIDACION-SUBAGENTES.md](./DIRECTIVA-VALIDACION-SUBAGENTES.md) - Proceso de validación
- [TEMPLATE-CONTEXTO-SUBAGENTE.md](../templates/TEMPLATE-CONTEXTO-SUBAGENTE.md) - Template de contexto
- [PROTOCOLO-ESCALAMIENTO-PO.md](./PROTOCOLO-ESCALAMIENTO-PO.md) - Protocolo de escalamiento a Product Owner
- [GUIA-NOMENCLATURA-COMPLETA.md](./GUIA-NOMENCLATURA-COMPLETA.md) - Guía completa de nomenclatura

---

**Versión:** 1.1.0
**Última actualización:** 2025-11-20
**Uso:** Referencia obligatoria para todos los agentes y subagentes
