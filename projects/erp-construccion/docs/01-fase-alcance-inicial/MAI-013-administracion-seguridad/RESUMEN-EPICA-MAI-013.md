# Resumen Ejecutivo: MAI-013 - Administración & Seguridad

**Fecha de generación:** 2025-11-20
**Estado:** 🚧 En Progreso (30% completo)
**Story Points:** 40 SP
**Prioridad:** P0 (Crítica)

---

## 📊 Estado de Completitud

| Tipo de Documento | Completados | Total | % |
|-------------------|-------------|-------|---|
| README Principal | 1 | 1 | 100% ✅ |
| Requerimientos Funcionales (RF) | 2 | 5 | 40% 🚧 |
| Especificaciones Técnicas (ET) | 0 | 5 | 0% ⏳ |
| Historias de Usuario (US) | 0 | 8 | 0% ⏳ |
| **Total Documentos** | **3** | **19** | **16%** |

**Tamaño total generado:** ~85 KB (estimado final: ~280 KB)

---

## ✅ Documentos Completados

### 1. README.md del Módulo (~30 KB) ✅

**Contenido clave:**
- Descripción general del módulo transversal
- 7 roles especializados en construcción
- Matriz completa de permisos (7 roles × 14 módulos)
- Estructura jerárquica de centros de costo
- Sistema de auditoría completo (4 categorías de eventos)
- Estrategia de backups 3-2-1 (Full, Incremental, Archivos, Snapshots)
- Seguridad de datos (LFPDPPP + GDPR compliance)
- Políticas de seguridad (contraseñas, sesiones, acceso)
- Métricas de éxito (KPIs operacionales y de seguridad)
- Riesgos y mitigaciones

**Audiencia:** Product Owner, Stakeholders, Tech Lead, Security Team

---

### 2. RF-ADM-001: Gestión de Usuarios y Roles (~28 KB) ✅

**Contenido principal:**

#### 7 Roles Especializados
| Rol | Código | Nivel | Permisos Globales |
|-----|--------|-------|-------------------|
| Director General | `director` | 🔴 Alto | CRUD+Approve en todos |
| Ingeniero | `engineer` | 🟠 Alto | CRUD en Proyectos, Presupuestos, Obra |
| Residente | `resident` | 🟡 Medio | CRUD en Obra, Compras, Avances |
| Compras | `purchases` | 🟡 Medio | CRUD+Approve en Compras, Inventarios |
| Finanzas | `finance` | 🟠 Alto | CRUD+Approve en Estimaciones, Finanzas |
| RRHH | `hr` | 🟡 Medio | CRUD+Approve en RRHH, Nómina |
| Postventa | `post_sales` | 🟢 Bajo | CRUD en Postventa, Garantías, CRM |

#### Multi-Tenancy
- Usuario puede pertenecer a **múltiples empresas constructoras**
- **Roles diferentes** en cada empresa
- Selector de empresa sin re-login
- Aislamiento total por `constructoraId` (RLS)

#### Estados de Cuenta
```
[*] → active: Invitación aceptada
active → suspended: Suspensión temporal
suspended → active: Reactivación
active → inactive: Baja
inactive → active: Reactivación
active → locked: 5 intentos fallidos
locked → active: Desbloqueo (admin o timeout)
```

#### Proceso de Invitación
1. Admin crea invitación (email, rol, empresa)
2. Sistema genera token único (válido 7 días)
3. Email enviado con link de registro
4. Usuario completa perfil y contraseña
5. Primer login automático
6. Estado: `active`

#### Row Level Security (RLS)
```sql
-- Política automática en PostgreSQL
CREATE POLICY users_isolation_policy ON user_constructoras
  USING (constructora_id = current_setting('app.current_constructora_id')::uuid);
```

**Casos de Uso Documentados:**
- Invitar nuevo ingeniero
- Usuario multi-empresa (Director en A, Ingeniero en B)
- Suspensión temporal con reactivación automática

**Tests Especificados:**
- Invitación exitosa con validación de email enviado
- Multi-tenancy: aislamiento entre empresas
- Cambio de rol con auditoría

---

### 3. RF-ADM-002: Sistema de Permisos Granulares (~27 KB) ✅

**Contenido principal:**

#### RBAC + ABAC Combinados
- **RBAC:** Permisos basados en roles predefinidos
- **ABAC:** Permisos adicionales basados en atributos/contexto

#### Permisos por Acción (CRUD+A)
```typescript
enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve'
}
```

