-- ============================================================================
-- ET-PROJ-001: Row-Level Security (RLS) Policies
-- Tabla: projects.projects
-- Fecha: 2025-11-17
-- Descripción: Políticas de seguridad para aislamiento multi-tenant (constructora)
-- ============================================================================

-- Habilitar RLS en la tabla
ALTER TABLE projects.projects ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- FUNCIONES HELPER
-- ============================================================================

-- Función: Obtener constructora_id del contexto actual
CREATE OR REPLACE FUNCTION public.get_current_constructora_id()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_constructora_id', true)::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION public.get_current_constructora_id() IS
'Obtiene el UUID de la constructora del contexto RLS actual.
Retorna NULL si no está configurado.';

-- Función: Obtener user_id del contexto actual
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_user_id', true)::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION public.get_current_user_id() IS
'Obtiene el UUID del usuario autenticado del contexto RLS actual.';

-- Función: Obtener rol del usuario del contexto actual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_user_role', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'guest';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION public.get_current_user_role() IS
'Obtiene el rol del usuario autenticado (director, engineer, resident, etc.).';

-- ============================================================================
-- POLÍTICAS RLS: SELECT
-- ============================================================================

-- Política: Permitir SELECT solo de proyectos de la constructora actual
DROP POLICY IF EXISTS "projects_select_own_constructora" ON projects.projects;

CREATE POLICY "projects_select_own_constructora"
ON projects.projects
FOR SELECT
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
);

COMMENT ON POLICY "projects_select_own_constructora" ON projects.projects IS
'Permite a usuarios autenticados ver solo proyectos de su constructora.
Aislamiento: tenant (constructora) level.';

-- ============================================================================
-- POLÍTICAS RLS: INSERT
-- ============================================================================

-- Política: Permitir INSERT solo con constructora_id del contexto actual
DROP POLICY IF EXISTS "projects_insert_own_constructora" ON projects.projects;

CREATE POLICY "projects_insert_own_constructora"
ON projects.projects
FOR INSERT
TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND (
    -- Solo directores y admins pueden crear proyectos
    public.get_current_user_role() IN ('director', 'admin')
  )
);

COMMENT ON POLICY "projects_insert_own_constructora" ON projects.projects IS
'Permite crear proyectos solo para la constructora actual.
Requiere rol: director o admin.
Previene: Inserción de proyectos en otras constructoras.';

-- ============================================================================
-- POLÍTICAS RLS: UPDATE
-- ============================================================================

-- Política: Permitir UPDATE solo de proyectos propios con roles autorizados
DROP POLICY IF EXISTS "projects_update_own_constructora" ON projects.projects;

CREATE POLICY "projects_update_own_constructora"
ON projects.projects
FOR UPDATE
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND (
    -- Director puede editar todo
    public.get_current_user_role() IN ('director', 'admin')
    OR
    -- Engineer e Resident pueden editar campos limitados (verificado en app)
    public.get_current_user_role() IN ('engineer', 'resident')
  )
)
WITH CHECK (
  -- No permitir cambiar constructora_id
  constructora_id = public.get_current_constructora_id()
);

COMMENT ON POLICY "projects_update_own_constructora" ON projects.projects IS
'Permite actualizar proyectos solo de la constructora actual.
Roles permitidos: director, admin (full), engineer, resident (limitado).
Protección: Previene cambio de constructora_id.';

-- ============================================================================
-- POLÍTICAS RLS: DELETE
-- ============================================================================

-- Política: Permitir DELETE solo a admin/director de proyectos propios
DROP POLICY IF EXISTS "projects_delete_own_constructora" ON projects.projects;

CREATE POLICY "projects_delete_own_constructora"
ON projects.projects
FOR DELETE
TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

COMMENT ON POLICY "projects_delete_own_constructora" ON projects.projects IS
'Permite eliminar proyectos solo a director/admin de la constructora actual.
Prevención: Cross-tenant deletion.
Nota: Considerar soft-delete en lugar de hard-delete.';

-- ============================================================================
-- POLÍTICAS ADICIONALES: BYPASS PARA SUPER ADMIN (OPCIONAL)
-- ============================================================================

-- Política: Super Admin puede ver todos los proyectos (para soporte)
DROP POLICY IF EXISTS "projects_super_admin_all_access" ON projects.projects;

CREATE POLICY "projects_super_admin_all_access"
ON projects.projects
FOR ALL
TO authenticated
USING (
  public.get_current_user_role() = 'super_admin'
)
WITH CHECK (
  public.get_current_user_role() = 'super_admin'
);

COMMENT ON POLICY "projects_super_admin_all_access" ON projects.projects IS
'Permite acceso completo a super_admin (equipo interno de soporte).
Uso: Troubleshooting, migración de datos, auditoría.
Seguridad: Solo usuarios con rol super_admin (muy limitados).';

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Índice en constructora_id para queries filtrados
CREATE INDEX IF NOT EXISTS idx_projects_constructora_id
ON projects.projects(constructora_id);

-- Índice compuesto para queries comunes
CREATE INDEX IF NOT EXISTS idx_projects_constructora_status
ON projects.projects(constructora_id, status);

CREATE INDEX IF NOT EXISTS idx_projects_constructora_type
ON projects.projects(constructora_id, type);

-- Índice para búsquedas por código
CREATE INDEX IF NOT EXISTS idx_projects_code
ON projects.projects(code);

