# ET-AUTH-001: RBAC (Role-Based Access Control) para Construcción

## 📋 Metadata

| Campo | Valor |
|-------|-------|
| **ID** | ET-AUTH-001 |
| **Épica** | MAI-001 - Fundamentos |
| **Módulo** | Autenticación y Autorización |
| **Tipo** | Especificación Técnica |
| **Estado** | 🚧 Planificado |
| **Versión** | 1.0 |
| **Fecha creación** | 2025-11-17 |
| **Última actualización** | 2025-11-17 |
| **Esfuerzo estimado** | 20h (vs 25h GAMILIT - 20% ahorro por reutilización de infraestructura) |

## 🔗 Referencias

### Requerimiento Funcional
📄 [RF-AUTH-001: Sistema de Roles de Construcción](../requerimientos/RF-AUTH-001-roles-construccion.md)

### Origen (GAMILIT)
♻️ **Reutilización:** 80%
- **Documento base:** `/workspace-gamilit/gamilit/projects/gamilit/docs/01-fase-alcance-inicial/EAI-001-fundamentos/especificaciones/ET-AUTH-001-rbac.md`
- **Componentes reutilizables:**
  - Arquitectura general de guards y decorators
  - RLS infrastructure
  - Frontend role-based components
  - Testing patterns
- **Adaptaciones:**
  - 3 roles → 7 roles de construcción
  - Agregar contexto multi-tenancy (constructora_id)
  - Permisos específicos de construcción
  - RLS policies adaptadas al dominio

### Implementación DDL

🗄️ **ENUM Principal:**
```sql
-- apps/database/ddl/00-prerequisites.sql
DO $$ BEGIN
    CREATE TYPE auth_management.construction_role AS ENUM (
        'director',     -- Director general/proyectos - Acceso total
        'engineer',     -- Ingeniero/Planeación - Presupuestos, programación
        'resident',     -- Residente de obra - Supervisión en campo
        'purchases',    -- Compras/Almacén - Órdenes de compra
        'finance',      -- Administración/Finanzas - Presupuestos, flujo
        'hr',           -- Recursos Humanos - Asistencias, nómina
        'post_sales'    -- Postventa/Garantías - Atención a clientes
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

COMMENT ON TYPE auth_management.construction_role IS
  'Roles de usuario en el sistema de gestión de obra: director, engineer, resident, purchases, finance, hr, post_sales';
```

🗄️ **Tablas que usan el ENUM:**
- `auth_management.user_constructoras.role` - Rol del usuario en cada constructora
- `projects.project_team_assignments.role` - Rol del usuario en cada proyecto específico

🗄️ **Funciones de Contexto:**
```sql
-- Obtener rol del usuario en constructora actual
CREATE OR REPLACE FUNCTION auth_management.get_current_user_role()
RETURNS auth_management.construction_role
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
    SELECT role
    FROM auth_management.user_constructoras
    WHERE user_id = auth_management.get_current_user_id()
      AND constructora_id = auth_management.get_current_constructora_id()
      AND status = 'active'
    LIMIT 1;
$$;

-- Verificar si usuario tiene uno de los roles requeridos
CREATE OR REPLACE FUNCTION auth_management.user_has_any_role(
  p_roles auth_management.construction_role[]
) RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM auth_management.user_constructoras
        WHERE user_id = auth_management.get_current_user_id()
          AND constructora_id = auth_management.get_current_constructora_id()
          AND role = ANY(p_roles)
          AND status = 'active'
    );
$$;

-- Verificar si usuario es admin (director)
CREATE OR REPLACE FUNCTION auth_management.is_director()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
    SELECT auth_management.get_current_user_role() = 'director';
$$;
```

### Backend

💻 **Archivos de Implementación:**
- **Enum:** `apps/backend/src/modules/auth/enums/construction-role.enum.ts`
- **Guards:** `apps/backend/src/modules/auth/guards/roles.guard.ts`
- **Decorators:** `apps/backend/src/modules/auth/decorators/roles.decorator.ts`
- **Constructora Guard:** `apps/backend/src/modules/auth/guards/constructora.guard.ts`
- **Utilities:** `apps/backend/src/modules/auth/utils/role-level.util.ts`

### Frontend

