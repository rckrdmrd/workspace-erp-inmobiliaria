-- ============================================================================
-- FUNCIÓN: validate_crucigrama
-- Descripción: Validador para ejercicios tipo crucigrama
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116 (Handoff FE-059)
-- Migrado desde: exercise-submission.service.ts línea 431 (validateCrucigrama)
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_crucigrama(
    p_solution JSONB,
    p_submitted_answer JSONB,
    p_max_points INTEGER,
    p_case_sensitive BOOLEAN DEFAULT false,
    p_normalize_text BOOLEAN DEFAULT true,
    OUT is_correct BOOLEAN,
    OUT score INTEGER,
    OUT feedback TEXT,
    OUT details JSONB
)
RETURNS RECORD
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    v_total_words INTEGER := 0;
    v_correct_words INTEGER := 0;
    v_word_id TEXT;
    v_correct_answer TEXT;
    v_submitted_answer TEXT;
    v_results JSONB := '[]'::jsonb;
    v_solution_clues JSONB;
    v_submitted_clues JSONB;
BEGIN
    -- ========================================================================
    -- 1. EXTRAER CLUES DE ESTRUCTURA JSONB
    -- ========================================================================
    -- Formato esperado:
    -- solution: {"clues": {"h1": "SORBONA", "h2": "NOBEL", "v1": "POLONIO"}}
    -- submitted: {"clues": {"h1": "sorbona", "h2": "nobel", "v1": "polonio"}}

    v_solution_clues := p_solution->'clues';
    v_submitted_clues := p_submitted_answer->'clues';

    IF v_solution_clues IS NULL THEN
        RAISE EXCEPTION 'Invalid solution format: missing "clues" key';
    END IF;

    IF v_submitted_clues IS NULL THEN
        RAISE EXCEPTION 'Invalid submitted answer format: missing "clues" key';
    END IF;

    -- ========================================================================
    -- 2. ITERAR SOBRE CADA CLUE Y COMPARAR
    -- ========================================================================
    FOR v_word_id IN SELECT jsonb_object_keys(v_solution_clues)
    LOOP
        v_total_words := v_total_words + 1;

        -- Obtener respuestas
        v_correct_answer := v_solution_clues->>v_word_id;
        v_submitted_answer := v_submitted_clues->>v_word_id;

        -- Normalizar si es necesario
        IF p_normalize_text THEN
            v_correct_answer := gamilit.normalize_text(v_correct_answer);
            v_submitted_answer := gamilit.normalize_text(COALESCE(v_submitted_answer, ''));
        END IF;

        -- Case-sensitive?
        IF NOT p_case_sensitive THEN
            v_correct_answer := UPPER(TRIM(v_correct_answer));
            v_submitted_answer := UPPER(TRIM(v_submitted_answer));
        ELSE
            v_correct_answer := TRIM(v_correct_answer);
            v_submitted_answer := TRIM(v_submitted_answer);
        END IF;

        -- Comparar
        IF v_submitted_answer = v_correct_answer THEN
            v_correct_words := v_correct_words + 1;

            v_results := v_results || jsonb_build_object(
                'clue_id', v_word_id,
                'is_correct', true,
                'submitted', p_submitted_answer->'clues'->>v_word_id,
                'expected', p_solution->'clues'->>v_word_id
            );
        ELSE
            v_results := v_results || jsonb_build_object(
                'clue_id', v_word_id,
                'is_correct', false,
                'submitted', COALESCE(p_submitted_answer->'clues'->>v_word_id, ''),
                'expected', p_solution->'clues'->>v_word_id
            );
        END IF;
    END LOOP;

    -- ========================================================================
    -- 3. CALCULAR SCORE Y RESULTADO
    -- ========================================================================
    IF v_total_words = 0 THEN
        RAISE EXCEPTION 'Crucigrama has no clues defined';
    END IF;

    is_correct := (v_correct_words = v_total_words);
    score := ROUND((v_correct_words::NUMERIC / v_total_words) * p_max_points);

    -- ========================================================================
    -- 4. GENERAR FEEDBACK
    -- ========================================================================
    IF is_correct THEN
        feedback := format('¡Perfecto! Todas las %s palabras están correctas.', v_total_words);
    ELSIF v_correct_words = 0 THEN
        feedback := format('Ninguna palabra correcta. Intenta de nuevo.');
    ELSE
        feedback := format('Tienes %s/%s palabras correctas (%s%%).',
                          v_correct_words,
                          v_total_words,
                          ROUND((v_correct_words::NUMERIC / v_total_words) * 100));
    END IF;

    -- ========================================================================
    -- 5. CONSTRUIR DETAILS
    -- ========================================================================
    details := jsonb_build_object(
        'total_words', v_total_words,
        'correct_words', v_correct_words,
        'incorrect_words', v_total_words - v_correct_words,
        'percentage', ROUND((v_correct_words::NUMERIC / v_total_words) * 100),
        'results_per_word', v_results
    );

END;
$$;

-- ============================================================================
-- COMENTARIOS
-- ============================================================================

COMMENT ON FUNCTION educational_content.validate_crucigrama IS
'Validador para ejercicios tipo crucigrama.
Compara cada respuesta (clue) con la solución esperada.
Soporta normalización de texto y case-insensitive matching.
Retorna puntuación parcial basada en palabras correctas.';

-- ============================================================================
-- EJEMPLOS DE USO
-- ============================================================================

/*
-- Ejemplo 1: Crucigrama correcto (100%)
SELECT * FROM educational_content.validate_crucigrama(
    '{"clues": {"h1": "SORBONA", "h2": "NOBEL", "v1": "POLONIO"}}'::jsonb,
    '{"clues": {"h1": "sorbona", "h2": "nobel", "v1": "polonio"}}'::jsonb,
    100,
    false,  -- case_sensitive
    true    -- normalize_text
);

-- Resultado esperado:
-- is_correct | score | feedback                           | details
-- -----------|-------|------------------------------------|---------
-- true       | 100   | ¡Perfecto! Todas las 3 palabras... | {...}

-- Ejemplo 2: Crucigrama parcialmente correcto (66%)
SELECT * FROM educational_content.validate_crucigrama(
    '{"clues": {"h1": "SORBONA", "h2": "NOBEL", "v1": "POLONIO"}}'::jsonb,
    '{"clues": {"h1": "sorbona", "h2": "nobel", "v1": "RADIO"}}'::jsonb,
    100,
    false,
    true
);

-- Resultado esperado:
-- is_correct | score | feedback                        | details
-- -----------|-------|----------------------------------|---------
-- false      | 67    | Tienes 2/3 palabras correctas... | {...}
*/