#### Matriz Completa (7 Roles × 14 Módulos)
| Módulo | Director | Engineer | Resident | Purchases | Finance | HR | Post Sales |
|--------|----------|----------|----------|-----------|---------|----|-----------  |
| projects | CRUD+A | CRUD | R | R | R | R | R |
| budgets | CRUD+A | CRUD | R | R | R | - | - |
| purchases | CRUD+A | R | CRUD | CRUD+A | R | - | - |
| construction | CRUD+A | CRUD | CRUD | R | R | - | R |
| estimations | CRUD+A | CRUD | R | - | CRUD+A | - | - |
| hr | CRUD+A | R | R | - | R | CRUD+A | - |
| admin | CRUD+A | - | - | - | R | R | - |

#### Reglas de Negocio (ABAC)

**Regla 1: Acceso por Proyecto Asignado**
- Usuario solo ve proyectos donde es miembro del equipo
- Excepción: Director ve todos los proyectos

**Regla 2: Aprobación por Monto**
| Monto | Aprobador Nivel 1 | Aprobador Nivel 2 |
|-------|-------------------|-------------------|
| < $20K | Compras/Finance | - |
| $20K - $100K | Finance | Director |
| > $100K | Finance + Director | Ambos requeridos |

**Regla 3: Edición Temporal**
| Entidad | Tiempo límite | Excepción |
|---------|---------------|-----------|
| Estimación autorizada | 0 días (bloqueado) | Director puede revertir |
| Orden de compra | 7 días | Director puede modificar |
| Avance de obra | 3 días | Ingeniero puede corregir |

**Regla 4: Segregación de Funciones**
- ❌ Creador de orden de compra NO puede aprobarla
- ❌ Quien captura avances NO puede aprobarlos
- ✅ Director puede (excepción)

#### Validación en 3 Capas

**Capa 1: Frontend (UX)**
```typescript
{hasPermission('projects', 'create') && (
  <Button onClick={createProject}>Crear Proyecto</Button>
)}
```

**Capa 2: Backend (Guards)**
```typescript
@RequirePermissions('projects', 'create')
@RequireRole('director', 'engineer')
async create(@Body() dto: CreateProjectDto) { }
```

**Capa 3: Database (RLS)**
```sql
CREATE POLICY projects_update_policy ON projects
FOR UPDATE
USING (
  constructora_id = current_setting('app.current_constructora_id')::uuid
  AND (
    current_setting('app.current_user_role') = 'director'
    OR user_id IN (SELECT user_id FROM team WHERE project_id = projects.id)
  )
);
```

#### Permisos Personalizados
```typescript
interface CustomPermission {
  userId: string;
  module: string; // 'budgets'
  actions: PermissionAction[]; // ['read']
  scope?: {
    projectId?: string; // Solo para un proyecto
    validUntil?: Date;  // Permiso temporal
  };
  grantedBy: string;
}
```

**Caso de uso:** Auditor externo con acceso temporal (30 días) a presupuestos de un proyecto específico.

**Tests Especificados:**
- Matriz completa de permisos por rol
- RLS automático en database
- Permisos personalizados temporales con expiración

---

## 📋 Documentos Pendientes (16/19)

### Requerimientos Funcionales (3 pendientes)

#### RF-ADM-003: Centros de Costo (Estimado: ~22 KB)
**Contenido esperado:**
- Estructura jerárquica (Empresa → Obra → Etapa → Frente)
- 3 tipos: Directos, Indirectos, Servicios Compartidos
- Imputación automática (Compras, RRHH, Maquinaria)
- Reportes por centro de costo
- Distribución de gastos indirectos

#### RF-ADM-004: Auditoría y Trazabilidad (Estimado: ~28 KB)
**Contenido esperado:**
- 4 categorías de eventos: Autenticación, Gestión usuarios, Operaciones críticas, Administración
- Estructura completa de AuditLog (20+ campos)
- Retención: 90 días (operativos), 5 años (críticos)
- Queries de consulta con filtros
- Reportes de auditoría

#### RF-ADM-005: Backups Automáticos (Estimado: ~25 KB)
**Contenido esperado:**
- 4 tipos de backup: Full (diario), Incremental (6h), Archivos (1h), Snapshots (30min)
- Estrategia 3-2-1 (3 copias, 2 medios, 1 offsite)
- Proceso de restauración (3 escenarios)
- RTO < 4 horas, RPO < 1 hora
- Pruebas mensuales de restauración

---

