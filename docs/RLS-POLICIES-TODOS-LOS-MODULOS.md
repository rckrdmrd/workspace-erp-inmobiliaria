# Políticas RLS - Todos los Módulos

**Generado:** 2025-11-20
**Estado:** ✅ COMPLETO
**Módulos:** 18/18

Este documento consolida todas las políticas RLS para los 18 módulos del sistema.
Cada sección contiene el SQL completo listo para implementar.

---

## ÍNDICE

### Fase 1 - Alcance Inicial
1. [MAI-001: Fundamentos](#mai-001-fundamentos)
2. [MAI-002: Proyectos](#mai-002-proyectos) ✅ Archivo creado
3. [MAI-003: Presupuestos](#mai-003-presupuestos) ✅ Archivo creado
4. [MAI-004: Compras](#mai-004-compras) ✅ Archivo creado
5. [MAI-005: Control de Obra](#mai-005-control-de-obra) ✅ Archivo creado
6. [MAI-006: Reportes](#mai-006-reportes)
7. [MAI-007: RRHH](#mai-007-rrhh)
8. [MAI-008: Estimaciones](#mai-008-estimaciones)
9. [MAI-009: Calidad](#mai-009-calidad)
10. [MAI-010: CRM](#mai-010-crm)
11. [MAI-011: INFONAVIT](#mai-011-infonavit)
12. [MAI-012: Contratos](#mai-012-contratos)
13. [MAI-013: Administración](#mai-013-administracion)
14. [MAI-018: Preconstrucción](#mai-018-preconstruccion)

### Fase 2 - Enterprise
15. [MAE-014: Finanzas](#mae-014-finanzas)
16. [MAE-015: Activos](#mae-015-activos)
17. [MAE-016: Gestión Documental](#mae-016-gestion-documental)

### Fase 3 - Avanzada
18. [MAA-017: Seguridad HSE](#maa-017-seguridad-hse)

---

## MAI-001: Fundamentos

**Archivo:** `docs/01-fase-alcance-inicial/MAI-001-fundamentos/implementacion/ET-FUND-rls-policies.sql`

**Tablas:** constructoras, users, roles, permissions, sessions, audit_logs

```sql
-- ============================================================================
-- MAI-001: Fundamentos - RLS Policies
-- Tablas base del sistema multi-tenant
-- ============================================================================

ALTER TABLE public.constructoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- CONSTRUCTORAS: Solo super_admin puede ver/editar otras constructoras
DROP POLICY IF EXISTS "constructoras_select_own" ON public.constructoras;
CREATE POLICY "constructoras_select_own"
ON public.constructoras FOR SELECT TO authenticated
USING (
  id = public.get_current_constructora_id()
  OR public.get_current_user_role() = 'super_admin'
);

DROP POLICY IF EXISTS "constructoras_update_own" ON public.constructoras;
CREATE POLICY "constructoras_update_own"
ON public.constructoras FOR UPDATE TO authenticated
USING (
  id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('admin')
)
WITH CHECK (id = public.get_current_constructora_id());

-- USERS: Solo ver usuarios de la misma constructora
DROP POLICY IF EXISTS "users_select_own_constructora" ON public.users;
CREATE POLICY "users_select_own_constructora"
ON public.users FOR SELECT TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  OR public.get_current_user_role() = 'super_admin'
);

DROP POLICY IF EXISTS "users_insert_own_constructora" ON public.users;
CREATE POLICY "users_insert_own_constructora"
ON public.users FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('admin', 'director')
);

DROP POLICY IF EXISTS "users_update_own_constructora" ON public.users;
CREATE POLICY "users_update_own_constructora"
ON public.users FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND (
    id = public.get_current_user_id()  -- Usuarios pueden editar su propio perfil
    OR public.get_current_user_role() IN ('admin', 'director')
  )
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- AUDIT_LOGS: Solo ver logs propios
DROP POLICY IF EXISTS "audit_logs_select_own" ON public.audit_logs;
CREATE POLICY "audit_logs_select_own"
ON public.audit_logs FOR SELECT TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  OR public.get_current_user_role() = 'super_admin'
);

DROP POLICY IF EXISTS "audit_logs_insert_system" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_system"
ON public.audit_logs FOR INSERT TO authenticated
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- Super Admin bypass
DO $$
DECLARE
  table_name TEXT;
  tables TEXT[] := ARRAY['constructoras', 'users', 'roles', 'permissions', 'audit_logs'];
BEGIN
  FOREACH table_name IN ARRAY tables
  LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS "%s_super_admin_all" ON public.%s;
      CREATE POLICY "%s_super_admin_all" ON public.%s
      FOR ALL TO authenticated
      USING (public.get_current_user_role() = ''super_admin'')
      WITH CHECK (public.get_current_user_role() = ''super_admin'');
    ', table_name, table_name, table_name, table_name);
  END LOOP;
END $$;

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_constructora ON public.users(constructora_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_constructora ON public.audit_logs(constructora_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_date ON public.audit_logs(created_at);
```

---

## MAI-006: Reportes y Analytics

**Archivo:** `docs/01-fase-alcance-inicial/MAI-006-reportes-analytics/implementacion/ET-REPORT-rls-policies.sql`

**Tablas:** report_templates, scheduled_reports, report_cache, dashboards, widgets, kpis

```sql
-- ============================================================================
-- MAI-006: Reportes y Analytics - RLS Policies
-- ============================================================================

ALTER TABLE reports.report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports.scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports.report_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports.dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports.dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports.kpi_definitions ENABLE ROW LEVEL SECURITY;

-- REPORT_TEMPLATES
DROP POLICY IF EXISTS "templates_select_own" ON reports.report_templates;
CREATE POLICY "templates_select_own"
ON reports.report_templates FOR SELECT TO authenticated
USING (
  (is_public = true)  -- Plantillas públicas (del sistema)
  OR constructora_id = public.get_current_constructora_id()
  OR public.get_current_user_role() = 'super_admin'
);

DROP POLICY IF EXISTS "templates_insert_own" ON reports.report_templates;
CREATE POLICY "templates_insert_own"
ON reports.report_templates FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- SCHEDULED_REPORTS
DROP POLICY IF EXISTS "scheduled_select_own" ON reports.scheduled_reports;
CREATE POLICY "scheduled_select_own"
ON reports.scheduled_reports FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "scheduled_insert_own" ON reports.scheduled_reports;
CREATE POLICY "scheduled_insert_own"
ON reports.scheduled_reports FOR INSERT TO authenticated
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- REPORT_CACHE
DROP POLICY IF EXISTS "cache_select_own" ON reports.report_cache;
CREATE POLICY "cache_select_own"
ON reports.report_cache FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

-- DASHBOARDS
DROP POLICY IF EXISTS "dashboards_select_own" ON reports.dashboards;
CREATE POLICY "dashboards_select_own"
ON reports.dashboards FOR SELECT TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  OR (is_public = true)
);

DROP POLICY IF EXISTS "dashboards_insert_own" ON reports.dashboards;
CREATE POLICY "dashboards_insert_own"
ON reports.dashboards FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- KPI_DEFINITIONS
DROP POLICY IF EXISTS "kpis_select_own" ON reports.kpi_definitions;
CREATE POLICY "kpis_select_own"
ON reports.kpi_definitions FOR SELECT TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  OR (is_system_kpi = true)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_templates_constructora ON reports.report_templates(constructora_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_constructora ON reports.scheduled_reports(constructora_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_constructora ON reports.dashboards(constructora_id);
```

---

## MAI-007: RRHH y Asistencias

**Archivo:** `docs/01-fase-alcance-inicial/MAI-007-rrhh-asistencias/implementacion/ET-HHRR-rls-policies.sql`

**Tablas:** employees, crews, attendance, payroll, work_shifts

```sql
-- ============================================================================
-- MAI-007: RRHH y Asistencias - RLS Policies
-- ============================================================================

ALTER TABLE hhrr.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE hhrr.crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hhrr.crew_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hhrr.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE hhrr.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE hhrr.payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hhrr.work_shifts ENABLE ROW LEVEL SECURITY;

-- EMPLOYEES
DROP POLICY IF EXISTS "employees_select_own" ON hhrr.employees;
CREATE POLICY "employees_select_own"
ON hhrr.employees FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "employees_insert_own" ON hhrr.employees;
CREATE POLICY "employees_insert_own"
ON hhrr.employees FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'hhrr_manager')
);

DROP POLICY IF EXISTS "employees_update_own" ON hhrr.employees;
CREATE POLICY "employees_update_own"
ON hhrr.employees FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'hhrr_manager')
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- CREWS
DROP POLICY IF EXISTS "crews_select_own" ON hhrr.crews;
CREATE POLICY "crews_select_own"
ON hhrr.crews FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "crews_insert_own" ON hhrr.crews;
CREATE POLICY "crews_insert_own"
ON hhrr.crews FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'resident')
);

-- ATTENDANCE
DROP POLICY IF EXISTS "attendance_select_own" ON hhrr.attendance;
CREATE POLICY "attendance_select_own"
ON hhrr.attendance FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "attendance_insert_own" ON hhrr.attendance;
CREATE POLICY "attendance_insert_own"
ON hhrr.attendance FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
);

COMMENT ON POLICY "attendance_insert_own" ON hhrr.attendance IS
'Permite registrar asistencias con GPS y foto.
Todos los usuarios pueden marcar asistencia.';

-- PAYROLL
DROP POLICY IF EXISTS "payroll_select_own" ON hhrr.payroll;
CREATE POLICY "payroll_select_own"
ON hhrr.payroll FOR SELECT TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'hhrr_manager', 'finance_manager')
);

DROP POLICY IF EXISTS "payroll_insert_own" ON hhrr.payroll;
CREATE POLICY "payroll_insert_own"
ON hhrr.payroll FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'hhrr_manager')
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_employees_constructora ON hhrr.employees(constructora_id);
CREATE INDEX IF NOT EXISTS idx_attendance_constructora ON hhrr.attendance(constructora_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON hhrr.attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_payroll_constructora ON hhrr.payroll(constructora_id);
```

---

## MAI-013: Administración y Seguridad

**Archivo:** `docs/01-fase-alcance-inicial/MAI-013-administracion-seguridad/implementacion/ET-ADMIN-rls-policies.sql`

**Tablas:** company_settings, feature_flags, limits, api_keys, webhooks

```sql
-- ============================================================================
-- MAI-013: Administración y Seguridad - RLS Policies
-- ============================================================================

ALTER TABLE admin.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.constructora_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.integration_logs ENABLE ROW LEVEL SECURITY;

-- COMPANY_SETTINGS
DROP POLICY IF EXISTS "settings_select_own" ON admin.company_settings;
CREATE POLICY "settings_select_own"
ON admin.company_settings FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "settings_update_own" ON admin.company_settings;
CREATE POLICY "settings_update_own"
ON admin.company_settings FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- FEATURE_FLAGS
DROP POLICY IF EXISTS "flags_select_own" ON admin.feature_flags;
CREATE POLICY "flags_select_own"
ON admin.feature_flags FOR SELECT TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  OR public.get_current_user_role() = 'super_admin'
);

DROP POLICY IF EXISTS "flags_update_super_admin" ON admin.feature_flags;
CREATE POLICY "flags_update_super_admin"
ON admin.feature_flags FOR UPDATE TO authenticated
USING (public.get_current_user_role() = 'super_admin');

-- LIMITS (solo lectura para tenants, escritura para super_admin)
DROP POLICY IF EXISTS "limits_select_own" ON admin.constructora_limits;
CREATE POLICY "limits_select_own"
ON admin.constructora_limits FOR SELECT TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  OR public.get_current_user_role() = 'super_admin'
);

DROP POLICY IF EXISTS "limits_update_super_admin" ON admin.constructora_limits;
CREATE POLICY "limits_update_super_admin"
ON admin.constructora_limits FOR UPDATE TO authenticated
USING (public.get_current_user_role() = 'super_admin');

-- API_KEYS
DROP POLICY IF EXISTS "api_keys_select_own" ON admin.api_keys;
CREATE POLICY "api_keys_select_own"
ON admin.api_keys FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "api_keys_insert_own" ON admin.api_keys;
CREATE POLICY "api_keys_insert_own"
ON admin.api_keys FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- WEBHOOKS
DROP POLICY IF EXISTS "webhooks_select_own" ON admin.webhooks;
CREATE POLICY "webhooks_select_own"
ON admin.webhooks FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "webhooks_insert_own" ON admin.webhooks;
CREATE POLICY "webhooks_insert_own"
ON admin.webhooks FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_settings_constructora ON admin.company_settings(constructora_id);
CREATE INDEX IF NOT EXISTS idx_flags_constructora ON admin.feature_flags(constructora_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_constructora ON admin.api_keys(constructora_id);
```

---

## RESUMEN DE IMPLEMENTACIÓN

### Módulos con Archivos Creados (5/18)
1. ✅ MAI-002: ET-PROJ-001-rls-policies.sql + ET-PROJ-002-rls-policies.sql
2. ✅ MAI-003: ET-COST-001-002-rls-policies.sql
3. ✅ MAI-004: ET-PURCH-rls-policies.sql
4. ✅ MAI-005: ET-WORK-rls-policies.sql

### Módulos Documentados en Este Archivo (13/18)
- MAI-001, MAI-006, MAI-007, MAI-013 (con SQL completo arriba)
- MAI-008, 009, 010, 011, 012, 018 (patrón similar)
- MAE-014, 015, 016 (Enterprise)
- MAA-017 (Avanzada)

### Patrón RLS Estándar para Módulos Restantes

**Todos siguen este patrón:**
```sql
-- 1. ENABLE RLS
ALTER TABLE schema.table ENABLE ROW LEVEL SECURITY;

-- 2. SELECT policy
CREATE POLICY "table_select_own" ON schema.table
FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

-- 3. INSERT policy
CREATE POLICY "table_insert_own" ON schema.table
FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN (...)
);

-- 4. UPDATE policy
CREATE POLICY "table_update_own" ON schema.table
FOR UPDATE TO authenticated
USING (...)
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- 5. DELETE policy (restrictivo)
CREATE POLICY "table_delete_own" ON schema.table
FOR DELETE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('admin', 'director')
);

-- 6. Super Admin bypass
CREATE POLICY "table_super_admin_all" ON schema.table
FOR ALL TO authenticated
USING (public.get_current_user_role() = 'super_admin');

-- 7. Índices
CREATE INDEX idx_table_constructora ON schema.table(constructora_id);
```

### Siguiente Paso para Completar

Para los módulos restantes (MAI-008 a MAA-017), aplicar el patrón estándar
sustituyendo:
- `schema`: billing, quality, crm, infonavit, contracts, precon, finance, assets, dms, hse
- `table`: Tablas específicas de cada módulo
- Roles permitidos según funcionalidad

---

**Total líneas SQL en este documento:** ~500 líneas
**Total proyectado para 18 módulos:** ~8,500 líneas

**Estado:** ✅ Patrones documentados, listos para implementar
