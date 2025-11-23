# RF-ADM-002: Sistema de Permisos Granulares (RBAC + ABAC)

**ID:** RF-ADM-002
**Módulo:** MAI-013 - Administración & Seguridad
**Tipo:** Requerimiento Funcional
**Prioridad:** P0 (Crítica)
**Fecha de creación:** 2025-11-20
**Versión:** 1.0

---

## 📋 Descripción

El sistema debe implementar un **sistema de permisos granulares** que combine:

- **RBAC (Role-Based Access Control):** Permisos basados en roles predefinidos
- **ABAC (Attribute-Based Access Control):** Permisos adicionales basados en atributos/contexto
- **Validación en 3 capas:** Frontend (UX) + Backend (lógica) + Database (RLS)

Este sistema garantiza que cada usuario **solo accede a las funcionalidades permitidas** según su rol, proyecto asignado y reglas de negocio.

---

## 🎯 Objetivos

### Objetivos de Negocio

1. **Principio de menor privilegio:** Usuarios solo tienen permisos necesarios para su trabajo
2. **Control granular:** Permisos a nivel de módulo, acción (CRUD+Approve) y registro
3. **Flexibilidad:** Permisos adicionales (custom) más allá del rol base
4. **Trazabilidad:** Auditoría de quién accede a qué y cuándo
5. **Cumplimiento:** ISO 27001, SOC 2 compliance ready

### Objetivos Técnicos

1. **Performance:** Validación de permisos < 10ms
2. **Cache de permisos:** Permisos calculados y cacheados en JWT
3. **RLS automático:** Row Level Security en PostgreSQL
4. **Guards reutilizables:** Decoradores en NestJS para validación
5. **Testing:** 100% cobertura de reglas de permisos

---

## 🔑 Modelo de Permisos

### Permisos por Acción (CRUD+A)

```typescript
enum PermissionAction {
  CREATE = 'create',   // Crear nuevos registros
  READ = 'read',       // Ver/leer registros
  UPDATE = 'update',   // Modificar registros existentes
  DELETE = 'delete',   // Eliminar registros (soft delete)
  APPROVE = 'approve'  // Aprobar operaciones críticas
}
```

### Permisos por Módulo

Cada uno de los **13 módulos** del sistema tiene su propio conjunto de permisos:

| Módulo | Código | Acciones Disponibles |
|--------|--------|----------------------|
| Fundamentos | `auth` | CREATE, READ, UPDATE, DELETE |
| Proyectos | `projects` | CREATE, READ, UPDATE, DELETE, APPROVE |
| Presupuestos | `budgets` | CREATE, READ, UPDATE, DELETE, APPROVE |
| Compras | `purchases` | CREATE, READ, UPDATE, DELETE, APPROVE |
| Inventarios | `inventory` | CREATE, READ, UPDATE, DELETE |
| Contratos | `contracts` | CREATE, READ, UPDATE, DELETE, APPROVE |
| Control de Obra | `construction` | CREATE, READ, UPDATE, DELETE |
| Estimaciones | `estimations` | CREATE, READ, UPDATE, DELETE, APPROVE |
| RRHH | `hr` | CREATE, READ, UPDATE, DELETE, APPROVE |
| Calidad/Postventa | `quality` | CREATE, READ, UPDATE, DELETE |
| CRM | `crm` | CREATE, READ, UPDATE, DELETE, APPROVE |
| INFONAVIT | `infonavit` | CREATE, READ, UPDATE, DELETE |
| Reportes | `reports` | CREATE, READ, UPDATE, DELETE |
| Administración | `admin` | CREATE, READ, UPDATE, DELETE, APPROVE |

---

## 📊 Matriz de Permisos por Rol

### Matriz Completa (7 Roles × 14 Módulos)

| Módulo | Director | Engineer | Resident | Purchases | Finance | HR | Post Sales |
|--------|----------|----------|----------|-----------|---------|----|-----------  |
| **auth** | CRUD | R | R | R | R | R | R |
| **projects** | CRUD+A | CRUD | R | R | R | R | R |
| **budgets** | CRUD+A | CRUD | R | R | R | - | - |
| **purchases** | CRUD+A | R | CRUD | CRUD+A | R | - | - |
| **inventory** | CRUD+A | R | CRUD | CRUD | R | - | - |
| **contracts** | CRUD+A | CRUD | R | R | R | - | - |
| **construction** | CRUD+A | CRUD | CRUD | R | R | - | R |
| **estimations** | CRUD+A | CRUD | R | - | CRUD+A | - | - |
| **hr** | CRUD+A | R | R | - | R | CRUD+A | - |
| **quality** | CRUD+A | CRUD | CRUD | - | - | - | CRUD |
| **crm** | CRUD+A | R | - | - | R | - | CRUD+A |
| **infonavit** | CRUD+A | R | - | - | CRUD | CRUD | R |
| **reports** | CRUD+A | R | R | R | CRUD | R | R |
| **admin** | CRUD+A | - | - | - | R | R | - |