🎨 **Componentes:**
- **Types:** `apps/frontend/src/types/auth.types.ts`
- **RoleBasedRoute:** `apps/frontend/src/components/auth/RoleBasedRoute.tsx`
- **RoleBadge:** `apps/frontend/src/components/ui/RoleBadge.tsx`
- **usePermissions:** `apps/frontend/src/hooks/usePermissions.ts`
- **PermissionGate:** `apps/frontend/src/components/auth/PermissionGate.tsx`

### Trazabilidad
📊 [TRACEABILITY.yml](../implementacion/TRACEABILITY.yml#L79-L115)

---

## 🏗️ Arquitectura de RBAC Multi-tenancy

### Diseño General

```
┌────────────────────────────────────────────────────────────────────┐
│                          CAPA FRONTEND                             │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────────────┐   │
│  │ RoleBadge    │  │ PermissionGate │  │ RoleBasedRoute      │   │
│  │ (director)   │  │ (can:view:     │  │ (allowedRoles:      │   │
│  │              │  │  budgets)      │  │  [director,engineer])│   │
│  └──────────────┘  └────────────────┘  └─────────────────────┘   │
└────────────────────────┬───────────────────────────────────────────┘
                         │ HTTP + JWT (role + constructoraId claims)
┌────────────────────────▼───────────────────────────────────────────┐
│                          CAPA BACKEND                              │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────────────┐   │
│  │ RolesGuard   │  │ @Roles()       │  │ ConstructoraGuard   │   │
│  │              │  │ decorator      │  │                     │   │
│  └──────────────┘  └────────────────┘  └─────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ SetRlsContextInterceptor                                      │ │
│  │ - set_config('app.current_user_id', userId)                  │ │
│  │ - set_config('app.current_constructora_id', constructoraId)  │ │
│  │ - set_config('app.current_user_role', role)                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────┬───────────────────────────────────────────┘
                         │ SQL Queries con RLS
┌────────────────────────▼───────────────────────────────────────────┐
│                  CAPA DATABASE (PostgreSQL + RLS)                  │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  RLS POLICIES (Row Level Security)                           │ │
│  │  - directors_view_all_projects                               │ │
│  │  - engineers_view_budgets                                    │ │
│  │  - residents_view_own_projects                               │ │
│  │  - hr_view_employees                                         │ │
│  │  + ALWAYS: constructora_id isolation                         │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  ENUM: auth_management.construction_role                     │ │
│  │  VALUES: director | engineer | resident | purchases |        │ │
│  │          finance | hr | post_sales                           │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  CONTEXT FUNCTIONS:                                          │ │
│  │  - get_current_user_role() → construction_role               │ │
│  │  - get_current_constructora_id() → UUID                      │ │
│  │  - user_has_any_role(roles[]) → BOOLEAN                      │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

**Flujo de Request:**
1. Frontend envía request con JWT que incluye `{ role: 'engineer', constructoraId: 'abc-123' }`
2. JwtAuthGuard extrae y valida JWT, inyecta `user` en request
3. ConstructoraGuard valida que usuario tenga acceso activo a esa constructora
4. SetRlsContextInterceptor configura variables de sesión de PostgreSQL
5. RolesGuard valida que usuario tenga rol requerido en endpoint
6. Controller ejecuta lógica de negocio
7. TypeORM/Prisma ejecuta queries
8. PostgreSQL aplica RLS automáticamente usando contexto configurado
9. Solo retorna datos de la constructora actual con permisos del rol

---

## 📐 Matriz de Permisos Completa

### Tabla Detallada de Permisos por Módulo

| Recurso | Acción | director | engineer | resident | purchases | finance | hr | post_sales |
|---------|--------|----------|----------|----------|-----------|---------|----|-----------
|
| **Perfil Propio** |
| Ver perfil | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editar perfil | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cambiar rol | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Proyectos/Obras** |
| Ver todos los proyectos | ✅ | ✅ | ❌ (solo asignados) | ❌ | ✅ | ❌ | ❌ |
| Crear proyecto | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Editar proyecto | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Archivar proyecto | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver márgenes de utilidad | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Presupuestos** |
| Ver presupuestos | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Crear presupuesto | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Editar presupuesto | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Aprobar presupuesto | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver costos reales | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Avances de Obra** |
| Capturar avance físico | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar avance | ✅ | ✅ | ✅ (solo hoy) | ❌ | ❌ | ❌ | ❌ |
| Ver historial avances | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Aprobar avance | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Compras** |
| Ver órdenes de compra | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Crear orden de compra | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Aprobar orden compra | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Ver inventario | ✅ | ✅ | ✅ (vista) | ✅ | ❌ | ❌ | ❌ |
| Gestionar inventario | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Finanzas** |
| Ver flujo de efectivo | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Ver cuentas por pagar | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Aprobar pagos | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Generar reportes fin. | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Recursos Humanos** |
| Ver empleados | ✅ | ✅ (asignados) | ✅ (asignados) | ❌ | ❌ | ✅ | ❌ |
| Crear empleado | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Registrar asistencia | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Ver nómina | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Exportar IMSS/INFONAVIT | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Postventa/Garantías** |
| Ver incidencias | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Crear incidencia | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Asignar incidencia | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Cerrar incidencia | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Sistema** |
| Ver usuarios constructora | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Invitar usuarios | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Suspender usuarios | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver audit logs | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Config. constructora | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Leyenda:**
- ✅ Acceso completo
- ✅ (condición) Acceso con restricción
- ❌ Sin acceso

---

## 🔧 Implementación Técnica Completa

### 1. Backend - Enum TypeScript

**Ubicación:** `apps/backend/src/modules/auth/enums/construction-role.enum.ts`

```typescript
/**
 * Roles de usuario en el Sistema de Gestión de Obra
 *
 * IMPORTANTE: Debe estar sincronizado con:
 * - Database ENUM: auth_management.construction_role
 * - DDL: apps/database/ddl/00-prerequisites.sql
 * - Frontend: apps/frontend/src/types/auth.types.ts
 */
export enum ConstructionRole {
  /** Director general/proyectos - Acceso total, visión estratégica */
  DIRECTOR = 'director',

  /** Ingeniero/Planeación - Presupuestos, programación, control de obra */
  ENGINEER = 'engineer',

  /** Residente de obra - Supervisión en campo, captura de avances */
  RESIDENT = 'resident',

  /** Compras/Almacén - Órdenes de compra, gestión de inventario */
  PURCHASES = 'purchases',

  /** Administración/Finanzas - Presupuestos, flujo de efectivo, pagos */
  FINANCE = 'finance',

  /** Recursos Humanos - Asistencias, nómina, IMSS/INFONAVIT */
  HR = 'hr',

  /** Postventa/Garantías - Atención a clientes, seguimiento post-entrega */
  POST_SALES = 'post_sales',
}

/**
 * Nivel jerárquico de cada rol (para comparaciones)
 *
 * Nivel más alto = más permisos
 */
export const RoleLevel: Record<ConstructionRole, number> = {
  [ConstructionRole.DIRECTOR]: 7,      // Máximo nivel
  [ConstructionRole.ENGINEER]: 6,
  [ConstructionRole.FINANCE]: 5,
  [ConstructionRole.HR]: 4,
  [ConstructionRole.PURCHASES]: 3,
  [ConstructionRole.POST_SALES]: 2,
  [ConstructionRole.RESIDENT]: 1,      // Mínimo nivel
};

/**
 * Descripción legible de cada rol
 */
export const RoleDisplayName: Record<ConstructionRole, string> = {
  [ConstructionRole.DIRECTOR]: 'Director',
  [ConstructionRole.ENGINEER]: 'Ingeniero',
  [ConstructionRole.RESIDENT]: 'Residente de Obra',
  [ConstructionRole.PURCHASES]: 'Compras',
  [ConstructionRole.FINANCE]: 'Finanzas',
  [ConstructionRole.HR]: 'Recursos Humanos',
  [ConstructionRole.POST_SALES]: 'Postventa',
};

/**
 * Verifica si un rol tiene al menos el nivel requerido
 */
export function hasMinimumRole(
  userRole: ConstructionRole,
  requiredRole: ConstructionRole
): boolean {
  return RoleLevel[userRole] >= RoleLevel[requiredRole];
}

/**
 * Verifica si usuario tiene uno de los roles permitidos
 */
export function hasAnyRole(
  userRole: ConstructionRole,
  allowedRoles: ConstructionRole[]
): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Roles con acceso a presupuestos
 */
export const BUDGET_ACCESS_ROLES: ConstructionRole[] = [
  ConstructionRole.DIRECTOR,
  ConstructionRole.ENGINEER,
  ConstructionRole.FINANCE,
];

/**
 * Roles con acceso a órdenes de compra
 */
export const PURCHASE_ORDER_ROLES: ConstructionRole[] = [
  ConstructionRole.DIRECTOR,
  ConstructionRole.ENGINEER,
  ConstructionRole.PURCHASES,
  ConstructionRole.FINANCE,
];

/**
 * Roles que pueden capturar avances de obra
 */
export const PROGRESS_CAPTURE_ROLES: ConstructionRole[] = [
  ConstructionRole.DIRECTOR,
  ConstructionRole.ENGINEER,
  ConstructionRole.RESIDENT,
];

/**
 * Roles con acceso a RRHH
 */
export const HR_ACCESS_ROLES: ConstructionRole[] = [
  ConstructionRole.DIRECTOR,
  ConstructionRole.HR,
];
```

---

### 2. Backend - Guards

#### RolesGuard (Validación de Roles)

**Ubicación:** `apps/backend/src/modules/auth/guards/roles.guard.ts`

```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConstructionRole } from '../enums/construction-role.enum';

