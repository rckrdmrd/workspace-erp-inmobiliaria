-- Nombre: is_admin
-- Descripción: Verifica si el usuario actual tiene rol de administrador
-- Schema: gamilit
-- Tipo: FUNCTION
-- Dependencias: gamilit.get_current_user_id(), auth_management.profiles
-- Uso: Políticas RLS para control de acceso administrativo

CREATE OR REPLACE FUNCTION gamilit.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    -- Verifica si el usuario actual tiene rol de administrador
    RETURN EXISTS (
        SELECT 1
        FROM auth_management.profiles
        WHERE id = gamilit.get_current_user_id()
        AND role IN ('admin_teacher', 'super_admin')
        AND status = 'active'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

-- Comentario descriptivo
COMMENT ON FUNCTION gamilit.is_admin() IS
    'Retorna TRUE si el usuario actual es administrador (admin_teacher o super_admin). '
    'Utilizada por políticas RLS para control de acceso administrativo. '
    'Verifica también que el usuario esté activo para prevenir acceso de usuarios suspendidos.';

-- Permisos
GRANT EXECUTE ON FUNCTION gamilit.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION gamilit.is_admin() TO gamilit_user;

-- =====================================================================================
-- NOTAS DE IMPLEMENTACIÓN
-- =====================================================================================
--
-- SEGURIDAD:
-- - Usa SECURITY DEFINER para ejecutar con permisos de creador
-- - Verifica status='active' para prevenir acceso de usuarios suspendidos
-- - Manejo de excepciones retorna FALSE por defecto (fail-safe)
--
-- PERFORMANCE:
-- - Marcada como STABLE para cacheo durante transacción
-- - Usa EXISTS para early exit (más eficiente que COUNT o SELECT)
-- - Índice recomendado en auth_management.profiles(id, role, status)
--
-- DEPENDENCIAS:
-- - gamilit.get_current_user_id() debe existir
-- - Tabla auth_management.profiles debe existir
-- - Roles válidos: 'admin_teacher', 'super_admin'
--
-- USO EN RLS POLICIES:
-- CREATE POLICY admin_access ON some_table
--   FOR ALL
--   USING (gamilit.is_admin());
--
-- =====================================================================================
-- TESTING
-- =====================================================================================
--
-- Test 1: Usuario administrador
-- SELECT gamilit.is_admin(); -- Resultado esperado: true (si hay admin autenticado)
--
-- Test 2: Usuario normal
-- SELECT gamilit.is_admin(); -- Resultado esperado: false (si hay user normal)
--
-- Test 3: Sin autenticación
-- SELECT gamilit.is_admin(); -- Resultado esperado: false
--
-- =====================================================================================
-- CHANGELOG
-- =====================================================================================
-- 2025-11-03: Creación inicial (ISSUE-M8-001)
--             Implementada para desbloquear 31 políticas RLS
--             Identificada como crítica en Microciclo M8
-- =====================================================================================
