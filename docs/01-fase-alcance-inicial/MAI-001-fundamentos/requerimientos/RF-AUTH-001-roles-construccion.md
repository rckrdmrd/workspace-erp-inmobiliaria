# RF-AUTH-001: Sistema de Roles de Construcción

## 📋 Metadata

| Campo | Valor |
|-------|-------|
| **ID** | RF-AUTH-001 |
| **Módulo** | Autenticación y Autorización |
| **Prioridad** | P0 - Crítica |
| **Estado** | 🚧 Planificado |
| **Versión** | 1.0 |
| **Fecha creación** | 2025-11-17 |
| **Última actualización** | 2025-11-17 |

## 🔗 Referencias

### Especificación Técnica
📐 [ET-AUTH-001: RBAC Implementation](../especificaciones/ET-AUTH-001-rbac.md)

### Implementación DDL
🗄️ **ENUM Canónico:**
- **Ubicación:** `apps/database/ddl/00-prerequisites.sql:30-39`
- **Tipo:** `auth_management.construction_role`
- **Valores:** `director`, `engineer`, `resident`, `purchases`, `finance`, `hr`, `post_sales`

🗄️ **Tablas que usan el ENUM:**
1. `auth_management.profiles` → `apps/database/ddl/schemas/auth_management/tables/03-profiles.sql:15`
2. `auth.users` → `apps/database/ddl/schemas/auth/tables/01-users.sql:15`
3. `constructoras.user_constructoras` → `apps/database/ddl/schemas/constructoras/tables/02-user_constructoras.sql:20`

### Backend
💻 **Implementación:**
- **Enum:** `apps/backend/src/shared/enums/construction-role.enum.ts`
- **Guard:** `apps/backend/src/shared/guards/roles.guard.ts`
- **Decorator:** `@Roles('engineer', 'director')`

### Frontend
🎨 **Componentes:**
- **Types:** `apps/frontend/src/types/auth.types.ts`
- **Componentes:**
  - `apps/frontend/src/components/auth/RoleBasedRoute.tsx`
  - `apps/frontend/src/components/ui/UserRoleBadge.tsx`
  - `apps/frontend/src/components/admin/AdminPanel.tsx`

### Reusado de GAMILIT
♻️ **Componente base:** [EAI-001/RF-AUTH-001](../../../../workspace-gamilit/gamilit/projects/gamilit/docs/01-fase-alcance-inicial/EAI-001-fundamentos/requerimientos/RF-AUTH-001-roles.md)
**Adaptación:** 3 roles → 7 roles específicos de construcción

---

## 📝 Descripción del Requerimiento

### Contexto

El Sistema de Administración de Obra necesita diferenciar entre **7 tipos de usuarios** con permisos y funcionalidades específicas para la gestión de proyectos de construcción. Esta diferenciación es crítica para:
- Proteger datos sensibles de obras y presupuestos
- Permitir gestión efectiva de recursos por perfil especializado
- Cumplir con segregación de funciones (SOD - Separation of Duties)
- Garantizar trazabilidad de acciones por responsable

### Necesidad del Negocio

**Problema:**
En proyectos de construcción, diferentes actores tienen responsabilidades y necesidades de información distintas:
- **Dirección** necesita visión global de márgenes y riesgos
- **Ingeniería** necesita control de presupuestos y programación
- **Residentes** necesitan capturar avances desde campo
- **Compras** necesita gestionar proveedores e inventarios
- **Finanzas** necesita controlar flujo de efectivo
- **RRHH** necesita gestionar nómina y asistencias
- **Postventa** necesita atender incidencias y garantías

Sin un sistema de roles bien definido, todos tendrían el mismo nivel de acceso, lo cual:
- Comprometería la confidencialidad de datos financieros
- Dificultaría la asignación de responsabilidades
- Impediría auditorías efectivas
- Generaría confusión en permisos

**Solución:**
Implementar un sistema de roles con **7 niveles especializados** de autorización que permita acceso granular basado en función y responsabilidad en la obra.

