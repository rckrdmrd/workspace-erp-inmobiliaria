-- =====================================================
-- Función: check_pattern_rule
-- Schema: content_management
-- Descripción: Verifica si un texto coincide con un patrón regex
-- Relacionado: EXT-002 (Admin Extendido - Moderación Automática)
-- Fecha: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION content_management.check_pattern_rule(
    p_text TEXT,
    p_config JSONB
) RETURNS BOOLEAN AS $$
DECLARE
    v_regex TEXT;
    v_case_sensitive BOOLEAN;
    v_flags TEXT;
BEGIN
    -- Si el texto está vacío, no hay match
    IF p_text IS NULL OR p_text = '' THEN
        RETURN false;
    END IF;

    -- Extraer regex de la configuración
    v_regex := p_config->>'regex';

    IF v_regex IS NULL OR v_regex = '' THEN
        RETURN false;
    END IF;

    -- Extraer case sensitivity
    v_case_sensitive := COALESCE((p_config->>'case_sensitive')::BOOLEAN, true);

    -- Construir flags para regex
    v_flags := CASE
        WHEN v_case_sensitive THEN ''
        ELSE 'i' -- case insensitive flag
    END;

    -- Evaluar regex
    BEGIN
        IF v_flags = '' THEN
            RETURN p_text ~ v_regex;
        ELSE
            RETURN p_text ~* v_regex; -- case insensitive operator
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            -- Si el regex es inválido, retornar false
            RAISE WARNING 'Invalid regex pattern: %', v_regex;
            RETURN false;
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Comentarios
COMMENT ON FUNCTION content_management.check_pattern_rule(TEXT, JSONB) IS
'Verifica si un texto coincide con un patrón regex definido en la configuración';
