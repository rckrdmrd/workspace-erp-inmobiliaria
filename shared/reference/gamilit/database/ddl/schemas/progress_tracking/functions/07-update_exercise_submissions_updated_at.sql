-- Nombre: update_exercise_submissions_updated_at
-- Descripción: Actualiza automáticamente el campo updated_at al modificar una submission
-- Schema: progress_tracking
-- Tipo: TRIGGER FUNCTION
-- Dependencias: gamilit.now_mexico()
-- Uso: Trigger BEFORE UPDATE ON progress_tracking.exercise_submissions

CREATE OR REPLACE FUNCTION progress_tracking.update_exercise_submissions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Actualizar timestamp de updated_at con hora de México
    NEW.updated_at = gamilit.now_mexico();
    RETURN NEW;
END;
$$;

-- Comentario descriptivo
COMMENT ON FUNCTION progress_tracking.update_exercise_submissions_updated_at() IS
    'Trigger function que actualiza automáticamente el campo updated_at al modificar una submission. '
    'Utiliza timezone de México (gamilit.now_mexico()) para consistencia temporal en toda la aplicación.';

-- =====================================================================================
-- NOTAS DE IMPLEMENTACIÓN
-- =====================================================================================
--
-- PROPÓSITO:
-- - Mantener el campo updated_at sincronizado automáticamente
-- - Usar timezone consistente (México) en toda la aplicación
-- - Evitar que desarrolladores olviden actualizar manualmente el timestamp
--
-- PATRÓN:
-- - Es una función trigger estándar BEFORE UPDATE
-- - Modifica NEW.updated_at antes de que se persista el cambio
-- - Siempre retorna NEW para permitir que el UPDATE continúe
--
-- PERFORMANCE:
-- - Función muy ligera: solo una asignación
-- - Se ejecuta en microsegundos
-- - No tiene queries adicionales
--
-- SEGURIDAD:
-- - No requiere SECURITY DEFINER (opera sobre NEW que ya tiene permisos)
-- - No expone datos sensibles
-- - No puede ser explotada para modificar otros datos
--
-- DEPENDENCIAS:
-- - Función: gamilit.now_mexico() debe existir
-- - Columna: updated_at debe existir en la tabla progress_tracking.exercise_submissions
--
-- =====================================================================================
-- USO EN TRIGGERS
-- =====================================================================================
--
-- CREATE TRIGGER exercise_submissions_updated_at
--   BEFORE UPDATE ON progress_tracking.exercise_submissions
--   FOR EACH ROW
--   EXECUTE FUNCTION progress_tracking.update_exercise_submissions_updated_at();
--
-- =====================================================================================
-- TESTING
-- =====================================================================================
--
-- Test 1: Actualizar un registro
-- UPDATE progress_tracking.exercise_submissions
-- SET score = 95
-- WHERE id = 'some-id';
-- -- Verificar: SELECT updated_at FROM exercise_submissions WHERE id = 'some-id';
-- -- Esperado: updated_at debe ser la hora actual de México
--
-- Test 2: Verificar que created_at no cambia
-- UPDATE progress_tracking.exercise_submissions
-- SET score = 80
-- WHERE id = 'some-id';
-- -- Verificar: SELECT created_at, updated_at FROM exercise_submissions WHERE id = 'some-id';
-- -- Esperado: created_at sin cambios, updated_at actualizado
--
-- =====================================================================================
-- CHANGELOG
-- =====================================================================================
-- 2025-11-03: Creación inicial (ISSUE-M8-002)
--             Implementada para desbloquear 2 triggers
--             Identificada como crítica en Microciclo M8
--             Patrón estándar de auto-actualización de timestamps
-- =====================================================================================