---

## 🎯 Requerimiento Funcional

### RF-AUTH-001.1: Roles Disponibles

El sistema **DEBE** soportar exactamente 7 roles de usuario especializados en construcción:

#### 1. Director (`director`)
**Descripción:** Director general o de proyectos con visión estratégica

**Permisos:**
- ✅ Visión global de todos los proyectos de la constructora
- ✅ Acceso a márgenes de utilidad y rentabilidad
- ✅ Ver todos los reportes financieros
- ✅ Aprobar presupuestos y modificaciones mayores
- ✅ Acceso a analytics y dashboards ejecutivos
- ✅ Gestionar equipo de proyecto (asignar responsables)
- ✅ Aprobar estimaciones mayores
- ❌ NO edita datos operativos (lo hace ingeniería)
- ❌ NO captura avances (lo hacen residentes)

**Restricciones RLS (Row Level Security):**
```sql
-- Política: Director ve todos los proyectos de su constructora
CREATE POLICY "directors_view_all_projects" ON projects.projects
    FOR SELECT
    TO authenticated
    USING (
        constructora_id = get_current_constructora_id()
        AND get_current_user_role() = 'director'
    );
```

**Casos de Uso:**
- Revisar estado financiero de todas las obras
- Analizar desviaciones de costos
- Tomar decisiones estratégicas (cancelar/continuar obras)
- Aprobar órdenes de cambio mayores

---

#### 2. Ingeniero (`engineer`)
**Descripción:** Ingeniero de planeación, control de obra, o jefe de proyecto

**Permisos:**
- ✅ Todos los permisos de residente
- ✅ Crear y editar presupuestos
- ✅ Gestionar catálogo de conceptos de obra
- ✅ Ver y ajustar programación de obra
- ✅ Generar reportes de avance y desviaciones
- ✅ Revisar estimaciones antes de aprobar
- ✅ Asignar cuadrillas a frentes de trabajo
- ✅ Acceso a módulo de planeación
- ❌ NO puede aprobar estimaciones (solo director/finanzas)
- ❌ NO puede ver márgenes de utilidad detallados
- ❌ NO gestiona compras (lo hace departamento de compras)

**Restricciones RLS:**
```sql
-- Política: Ingeniero ve proyectos donde es responsable o de su área
CREATE POLICY "engineers_view_assigned_projects" ON projects.projects
    FOR SELECT
    TO authenticated
    USING (
        get_current_user_role() = 'engineer'
        AND (
            id IN (
                SELECT project_id
                FROM projects.project_team_assignments
                WHERE user_id = get_current_user_id()
                AND role IN ('engineer', 'project_manager')
            )
            OR constructora_id = get_current_constructora_id()
        )
    );
```

**Casos de Uso:**
- Elaborar presupuestos por prototipo
- Ajustar precios unitarios
- Revisar avances vs programado
- Generar curva S
- Revisar checklists de calidad

---

#### 3. Residente (`resident`)
**Descripción:** Residente de obra o supervisor de campo

**Permisos:**
- ✅ Capturar avances físicos de obra (desde app móvil)
- ✅ Registrar incidencias y no conformidades
- ✅ Tomar evidencias fotográficas geolocalizadas
- ✅ Completar checklists de actividades
- ✅ Ver programación de su obra
- ✅ Registrar asistencia de empleados (app móvil con biométrico)
- ✅ Solicitar materiales (requisiciones)
- ✅ Ver inventario de su almacén de obra
- ❌ NO puede editar presupuestos
- ❌ NO puede aprobar órdenes de compra
- ❌ NO puede ver datos financieros (costos, márgenes)
- ❌ NO puede ver otras obras (solo las asignadas)

**Restricciones RLS:**
```sql
-- Política: Residente solo ve su(s) obra(s) asignada(s)
CREATE POLICY "residents_view_own_projects" ON projects.projects
    FOR SELECT
    TO authenticated
    USING (
        get_current_user_role() = 'resident'
        AND id IN (
            SELECT project_id
            FROM projects.project_team_assignments
            WHERE user_id = get_current_user_id()
            AND role = 'resident'
            AND active = true
        )
    );
```

