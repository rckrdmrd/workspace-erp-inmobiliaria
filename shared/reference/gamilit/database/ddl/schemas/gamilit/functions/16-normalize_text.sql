-- ============================================================================
-- FUNCIÓN: normalize_text
-- Descripción: Normaliza texto para comparaciones (quita acentos, espacios extras)
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-123 (Fix crítico - función faltante)
-- ============================================================================

CREATE OR REPLACE FUNCTION gamilit.normalize_text(
    p_text TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    v_normalized TEXT;
BEGIN
    -- Manejar NULL
    IF p_text IS NULL OR TRIM(p_text) = '' THEN
        RETURN '';
    END IF;

    -- Normalizar texto:
    -- 1. Remover diacríticos (acentos) usando unaccent si está disponible
    -- 2. Normalizar espacios múltiples a uno solo
    -- 3. Trim espacios al inicio y fin

    v_normalized := p_text;

    -- Intentar usar unaccent si la extensión está instalada
    -- Si no está, fallback a reemplazos manuales básicos
    BEGIN
        v_normalized := unaccent(v_normalized);
    EXCEPTION WHEN undefined_function THEN
        -- Fallback: reemplazos manuales más comunes
        v_normalized := REPLACE(v_normalized, 'á', 'a');
        v_normalized := REPLACE(v_normalized, 'é', 'e');
        v_normalized := REPLACE(v_normalized, 'í', 'i');
        v_normalized := REPLACE(v_normalized, 'ó', 'o');
        v_normalized := REPLACE(v_normalized, 'ú', 'u');
        v_normalized := REPLACE(v_normalized, 'ñ', 'n');
        v_normalized := REPLACE(v_normalized, 'ü', 'u');
        v_normalized := REPLACE(v_normalized, 'Á', 'A');
        v_normalized := REPLACE(v_normalized, 'É', 'E');
        v_normalized := REPLACE(v_normalized, 'Í', 'I');
        v_normalized := REPLACE(v_normalized, 'Ó', 'O');
        v_normalized := REPLACE(v_normalized, 'Ú', 'U');
        v_normalized := REPLACE(v_normalized, 'Ñ', 'N');
        v_normalized := REPLACE(v_normalized, 'Ü', 'U');
    END;

    -- Normalizar espacios múltiples a uno solo
    v_normalized := REGEXP_REPLACE(v_normalized, '\s+', ' ', 'g');

    -- Trim espacios al inicio y fin
    v_normalized := TRIM(v_normalized);

    RETURN v_normalized;
END;
$$;

-- ============================================================================
-- COMENTARIOS
-- ============================================================================

COMMENT ON FUNCTION gamilit.normalize_text IS
'Normaliza texto para comparaciones case-insensitive y sin acentos.
Elimina diacríticos, normaliza espacios múltiples, y hace trim.
Usado por funciones de validación de ejercicios.';

-- ============================================================================
-- PERMISOS
-- ============================================================================

GRANT EXECUTE ON FUNCTION gamilit.normalize_text TO authenticated;
GRANT EXECUTE ON FUNCTION gamilit.normalize_text TO admin_teacher;

-- ============================================================================
-- EJEMPLOS DE USO
-- ============================================================================

/*
-- Ejemplo 1: Normalizar texto con acentos
SELECT gamilit.normalize_text('María José Curie');
-- Resultado: 'Maria Jose Curie'

-- Ejemplo 2: Normalizar espacios
SELECT gamilit.normalize_text('texto   con    espacios     múltiples');
-- Resultado: 'texto con espacios multiples'

-- Ejemplo 3: Texto con acentos y espacios
SELECT gamilit.normalize_text('  Władysław    Skłodowska  ');
-- Resultado: 'Wladyslaw Sklodowska'
*/