/**
 * Guard que valida roles de usuario en endpoints
 *
 * Uso:
 * @Roles(ConstructionRole.DIRECTOR, ConstructionRole.ENGINEER)
 * @Get('budgets')
 * getBudgets() { ... }
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener roles permitidos del decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<ConstructionRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtener usuario del request (inyectado por JwtStrategy)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Validar que usuario tenga alguno de los roles permitidos
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException({
        statusCode: 403,
        message: `Acceso denegado. Requiere uno de estos roles: ${requiredRoles.join(', ')}`,
        errorCode: 'INSUFFICIENT_ROLE',
        userRole: user.role,
        requiredRoles,
      });
    }

    return true;
  }
}
```

#### ConstructoraGuard (Validación de Acceso a Constructora)

**Ubicación:** `apps/backend/src/modules/auth/guards/constructora.guard.ts`

```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserConstructora } from '../entities/user-constructora.entity';
import { UserStatus } from '../enums/user-status.enum';

/**
 * Guard que valida que usuario tenga acceso activo a la constructora
 *
 * Valida:
 * 1. Usuario tiene relación con constructora
 * 2. Status es 'active'
 * 3. Constructora está activa
 */
@Injectable()
export class ConstructoraGuard implements CanActivate {
  constructor(
    @InjectRepository(UserConstructora)
    private readonly userConstructoraRepo: Repository<UserConstructora>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (!user.constructoraId) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'No se ha seleccionado una constructora',
        errorCode: 'NO_CONSTRUCTORA_SELECTED',
      });
    }

    // Validar acceso a constructora
    const access = await this.userConstructoraRepo.findOne({
      where: {
        userId: user.id,
        constructoraId: user.constructoraId,
      },
      relations: ['constructora'],
    });

    if (!access) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'No tienes acceso a esta constructora',
        errorCode: 'CONSTRUCTORA_ACCESS_DENIED',
        constructoraId: user.constructoraId,
      });
    }

    // Validar estado del usuario en constructora
    if (access.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException({
        statusCode: 403,
        message: `Tu acceso a esta constructora está ${access.status}`,
        errorCode: 'CONSTRUCTORA_ACCESS_INACTIVE',
        status: access.status,
      });
    }

    // Validar que constructora esté activa
    if (!access.constructora.active) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Esta constructora está inactiva',
        errorCode: 'CONSTRUCTORA_INACTIVE',
      });
    }

    return true;
  }
}
```

---

### 3. Backend - Decorators

#### @Roles Decorator

**Ubicación:** `apps/backend/src/modules/auth/decorators/roles.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';
import { ConstructionRole } from '../enums/construction-role.enum';

