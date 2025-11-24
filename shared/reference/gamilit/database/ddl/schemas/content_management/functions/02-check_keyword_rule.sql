-- =====================================================
-- Función: check_keyword_rule
-- Schema: content_management
-- Descripción: Verifica si un texto contiene palabras prohibidas
-- Relacionado: EXT-002 (Admin Extendido - Moderación Automática)
-- Fecha: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION content_management.check_keyword_rule(
    p_text TEXT,
    p_config JSONB
) RETURNS BOOLEAN AS $$
DECLARE
    v_keywords TEXT[];
    v_case_sensitive BOOLEAN;
    v_match_whole_word BOOLEAN;
    v_keyword TEXT;
    v_search_text TEXT;
    v_search_keyword TEXT;
    v_pattern TEXT;
BEGIN
    -- Si el texto está vacío, no hay match
    IF p_text IS NULL OR p_text = '' THEN
        RETURN false;
    END IF;

    -- Extraer configuración
    v_keywords := ARRAY(SELECT jsonb_array_elements_text(p_config->'keywords'));
    v_case_sensitive := COALESCE((p_config->>'case_sensitive')::BOOLEAN, false);
    v_match_whole_word := COALESCE((p_config->>'match_whole_word')::BOOLEAN, true);

    -- Si no hay keywords, no hay match
    IF array_length(v_keywords, 1) IS NULL THEN
        RETURN false;
    END IF;

    -- Preparar texto para búsqueda
    v_search_text := CASE
        WHEN v_case_sensitive THEN p_text
        ELSE LOWER(p_text)
    END;

    -- Buscar cada keyword
    FOREACH v_keyword IN ARRAY v_keywords LOOP
        v_search_keyword := CASE
            WHEN v_case_sensitive THEN v_keyword
            ELSE LOWER(v_keyword)
        END;

        IF v_match_whole_word THEN
            -- Buscar palabra completa usando regex
            v_pattern := '\y' || v_search_keyword || '\y';
            IF v_search_text ~ v_pattern THEN
                RETURN true;
            END IF;
        ELSE
            -- Buscar substring
            IF v_search_text LIKE '%' || v_search_keyword || '%' THEN
                RETURN true;
            END IF;
        END IF;
    END LOOP;

    RETURN false;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Comentarios
COMMENT ON FUNCTION content_management.check_keyword_rule(TEXT, JSONB) IS
'Verifica si un texto contiene keywords prohibidas según configuración JSON';
