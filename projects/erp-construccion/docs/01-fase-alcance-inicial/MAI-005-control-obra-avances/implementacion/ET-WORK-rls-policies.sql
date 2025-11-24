-- ============================================================================
-- ET-WORK: Row-Level Security (RLS) Policies
-- Módulo: MAI-005 - Control de Obra y Avances
-- Tablas: work_control schema (todas las tablas del módulo)
-- Fecha: 2025-11-20
-- Descripción: Políticas de seguridad para aislamiento multi-tenant (constructora)
-- ============================================================================

-- ============================================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================================================

ALTER TABLE work_control.work_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_control.daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_control.work_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_control.quality_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_control.checkpoint_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_control.material_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_control.labor_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_control.equipment_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_control.weather_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_control.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_control.delays ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_control.rfi_requests ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS RLS: WORK_PROGRESS (Avances de Obra)
-- ============================================================================

DROP POLICY IF EXISTS "work_progress_select_own" ON work_control.work_progress;
CREATE POLICY "work_progress_select_own"
ON work_control.work_progress FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

COMMENT ON POLICY "work_progress_select_own" ON work_control.work_progress IS
'Permite ver solo avances de obra de la constructora actual.
Usado en: Dashboard de avances, curva S, reportes de progreso.';

DROP POLICY IF EXISTS "work_progress_insert_own" ON work_control.work_progress;
CREATE POLICY "work_progress_insert_own"
ON work_control.work_progress FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'resident')
);

DROP POLICY IF EXISTS "work_progress_update_own" ON work_control.work_progress;
CREATE POLICY "work_progress_update_own"
ON work_control.work_progress FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'resident')
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "work_progress_delete_own" ON work_control.work_progress;
CREATE POLICY "work_progress_delete_own"
ON work_control.work_progress FOR DELETE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- ============================================================================
-- POLÍTICAS RLS: DAILY_REPORTS (Reportes Diarios)
-- ============================================================================

DROP POLICY IF EXISTS "daily_reports_select_own" ON work_control.daily_reports;
CREATE POLICY "daily_reports_select_own"
ON work_control.daily_reports FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "daily_reports_insert_own" ON work_control.daily_reports;
CREATE POLICY "daily_reports_insert_own"
ON work_control.daily_reports FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'resident', 'supervisor')
);

COMMENT ON POLICY "daily_reports_insert_own" ON work_control.daily_reports IS
'Permite crear reportes diarios a personal de campo.
Roles: director, admin, engineer, resident, supervisor.';

DROP POLICY IF EXISTS "daily_reports_update_own" ON work_control.daily_reports;
CREATE POLICY "daily_reports_update_own"
ON work_control.daily_reports FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND (
    -- Creador puede editar mismo día
    (created_by = public.get_current_user_id() AND created_at::date = CURRENT_DATE)
    OR
    -- Director/Admin siempre
    public.get_current_user_role() IN ('director', 'admin')
  )
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- ============================================================================
-- POLÍTICAS RLS: WORK_PHOTOS (Fotos de Obra)
-- ============================================================================

DROP POLICY IF EXISTS "work_photos_select_own" ON work_control.work_photos;
CREATE POLICY "work_photos_select_own"
ON work_control.work_photos FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "work_photos_insert_own" ON work_control.work_photos;
CREATE POLICY "work_photos_insert_own"
ON work_control.work_photos FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
);

COMMENT ON POLICY "work_photos_insert_own" ON work_control.work_photos IS
'Todos los usuarios pueden subir fotos de obra (con geolocalización).';

DROP POLICY IF EXISTS "work_photos_delete_own" ON work_control.work_photos;
CREATE POLICY "work_photos_delete_own"
ON work_control.work_photos FOR DELETE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND (
    created_by = public.get_current_user_id()
    OR public.get_current_user_role() IN ('director', 'admin')
  )
);

-- ============================================================================
-- POLÍTICAS RLS: QUALITY_CHECKPOINTS (Puntos de Control de Calidad)
-- ============================================================================

DROP POLICY IF EXISTS "checkpoints_select_own" ON work_control.quality_checkpoints;
CREATE POLICY "checkpoints_select_own"
ON work_control.quality_checkpoints FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "checkpoints_insert_own" ON work_control.quality_checkpoints;
CREATE POLICY "checkpoints_insert_own"
ON work_control.quality_checkpoints FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer')
);