/**
 * Decorator para especificar roles permitidos en un endpoint
 *
 * Ejemplos:
 * @Roles(ConstructionRole.DIRECTOR)
 * @Roles(ConstructionRole.DIRECTOR, ConstructionRole.ENGINEER)
 * @Roles(...BUDGET_ACCESS_ROLES)
 */
export const Roles = (...roles: ConstructionRole[]) => SetMetadata('roles', roles);
```

#### @CurrentUser Decorator

**Ubicación:** `apps/backend/src/modules/auth/decorators/current-user.decorator.ts`

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator para obtener usuario actual del request
 *
 * Uso:
 * @Get('profile')
 * getProfile(@CurrentUser() user: UserJwtPayload) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

/**
 * Obtener solo el ID del usuario
 *
 * Uso:
 * @Get('my-data')
 * getMyData(@UserId() userId: string) {
 *   return this.service.findByUserId(userId);
 * }
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id;
  },
);

/**
 * Obtener constructora actual
 */
export const CurrentConstructora = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.constructoraId;
  },
);
```

---

### 4. Backend - Interceptor para RLS Context

**Ubicación:** `apps/backend/src/common/interceptors/set-rls-context.interceptor.ts`

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

/**
 * Interceptor que configura el contexto de RLS en PostgreSQL
 *
 * Configura variables de sesión:
 * - app.current_user_id
 * - app.current_constructora_id
 * - app.current_user_role
 *
 * Estas variables son usadas por RLS policies para filtrar datos
 */