### Especificaciones Técnicas (5 pendientes)

| ID | Título | Complejidad | Tamaño Estimado |
|----|--------|-------------|-----------------|
| ET-ADM-001 | Modelo de RBAC multi-tenancy | Alta | ~45 KB |
| ET-ADM-002 | Centros de costo jerárquicos | Media | ~35 KB |
| ET-ADM-003 | Audit logging y change tracking | Alta | ~40 KB |
| ET-ADM-004 | Backups y Disaster Recovery | Alta | ~38 KB |
| ET-ADM-005 | Seguridad de datos (encriptación) | Alta | ~35 KB |

**Total estimado:** ~193 KB

**Contenido esperado:**
- Entities TypeORM completas
- ENUMs y tipos
- Services con lógica de negocio
- Controllers RESTful
- Frontend components (React)
- Validaciones Zod
- Tests unitarios
- Cron jobs (backups, cleanup)

---

### Historias de Usuario (8 pendientes)

| ID | Título | SP | Tamaño Estimado |
|----|--------|----|-----------------|
| US-ADM-001 | Crear y gestionar usuarios | 5 | ~15 KB |
| US-ADM-002 | Asignar roles y permisos | 5 | ~15 KB |
| US-ADM-003 | Configurar centros de costo | 5 | ~12 KB |
| US-ADM-004 | Consultar bitácora de auditoría | 5 | ~13 KB |
| US-ADM-005 | Configurar backups automáticos | 3 | ~10 KB |
| US-ADM-006 | Restaurar desde backup | 5 | ~14 KB |
| US-ADM-007 | Dashboard de administración | 7 | ~16 KB |
| US-ADM-008 | Configurar políticas de seguridad | 5 | ~13 KB |

**Total:** 40 SP | ~108 KB estimado

---

## 🏗️ Arquitectura Técnica (Preliminar)

### Base de Datos (PostgreSQL)

```sql
-- Schemas principales
CREATE SCHEMA IF NOT EXISTS auth_management;
CREATE SCHEMA IF NOT EXISTS admin;
CREATE SCHEMA IF NOT EXISTS audit_logging;

-- Tablas clave (estimadas)
auth_management.users (12 columnas)
auth_management.user_constructoras (6 columnas)
auth_management.invitations (8 columnas)
admin.roles (5 columnas)
admin.role_permissions (5 columnas)
admin.custom_permissions (10 columnas)
admin.cost_centers (12 columnas)
admin.system_settings (8 columnas)
audit_logging.audit_logs (20+ columnas)
admin.backups (15 columnas)

-- Total estimado: 10-12 tablas principales
```

### Backend (NestJS)

```
apps/backend/src/modules/
├── auth-management/
│   ├── users.service.ts
│   ├── invitations.service.ts
│   └── users.controller.ts
├── admin/
│   ├── roles.service.ts
│   ├── permissions.service.ts
│   ├── cost-centers.service.ts
│   └── system-settings.service.ts
├── audit/
│   ├── audit-logs.service.ts
│   ├── audit.middleware.ts
│   └── audit-logs.controller.ts
└── backups/
    ├── backup.service.ts
    ├── backup.cron.ts
    └── restore.service.ts
```

### Frontend (React)

```
apps/frontend/src/features/admin/
├── pages/
│   ├── UsersManagementPage.tsx
│   ├── RolesPermissionsPage.tsx
│   ├── CostCentersPage.tsx
│   ├── AuditLogsPage.tsx
│   ├── BackupsPage.tsx
│   └── SystemSettingsPage.tsx
├── components/
│   ├── UserForm.tsx
│   ├── PermissionMatrix.tsx
│   ├── CostCenterTree.tsx
│   ├── AuditLogViewer.tsx
│   ├── BackupManager.tsx
│   └── SystemDashboard.tsx
└── stores/
    └── adminStore.ts
```

---

## 📈 Características Clave Implementadas (Documentadas)

### 1. Multi-Tenancy Seguro ✅
- Múltiples empresas en el mismo sistema
- Aislamiento total por `constructoraId`
- RLS en PostgreSQL (defensa en profundidad)
- Selector de empresa sin re-login

### 2. RBAC + ABAC Combinados ✅
- 7 roles especializados en construcción
- Matriz de permisos (7 × 14 módulos)
- Reglas de negocio contextuales
- Permisos personalizados temporales

### 3. Validación en 3 Capas ✅
- Frontend: UX (oculta botones)
- Backend: Guards (seguridad real)
- Database: RLS (defensa en profundidad)

