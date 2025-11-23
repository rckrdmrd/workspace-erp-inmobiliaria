-- ============================================================================
-- ET-COST-001/002: Row-Level Security (RLS) Policies
-- Módulo: MAI-003 - Presupuestos y Costos
-- Tablas: budgets schema (todas las tablas del módulo)
-- Fecha: 2025-11-20
-- Descripción: Políticas de seguridad para aislamiento multi-tenant (constructora)
-- ============================================================================

-- ============================================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================================================

ALTER TABLE budgets.concept_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets.concept_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets.budget_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets.actual_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets.cost_variances ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets.cost_projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets.profitability_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets.prototype_profitability ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS RLS: CONCEPT_CATALOG (Catálogo de Conceptos)
-- ============================================================================

-- SELECT: Ver solo conceptos de la constructora actual
DROP POLICY IF EXISTS "concept_catalog_select_own_constructora" ON budgets.concept_catalog;
CREATE POLICY "concept_catalog_select_own_constructora"
ON budgets.concept_catalog FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

COMMENT ON POLICY "concept_catalog_select_own_constructora" ON budgets.concept_catalog IS
'Permite ver solo conceptos del catálogo de la constructora actual.
Aislamiento: tenant (constructora) level.';

-- INSERT: Crear conceptos solo para la constructora actual
DROP POLICY IF EXISTS "concept_catalog_insert_own_constructora" ON budgets.concept_catalog;
CREATE POLICY "concept_catalog_insert_own_constructora"
ON budgets.concept_catalog FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'budget_manager')
);

COMMENT ON POLICY "concept_catalog_insert_own_constructora" ON budgets.concept_catalog IS
'Permite crear conceptos solo para la constructora actual.
Roles permitidos: director, admin, engineer, budget_manager.';

-- UPDATE: Actualizar conceptos propios
DROP POLICY IF EXISTS "concept_catalog_update_own_constructora" ON budgets.concept_catalog;
CREATE POLICY "concept_catalog_update_own_constructora"
ON budgets.concept_catalog FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'budget_manager')
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- DELETE: Eliminar conceptos (solo admin/director, validar uso)
DROP POLICY IF EXISTS "concept_catalog_delete_own_constructora" ON budgets.concept_catalog;
CREATE POLICY "concept_catalog_delete_own_constructora"
ON budgets.concept_catalog FOR DELETE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- ============================================================================
-- POLÍTICAS RLS: CONCEPT_PRICE_HISTORY (Historial de Precios)
-- ============================================================================