@Injectable()
export class SetRlsContextInterceptor implements NestInterceptor {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario autenticado, continuar sin configurar RLS
    if (!user) {
      return next.handle();
    }

    // Configurar variables de sesión de PostgreSQL
    return from(
      this.dataSource.query(`
        SELECT
          set_config('app.current_user_id', $1, true),
          set_config('app.current_constructora_id', $2, true),
          set_config('app.current_user_role', $3, true)
      `, [
        user.id || '',
        user.constructoraId || '',
        user.role || '',
      ])
    ).pipe(
      switchMap(() => next.handle())
    );
  }
}
```

**Aplicación global:**
```typescript
// apps/backend/src/main.ts
import { SetRlsContextInterceptor } from './common/interceptors/set-rls-context.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplicar interceptor globalmente
  app.useGlobalInterceptors(new SetRlsContextInterceptor(app.get(DataSource)));

  await app.listen(3000);
}
```

---

### 5. Backend - Ejemplo de Controller con Guards

**Ubicación:** `apps/backend/src/modules/budgets/budgets.controller.ts`

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { ConstructoraGuard } from '@modules/auth/guards/constructora.guard';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { CurrentUser, CurrentConstructora } from '@modules/auth/decorators/current-user.decorator';
import { ConstructionRole, BUDGET_ACCESS_ROLES } from '@modules/auth/enums/construction-role.enum';
import { BudgetsService } from './budgets.service';

/**
 * Controller de Presupuestos
 *
 * Guards aplicados:
 * 1. JwtAuthGuard: Validar que usuario esté autenticado
 * 2. ConstructoraGuard: Validar acceso a constructora
 * 3. RolesGuard: Validar rol requerido
 */
@Controller('budgets')
@UseGuards(JwtAuthGuard, ConstructoraGuard, RolesGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  /**
   * Listar presupuestos
   * Acceso: director, engineer, finance
   */
  @Roles(...BUDGET_ACCESS_ROLES)
  @Get()
  async findAll(@CurrentConstructora() constructoraId: string) {
    return this.budgetsService.findAll(constructoraId);
  }

  /**
   * Crear presupuesto
   * Acceso: director, engineer
   */
  @Roles(ConstructionRole.DIRECTOR, ConstructionRole.ENGINEER)
  @Post()
  async create(
    @Body() createDto: CreateBudgetDto,
    @CurrentUser() user: UserJwtPayload,
    @CurrentConstructora() constructoraId: string,
  ) {
    return this.budgetsService.create(createDto, user.id, constructoraId);
  }

  /**
   * Aprobar presupuesto
   * Acceso: SOLO director
   */
  @Roles(ConstructionRole.DIRECTOR)
  @Patch(':id/approve')
  async approve(
    @Param('id') id: string,
    @CurrentUser() user: UserJwtPayload,
  ) {
    return this.budgetsService.approve(id, user.id);
  }

  /**
   * Eliminar presupuesto
   * Acceso: SOLO director
   */
  @Roles(ConstructionRole.DIRECTOR)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.budgetsService.remove(id);
  }
}
```

---

## 🔒 Row Level Security (RLS) Policies

### Patrón Base para RLS con Multi-tenancy

**Todas las policies DEBEN incluir filtrado por constructora_id:**

```sql
-- Patrón base
CREATE POLICY "policy_name" ON [schema].[table]
  FOR [SELECT|INSERT|UPDATE|DELETE]
  TO authenticated
  USING (
    -- 1. Filtro por constructora (OBLIGATORIO)
    constructora_id = auth_management.get_current_constructora_id()

    -- 2. Filtro por rol (según necesidad)
    AND auth_management.user_has_any_role(ARRAY['director', 'engineer'])

    -- 3. Filtros adicionales (según lógica de negocio)
    AND [condiciones específicas]
  );
```