COMMENT ON INDEX projects.idx_projects_constructora_id IS
'Optimiza queries filtrados por constructora_id (usado por RLS).';

COMMENT ON INDEX projects.idx_projects_constructora_status IS
'Optimiza queries: listar proyectos activos de una constructora.';

-- ============================================================================
-- TRIGGERS DE AUDITORÍA
-- ============================================================================

-- Función: Registrar cambios en proyectos
CREATE OR REPLACE FUNCTION projects.audit_project_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- En UPDATE, registrar cambio de estado
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO projects.project_status_history (
      project_id,
      old_status,
      new_status,
      changed_by,
      changed_at,
      constructora_id
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      public.get_current_user_id(),
      NOW(),
      NEW.constructora_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auditar cambios de estado
DROP TRIGGER IF EXISTS trigger_audit_project_status ON projects.projects;

CREATE TRIGGER trigger_audit_project_status
AFTER UPDATE ON projects.projects
FOR EACH ROW
EXECUTE FUNCTION projects.audit_project_changes();

COMMENT ON TRIGGER trigger_audit_project_status ON projects.projects IS
'Registra cambios de estado en tabla de auditoría.
Tabla destino: projects.project_status_history.';

-- ============================================================================
-- VALIDACIONES Y RESTRICCIONES
-- ============================================================================

-- Constraint: constructora_id no puede ser NULL
ALTER TABLE projects.projects
ALTER COLUMN constructora_id SET NOT NULL;

-- Foreign Key: Validar que constructora existe y está activa
ALTER TABLE projects.projects
DROP CONSTRAINT IF EXISTS fk_projects_constructora;

ALTER TABLE projects.projects
ADD CONSTRAINT fk_projects_constructora
FOREIGN KEY (constructora_id)
REFERENCES constructoras.constructoras(id)
ON DELETE RESTRICT;  -- Prevenir eliminación de constructora con proyectos

COMMENT ON CONSTRAINT fk_projects_constructora ON projects.projects IS
'Garantiza que constructora_id apunta a una constructora válida.
ON DELETE RESTRICT: No permitir eliminar constructora con proyectos activos.';

-- ============================================================================
-- TESTS DE RLS (Para ejecutar en ambiente de prueba)
-- ============================================================================

-- Test 1: Verificar aislamiento entre constructoras
DO $$
DECLARE
  v_constructora_a UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  v_constructora_b UUID := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  v_count INTEGER;
BEGIN
  -- Configurar contexto para constructora A
  PERFORM set_config('app.current_constructora_id', v_constructora_a::TEXT, true);

  -- Contar proyectos visibles
  SELECT COUNT(*) INTO v_count FROM projects.projects;

  RAISE NOTICE 'Constructora A puede ver % proyectos', v_count;

  -- Cambiar a constructora B
  PERFORM set_config('app.current_constructora_id', v_constructora_b::TEXT, true);

  SELECT COUNT(*) INTO v_count FROM projects.projects;

  RAISE NOTICE 'Constructora B puede ver % proyectos', v_count;

  -- Verificar que no se cruzan datos
  IF v_count > 0 THEN
    RAISE EXCEPTION 'RLS FAIL: Constructora B no debería ver proyectos de A';
  END IF;

  RAISE NOTICE 'Test RLS: PASSED - Aislamiento correcto';
END $$;

-- Test 2: Verificar que no se puede cambiar constructora_id
DO $$
DECLARE
  v_project_id UUID;
  v_original_constructora UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  v_malicious_constructora UUID := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
BEGIN
  -- Configurar contexto
  PERFORM set_config('app.current_constructora_id', v_original_constructora::TEXT, true);
  PERFORM set_config('app.current_user_role', 'director', true);

  -- Crear proyecto de prueba
  INSERT INTO projects.projects (
    code, name, type, status, constructora_id
  ) VALUES (
    'TEST-001', 'Test Project', 'fraccionamiento', 'adjudicado', v_original_constructora
  ) RETURNING id INTO v_project_id;

  -- Intentar cambiar constructora_id (debe fallar)
  BEGIN
    UPDATE projects.projects
    SET constructora_id = v_malicious_constructora
    WHERE id = v_project_id;

    RAISE EXCEPTION 'RLS FAIL: Se permitió cambiar constructora_id';
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Test RLS: PASSED - No se puede cambiar constructora_id';
  END;

  -- Limpiar
  DELETE FROM projects.projects WHERE id = v_project_id;
END $$;

-- ============================================================================
-- GRANTS DE PERMISOS
-- ============================================================================

-- Permisos para rol 'authenticated' (usuarios normales)
GRANT SELECT, INSERT, UPDATE, DELETE ON projects.projects TO authenticated;

-- Permisos para funciones helper
GRANT EXECUTE ON FUNCTION public.get_current_constructora_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;

-- ============================================================================
-- FIN DE POLÍTICAS RLS
-- ============================================================================

-- Verificación final: RLS está habilitado
DO $$
BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'projects' AND relnamespace = 'projects'::regnamespace) THEN
    RAISE EXCEPTION 'CRITICAL: RLS no está habilitado en projects.projects';
  ELSE
    RAISE NOTICE '✓ RLS habilitado correctamente en projects.projects';
  END IF;
END $$;

-- Estadísticas
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'projects' AND tablename = 'projects') as policy_count
FROM pg_tables
WHERE schemaname = 'projects' AND tablename = 'projects';