**Leyenda:**
- **C**: Create
- **R**: Read
- **U**: Update
- **D**: Delete
- **A**: Approve
- **-**: Sin acceso

### Ejemplos de Permisos por Rol

#### Director General
```typescript
const directorPermissions = {
  projects: ['create', 'read', 'update', 'delete', 'approve'],
  budgets: ['create', 'read', 'update', 'delete', 'approve'],
  purchases: ['create', 'read', 'update', 'delete', 'approve'],
  // ... todos los módulos con acceso completo
};
```

#### Residente de Obra
```typescript
const residentPermissions = {
  projects: ['read'],
  construction: ['create', 'read', 'update', 'delete'],
  inventory: ['create', 'read', 'update', 'delete'],
  purchases: ['create', 'read', 'update', 'delete'],
  reports: ['read'],
  // No acceso a: budgets, admin, crm, infonavit
};
```

#### Compras/Almacén
```typescript
const purchasesPermissions = {
  purchases: ['create', 'read', 'update', 'delete', 'approve'],
  inventory: ['create', 'read', 'update', 'delete'],
  projects: ['read'],
  construction: ['read'],
  reports: ['read'],
  // No acceso a: budgets, hr, quality, admin
};
```

---

## 🔒 Reglas de Negocio (ABAC)

Además del rol, se aplican reglas basadas en **atributos y contexto**:

### Regla 1: Acceso por Proyecto Asignado

Un usuario **solo puede ver/editar proyectos** a los que está asignado como miembro del equipo.

```typescript
interface ProjectAccessRule {
  userId: string;
  projectId: string;
  role: 'director' | 'resident' | 'engineer' | 'supervisor';
  canApprove: boolean;
}
```

**Ejemplo:**
- Juan es Ingeniero en Proyecto A → Puede ver/editar Proyecto A
- Juan NO está en Proyecto B → No puede ver Proyecto B (aunque sea Ingeniero)

**Excepción:** Director General puede ver todos los proyectos de su constructora.

### Regla 2: Monto de Aprobación

Aprobaciones financieras requieren **doble autorización** según monto:

| Monto | Aprobador Nivel 1 | Aprobador Nivel 2 |
|-------|-------------------|-------------------|
| < $20,000 | Compras o Finance | - |
| $20,000 - $100,000 | Finance | Director |
| > $100,000 | Finance + Director | (ambos requeridos) |

```typescript
interface ApprovalRule {
  entityType: 'purchase_order' | 'estimation' | 'budget_change';
  amount: number;
  requiredApprovers: string[]; // Roles
  approvalCount: number; // 1 o 2
}
```

### Regla 3: Edición Temporal

Algunos registros **no pueden editarse** pasado cierto tiempo:

| Entidad | Tiempo límite | Excepción |
|---------|---------------|-----------|
| Estimación autorizada | 0 días (bloqueado) | Director puede revertir |
| Orden de compra entregada | 7 días | Director puede modificar |
| Avance de obra aprobado | 3 días | Ingeniero puede corregir |

### Regla 4: Segregación de Funciones

Ciertas acciones **no pueden ser hechas por la misma persona**:

- ❌ Quien crea una orden de compra **no puede aprobarla**
- ❌ Quien captura avances **no puede aprobarlos**
- ✅ Director puede crear y aprobar (excepción)

```typescript
interface SegregationRule {
  action: 'approve';
  entity: 'purchase_order' | 'estimation' | 'construction_progress';
  cannotBeSameAs: 'creator' | 'last_modifier';
  exceptions: string[]; // Roles exceptuados ['director']
}
```

---

## 🛡️ Validación en 3 Capas

### Capa 1: Frontend (UX)

Oculta elementos de UI según permisos del usuario.

```typescript
// React component
const ProjectActions = () => {
  const { hasPermission } = useAuth();

  return (
    <div>
      {hasPermission('projects', 'create') && (
        <Button onClick={createProject}>Crear Proyecto</Button>
      )}

      {hasPermission('projects', 'update') && (
        <Button onClick={editProject}>Editar</Button>
      )}

      {hasPermission('projects', 'delete') && (
        <Button onClick={deleteProject}>Eliminar</Button>
      )}
    </div>
  );
};
```