**Casos de Uso:**
- Capturar avance de cimentación al 80%
- Registrar incidencia de filtración en lote 23
- Tomar foto de avance con GPS
- Completar checklist de instalaciones hidrosanitarias
- Registrar asistencia de cuadrilla de albañiles con huella dactilar

---

#### 4. Compras (`purchases`)
**Descripción:** Encargado de compras y almacén

**Permisos:**
- ✅ Ver requisiciones de todas las obras
- ✅ Crear y gestionar órdenes de compra
- ✅ Comparar cotizaciones de proveedores
- ✅ Gestionar catálogo de proveedores
- ✅ Autorizar entregas parciales/completas
- ✅ Gestionar movimientos de inventario (entradas, salidas, traspasos)
- ✅ Ver kardex de materiales
- ✅ Configurar alertas de stock mínimo
- ❌ NO puede editar presupuestos
- ❌ NO puede ver márgenes de utilidad
- ❌ NO puede aprobar estimaciones

**Restricciones RLS:**
```sql
-- Política: Compras ve requisiciones de todas las obras de la constructora
CREATE POLICY "purchases_view_all_requisitions" ON purchases.purchase_requisitions
    FOR SELECT
    TO authenticated
    USING (
        get_current_user_role() = 'purchases'
        AND constructora_id = get_current_constructora_id()
    );
```

**Casos de Uso:**
- Comparar 3 cotizaciones de cemento
- Generar orden de compra por $50,000
- Autorizar entrega parcial de acero
- Traspasar materiales entre obras
- Alertar por stock bajo de alambrón

---

#### 5. Finanzas (`finance`)
**Descripción:** Administración, contabilidad o finanzas

**Permisos:**
- ✅ Ver presupuestos y costos reales de todas las obras
- ✅ Aprobar estimaciones hacia clientes
- ✅ Aprobar estimaciones hacia subcontratistas
- ✅ Ver flujo de efectivo de obra
- ✅ Gestionar pagos y cobranzas
- ✅ Ver reportes financieros detallados
- ✅ Exportar datos contables
- ✅ Configurar centros de costo
- ❌ NO puede editar avances físicos
- ❌ NO puede crear órdenes de compra (solo autorizar pagos)

**Restricciones RLS:**
```sql
-- Política: Finanzas ve datos financieros de toda la constructora
CREATE POLICY "finance_view_all_financials" ON budgets.budgets
    FOR SELECT
    TO authenticated
    USING (
        get_current_user_role() = 'finance'
        AND constructora_id = get_current_constructora_id()
    );
```

**Casos de Uso:**
- Revisar desviaciones de presupuesto por obra
- Aprobar estimación 3 de obra A por $2M
- Ver flujo de efectivo proyectado
- Generar reporte de cartera vencida
- Exportar pólizas contables

---

#### 6. RRHH (`hr`)
**Descripción:** Recursos Humanos y nómina

**Permisos:**
- ✅ Gestionar empleados y cuadrillas
- ✅ Ver asistencias de todas las obras
- ✅ Generar reportes de nómina
- ✅ Exportar datos para IMSS/INFONAVIT
- ✅ Ver costeo de mano de obra por obra
- ✅ Gestionar oficios y categorías
- ✅ Configurar parámetros de nómina
- ❌ NO puede ver presupuestos completos
- ❌ NO puede aprobar estimaciones
- ❌ NO puede ver márgenes de utilidad

**Restricciones RLS:**
```sql
-- Política: RRHH ve datos de empleados de toda la constructora
CREATE POLICY "hr_view_all_employees" ON hr.employees
    FOR SELECT
    TO authenticated
    USING (
        get_current_user_role() = 'hr'
        AND constructora_id = get_current_constructora_id()
    );
```

