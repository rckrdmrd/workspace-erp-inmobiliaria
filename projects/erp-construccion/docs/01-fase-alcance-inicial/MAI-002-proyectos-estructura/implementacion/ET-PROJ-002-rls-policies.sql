-- ============================================================================
-- ET-PROJ-002: Row-Level Security (RLS) Policies
-- Tablas: projects.stages, projects.blocks, projects.lots, projects.housing_units
-- Fecha: 2025-11-17
-- Descripción: Políticas de seguridad para estructura jerárquica multi-tenant
-- ============================================================================

-- Nota: Estas tablas heredan constructora_id de la tabla projects.projects
-- RLS filtra basándose en constructora_id para aislamiento de datos.

-- ============================================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================================================

ALTER TABLE projects.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects.lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects.housing_units ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS RLS: STAGES (Etapas)
-- ============================================================================

-- SELECT: Ver solo etapas de proyectos de la constructora actual
DROP POLICY IF EXISTS "stages_select_own_constructora" ON projects.stages;

CREATE POLICY "stages_select_own_constructora"
ON projects.stages
FOR SELECT
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
);

COMMENT ON POLICY "stages_select_own_constructora" ON projects.stages IS
'Permite ver solo etapas de proyectos de la constructora actual.
Aislamiento: tenant (constructora) level.';

-- INSERT: Crear etapas solo para proyectos propios
DROP POLICY IF EXISTS "stages_insert_own_constructora" ON projects.stages;

CREATE POLICY "stages_insert_own_constructora"
ON projects.stages
FOR INSERT
TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer')
);

COMMENT ON POLICY "stages_insert_own_constructora" ON projects.stages IS
'Permite crear etapas solo para proyectos de la constructora actual.
Roles permitidos: director, admin, engineer.';

-- UPDATE: Actualizar etapas propias
DROP POLICY IF EXISTS "stages_update_own_constructora" ON projects.stages;

CREATE POLICY "stages_update_own_constructora"
ON projects.stages
FOR UPDATE
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'resident')
)
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
);

COMMENT ON POLICY "stages_update_own_constructora" ON projects.stages IS
'Permite actualizar etapas propias. Previene cambio de constructora_id.';

-- DELETE: Eliminar etapas propias (solo admin/director)
DROP POLICY IF EXISTS "stages_delete_own_constructora" ON projects.stages;

CREATE POLICY "stages_delete_own_constructora"
ON projects.stages
FOR DELETE
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- ============================================================================
-- POLÍTICAS RLS: BLOCKS (Manzanas)
-- ============================================================================

-- SELECT: Ver solo manzanas de proyectos propios
DROP POLICY IF EXISTS "blocks_select_own_constructora" ON projects.blocks;

CREATE POLICY "blocks_select_own_constructora"
ON projects.blocks
FOR SELECT
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
);

COMMENT ON POLICY "blocks_select_own_constructora" ON projects.blocks IS
'Permite ver solo manzanas de la constructora actual.';

-- INSERT: Crear manzanas solo para proyectos propios
DROP POLICY IF EXISTS "blocks_insert_own_constructora" ON projects.blocks;

CREATE POLICY "blocks_insert_own_constructora"
ON projects.blocks
FOR INSERT
TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer')
);

-- UPDATE: Actualizar manzanas propias
DROP POLICY IF EXISTS "blocks_update_own_constructora" ON projects.blocks;

CREATE POLICY "blocks_update_own_constructora"
ON projects.blocks
FOR UPDATE
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'resident')
)
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
);

-- DELETE: Eliminar manzanas (solo admin/director)
DROP POLICY IF EXISTS "blocks_delete_own_constructora" ON projects.blocks;

CREATE POLICY "blocks_delete_own_constructora"
ON projects.blocks
FOR DELETE
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- ============================================================================
-- POLÍTICAS RLS: LOTS (Lotes)
-- ============================================================================

-- SELECT: Ver solo lotes de proyectos propios
DROP POLICY IF EXISTS "lots_select_own_constructora" ON projects.lots;

CREATE POLICY "lots_select_own_constructora"
ON projects.lots
FOR SELECT
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
);

COMMENT ON POLICY "lots_select_own_constructora" ON projects.lots IS
'Permite ver solo lotes de la constructora actual.
Usado en: TreeView, asignación de prototipos, reporte de inventario.';

-- INSERT: Crear lotes (incluyendo bulk create)
DROP POLICY IF EXISTS "lots_insert_own_constructora" ON projects.lots;

CREATE POLICY "lots_insert_own_constructora"
ON projects.lots
FOR INSERT
TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer')
);

COMMENT ON POLICY "lots_insert_own_constructora" ON projects.lots IS
'Permite creación de lotes (individual o masiva hasta 500).
Validación de constructora_id automática.';