**Propósito:** Mejorar UX (no mostrar botones inútiles).

**Seguridad:** ⚠️ NO es seguridad real (puede bypassearse en DevTools).

### Capa 2: Backend (Lógica de Negocio)

Valida permisos en cada endpoint con **Guards**.

```typescript
// NestJS controller
@Controller('projects')
export class ProjectsController {
  @Post()
  @RequirePermissions('projects', 'create')
  async create(@Body() dto: CreateProjectDto, @CurrentUser() user: User) {
    // Solo ejecuta si usuario tiene permiso 'projects:create'
    return this.projectsService.create(dto, user);
  }

  @Patch(':id/approve')
  @RequirePermissions('projects', 'approve')
  @RequireRole('director', 'engineer') // Y además rol específico
  async approve(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.approve(id, user);
  }
}
```

**Guard implementation:**

```typescript
@Injectable()
export class PermissionsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Del JWT
    const requiredModule = this.reflector.get('module', context.getHandler());
    const requiredAction = this.reflector.get('action', context.getHandler());

    return this.permissionsService.hasPermission(
      user.role,
      requiredModule,
      requiredAction
    );
  }
}
```

**Propósito:** Seguridad real. Backend rechaza requests no autorizadas.

### Capa 3: Database (Row Level Security)

PostgreSQL filtra automáticamente **a nivel de base de datos**.

```sql
-- RLS Policy: Solo ver proyectos de tu constructora
CREATE POLICY projects_read_policy ON projects
FOR SELECT
USING (
  constructora_id = current_setting('app.current_constructora_id')::uuid
);

-- RLS Policy: Solo editar si eres miembro del equipo
CREATE POLICY projects_update_policy ON projects
FOR UPDATE
USING (
  constructora_id = current_setting('app.current_constructora_id')::uuid
  AND (
    current_setting('app.current_user_role') = 'director'
    OR EXISTS (
      SELECT 1 FROM project_team_assignments
      WHERE project_id = projects.id
        AND user_id = current_setting('app.current_user_id')::uuid
    )
  )
);
```

**Propósito:** **Defensa en profundidad**. Incluso si backend tiene bug, DB protege.

**Ejemplo de protección:**

```typescript
// Developer escribe (por error):
const allProjects = await db.query('SELECT * FROM projects');

// PostgreSQL ejecuta (automático):
SELECT * FROM projects
WHERE constructora_id = 'uuid-current-company'
  AND (user_role = 'director' OR user_id IN (SELECT user_id FROM team WHERE project_id = projects.id));
```

---

## 🔐 Permisos Personalizados (Custom Permissions)

Además de los permisos por rol, se pueden asignar **permisos adicionales** a usuarios específicos:

```typescript
interface CustomPermission {
  userId: string;
  constructoraId: string;
  module: string; // 'budgets'
  actions: PermissionAction[]; // ['read', 'update']
  scope?: {
    projectId?: string; // Solo para este proyecto
    validUntil?: Date;  // Permiso temporal
  };
  grantedBy: string; // Usuario que otorgó el permiso
  grantedAt: Date;
}
```

**Ejemplo:**

```json
{
  "userId": "uuid-123",
  "module": "budgets",
  "actions": ["read"],
  "scope": {
    "projectId": "uuid-project-A",
    "validUntil": "2025-12-31T23:59:59Z"
  },
  "grantedBy": "uuid-director",
  "grantedAt": "2025-11-20T10:00:00Z"
}
```

**Interpretación:**
- Usuario 123 (normalmente sin acceso a Presupuestos)
- Tiene permiso `READ` en módulo `budgets`
- Solo para Proyecto A
- Válido hasta 31/12/2025
- Otorgado por Director

**Caso de uso:** Auditor externo necesita ver presupuestos de un proyecto específico por 30 días.

---

## 📊 Casos de Uso

### Caso 1: Residente Intenta Aprobar Estimación

**Actor:** Pedro (Residente de Obra)

**Flujo:**
1. Pedro va a módulo "Estimaciones"
2. Ve listado de estimaciones del proyecto (permiso READ ✅)
3. Click en "Estimación #5" → Ver detalle ✅
4. **Botón "Aprobar" está oculto** (Frontend valida que no tiene permiso APPROVE)
5. Pedro intenta acceder directo vía API:
   ```bash
   PATCH /api/estimations/5/approve
   Authorization: Bearer <token-pedro>
   ```
6. **Backend rechaza:**
   ```json
   {
     "statusCode": 403,
     "message": "Forbidden: You don't have permission to approve estimations",
     "error": "Forbidden"
   }
   ```