**Casos de Uso:**
- Dar de alta nuevo empleado en IMSS
- Generar archivo SUA mensual
- Revisar asistencias de obra B
- Calcular costeo de mano de obra por partida
- Exportar nómina semanal

---

#### 7. Postventa (`post_sales`)
**Descripción:** Coordinador de postventa y garantías

**Permisos:**
- ✅ Ver viviendas entregadas
- ✅ Gestionar tickets de postventa
- ✅ Registrar incidencias de clientes
- ✅ Dar seguimiento a garantías
- ✅ Programar visitas de reparación
- ✅ Gestionar cuadrillas de postventa
- ✅ Ver historial completo de vivienda
- ❌ NO puede ver presupuestos
- ❌ NO puede ver datos de obras en ejecución
- ❌ NO puede gestionar compras

**Restricciones RLS:**
```sql
-- Política: Postventa solo ve viviendas entregadas
CREATE POLICY "post_sales_view_delivered_units" ON projects.housing_units
    FOR SELECT
    TO authenticated
    USING (
        get_current_user_role() = 'post_sales'
        AND status = 'delivered'
        AND constructora_id = get_current_constructora_id()
    );
```

**Casos de Uso:**
- Registrar incidencia de filtración en vivienda entregada
- Programar reparación de grieta en muro
- Ver historial de tickets de lote 45
- Generar reporte de garantías vencidas
- Asignar cuadrilla de plomería para reparación

---

### RF-AUTH-001.2: Asignación de Roles

**Reglas de Asignación:**

1. **Al registrarse (self-service):**
   - Usuarios nuevos reciben rol `resident` por defecto
   - No es posible auto-asignarse otros roles
   - Registro requiere invitación de constructora

2. **Promoción a otros roles:**
   - Solo `director` puede asignar/cambiar roles
   - Requiere justificación documentada en audit_logs
   - Cambio de rol envía notificación por email

3. **Relación con Constructoras:**
   - Un usuario puede pertenecer a múltiples constructoras (diferentes roles)
   - Ejemplo: Juan es `engineer` en Constructora A y `resident` en Constructora B
   - Usuario selecciona constructora activa al login

4. **Degradación de rol:**
   - `director` puede degradar cualquier rol
   - Usuario puede solicitar cambio de rol
   - Cambio de rol no elimina acceso histórico (solo auditoría)

---

### RF-AUTH-001.3: Validación de Roles

El sistema **DEBE** validar roles en 3 capas:

1. **Backend (Guards):**
```typescript
// apps/backend/src/modules/budgets/budgets.controller.ts
@Roles('director', 'engineer', 'finance')
@Get('budgets/:id')
getBudget(@Param('id') id: string) {
  // Solo director, engineer y finance pueden ver presupuestos
}
```

2. **Database (RLS Policies):**
```sql
-- Cada tabla sensible debe tener políticas RLS por rol
-- Ejemplo: presupuestos solo visibles por director, engineer, finance
CREATE POLICY "budgets_select_by_role" ON budgets.budgets
    FOR SELECT
    TO authenticated
    USING (
        get_current_user_role() IN ('director', 'engineer', 'finance')
        AND constructora_id = get_current_constructora_id()
    );
```

3. **Frontend (Routing y UI):**
```typescript
// apps/frontend/src/routes/ProtectedRoute.tsx
<RoleBasedRoute allowedRoles={['engineer', 'director']}>
  <BudgetManagement />
</RoleBasedRoute>
```

---

## 📊 Matriz de Permisos por Módulo

| Módulo | director | engineer | resident | purchases | finance | hr | post_sales |
|--------|----------|----------|----------|-----------|---------|----|-----------:|
| **Proyectos** |
| Ver todos los proyectos | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Ver proyectos asignados | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Crear proyecto | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Editar proyecto | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Presupuestos** |
| Ver presupuestos | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Crear presupuesto | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Editar presupuesto | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver márgenes | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Compras** |
| Ver requisiciones | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Crear requisición | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Crear orden de compra | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Aprobar orden | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Inventarios** |
| Ver inventario | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Movimientos | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Control de Obra** |
| Capturar avances | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Ver avances | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Editar avances | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **RRHH** |
| Ver empleados | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Gestionar empleados | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Ver asistencias | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Registrar asistencia | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Exportar IMSS/INFONAVIT | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Postventa** |
| Ver tickets | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Crear ticket | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Asignar cuadrilla | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Reportes** |
| Dashboard ejecutivo | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Reportes de obra | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Reportes financieros | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