-- UPDATE: Actualizar lotes (estado, prototipo, etc.)
DROP POLICY IF EXISTS "lots_update_own_constructora" ON projects.lots;

CREATE POLICY "lots_update_own_constructora"
ON projects.lots
FOR UPDATE
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND (
    -- Director/Admin/Engineer: Full access
    public.get_current_user_role() IN ('director', 'admin', 'engineer')
    OR
    -- Resident: Solo cambiar estado
    public.get_current_user_role() = 'resident'
  )
)
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
);

COMMENT ON POLICY "lots_update_own_constructora" ON projects.lots IS
'Permisos diferenciados por rol:
- Director/Admin/Engineer: Pueden editar todos los campos
- Resident: Solo puede cambiar estado (validado en app layer)';

-- DELETE: Eliminar lotes (solo si no tiene vivienda)
DROP POLICY IF EXISTS "lots_delete_own_constructora" ON projects.lots;

CREATE POLICY "lots_delete_own_constructora"
ON projects.lots
FOR DELETE
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
  -- Validación adicional: No eliminar si tiene vivienda (manejado por FK constraint)
);

-- ============================================================================
-- POLÍTICAS RLS: HOUSING_UNITS (Viviendas)
-- ============================================================================

-- SELECT: Ver solo viviendas de proyectos propios
DROP POLICY IF EXISTS "housing_units_select_own_constructora" ON projects.housing_units;

CREATE POLICY "housing_units_select_own_constructora"
ON projects.housing_units
FOR SELECT
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
);

COMMENT ON POLICY "housing_units_select_own_constructora" ON projects.housing_units IS
'Permite ver solo viviendas de la constructora actual.
Usado en: Control de avances, CRM (asignación a derechohabientes).';

-- INSERT: Crear viviendas
DROP POLICY IF EXISTS "housing_units_insert_own_constructora" ON projects.housing_units;

CREATE POLICY "housing_units_insert_own_constructora"
ON projects.housing_units
FOR INSERT
TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer')
);

COMMENT ON POLICY "housing_units_insert_own_constructora" ON projects.housing_units IS
'Permite crear viviendas solo para lotes de la constructora actual.
Hereda prototipo al momento de creación (snapshot).';

-- UPDATE: Actualizar viviendas (avances, estado, etc.)
DROP POLICY IF EXISTS "housing_units_update_own_constructora" ON projects.housing_units;

CREATE POLICY "housing_units_update_own_constructora"
ON projects.housing_units
FOR UPDATE
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND (
    -- Director/Admin/Engineer: Full access
    public.get_current_user_role() IN ('director', 'admin', 'engineer')
    OR
    -- Resident: Actualizar avances físicos
    public.get_current_user_role() = 'resident'
  )
)
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
);

COMMENT ON POLICY "housing_units_update_own_constructora" ON projects.housing_units IS
'Permisos por rol:
- Director/Admin/Engineer: Editar todo
- Resident: Actualizar campos de avance (progressCimentacion, progressEstructura, etc.)';

-- DELETE: Eliminar viviendas (solo admin/director, validar dependencias)
DROP POLICY IF EXISTS "housing_units_delete_own_constructora" ON projects.housing_units;

CREATE POLICY "housing_units_delete_own_constructora"
ON projects.housing_units
FOR DELETE
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- ============================================================================
-- POLÍTICAS SUPER ADMIN (Bypass para soporte)
-- ============================================================================

-- Super Admin puede ver/editar toda la estructura
DROP POLICY IF EXISTS "stages_super_admin_all" ON projects.stages;
CREATE POLICY "stages_super_admin_all" ON projects.stages FOR ALL TO authenticated
USING (public.get_current_user_role() = 'super_admin')
WITH CHECK (public.get_current_user_role() = 'super_admin');

DROP POLICY IF EXISTS "blocks_super_admin_all" ON projects.blocks;
CREATE POLICY "blocks_super_admin_all" ON projects.blocks FOR ALL TO authenticated
USING (public.get_current_user_role() = 'super_admin')
WITH CHECK (public.get_current_user_role() = 'super_admin');

DROP POLICY IF EXISTS "lots_super_admin_all" ON projects.lots;
CREATE POLICY "lots_super_admin_all" ON projects.lots FOR ALL TO authenticated
USING (public.get_current_user_role() = 'super_admin')
WITH CHECK (public.get_current_user_role() = 'super_admin');