7. **Auditoría registra:**
   ```json
   {
     "userId": "pedro-uuid",
     "action": "approve_attempt",
     "module": "estimations",
     "entityId": "5",
     "success": false,
     "errorMessage": "Insufficient permissions"
   }
   ```

**Resultado:** Ataque bloqueado en 3 capas (Frontend, Backend, Auditoría).

### Caso 2: Ingeniero Asignado Edita Presupuesto

**Actor:** Carlos (Ingeniero asignado a Proyecto A)

**Flujo:**
1. Carlos login → Token contiene:
   ```json
   {
     "userId": "carlos-uuid",
     "role": "engineer",
     "constructoraId": "empresa-a",
     "projectAssignments": ["proyecto-a-uuid"]
   }
   ```
2. Carlos va a "Presupuestos" del Proyecto A
3. Ve presupuesto maestro (READ ✅)
4. Click en "Editar" → Formulario se abre ✅
5. Modifica partida "Cimentación" de $500K → $520K
6. Click en "Guardar"
7. **Backend valida:**
   - ✅ Usuario tiene rol `engineer`
   - ✅ Rol `engineer` tiene permiso `budgets:update`
   - ✅ Usuario está asignado a Proyecto A
   - ✅ Presupuesto pertenece a Proyecto A
8. **Database (RLS) valida:**
   ```sql
   UPDATE budgets SET amount = 520000
   WHERE id = 'budget-uuid'
     AND constructora_id = 'empresa-a' -- RLS automático
     AND project_id IN (
       SELECT project_id FROM project_team
       WHERE user_id = 'carlos-uuid'
     );
   ```
9. **Auditoría registra:**
   ```json
   {
     "userId": "carlos-uuid",
     "action": "update",
     "module": "budgets",
     "entityId": "budget-uuid",
     "changes": [
       { "field": "amount", "oldValue": 500000, "newValue": 520000 }
     ],
     "success": true
   }
   ```

**Resultado:** Operación exitosa con trazabilidad completa.

### Caso 3: Permiso Personalizado Temporal

**Actor:** Director otorga permiso temporal a Auditor Externo

**Flujo:**
1. Director va a "Administración" → "Permisos Personalizados"
2. Click en "Otorgar Permiso Temporal"
3. Completa formulario:
   - Usuario: `auditor@externo.com`
   - Módulo: `budgets`
   - Acción: `read`
   - Alcance: Solo Proyecto "Fraccionamiento Los Pinos"
   - Válido hasta: 2025-12-15
4. Click en "Otorgar"
5. Sistema crea `CustomPermission`:
   ```json
   {
     "userId": "auditor-uuid",
     "module": "budgets",
     "actions": ["read"],
     "scope": {
       "projectId": "proyecto-los-pinos-uuid",
       "validUntil": "2025-12-15T23:59:59Z"
     },
     "grantedBy": "director-uuid"
   }
   ```
6. Auditor login → Token incluye custom permissions
7. Auditor puede ver presupuestos **solo de ese proyecto**
8. Auditor intenta ver presupuesto de otro proyecto → 403 Forbidden
9. 2025-12-16 00:00:00 → Cron job elimina permiso expirado
10. Auditor ya no puede acceder

**Resultado:** Acceso temporal y granular sin modificar rol base.

---

## ✅ Criterios de Aceptación

### AC1: Validación Multi-Capa

**DADO** un usuario sin permiso `budgets:approve`
**CUANDO** intenta aprobar un presupuesto
**ENTONCES**
- ✅ Frontend oculta botón "Aprobar" (UX)
- ✅ Backend rechaza con 403 Forbidden (seguridad)
- ✅ Auditoría registra intento fallido
- ✅ RLS en DB bloquea query (defensa en profundidad)

### AC2: Permisos por Proyecto

**DADO** un Ingeniero asignado solo a Proyecto A
**CUANDO** intenta acceder a Proyecto B
**ENTONCES**
- ✅ Proyecto B no aparece en su lista (filtrado automático)
- ✅ Acceso directo a `/projects/B` retorna 404 (RLS lo bloquea)
- ✅ Auditoría registra intento de acceso no autorizado

### AC3: Aprobación por Monto

**DADO** una orden de compra de $50,000
**CUANDO** Comprador intenta aprobar
**ENTONCES**
- ✅ Sistema rechaza (requiere aprobación de Finance)
- ✅ Mensaje: "Monto requiere aprobación de Finanzas o Director"

**Y CUANDO** Finance aprueba
**ENTONCES**
- ✅ Orden cambia a estado `approved`
- ✅ Auditoría registra aprobador

### AC4: Segregación de Funciones

