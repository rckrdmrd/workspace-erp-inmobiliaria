-- =====================================================
-- Función: auto_moderate_content
-- Schema: content_management
-- Descripción: Función simplificada para moderar contenido desde backend
-- Relacionado: EXT-002 (Admin Extendido - Moderación Automática)
-- Fecha: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION content_management.auto_moderate_content(
    p_content_id UUID,
    p_content_text TEXT,
    p_entity_type VARCHAR DEFAULT 'content'
) RETURNS JSONB AS $$
DECLARE
    v_results RECORD;
    v_matches JSONB := '[]'::jsonb;
    v_has_critical BOOLEAN := false;
    v_should_block BOOLEAN := false;
BEGIN
    -- Aplicar reglas de moderación
    FOR v_results IN
        SELECT *
        FROM content_management.apply_moderation_rules(
            p_content_id,
            p_content_text,
            p_entity_type
        )
        WHERE rule_matched = true
    LOOP
        -- Agregar match al resultado
        v_matches := v_matches || jsonb_build_object(
            'rule_id', v_results.rule_id,
            'rule_name', v_results.rule_name,
            'action', v_results.action,
            'severity', v_results.severity,
            'auto_executed', v_results.auto_executed
        );

        -- Verificar si hay reglas críticas
        IF v_results.severity = 'critical' THEN
            v_has_critical := true;
        END IF;

        -- Verificar si debe bloquearse
        IF v_results.action = 'block' AND v_results.auto_executed THEN
            v_should_block := true;
        END IF;
    END LOOP;

    -- Retornar resumen en JSON
    RETURN jsonb_build_object(
        'content_id', p_content_id,
        'moderated', jsonb_array_length(v_matches) > 0,
        'matches_count', jsonb_array_length(v_matches),
        'has_critical', v_has_critical,
        'should_block', v_should_block,
        'matches', v_matches
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios
COMMENT ON FUNCTION content_management.auto_moderate_content(UUID, TEXT, VARCHAR) IS
'Función simplificada que modera contenido y retorna resultado en formato JSON';