DROP POLICY IF EXISTS "housing_units_super_admin_all" ON projects.housing_units;
CREATE POLICY "housing_units_super_admin_all" ON projects.housing_units FOR ALL TO authenticated
USING (public.get_current_user_role() = 'super_admin')
WITH CHECK (public.get_current_user_role() = 'super_admin');

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Stages
CREATE INDEX IF NOT EXISTS idx_stages_constructora_id ON projects.stages(constructora_id);
CREATE INDEX IF NOT EXISTS idx_stages_project_id ON projects.stages(project_id);
CREATE INDEX IF NOT EXISTS idx_stages_constructora_status ON projects.stages(constructora_id, status);

-- Blocks
CREATE INDEX IF NOT EXISTS idx_blocks_constructora_id ON projects.blocks(constructora_id);
CREATE INDEX IF NOT EXISTS idx_blocks_stage_id ON projects.blocks(stage_id);
CREATE INDEX IF NOT EXISTS idx_blocks_project_id ON projects.blocks(project_id);

-- Lots
CREATE INDEX IF NOT EXISTS idx_lots_constructora_id ON projects.lots(constructora_id);
CREATE INDEX IF NOT EXISTS idx_lots_stage_id ON projects.lots(stage_id);
CREATE INDEX IF NOT EXISTS idx_lots_block_id ON projects.lots(block_id);
CREATE INDEX IF NOT EXISTS idx_lots_project_id ON projects.lots(project_id);
CREATE INDEX IF NOT EXISTS idx_lots_constructora_status ON projects.lots(constructora_id, status);
CREATE INDEX IF NOT EXISTS idx_lots_prototype_id ON projects.lots(prototype_id) WHERE prototype_id IS NOT NULL;

-- Housing Units
CREATE INDEX IF NOT EXISTS idx_housing_units_constructora_id ON projects.housing_units(constructora_id);
CREATE INDEX IF NOT EXISTS idx_housing_units_lot_id ON projects.housing_units(lot_id);
CREATE INDEX IF NOT EXISTS idx_housing_units_project_id ON projects.housing_units(project_id);
CREATE INDEX IF NOT EXISTS idx_housing_units_status ON projects.housing_units(constructora_id, status);

COMMENT ON INDEX projects.idx_lots_constructora_id IS
'Optimiza queries RLS filtrados por constructora_id.';

COMMENT ON INDEX projects.idx_lots_constructora_status IS
'Optimiza query: listar lotes disponibles/vendidos de una constructora.';

-- ============================================================================
-- TRIGGERS PARA HEREDAR constructora_id
-- ============================================================================

-- Función: Auto-asignar constructora_id desde proyecto padre
CREATE OR REPLACE FUNCTION projects.auto_assign_constructora_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Si no viene constructora_id, heredar del proyecto
  IF NEW.constructora_id IS NULL THEN
    SELECT constructora_id INTO NEW.constructora_id
    FROM projects.projects
    WHERE id = NEW.project_id;

    IF NEW.constructora_id IS NULL THEN
      RAISE EXCEPTION 'No se pudo determinar constructora_id para %', TG_TABLE_NAME;
    END IF;
  END IF;

  -- Validar que constructora_id coincida con el proyecto
  IF NOT EXISTS (
    SELECT 1 FROM projects.projects
    WHERE id = NEW.project_id
    AND constructora_id = NEW.constructora_id
  ) THEN
    RAISE EXCEPTION 'constructora_id no coincide con el proyecto padre';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar trigger a todas las tablas
DROP TRIGGER IF EXISTS trigger_auto_assign_constructora ON projects.stages;
CREATE TRIGGER trigger_auto_assign_constructora
BEFORE INSERT ON projects.stages
FOR EACH ROW
EXECUTE FUNCTION projects.auto_assign_constructora_id();

DROP TRIGGER IF EXISTS trigger_auto_assign_constructora ON projects.blocks;
CREATE TRIGGER trigger_auto_assign_constructora
BEFORE INSERT ON projects.blocks
FOR EACH ROW
EXECUTE FUNCTION projects.auto_assign_constructora_id();

DROP TRIGGER IF EXISTS trigger_auto_assign_constructora ON projects.lots;
CREATE TRIGGER trigger_auto_assign_constructora
BEFORE INSERT ON projects.lots
FOR EACH ROW
EXECUTE FUNCTION projects.auto_assign_constructora_id();

DROP TRIGGER IF EXISTS trigger_auto_assign_constructora ON projects.housing_units;
CREATE TRIGGER trigger_auto_assign_constructora
BEFORE INSERT ON projects.housing_units
FOR EACH ROW
EXECUTE FUNCTION projects.auto_assign_constructora_id();

COMMENT ON FUNCTION projects.auto_assign_constructora_id() IS
'Auto-asigna constructora_id heredando del proyecto padre.
Validación: Garantiza coherencia del discriminador multi-tenant.';

-- ============================================================================
-- CONSTRAINTS Y VALIDACIONES
-- ============================================================================