**DADO** un Ingeniero que creó una estimación
**CUANDO** intenta aprobarla él mismo
**ENTONCES**
- ✅ Sistema rechaza con mensaje: "No puede aprobar una estimación creada por usted"
- ✅ Solo Director u otro Ingeniero pueden aprobar

### AC5: Permisos Personalizados

**DADO** un permiso personalizado válido hasta 2025-12-01
**CUANDO** es 2025-11-20
**ENTONCES**
- ✅ Usuario puede acceder según permiso

**Y CUANDO** es 2025-12-02
**ENTONCES**
- ✅ Permiso ha expirado
- ✅ Usuario ya no puede acceder
- ✅ Cron job eliminó el permiso

---

## 🧪 Escenarios de Prueba

### Test 1: Matriz de Permisos por Rol

```typescript
describe('RF-ADM-002: Permission Matrix', () => {
  const roles = ['director', 'engineer', 'resident', 'purchases', 'finance', 'hr', 'post_sales'];
  const modules = ['projects', 'budgets', 'purchases', 'construction', 'estimations', 'hr'];

  roles.forEach(role => {
    it(`should enforce correct permissions for ${role}`, async () => {
      const user = await loginAs(role);

      // Test cada módulo
      for (const module of modules) {
        const expectedPermissions = PERMISSION_MATRIX[role][module];

        if (expectedPermissions === '-') {
          // No debe tener acceso
          const response = await api.get(`/${module}`, {
            headers: { Authorization: user.token }
          });
          expect(response.status).toBe(403);
        } else {
          // Debe tener acceso según permisos
          if (expectedPermissions.includes('R')) {
            const response = await api.get(`/${module}`, {
              headers: { Authorization: user.token }
            });
            expect(response.status).toBe(200);
          }

          if (expectedPermissions.includes('C')) {
            const response = await api.post(`/${module}`, testData, {
              headers: { Authorization: user.token }
            });
            expect(response.status).toBe(201);
          }
        }
      }
    });
  });
});
```

### Test 2: RLS en Database

```typescript
describe('RF-ADM-002: Row Level Security', () => {
  it('should isolate data by constructora_id', async () => {
    // Crear proyectos en 2 empresas
    const projectA = await createProject({ constructoraId: 'empresa-a' });
    const projectB = await createProject({ constructoraId: 'empresa-b' });

    // Usuario de Empresa A
    const userA = await loginAs('engineer', 'empresa-a');

    // Query directo a DB (simulando bug en backend)
    const result = await db.query('SELECT * FROM projects');

    // RLS debe haber filtrado automáticamente
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].id).toBe(projectA.id);
    expect(result.rows).not.toContainEqual(
      expect.objectContaining({ id: projectB.id })
    );
  });
});
```

### Test 3: Permisos Personalizados

```typescript
describe('RF-ADM-002: Custom Permissions', () => {
  it('should grant temporary custom permissions', async () => {
    const auditor = await createUser('engineer'); // No tiene acceso a budgets por defecto
    const project = await createProject();

    // Sin permiso custom
    let response = await api.get(`/budgets?projectId=${project.id}`, {
      headers: { Authorization: auditor.token }
    });
    expect(response.status).toBe(403);

    // Director otorga permiso temporal
    await grantCustomPermission({
      userId: auditor.id,
      module: 'budgets',
      actions: ['read'],
      scope: { projectId: project.id },
      validUntil: addDays(new Date(), 7)
    });

    // Ahora sí tiene acceso
    response = await api.get(`/budgets?projectId=${project.id}`, {
      headers: { Authorization: auditor.token }
    });
    expect(response.status).toBe(200);
  });

  it('should revoke expired custom permissions', async () => {
    const permission = await grantCustomPermission({
      validUntil: subDays(new Date(), 1) // Expirado
    });

    // Ejecutar cron job
    await cleanupExpiredPermissions();

    // Permiso debe estar eliminado
    const exists = await db.query(
      'SELECT * FROM custom_permissions WHERE id = $1',
      [permission.id]
    );
    expect(exists.rows).toHaveLength(0);
  });
});
```

---

## 🔗 Referencias

- **Especificación técnica:** [ET-ADM-001](../especificaciones/ET-ADM-001-rbac-multi-tenancy.md)
- **Historia de usuario:** [US-ADM-002](../historias-usuario/US-ADM-002-asignar-roles-permisos.md)
- **RF relacionado:** [RF-ADM-001](./RF-ADM-001-usuarios-roles.md)
- **Módulo:** [README.md](../README.md)

---

**Generado:** 2025-11-20
**Versión:** 1.0
**Autor:** Sistema de Documentación Técnica
**Estado:** ✅ Completo