DROP POLICY IF EXISTS "checkpoints_update_own" ON work_control.quality_checkpoints;
CREATE POLICY "checkpoints_update_own"
ON work_control.quality_checkpoints FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer')
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- ============================================================================
-- POLÍTICAS RLS: CHECKPOINT_INSPECTIONS (Inspecciones de Calidad)
-- ============================================================================

DROP POLICY IF EXISTS "inspections_select_own" ON work_control.checkpoint_inspections;
CREATE POLICY "inspections_select_own"
ON work_control.checkpoint_inspections FOR SELECT TO authenticated
USING (
  checkpoint_id IN (
    SELECT id FROM work_control.quality_checkpoints
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

DROP POLICY IF EXISTS "inspections_insert_own" ON work_control.checkpoint_inspections;
CREATE POLICY "inspections_insert_own"
ON work_control.checkpoint_inspections FOR INSERT TO authenticated
WITH CHECK (
  checkpoint_id IN (
    SELECT id FROM work_control.quality_checkpoints
    WHERE constructora_id = public.get_current_constructora_id()
  )
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'resident', 'supervisor')
);

-- ============================================================================
-- POLÍTICAS RLS: MATERIAL_CONSUMPTION (Consumo de Materiales)
-- ============================================================================

DROP POLICY IF EXISTS "material_consumption_select_own" ON work_control.material_consumption;
CREATE POLICY "material_consumption_select_own"
ON work_control.material_consumption FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "material_consumption_insert_own" ON work_control.material_consumption;
CREATE POLICY "material_consumption_insert_own"
ON work_control.material_consumption FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'resident', 'warehouse_manager')
);

COMMENT ON POLICY "material_consumption_insert_own" ON work_control.material_consumption IS
'Permite registrar consumo de materiales en obra.
Integración: Actualiza inventario y costos reales.';

-- ============================================================================
-- POLÍTICAS RLS: LABOR_TRACKING (Seguimiento de Mano de Obra)
-- ============================================================================

DROP POLICY IF EXISTS "labor_tracking_select_own" ON work_control.labor_tracking;
CREATE POLICY "labor_tracking_select_own"
ON work_control.labor_tracking FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "labor_tracking_insert_own" ON work_control.labor_tracking;
CREATE POLICY "labor_tracking_insert_own"
ON work_control.labor_tracking FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'resident', 'supervisor')
);

-- ============================================================================
-- POLÍTICAS RLS: EQUIPMENT_USAGE (Uso de Maquinaria)
-- ============================================================================

DROP POLICY IF EXISTS "equipment_usage_select_own" ON work_control.equipment_usage;
CREATE POLICY "equipment_usage_select_own"
ON work_control.equipment_usage FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "equipment_usage_insert_own" ON work_control.equipment_usage;
CREATE POLICY "equipment_usage_insert_own"
ON work_control.equipment_usage FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'resident')
);

-- ============================================================================
-- POLÍTICAS RLS: WEATHER_CONDITIONS (Condiciones Climáticas)
-- ============================================================================

DROP POLICY IF EXISTS "weather_select_own" ON work_control.weather_conditions;
CREATE POLICY "weather_select_own"
ON work_control.weather_conditions FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "weather_insert_own" ON work_control.weather_conditions;
CREATE POLICY "weather_insert_own"
ON work_control.weather_conditions FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
);

COMMENT ON POLICY "weather_insert_own" ON work_control.weather_conditions IS
'Registro automático o manual de condiciones climáticas.
Usado para: Justificación de retrasos, análisis de productividad.';

-- ============================================================================
-- POLÍTICAS RLS: INCIDENTS (Incidentes)
-- ============================================================================

DROP POLICY IF EXISTS "incidents_select_own" ON work_control.incidents;
CREATE POLICY "incidents_select_own"
ON work_control.incidents FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "incidents_insert_own" ON work_control.incidents;
CREATE POLICY "incidents_insert_own"
ON work_control.incidents FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
);

DROP POLICY IF EXISTS "incidents_update_own" ON work_control.incidents;
CREATE POLICY "incidents_update_own"
ON work_control.incidents FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'resident')
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- ============================================================================
-- POLÍTICAS RLS: DELAYS (Retrasos)
-- ============================================================================

