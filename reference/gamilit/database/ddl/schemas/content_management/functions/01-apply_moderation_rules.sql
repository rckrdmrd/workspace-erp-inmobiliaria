-- =====================================================
-- Función: apply_moderation_rules
-- Schema: content_management
-- Descripción: Aplica reglas de moderación a un contenido
-- Relacionado: EXT-002 (Admin Extendido - Moderación Automática)
-- Fecha: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION content_management.apply_moderation_rules(
    p_content_id UUID,
    p_content_text TEXT,
    p_entity_type VARCHAR
) RETURNS TABLE (
    rule_matched BOOLEAN,
    rule_id UUID,
    rule_name VARCHAR,
    action VARCHAR,
    severity VARCHAR,
    auto_executed BOOLEAN
) AS $$
DECLARE
    v_rule RECORD;
    v_matched BOOLEAN;
    v_has_matches BOOLEAN := false;
BEGIN
    -- Si no hay contenido, no hay nada que moderar
    IF p_content_text IS NULL OR p_content_text = '' THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::VARCHAR, NULL::VARCHAR, NULL::VARCHAR, false;
        RETURN;
    END IF;

    -- Iterar sobre reglas activas ordenadas por prioridad y severidad
    FOR v_rule IN
        SELECT *
        FROM content_management.moderation_rules
        WHERE is_active = true
          AND target_entity = p_entity_type
        ORDER BY priority DESC, severity DESC, created_at ASC
    LOOP
        v_matched := false;

        -- Evaluar según tipo de regla
        CASE v_rule.rule_type
            WHEN 'keyword' THEN
                v_matched := content_management.check_keyword_rule(
                    p_content_text,
                    v_rule.rule_config
                );

            WHEN 'pattern' THEN
                v_matched := content_management.check_pattern_rule(
                    p_content_text,
                    v_rule.rule_config
                );

            WHEN 'length' THEN
                -- Verificar longitud del texto
                DECLARE
                    v_min_length INTEGER;
                    v_max_length INTEGER;
                    v_text_length INTEGER;
                BEGIN
                    v_min_length := COALESCE((v_rule.rule_config->>'min_length')::INTEGER, 0);
                    v_max_length := COALESCE((v_rule.rule_config->>'max_length')::INTEGER, 999999);
                    v_text_length := LENGTH(p_content_text);

                    v_matched := v_text_length < v_min_length OR v_text_length > v_max_length;
                END;

            ELSE
                -- Tipo de regla no soportado
                CONTINUE;
        END CASE;

        -- Si la regla coincidió, aplicar acción
        IF v_matched THEN
            v_has_matches := true;

            -- Aplicar acción según el tipo
            IF v_rule.action = 'flag' THEN
                -- Flaggear contenido para revisión
                INSERT INTO content_management.flagged_content (
                    content_id,
                    flagged_by_system,
                    reason,
                    priority,
                    status,
                    created_at
                ) VALUES (
                    p_content_id,
                    true,
                    'Auto-moderación: ' || v_rule.rule_name,
                    v_rule.severity,
                    'pending',
                    gamilit.now_mexico()
                )
                ON CONFLICT (content_id) DO UPDATE
                SET
                    reason = EXCLUDED.reason,
                    priority = EXCLUDED.priority,
                    updated_at = gamilit.now_mexico();

            ELSIF v_rule.action = 'block' AND v_rule.auto_execute THEN
                -- Bloquear contenido automáticamente
                -- Nota: Esto requiere que exista una tabla 'content' o similar
                -- con una columna 'status'. Ajustar según estructura real.
                -- Por ahora solo lo flaggeamos con alta prioridad
                INSERT INTO content_management.flagged_content (
                    content_id,
                    flagged_by_system,
                    reason,
                    priority,
                    status,
                    created_at
                ) VALUES (
                    p_content_id,
                    true,
                    'AUTO-BLOCKED: ' || v_rule.rule_name,
                    'critical',
                    'blocked',
                    gamilit.now_mexico()
                )
                ON CONFLICT (content_id) DO UPDATE
                SET
                    reason = EXCLUDED.reason,
                    status = 'blocked',
                    updated_at = gamilit.now_mexico();

            ELSIF v_rule.action = 'notify' THEN
                -- Enviar notificación a moderadores
                -- (Aquí se puede integrar con el sistema de notificaciones)
                INSERT INTO content_management.flagged_content (
                    content_id,
                    flagged_by_system,
                    reason,
                    priority,
                    status,
                    created_at
                ) VALUES (
                    p_content_id,
                    true,
                    'NOTIFY: ' || v_rule.rule_name,
                    v_rule.severity,
                    'review_required',
                    gamilit.now_mexico()
                )
                ON CONFLICT (content_id) DO UPDATE
                SET
                    reason = EXCLUDED.reason,
                    updated_at = gamilit.now_mexico();
            END IF;

            -- Retornar información del match
            RETURN QUERY SELECT
                true,
                v_rule.id,
                v_rule.rule_name::VARCHAR,
                v_rule.action::VARCHAR,
                v_rule.severity::VARCHAR,
                v_rule.auto_execute;

            -- Si la regla se auto-ejecutó y no requiere más revisión, detener
            IF v_rule.auto_execute AND NOT v_rule.require_review THEN
                RETURN;
            END IF;
        END IF;
    END LOOP;

    -- Si no hubo matches, retornar registro con false
    IF NOT v_has_matches THEN
        RETURN QUERY SELECT
            false,
            NULL::UUID,
            NULL::VARCHAR,
            NULL::VARCHAR,
            NULL::VARCHAR,
            false;
    END IF;

    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios
COMMENT ON FUNCTION content_management.apply_moderation_rules(UUID, TEXT, VARCHAR) IS
'Aplica todas las reglas de moderación activas a un contenido y ejecuta las acciones correspondientes';