---

### Ejemplo 1: Proyectos - Acceso Basado en Rol

```sql
-- apps/database/ddl/schemas/projects/tables/projects.sql

ALTER TABLE projects.projects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Director y Engineer ven todos los proyectos de su constructora
CREATE POLICY "directors_engineers_view_all_projects"
  ON projects.projects
  FOR SELECT
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.user_has_any_role(ARRAY['director', 'engineer'])
  );

-- Policy 2: Residente solo ve proyectos asignados
CREATE POLICY "residents_view_own_projects"
  ON projects.projects
  FOR SELECT
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.get_current_user_role() = 'resident'
    AND id IN (
      SELECT project_id
      FROM projects.project_team_assignments
      WHERE user_id = auth_management.get_current_user_id()
        AND role = 'resident'
        AND active = TRUE
    )
  );

-- Policy 3: Finance ve todos los proyectos (para reportes)
CREATE POLICY "finance_view_all_projects"
  ON projects.projects
  FOR SELECT
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.get_current_user_role() = 'finance'
  );

-- Policy 4: Solo director y engineer pueden crear proyectos
CREATE POLICY "create_projects"
  ON projects.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.user_has_any_role(ARRAY['director', 'engineer'])
  );

-- Policy 5: Solo director y engineer pueden editar proyectos
CREATE POLICY "update_projects"
  ON projects.projects
  FOR UPDATE
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.user_has_any_role(ARRAY['director', 'engineer'])
  );

-- Policy 6: Solo director puede archivar proyectos
CREATE POLICY "archive_projects"
  ON projects.projects
  FOR DELETE
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.get_current_user_role() = 'director'
  );
```

---

### Ejemplo 2: Presupuestos - Ocultar Márgenes según Rol

```sql
-- apps/database/ddl/schemas/budgets/tables/budgets.sql

ALTER TABLE budgets.budgets ENABLE ROW LEVEL SECURITY;

-- Policy 1: Director y Finance ven presupuestos completos (incluye márgenes)
CREATE POLICY "directors_finance_view_full_budgets"
  ON budgets.budgets
  FOR SELECT
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.user_has_any_role(ARRAY['director', 'finance'])
  );

-- Policy 2: Engineer ve presupuestos (pero márgenes se ocultan en aplicación)
CREATE POLICY "engineers_view_budgets"
  ON budgets.budgets
  FOR SELECT
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.get_current_user_role() = 'engineer'
  );

-- Policy 3: Solo director y engineer pueden crear presupuestos
CREATE POLICY "create_budgets"
  ON budgets.budgets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.user_has_any_role(ARRAY['director', 'engineer'])
  );

-- Policy 4: Solo director puede aprobar presupuestos
CREATE POLICY "approve_budgets"
  ON budgets.budgets
  FOR UPDATE
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.get_current_user_role() = 'director'
    AND status = 'pending' -- Solo aprobar pendientes
  )
  WITH CHECK (
    status = 'approved' -- Solo cambiar a aprobado
  );
```

**Nota:** Para ocultar columnas específicas según rol (ej: `margin_percentage`), se usa en el service:

```typescript
// apps/backend/src/modules/budgets/budgets.service.ts
async findAll(constructoraId: string, userRole: ConstructionRole) {
  const query = this.budgetRepo
    .createQueryBuilder('budget')
    .where('budget.constructoraId = :constructoraId', { constructoraId });

  // Ocultar márgenes si no es director o finance
  if (![ConstructionRole.DIRECTOR, ConstructionRole.FINANCE].includes(userRole)) {
    query.select([
      'budget.id',
      'budget.projectId',
      'budget.totalCost',
      'budget.status',
      // NO incluir: budget.marginPercentage, budget.profitAmount
    ]);
  }

  return query.getMany();
}
```

---

### Ejemplo 3: Empleados (RRHH) - Acceso Selectivo