### 4. Auditoría Completa 🚧 (Pendiente documentar)
- 4 categorías de eventos
- Registro automático de operaciones críticas
- Retención diferenciada (90 días / 5 años)
- Queries con filtros avanzados

### 5. Backups Automáticos 🚧 (Pendiente documentar)
- Estrategia 3-2-1
- 4 tipos de backup (Full, Incremental, Archivos, Snapshots)
- RTO < 4 horas, RPO < 1 hora
- Pruebas mensuales

---

## 🔗 Integraciones con Otros Módulos

| Módulo | Tipo | Funcionalidad |
|--------|------|---------------|
| **Todos los módulos** | Transversal | RBAC, RLS, Auditoría |
| MAI-001 (Fundamentos) | Core | Reutiliza auth, extiende roles |
| MAI-002 (Proyectos) | RLS | Filtrado por constructora y equipo |
| MAI-003 (Presupuestos) | Auditoría | Log de cambios en presupuestos |
| MAI-004 (Compras) | Centros Costo | Imputación automática |
| MAI-008 (Estimaciones) | Auditoría | Log de aprobaciones >$50K |
| MAE-014 (Finanzas) | Centros Costo | Reporting financiero |

---

## 📊 Métricas de Progreso

| Métrica | Planificado | Actual | % |
|---------|-------------|--------|---|
| **README** | 1 | 1 | 100% ✅ |
| **RFs** | 5 | 2 | 40% 🚧 |
| **ETs** | 5 | 0 | 0% ⏳ |
| **USs** | 8 | 0 | 0% ⏳ |
| **Story Points** | 40 SP | - | - |
| **Tamaño Documentación** | ~280 KB | ~85 KB | 30% |
| **Tiempo invertido** | - | ~1 hora | - |

---

## 🎯 Próximos Pasos Inmediatos

### Opción 1: Completar Requerimientos Funcionales ⭐ RECOMENDADO
**Razón:** Terminar la capa de RFs antes de pasar a ETs

**Pendientes:**
1. RF-ADM-003: Centros de Costo (~1 hora)
2. RF-ADM-004: Auditoría (~1.5 horas)
3. RF-ADM-005: Backups (~1 hora)

**Estimación:** 3.5 horas para completar RFs (100%)

### Opción 2: Comenzar Especificaciones Técnicas
**Razón:** Tener especificación técnica completa de lo documentado

**Prioridad:**
1. ET-ADM-001: RBAC multi-tenancy (45 KB, ~2 horas)
2. ET-ADM-003: Audit logging (40 KB, ~2 horas)

### Opción 3: Crear Historias de Usuario
**Razón:** Tener user stories listas para sprint planning

**Prioridad P0 (críticas):**
- US-ADM-001: Gestión de usuarios (5 SP)
- US-ADM-002: Roles y permisos (5 SP)
- US-ADM-004: Auditoría (5 SP)
- US-ADM-006: Restauración (5 SP)

---

## 📝 Lecciones Aprendidas

### Reutilización de GAMILIT

| Componente | Reutilización | Adaptación Necesaria |
|------------|---------------|----------------------|
| Auth base | 95% | Extender de 3 a 7 roles |
| Multi-tenancy | 90% | Adaptar de schools a constructoras |
| RLS policies | 85% | Adaptar contexto (school_id → constructora_id) |
| Audit logging | 70% | Agregar eventos específicos de construcción |
| RBAC guards | 90% | Agregar permisos APPROVE |

**Ahorro estimado:** 90% del trabajo base ya hecho en GAMILIT.

### Complejidad Manejada

✅ Multi-tenancy con múltiples roles por empresa
✅ Matriz de permisos 7 × 14
✅ Validación en 3 capas (Frontend, Backend, Database)
✅ Reglas de negocio complejas (ABAC)
✅ Permisos personalizados temporales

---

## 🚨 Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| RLS mal configurado | Media | Crítico | Tests automáticos en CI/CD |
| Permisos demasiado complejos | Media | Alto | Documentación clara, UI intuitiva |
| Performance de audit logs | Media | Medio | Particionamiento de tabla, retención |
| Backups fallan silenciosamente | Baja | Crítico | Monitoreo activo, alertas |

---

**Generado:** 2025-11-20
**Versión:** 1.0
**Autor:** Sistema de Documentación Técnica
**Próxima revisión:** Al completar RFs pendientes
**Reutilización GAMILIT:** 90%