---

## ✅ Criterios de Aceptación

### AC-001: Roles Implementados
- [ ] ENUM `construction_role` existe en DDL con 7 valores
- [ ] Backend tiene enum TypeScript espejo
- [ ] Frontend tiene types TypeScript
- [ ] Documentación de cada rol completa

### AC-002: RLS Policies Activas
- [ ] Tabla `projects.projects` tiene policies por rol
- [ ] Tabla `budgets.budgets` tiene policies por rol
- [ ] Tabla `hr.employees` tiene policies por rol
- [ ] 10+ tablas críticas con RLS implementado

### AC-003: Guards Funcionales
- [ ] `@Roles()` decorator implementado en backend
- [ ] Endpoints sensibles protegidos con guards
- [ ] Tests E2E validan autorización por rol

### AC-004: UI Adapta por Rol
- [ ] Dashboard muestra diferentes opciones según rol (7 variantes)
- [ ] Menú de navegación adapta según rol
- [ ] Componentes restringidos no se muestran a roles no autorizados

### AC-005: Auditoría
- [ ] Cambios de rol se auditan en `audit_logs`
- [ ] Timestamp, admin que realizó cambio, y justificación registrados

---

## 🧪 Testing

### Test Case 1: Residente NO puede ver presupuestos
```typescript
test('Resident cannot view budgets', async () => {
  const resident = await createUser({ role: 'resident' });
  const project = await createProject();

  await loginAs(resident);
  const response = await api.get(`/budgets/project/${project.id}`);

  expect(response.status).toBe(403); // Forbidden
});
```

### Test Case 2: Ingeniero puede crear presupuesto
```typescript
test('Engineer can create budget', async () => {
  const engineer = await createUser({ role: 'engineer' });
  const project = await createProject();

  await loginAs(engineer);
  const response = await api.post('/budgets', {
    project_id: project.id,
    name: 'Presupuesto base',
    total: 1000000
  });

  expect(response.status).toBe(201);
  expect(response.data.budget.id).toBeDefined();
});
```

### Test Case 3: Director tiene acceso completo
```typescript
test('Director can access all projects', async () => {
  const director = await createUser({ role: 'director' });
  await createMultipleProjects(5);

  await loginAs(director);
  const response = await api.get('/projects');

  expect(response.status).toBe(200);
  expect(response.data.projects.length).toBe(5);
});
```

---

## 📚 Referencias Adicionales

### Documentos Relacionados
- 📄 [RF-AUTH-002: Estados de Cuenta de Usuario](./RF-AUTH-002-estados-cuenta.md)
- 📄 [RF-AUTH-003: Multi-tenancy por Constructora](./RF-AUTH-003-multi-tenancy.md)
- 📐 [ET-AUTH-001: RBAC Implementation](../especificaciones/ET-AUTH-001-rbac.md)

### Estándares de Industria
- [NIST RBAC Model](https://csrc.nist.gov/projects/role-based-access-control)
- [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

---

## 📅 Historial de Cambios

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2025-11-17 | Tech Lead | Creación inicial basada en EAI-001/RF-AUTH-001 de GAMILIT |

---

**Documento:** `docs/01-fase-alcance-inicial/MAI-001-fundamentos/requerimientos/RF-AUTH-001-roles-construccion.md`
**Ruta relativa:** `MAI-001-fundamentos/requerimientos/RF-AUTH-001-roles-construccion.md`
**Épica:** MAI-001
**Sprint:** Sprint 1 (Semanas 2-3)