```sql
-- apps/database/ddl/schemas/hr/tables/employees.sql

ALTER TABLE hr.employees ENABLE ROW LEVEL SECURITY;

-- Policy 1: Director y HR ven todos los empleados
CREATE POLICY "directors_hr_view_all_employees"
  ON hr.employees
  FOR SELECT
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.user_has_any_role(ARRAY['director', 'hr'])
  );

-- Policy 2: Engineer y Resident ven empleados asignados a sus proyectos
CREATE POLICY "engineers_residents_view_assigned_employees"
  ON hr.employees
  FOR SELECT
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.user_has_any_role(ARRAY['engineer', 'resident'])
    AND id IN (
      SELECT employee_id
      FROM hr.project_employee_assignments pea
      INNER JOIN projects.project_team_assignments pta
        ON pta.project_id = pea.project_id
      WHERE pta.user_id = auth_management.get_current_user_id()
        AND pea.active = TRUE
    )
  );

-- Policy 3: Solo HR puede crear empleados
CREATE POLICY "hr_create_employees"
  ON hr.employees
  FOR INSERT
  TO authenticated
  WITH CHECK (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.user_has_any_role(ARRAY['director', 'hr'])
  );
```

---

## 📊 Performance y Escalabilidad

### 1. Índices Requeridos

```sql
-- Índices en columna role para filtrado rápido
CREATE INDEX idx_user_constructoras_role
  ON auth_management.user_constructoras(user_id, constructora_id, role)
  WHERE status = 'active';

-- Índice compuesto para RLS policies
CREATE INDEX idx_project_team_assignments_composite
  ON projects.project_team_assignments(user_id, project_id, role, active);

-- Índice para asignaciones de empleados
CREATE INDEX idx_project_employee_assignments_composite
  ON hr.project_employee_assignments(project_id, employee_id, active);
```

### 2. Caching de Funciones

```sql
-- Funciones STABLE se cachean durante la transacción
CREATE OR REPLACE FUNCTION auth_management.get_current_user_role()
RETURNS auth_management.construction_role
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
    SELECT role
    FROM auth_management.user_constructoras
    WHERE user_id = auth_management.get_current_user_id()
      AND constructora_id = auth_management.get_current_constructora_id()
      AND status = 'active'
    LIMIT 1;
$$;
```

### 3. Monitoreo de Queries Lentos

```sql
-- Query para detectar policies que causan slow queries
SELECT
  schemaname,
  tablename,
  policyname,
  qual
FROM pg_policies
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY tablename;

-- Habilitar logging de queries lentos
-- postgresql.conf:
-- log_min_duration_statement = 1000 (1 segundo)
```

---

## 🧪 Testing

### Unit Tests - RolesGuard

```typescript
// apps/backend/src/modules/auth/guards/roles.guard.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ConstructionRole } from '../enums/construction-role.enum';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  const createMockContext = (user: any, requiredRoles: ConstructionRole[]): ExecutionContext => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  it('should allow access if user has required role', () => {
    const user = { id: '123', role: ConstructionRole.DIRECTOR };
    const requiredRoles = [ConstructionRole.DIRECTOR, ConstructionRole.ENGINEER];

    const context = createMockContext(user, requiredRoles);
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access if user lacks required role', () => {
    const user = { id: '123', role: ConstructionRole.RESIDENT };
    const requiredRoles = [ConstructionRole.DIRECTOR];

    const context = createMockContext(user, requiredRoles);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should allow access if no roles required', () => {
    const user = { id: '123', role: ConstructionRole.RESIDENT };
    const requiredRoles = [];

    const context = createMockContext(user, requiredRoles);
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should throw if user is not authenticated', () => {
    const user = null;
    const requiredRoles = [ConstructionRole.DIRECTOR];

    const context = createMockContext(user, requiredRoles);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
```

### E2E Tests - RBAC Integration