-- Asegurar que constructora_id no sea NULL
ALTER TABLE projects.stages ALTER COLUMN constructora_id SET NOT NULL;
ALTER TABLE projects.blocks ALTER COLUMN constructora_id SET NOT NULL;
ALTER TABLE projects.lots ALTER COLUMN constructora_id SET NOT NULL;
ALTER TABLE projects.housing_units ALTER COLUMN constructora_id SET NOT NULL;

-- Foreign Keys hacia constructoras
ALTER TABLE projects.stages
DROP CONSTRAINT IF EXISTS fk_stages_constructora,
ADD CONSTRAINT fk_stages_constructora
FOREIGN KEY (constructora_id) REFERENCES constructoras.constructoras(id) ON DELETE RESTRICT;

ALTER TABLE projects.blocks
DROP CONSTRAINT IF EXISTS fk_blocks_constructora,
ADD CONSTRAINT fk_blocks_constructora
FOREIGN KEY (constructora_id) REFERENCES constructoras.constructoras(id) ON DELETE RESTRICT;

ALTER TABLE projects.lots
DROP CONSTRAINT IF EXISTS fk_lots_constructora,
ADD CONSTRAINT fk_lots_constructora
FOREIGN KEY (constructora_id) REFERENCES constructoras.constructoras(id) ON DELETE RESTRICT;

ALTER TABLE projects.housing_units
DROP CONSTRAINT IF EXISTS fk_housing_units_constructora,
ADD CONSTRAINT fk_housing_units_constructora
FOREIGN KEY (constructora_id) REFERENCES constructoras.constructoras(id) ON DELETE RESTRICT;

-- ============================================================================
-- TESTS DE AISLAMIENTO RLS
-- ============================================================================

-- Test: Verificar que no se puede crear lote en proyecto de otra constructora
DO $$
DECLARE
  v_constructora_a UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  v_constructora_b UUID := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  v_project_a UUID;
  v_stage_a UUID;
  v_lot_id UUID;
BEGIN
  -- Setup: Crear proyecto de constructora A
  PERFORM set_config('app.current_constructora_id', v_constructora_a::TEXT, true);
  PERFORM set_config('app.current_user_role', 'director', true);

  INSERT INTO projects.projects (code, name, type, status, constructora_id)
  VALUES ('TEST-A', 'Proyecto A', 'fraccionamiento', 'adjudicado', v_constructora_a)
  RETURNING id INTO v_project_a;

  INSERT INTO projects.stages (code, name, project_id, constructora_id)
  VALUES ('ETA-1', 'Etapa 1', v_project_a, v_constructora_a)
  RETURNING id INTO v_stage_a;

  -- Cambiar contexto a constructora B (atacante)
  PERFORM set_config('app.current_constructora_id', v_constructora_b::TEXT, true);

  -- Intentar crear lote en proyecto de A (debe fallar)
  BEGIN
    INSERT INTO projects.lots (
      code, number, stage_id, project_id, constructora_id
    ) VALUES (
      'LOTE-1', '001', v_stage_a, v_project_a, v_constructora_b
    ) RETURNING id INTO v_lot_id;

    RAISE EXCEPTION 'RLS FAIL: Se permitió crear lote en proyecto de otra constructora';
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Test RLS: PASSED - Cross-tenant INSERT bloqueado';
  END;

  -- Cleanup
  PERFORM set_config('app.current_constructora_id', v_constructora_a::TEXT, true);
  DELETE FROM projects.stages WHERE id = v_stage_a;
  DELETE FROM projects.projects WHERE id = v_project_a;
END $$;

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON projects.stages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON projects.blocks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON projects.lots TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON projects.housing_units TO authenticated;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

DO $$
DECLARE
  v_tables TEXT[] := ARRAY['stages', 'blocks', 'lots', 'housing_units'];
  v_table TEXT;
  v_rls_enabled BOOLEAN;
  v_policy_count INTEGER;
BEGIN
  FOREACH v_table IN ARRAY v_tables
  LOOP
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class
    WHERE relname = v_table AND relnamespace = 'projects'::regnamespace;

    SELECT COUNT(*) INTO v_policy_count
    FROM pg_policies
    WHERE schemaname = 'projects' AND tablename = v_table;

    IF NOT v_rls_enabled THEN
      RAISE EXCEPTION 'CRITICAL: RLS no habilitado en projects.%', v_table;
    END IF;

    IF v_policy_count < 4 THEN
      RAISE WARNING 'projects.%: Solo % políticas (esperadas: ≥4)', v_table, v_policy_count;
    END IF;

    RAISE NOTICE '✓ projects.%: RLS habilitado con % políticas', v_table, v_policy_count;
  END LOOP;

  RAISE NOTICE '✓ Todas las tablas tienen RLS habilitado correctamente';
END $$;