-- SELECT: Ver historial mediante FK constraint validation
DROP POLICY IF EXISTS "concept_price_history_select_own" ON budgets.concept_price_history;
CREATE POLICY "concept_price_history_select_own"
ON budgets.concept_price_history FOR SELECT TO authenticated
USING (
  concept_id IN (
    SELECT id FROM budgets.concept_catalog
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

-- INSERT: Solo para conceptos propios
DROP POLICY IF EXISTS "concept_price_history_insert_own" ON budgets.concept_price_history;
CREATE POLICY "concept_price_history_insert_own"
ON budgets.concept_price_history FOR INSERT TO authenticated
WITH CHECK (
  concept_id IN (
    SELECT id FROM budgets.concept_catalog
    WHERE constructora_id = public.get_current_constructora_id()
  )
  AND public.get_current_user_role() IN ('director', 'admin', 'budget_manager')
);

-- UPDATE: Solo admin/director
DROP POLICY IF EXISTS "concept_price_history_update_own" ON budgets.concept_price_history;
CREATE POLICY "concept_price_history_update_own"
ON budgets.concept_price_history FOR UPDATE TO authenticated
USING (
  concept_id IN (
    SELECT id FROM budgets.concept_catalog
    WHERE constructora_id = public.get_current_constructora_id()
  )
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- ============================================================================
-- POLÍTICAS RLS: REGIONS (Regiones)
-- ============================================================================

-- SELECT: Ver solo regiones de la constructora
DROP POLICY IF EXISTS "regions_select_own_constructora" ON budgets.regions;
CREATE POLICY "regions_select_own_constructora"
ON budgets.regions FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

-- INSERT: Crear regiones
DROP POLICY IF EXISTS "regions_insert_own_constructora" ON budgets.regions;
CREATE POLICY "regions_insert_own_constructora"
ON budgets.regions FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- UPDATE: Actualizar regiones
DROP POLICY IF EXISTS "regions_update_own_constructora" ON budgets.regions;
CREATE POLICY "regions_update_own_constructora"
ON budgets.regions FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- DELETE: Eliminar regiones (validar no está en uso)
DROP POLICY IF EXISTS "regions_delete_own_constructora" ON budgets.regions;
CREATE POLICY "regions_delete_own_constructora"
ON budgets.regions FOR DELETE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- ============================================================================
-- POLÍTICAS RLS: BUDGETS (Presupuestos Maestros)
-- ============================================================================

-- SELECT: Ver presupuestos propios
DROP POLICY IF EXISTS "budgets_select_own_constructora" ON budgets.budgets;
CREATE POLICY "budgets_select_own_constructora"
ON budgets.budgets FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

COMMENT ON POLICY "budgets_select_own_constructora" ON budgets.budgets IS
'Permite ver solo presupuestos de la constructora actual.
Usado en: Listado de presupuestos, análisis de costos, reportes.';

-- INSERT: Crear presupuestos
DROP POLICY IF EXISTS "budgets_insert_own_constructora" ON budgets.budgets;
CREATE POLICY "budgets_insert_own_constructora"
ON budgets.budgets FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'budget_manager')
);

-- UPDATE: Actualizar presupuestos (según estado)
DROP POLICY IF EXISTS "budgets_update_own_constructora" ON budgets.budgets;
CREATE POLICY "budgets_update_own_constructora"
ON budgets.budgets FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND (
    -- Director/Admin: Full access
    public.get_current_user_role() IN ('director', 'admin')
    OR
    -- Budget Manager: Solo si está en draft
    (public.get_current_user_role() = 'budget_manager' AND status = 'draft')
  )
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

COMMENT ON POLICY "budgets_update_own_constructora" ON budgets.budgets IS
'Permisos diferenciados por rol:
- Director/Admin: Editar en cualquier estado
- Budget Manager: Solo en estado draft';

-- DELETE: Eliminar presupuestos (solo draft)
DROP POLICY IF EXISTS "budgets_delete_own_constructora" ON budgets.budgets;
CREATE POLICY "budgets_delete_own_constructora"
ON budgets.budgets FOR DELETE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
  AND status = 'draft'
);

-- ============================================================================
-- POLÍTICAS RLS: BUDGET_ITEMS (Partidas de Presupuesto)
-- ============================================================================

-- SELECT: Ver partidas de presupuestos propios
DROP POLICY IF EXISTS "budget_items_select_own" ON budgets.budget_items;
CREATE POLICY "budget_items_select_own"
ON budgets.budget_items FOR SELECT TO authenticated
USING (
  budget_id IN (
    SELECT id FROM budgets.budgets
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

-- INSERT: Crear partidas
DROP POLICY IF EXISTS "budget_items_insert_own" ON budgets.budget_items;
CREATE POLICY "budget_items_insert_own"
ON budgets.budget_items FOR INSERT TO authenticated
WITH CHECK (
  budget_id IN (
    SELECT id FROM budgets.budgets
    WHERE constructora_id = public.get_current_constructora_id()
  )
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'budget_manager')
);

-- UPDATE: Actualizar partidas
DROP POLICY IF EXISTS "budget_items_update_own" ON budgets.budget_items;
CREATE POLICY "budget_items_update_own"
ON budgets.budget_items FOR UPDATE TO authenticated
USING (
  budget_id IN (
    SELECT id FROM budgets.budgets
    WHERE constructora_id = public.get_current_constructora_id()
  )
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'budget_manager')
);

-- DELETE: Eliminar partidas
DROP POLICY IF EXISTS "budget_items_delete_own" ON budgets.budget_items;
CREATE POLICY "budget_items_delete_own"
ON budgets.budget_items FOR DELETE TO authenticated
USING (
  budget_id IN (
    SELECT id FROM budgets.budgets
    WHERE constructora_id = public.get_current_constructora_id()
      AND status = 'draft'
  )
  AND public.get_current_user_role() IN ('director', 'admin', 'budget_manager')
);