DROP POLICY IF EXISTS "delays_select_own" ON work_control.delays;
CREATE POLICY "delays_select_own"
ON work_control.delays FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "delays_insert_own" ON work_control.delays;
CREATE POLICY "delays_insert_own"
ON work_control.delays FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'resident')
);

-- ============================================================================
-- POLÍTICAS RLS: RFI_REQUESTS (Solicitudes de Información)
-- ============================================================================

DROP POLICY IF EXISTS "rfi_select_own" ON work_control.rfi_requests;
CREATE POLICY "rfi_select_own"
ON work_control.rfi_requests FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "rfi_insert_own" ON work_control.rfi_requests;
CREATE POLICY "rfi_insert_own"
ON work_control.rfi_requests FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
);

DROP POLICY IF EXISTS "rfi_update_own" ON work_control.rfi_requests;
CREATE POLICY "rfi_update_own"
ON work_control.rfi_requests FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND (
    created_by = public.get_current_user_id()
    OR public.get_current_user_role() IN ('director', 'admin', 'engineer')
  )
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- ============================================================================
-- POLÍTICAS SUPER ADMIN
-- ============================================================================

DO $$
DECLARE
  table_name TEXT;
  tables TEXT[] := ARRAY[
    'work_progress', 'daily_reports', 'work_photos', 'quality_checkpoints',
    'checkpoint_inspections', 'material_consumption', 'labor_tracking',
    'equipment_usage', 'weather_conditions', 'incidents', 'delays', 'rfi_requests'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables
  LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS "%s_super_admin_all" ON work_control.%s;
      CREATE POLICY "%s_super_admin_all" ON work_control.%s
      FOR ALL TO authenticated
      USING (public.get_current_user_role() = ''super_admin'')
      WITH CHECK (public.get_current_user_role() = ''super_admin'');
    ', table_name, table_name, table_name, table_name);
  END LOOP;
END $$;

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_work_progress_constructora ON work_control.work_progress(constructora_id);
CREATE INDEX IF NOT EXISTS idx_work_progress_housing_unit ON work_control.work_progress(housing_unit_id);
CREATE INDEX IF NOT EXISTS idx_work_progress_date ON work_control.work_progress(progress_date);

CREATE INDEX IF NOT EXISTS idx_daily_reports_constructora ON work_control.daily_reports(constructora_id);
CREATE INDEX IF NOT EXISTS idx_daily_reports_project ON work_control.daily_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_daily_reports_date ON work_control.daily_reports(report_date);

CREATE INDEX IF NOT EXISTS idx_work_photos_constructora ON work_control.work_photos(constructora_id);
CREATE INDEX IF NOT EXISTS idx_work_photos_entity ON work_control.work_photos(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_material_consumption_constructora ON work_control.material_consumption(constructora_id);
CREATE INDEX IF NOT EXISTS idx_material_consumption_item ON work_control.material_consumption(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_material_consumption_date ON work_control.material_consumption(consumption_date);

COMMENT ON INDEX work_control.idx_work_progress_constructora IS
'Optimiza queries RLS filtrados por constructora_id.';

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA work_control TO authenticated;
GRANT USAGE ON SCHEMA work_control TO authenticated;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

DO $$
DECLARE
  v_tables TEXT[] := ARRAY[
    'work_progress', 'daily_reports', 'work_photos',
    'material_consumption', 'quality_checkpoints', 'incidents'
  ];
  v_table TEXT;
  v_rls_enabled BOOLEAN;
  v_policy_count INTEGER;
BEGIN
  FOREACH v_table IN ARRAY v_tables
  LOOP
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class
    WHERE relname = v_table AND relnamespace = 'work_control'::regnamespace;

    SELECT COUNT(*) INTO v_policy_count
    FROM pg_policies
    WHERE schemaname = 'work_control' AND tablename = v_table;

    IF NOT v_rls_enabled THEN
      RAISE EXCEPTION 'CRITICAL: RLS no habilitado en work_control.%', v_table;
    END IF;

    RAISE NOTICE '✓ work_control.%: RLS habilitado con % políticas', v_table, v_policy_count;
  END LOOP;

  RAISE NOTICE '✓ Módulo MAI-005: Todas las tablas tienen RLS habilitado';
END $$;
