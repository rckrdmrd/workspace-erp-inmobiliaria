-- =====================================================
-- Trigger: trg_auto_moderate
-- Schema: content_management
-- Descripción: Trigger para auto-moderación de contenido al crear/actualizar
-- Relacionado: EXT-002 (Admin Extendido - Moderación Automática)
-- Fecha: 2025-11-11
-- =====================================================

-- Función del trigger
CREATE OR REPLACE FUNCTION content_management.trg_auto_moderate()
RETURNS TRIGGER AS $$
DECLARE
    v_result RECORD;
    v_any_match BOOLEAN := false;
    v_content_text TEXT;
    v_entity_type VARCHAR;
BEGIN
    -- Determinar qué campo contiene el texto a moderar
    -- Esto es flexible para adaptarse a diferentes tablas
    v_content_text := COALESCE(
        NEW.content_text,  -- Para tablas con campo content_text
        NEW.message,       -- Para tablas de mensajes
        NEW.comment_text,  -- Para tablas de comentarios
        NEW.body,          -- Para tablas con campo body
        NEW.text           -- Para tablas con campo text
    );

    -- Si no hay texto, no moderar
    IF v_content_text IS NULL OR v_content_text = '' THEN
        RETURN NEW;
    END IF;

    -- Determinar entity type (usar argumento del trigger o table name)
    v_entity_type := COALESCE(TG_ARGV[0]::VARCHAR, 'content');

    -- Aplicar reglas de moderación
    FOR v_result IN
        SELECT *
        FROM content_management.apply_moderation_rules(
            NEW.id,
            v_content_text,
            v_entity_type
        )
        WHERE rule_matched = true
    LOOP
        v_any_match := true;

        -- Log en audit (si existe la tabla)
        BEGIN
            INSERT INTO audit_logging.audit_logs (
                action,
                table_name,
                record_id,
                metadata,
                created_at
            ) VALUES (
                'auto_moderation',
                TG_TABLE_NAME,
                NEW.id,
                jsonb_build_object(
                    'rule_id', v_result.rule_id,
                    'rule_name', v_result.rule_name,
                    'action', v_result.action,
                    'severity', v_result.severity,
                    'auto_executed', v_result.auto_executed
                ),
                gamilit.now_mexico()
            );
        EXCEPTION
            WHEN undefined_table THEN
                -- Si la tabla audit_logs no existe, continuar
                NULL;
            WHEN OTHERS THEN
                -- Otros errores, log warning pero continuar
                RAISE WARNING 'Error logging auto-moderation: %', SQLERRM;
        END;
    END LOOP;

    -- Si la tabla tiene campo auto_moderated, marcarlo
    IF v_any_match THEN
        BEGIN
            -- Intentar setear el campo auto_moderated
            NEW.auto_moderated := true;
        EXCEPTION
            WHEN undefined_column THEN
                -- Si no existe el campo, continuar
                NULL;
        END;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Comentarios
COMMENT ON FUNCTION content_management.trg_auto_moderate() IS
'Función de trigger que aplica reglas de moderación automáticamente al insertar/actualizar contenido';

-- =====================================================
-- NOTA: Para activar el trigger en una tabla específica, usar:
--
-- CREATE TRIGGER trg_auto_moderate_content
-- AFTER INSERT OR UPDATE ON content_management.{tabla}
-- FOR EACH ROW
-- EXECUTE FUNCTION content_management.trg_auto_moderate('content');
--
-- Donde {tabla} es la tabla objetivo (ej: content, comments, posts, etc.)
-- y 'content' es el entity_type correspondiente
-- =====================================================
