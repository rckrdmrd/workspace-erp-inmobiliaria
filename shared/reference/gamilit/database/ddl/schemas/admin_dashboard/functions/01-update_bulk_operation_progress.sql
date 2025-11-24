-- =====================================================
-- Función: update_bulk_operation_progress
-- Schema: admin_dashboard
-- Descripción: Actualiza el progreso de una operación bulk
--              incrementando contadores y actualizando estado
-- Parámetros:
--   - p_operation_id: UUID de la operación bulk
--   - p_completed_increment: Cantidad de items completados exitosamente
--   - p_failed_increment: Cantidad de items que fallaron
-- Relacionado: EXT-002 (Admin Extendido)
-- Fecha: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION admin_dashboard.update_bulk_operation_progress(
    p_operation_id UUID,
    p_completed_increment INTEGER,
    p_failed_increment INTEGER DEFAULT 0
) RETURNS VOID AS $$
DECLARE
    v_target_count INTEGER;
    v_new_completed INTEGER;
    v_new_failed INTEGER;
    v_total_processed INTEGER;
BEGIN
    -- Obtener el conteo objetivo y actualizar contadores
    UPDATE admin_dashboard.bulk_operations
    SET
        completed_count = completed_count + p_completed_increment,
        failed_count = failed_count + p_failed_increment
    WHERE id = p_operation_id
    RETURNING target_count, completed_count, failed_count
    INTO v_target_count, v_new_completed, v_new_failed;

    -- Verificar que la operación existe
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Bulk operation with id % not found', p_operation_id;
    END IF;

    -- Calcular total procesado
    v_total_processed := v_new_completed + v_new_failed;

    -- Actualizar estado basado en el progreso
    UPDATE admin_dashboard.bulk_operations
    SET
        status = CASE
            WHEN v_total_processed >= v_target_count THEN 'completed'
            WHEN v_total_processed > 0 THEN 'running'
            ELSE status
        END,
        completed_at = CASE
            WHEN v_total_processed >= v_target_count THEN gamilit.now_mexico()
            ELSE completed_at
        END
    WHERE id = p_operation_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios
COMMENT ON FUNCTION admin_dashboard.update_bulk_operation_progress(UUID, INTEGER, INTEGER) IS
'Actualiza el progreso de una operación bulk incrementando contadores y actualizando estado automáticamente';