-- ============================================================================
-- POLÍTICAS RLS: BUDGET_VERSIONS (Versiones de Presupuesto)
-- ============================================================================

-- SELECT: Ver versiones
DROP POLICY IF EXISTS "budget_versions_select_own" ON budgets.budget_versions;
CREATE POLICY "budget_versions_select_own"
ON budgets.budget_versions FOR SELECT TO authenticated
USING (
  budget_id IN (
    SELECT id FROM budgets.budgets
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

-- INSERT: Crear versiones
DROP POLICY IF EXISTS "budget_versions_insert_own" ON budgets.budget_versions;
CREATE POLICY "budget_versions_insert_own"
ON budgets.budget_versions FOR INSERT TO authenticated
WITH CHECK (
  budget_id IN (
    SELECT id FROM budgets.budgets
    WHERE constructora_id = public.get_current_constructora_id()
  )
  AND public.get_current_user_role() IN ('director', 'admin', 'budget_manager')
);

-- UPDATE: Actualizar versiones (solo metadata)
DROP POLICY IF EXISTS "budget_versions_update_own" ON budgets.budget_versions;
CREATE POLICY "budget_versions_update_own"
ON budgets.budget_versions FOR UPDATE TO authenticated
USING (
  budget_id IN (
    SELECT id FROM budgets.budgets
    WHERE constructora_id = public.get_current_constructora_id()
  )
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- ============================================================================
-- POLÍTICAS RLS: ACTUAL_COSTS (Costos Reales)
-- ============================================================================

-- SELECT: Ver costos reales propios
DROP POLICY IF EXISTS "actual_costs_select_own" ON budgets.actual_costs;
CREATE POLICY "actual_costs_select_own"
ON budgets.actual_costs FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

-- INSERT: Registrar costos reales
DROP POLICY IF EXISTS "actual_costs_insert_own" ON budgets.actual_costs;
CREATE POLICY "actual_costs_insert_own"
ON budgets.actual_costs FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'resident', 'budget_manager')
);

-- UPDATE: Actualizar costos reales (correcciones)
DROP POLICY IF EXISTS "actual_costs_update_own" ON budgets.actual_costs;
CREATE POLICY "actual_costs_update_own"
ON budgets.actual_costs FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'budget_manager')
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- DELETE: Eliminar costos (solo admin, auditoría)
DROP POLICY IF EXISTS "actual_costs_delete_own" ON budgets.actual_costs;
CREATE POLICY "actual_costs_delete_own"
ON budgets.actual_costs FOR DELETE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('admin')
);

-- ============================================================================
-- POLÍTICAS RLS: COST_VARIANCES (Variaciones de Costo)
-- ============================================================================

-- SELECT: Ver variaciones propias
DROP POLICY IF EXISTS "cost_variances_select_own" ON budgets.cost_variances;
CREATE POLICY "cost_variances_select_own"
ON budgets.cost_variances FOR SELECT TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects.projects
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

-- Las demás operaciones son generadas automáticamente por triggers/funciones

-- ============================================================================
-- POLÍTICAS RLS: COST_PROJECTIONS (Proyecciones de Costo)
-- ============================================================================

-- SELECT: Ver proyecciones propias
DROP POLICY IF EXISTS "cost_projections_select_own" ON budgets.cost_projections;
CREATE POLICY "cost_projections_select_own"
ON budgets.cost_projections FOR SELECT TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects.projects
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

-- Las demás operaciones son calculadas automáticamente

-- ============================================================================
-- POLÍTICAS RLS: PROFITABILITY_ANALYSIS (Análisis de Rentabilidad)
-- ============================================================================

-- SELECT: Ver análisis propios
DROP POLICY IF EXISTS "profitability_analysis_select_own" ON budgets.profitability_analysis;
CREATE POLICY "profitability_analysis_select_own"
ON budgets.profitability_analysis FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

-- INSERT: Generar análisis
DROP POLICY IF EXISTS "profitability_analysis_insert_own" ON budgets.profitability_analysis;
CREATE POLICY "profitability_analysis_insert_own"
ON budgets.profitability_analysis FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'finance_manager')
);