```typescript
// apps/backend/test/rbac/rbac.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { ConstructionRole } from '@modules/auth/enums/construction-role.enum';

describe('RBAC E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Budgets Endpoints', () => {
    it('director should access budgets', async () => {
      const director = await createUser({ role: ConstructionRole.DIRECTOR });
      const token = await getAuthToken(director);

      const response = await request(app.getHttpServer())
        .get('/budgets')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toBeDefined();
    });

    it('engineer should access budgets', async () => {
      const engineer = await createUser({ role: ConstructionRole.ENGINEER });
      const token = await getAuthToken(engineer);

      const response = await request(app.getHttpServer())
        .get('/budgets')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toBeDefined();
    });

    it('resident should NOT access budgets', async () => {
      const resident = await createUser({ role: ConstructionRole.RESIDENT });
      const token = await getAuthToken(resident);

      const response = await request(app.getHttpServer())
        .get('/budgets')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.FORBIDDEN);

      expect(response.body.errorCode).toBe('INSUFFICIENT_ROLE');
    });

    it('only director can approve budgets', async () => {
      const engineer = await createUser({ role: ConstructionRole.ENGINEER });
      const budget = await createBudget({ status: 'pending' });
      const token = await getAuthToken(engineer);

      const response = await request(app.getHttpServer())
        .patch(`/budgets/${budget.id}/approve`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.FORBIDDEN);

      expect(response.body.errorCode).toBe('INSUFFICIENT_ROLE');
    });
  });

  describe('RLS Data Isolation by Constructora', () => {
    it('user should only see data from their constructora', async () => {
      // Setup: 2 constructoras con 1 proyecto cada una
      const constructoraA = await createConstructora({ nombre: 'Constructora A' });
      const constructoraB = await createConstructora({ nombre: 'Constructora B' });

      const projectA = await createProject({ constructoraId: constructoraA.id, nombre: 'Proyecto A' });
      const projectB = await createProject({ constructoraId: constructoraB.id, nombre: 'Proyecto B' });

      // Usuario con acceso SOLO a constructora A
      const user = await createUser({ role: ConstructionRole.ENGINEER });
      await assignToConstructora(user.id, constructoraA.id);
      const token = await getAuthToken(user, constructoraA.id);

      // Act: Solicitar todos los proyectos
      const response = await request(app.getHttpServer())
        .get('/projects')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      // Assert: Solo debe ver proyecto de constructora A
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe(projectA.id);
      expect(response.body.data[0].nombre).toBe('Proyecto A');

      // Proyecto B NO debe aparecer (RLS lo bloqueó)
      const projectBInResponse = response.body.data.find(p => p.id === projectB.id);
      expect(projectBInResponse).toBeUndefined();
    });
  });

  describe('Role-based Field Visibility', () => {
    it('director should see budget margins', async () => {
      const director = await createUser({ role: ConstructionRole.DIRECTOR });
      const budget = await createBudget({ marginPercentage: 15.5 });
      const token = await getAuthToken(director);

      const response = await request(app.getHttpServer())
        .get(`/budgets/${budget.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.marginPercentage).toBe(15.5);
      expect(response.body.profitAmount).toBeDefined();
    });

    it('engineer should NOT see budget margins', async () => {
      const engineer = await createUser({ role: ConstructionRole.ENGINEER });
      const budget = await createBudget({ marginPercentage: 15.5 });
      const token = await getAuthToken(engineer);

      const response = await request(app.getHttpServer())
        .get(`/budgets/${budget.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      // Márgenes ocultos
      expect(response.body.marginPercentage).toBeUndefined();
      expect(response.body.profitAmount).toBeUndefined();

      // Pero ve otros campos
      expect(response.body.totalCost).toBeDefined();
      expect(response.body.status).toBeDefined();
    });
  });
});
```

---

## 📚 Referencias Adicionales

### Documentos Relacionados
- 📄 [RF-AUTH-001: Sistema de Roles de Construcción](../requerimientos/RF-AUTH-001-roles-construccion.md)
- 📄 [RF-AUTH-002: Estados de Cuenta](../requerimientos/RF-AUTH-002-estados-cuenta.md)
- 📄 [RF-AUTH-003: Multi-tenancy](../requerimientos/RF-AUTH-003-multi-tenancy.md)
- 📄 [ET-AUTH-003: Multi-tenancy Implementation](./ET-AUTH-003-multi-tenancy.md) *(Pendiente)*

### Estándares y Best Practices
- [NIST RBAC](https://csrc.nist.gov/projects/role-based-access-control) - Estándar de RBAC
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [OWASP Access Control](https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control)

### Recursos Técnicos
- [NestJS Guards](https://docs.nestjs.com/guards)
- [NestJS Custom Decorators](https://docs.nestjs.com/custom-decorators)
- [TypeORM Indexes](https://typeorm.io/indices)

---

## 📅 Historial de Cambios

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2025-11-17 | Tech Team | Creación inicial adaptada de GAMILIT con 7 roles de construcción y multi-tenancy |

---

**Documento:** `MAI-001-fundamentos/especificaciones/ET-AUTH-001-rbac.md`
**Ruta absoluta:** `/home/isem/workspace/worskpace-inmobiliaria/docs/01-fase-alcance-inicial/MAI-001-fundamentos/especificaciones/ET-AUTH-001-rbac.md`
**Generado:** 2025-11-17
**Mantenedores:** @tech-lead @backend-team @frontend-team @database-team