-- ============================================================================
-- POLÍTICAS RLS: PROTOTYPE_PROFITABILITY (Rentabilidad por Prototipo)
-- ============================================================================

-- SELECT: Ver rentabilidad de prototipos propios
DROP POLICY IF EXISTS "prototype_profitability_select_own" ON budgets.prototype_profitability;
CREATE POLICY "prototype_profitability_select_own"
ON budgets.prototype_profitability FOR SELECT TO authenticated
USING (
  prototype_id IN (
    SELECT id FROM projects.housing_prototypes
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

-- ============================================================================
-- POLÍTICAS SUPER ADMIN (Bypass para soporte)
-- ============================================================================

-- Aplicar a todas las tablas
DO $$
DECLARE
  table_name TEXT;
  tables TEXT[] := ARRAY[
    'concept_catalog', 'concept_price_history', 'regions',
    'budgets', 'budget_items', 'budget_versions',
    'actual_costs', 'cost_variances', 'cost_projections',
    'profitability_analysis', 'prototype_profitability'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables
  LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS "%s_super_admin_all" ON budgets.%s;
      CREATE POLICY "%s_super_admin_all" ON budgets.%s
      FOR ALL TO authenticated
      USING (public.get_current_user_role() = ''super_admin'')
      WITH CHECK (public.get_current_user_role() = ''super_admin'');
    ', table_name, table_name, table_name, table_name);
  END LOOP;
END $$;

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_concept_catalog_constructora ON budgets.concept_catalog(constructora_id);
CREATE INDEX IF NOT EXISTS idx_concept_catalog_code ON budgets.concept_catalog(constructora_id, code);
CREATE INDEX IF NOT EXISTS idx_concept_catalog_category ON budgets.concept_catalog(constructora_id, category);

CREATE INDEX IF NOT EXISTS idx_regions_constructora ON budgets.regions(constructora_id);

CREATE INDEX IF NOT EXISTS idx_budgets_constructora ON budgets.budgets(constructora_id);
CREATE INDEX IF NOT EXISTS idx_budgets_project ON budgets.budgets(project_id);
CREATE INDEX IF NOT EXISTS idx_budgets_status ON budgets.budgets(constructora_id, status);

CREATE INDEX IF NOT EXISTS idx_budget_items_budget ON budgets.budget_items(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_concept ON budgets.budget_items(concept_id);

CREATE INDEX IF NOT EXISTS idx_actual_costs_constructora ON budgets.actual_costs(constructora_id);
CREATE INDEX IF NOT EXISTS idx_actual_costs_project ON budgets.actual_costs(project_id);
CREATE INDEX IF NOT EXISTS idx_actual_costs_date ON budgets.actual_costs(cost_date);

COMMENT ON INDEX budgets.idx_budgets_constructora IS
'Optimiza queries RLS filtrados por constructora_id.';

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA budgets TO authenticated;
GRANT USAGE ON SCHEMA budgets TO authenticated;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

DO $$
DECLARE
  v_tables TEXT[] := ARRAY[
    'concept_catalog', 'budgets', 'budget_items', 'actual_costs', 'cost_variances'
  ];
  v_table TEXT;
  v_rls_enabled BOOLEAN;
  v_policy_count INTEGER;
BEGIN
  FOREACH v_table IN ARRAY v_tables
  LOOP
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class
    WHERE relname = v_table AND relnamespace = 'budgets'::regnamespace;

    SELECT COUNT(*) INTO v_policy_count
    FROM pg_policies
    WHERE schemaname = 'budgets' AND tablename = v_table;

    IF NOT v_rls_enabled THEN
      RAISE EXCEPTION 'CRITICAL: RLS no habilitado en budgets.%', v_table;
    END IF;

    IF v_policy_count < 1 THEN
      RAISE WARNING 'budgets.%: Solo % políticas', v_table, v_policy_count;
    END IF;

    RAISE NOTICE '✓ budgets.%: RLS habilitado con % políticas', v_table, v_policy_count;
  END LOOP;

  RAISE NOTICE '✓ Módulo MAI-003: Todas las tablas tienen RLS habilitado';
END $$;
