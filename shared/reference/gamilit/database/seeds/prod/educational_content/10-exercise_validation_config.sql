-- ============================================================================
-- SEED: exercise_validation_config
-- Descripción: Configuración de validación para 15 tipos de ejercicios
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116 (Handoff FE-059)
-- Alcance: Módulos 1, 2, 3 (15 tipos reales)
-- NOTA: mapa_conceptual y emparejamiento NO existen en el ENUM exercise_type
-- ============================================================================

INSERT INTO educational_content.exercise_validation_config (
    exercise_type,
    validation_function,
    case_sensitive,
    allow_partial_credit,
    fuzzy_matching_threshold,
    normalize_text,
    special_rules,
    default_max_points,
    default_passing_score,
    description,
    examples
) VALUES

-- ============================================================================
-- MÓDULO 1: COMPRENSIÓN LITERAL (5 tipos)
-- ============================================================================

-- 1.1. CRUCIGRAMA
(
    'crucigrama',
    'validate_crucigrama',
    false,                          -- No case-sensitive
    true,                           -- Puntuación parcial por respuesta correcta
    NULL,                           -- No fuzzy matching (respuestas exactas)
    true,                           -- Normalizar texto (quitar acentos)
    '{
        "allow_empty_cells": false,
        "score_per_word": true
    }'::jsonb,
    100,
    70,
    'Validación de crucigrama: compara cada respuesta con solution por id (h1, h2, v1, etc.)',
    '{
        "submitted": {"clues": {"h1": "sorbona", "h2": "nobel"}},
        "solution": {"clues": {"h1": "SORBONA", "h2": "NOBEL"}},
        "result": {"is_correct": true, "score": 100}
    }'::jsonb
),

-- 1.2. LÍNEA DE TIEMPO
(
    'linea_tiempo',
    'validate_timeline',
    false,
    true,
    NULL,
    true,
    '{
        "scoring_method": "position_based",
        "allow_partial_order": true
    }'::jsonb,
    100,
    70,
    'Validación de línea de tiempo: compara orden de eventos',
    '{
        "submitted": {"events": ["event-1", "event-2", "event-3"]},
        "solution": {"correctOrder": ["event-1", "event-2", "event-3"]},
        "result": {"is_correct": true, "score": 100}
    }'::jsonb
),

-- 1.3. SOPA DE LETRAS
(
    'sopa_letras',
    'validate_word_search',
    false,
    true,
    NULL,
    true,
    '{
        "score_per_word_found": true,
        "require_all_words": false
    }'::jsonb,
    100,
    70,
    'Validación de sopa de letras: verifica palabras encontradas vs esperadas',
    '{
        "submitted": {"words": ["MARIE", "CURIE", "POLONIA"]},
        "solution": {"allWords": ["MARIE", "CURIE", "POLONIA", "NOBEL", "RADIO"]},
        "result": {"is_correct": false, "score": 60}
    }'::jsonb
),

-- 1.4. COMPLETAR ESPACIOS
(
    'completar_espacios',
    'validate_fill_in_blank',
    false,
    true,
    0.85,                           -- Permitir 85% de similaridad (fuzzy matching)
    true,
    '{
        "allow_synonyms": false,
        "score_per_blank": true
    }'::jsonb,
    100,
    70,
    'Validación de completar espacios: compara cada respuesta con correctAnswers por id',
    '{
        "submitted": {"blanks": {"blank1": "varsovia", "blank2": "wladyslaw"}},
        "solution": {"correctAnswers": {"blank1": "Varsovia", "blank2": "Władysław"}},
        "result": {"is_correct": true, "score": 100}
    }'::jsonb
),

-- 1.5. VERDADERO O FALSO
(
    'verdadero_falso',
    'validate_true_false',
    false,
    true,
    NULL,
    false,
    '{
        "score_per_statement": true
    }'::jsonb,
    100,
    70,
    'Validación de verdadero/falso: compara objeto de statements',
    '{
        "submitted": {"statements": {"stmt1": false, "stmt2": true, "stmt3": true, "stmt4": false}},
        "solution": {"correctAnswers": {"stmt1": false, "stmt2": true, "stmt3": true, "stmt4": false}},
        "result": {"is_correct": true, "score": 100}
    }'::jsonb
),

-- ============================================================================
-- MÓDULO 2: COMPRENSIÓN INFERENCIAL (5 tipos)
-- ============================================================================

-- 2.1. DETECTIVE TEXTUAL
(
    'detective_textual',
    'validate_detective_textual',
    false,
    true,
    NULL,
    false,
    '{
        "allowPartialCredit": true
    }'::jsonb,
    100,
    70,
    'Validación de detective textual: preguntas de inferencia con opciones múltiples',
    '{
        "submitted": {"questions": {"q1": "1", "q2": "1", "q3": "1", "q4": "1"}},
        "solution": {"correctAnswers": {"q1": "1", "q2": "1", "q3": "1", "q4": "1"}, "totalQuestions": 4},
        "result": {"is_correct": true, "correct_answers": 4, "score": 100}
    }'::jsonb
),

-- 2.2. CONSTRUCCIÓN DE HIPÓTESIS (Causa-Efecto Matching)
(
    'construccion_hipotesis',
    'validate_cause_effect_matching',
    false,
    true,
    NULL,
    true,
    '{
        "allowPartialMatches": true,
        "strictOrder": false
    }'::jsonb,
    100,
    70,
    'Validación de causa-efecto: asociación de causas con consecuencias mediante drag & drop',
    '{
        "submitted": {"causes": {"c1": ["cons1", "cons2"], "c2": ["cons3"], "c3": ["cons4"]}},
        "solution": {"causes": {"c1": ["cons1", "cons2"], "c2": ["cons3"], "c3": ["cons4"]}},
        "result": {"is_correct": true, "correctCount": 4, "totalCount": 4, "score": 100}
    }'::jsonb
),

-- 2.3. PREDICCIÓN NARRATIVA
(
    'prediccion_narrativa',
    'validate_prediction_scenarios',
    false,
    true,
    NULL,
    true,
    '{
        "allowPartialCredit": true
    }'::jsonb,
    100,
    70,
    'Validación de predicción narrativa: selección de predicciones predefinidas para múltiples escenarios',
    '{
        "submitted": {"scenarios": {"pred-1": "p2", "pred-2": "p1"}},
        "solution": {"scenarios": {"pred-1": "p2", "pred-2": "p1"}},
        "result": {"is_correct": true, "correctCount": 2, "score": 100}
    }'::jsonb
),

-- 2.4. PUZZLE DE CONTEXTO
(
    'puzzle_contexto',
    'validate_puzzle_contexto',
    false,
    true,
    NULL,
    false,
    '{
        "score_per_question": true,
        "question_type": "context_inference"
    }'::jsonb,
    100,
    70,
    'Validación de puzzle de contexto: multiple choice con inferencias contextuales',
    '{
        "submitted": {"questions": {"q1": "option_c", "q2": "option_a"}},
        "solution": {"correctAnswers": {"q1": "option_c", "q2": "option_a"}},
        "result": {"is_correct": true, "score": 100}
    }'::jsonb
),

-- 2.5. RUEDA DE INFERENCIAS (Texto Libre)
(
    'rueda_inferencias',
    'validate_rueda_inferencias',
    false,
    true,
    NULL,
    true,
    '{
        "validation_type": "keyword_based",
        "min_keywords": 2,
        "min_length": 20,
        "max_length": 200,
        "score_per_fragment": true
    }'::jsonb,
    100,
    70,
    'Validación de rueda de inferencias con texto libre: wrapper estándar que valida múltiples fragmentos con keywords',
    '{
        "submitted": {"fragments": {"frag-1": "Marie Curie fue la primera mujer en ganar el Nobel en física y química", "frag-2": "Ella usaba el apellido Curie en sus publicaciones"}},
        "solution": {"fragments": [{"id": "frag-1", "keywords": ["nobel", "física", "química", "primera", "mujer"], "points": 20}, {"id": "frag-2", "keywords": ["apellido", "curie", "publicaciones"], "points": 20}], "validation": {"minKeywords": 2, "minLength": 20, "maxLength": 200}},
        "result": {"is_correct": true, "valid_fragments": 2, "total_points": 40, "score": 100}
    }'::jsonb
),

-- ============================================================================
-- MÓDULO 3: COMPRENSIÓN CRÍTICA (5 tipos)
-- ============================================================================

-- 3.1. TRIBUNAL DE OPINIONES
(
    'tribunal_opiniones',
    'validate_tribunal_opiniones',
    false,
    true,
    0.75,
    true,
    '{
        "min_word_count": 100,
        "require_keywords": true,
        "keywords": ["argumento", "evidencia", "porque", "razón"],
        "rubric_criteria": ["argumentación", "evidencia", "contra-argumentos"]
    }'::jsonb,
    100,
    70,
    'Validación heurística de tribunal: verifica longitud y palabras clave de argumentación',
    '{
        "submitted": {"opinion": "Opino que Marie Curie fue importante porque..."},
        "solution": {"keywords": ["argumento", "evidencia", "porque"], "min_words": 100},
        "result": {"is_correct": true, "score": 85}
    }'::jsonb
),

-- 3.2. DEBATE DIGITAL
(
    'debate_digital',
    'validate_debate_digital',
    false,
    true,
    0.75,
    true,
    '{
        "min_word_count": 150,
        "require_keywords": true,
        "keywords": ["postura", "evidencia", "argumento", "contra-argumento"],
        "rubric_criteria": ["postura_clara", "evidencias", "respeto"]
    }'::jsonb,
    100,
    70,
    'Validación heurística de debate: verifica longitud, palabras clave y estructura argumentativa',
    '{
        "submitted": {"debate": "Mi postura es que... porque las evidencias muestran..."},
        "solution": {"keywords": ["postura", "evidencia", "argumento"], "min_words": 150},
        "result": {"is_correct": true, "score": 90}
    }'::jsonb
),

-- 3.3. ANÁLISIS DE FUENTES
(
    'analisis_fuentes',
    'validate_analisis_fuentes',
    false,
    true,
    NULL,
    false,
    '{
        "score_per_question": true,
        "question_type": "source_analysis"
    }'::jsonb,
    100,
    70,
    'Validación de análisis de fuentes: preguntas de análisis crítico',
    '{
        "submitted": {"questions": {"q1": "option_a", "q2": "option_c"}},
        "solution": {"correctAnswers": {"q1": "option_a", "q2": "option_c"}},
        "result": {"is_correct": true, "score": 100}
    }'::jsonb
),

-- 3.4. PODCAST ARGUMENTATIVO
(
    'podcast_argumentativo',
    'validate_podcast_argumentativo',
    false,
    true,
    NULL,
    false,
    '{
        "check_duration": true,
        "min_duration_seconds": 120,
        "max_duration_seconds": 300,
        "check_format": true,
        "allowed_formats": ["mp3", "wav", "ogg"]
    }'::jsonb,
    100,
    70,
    'Validación de podcast: verifica duración y formato de audio',
    '{
        "submitted": {"audio_url": "https://example.com/podcast.mp3", "duration": 180},
        "solution": {"min_duration": 120, "max_duration": 300},
        "result": {"is_correct": true, "score": 100}
    }'::jsonb
),

-- 3.5. MATRIZ DE PERSPECTIVAS
(
    'matriz_perspectivas',
    'validate_matriz_perspectivas',
    false,
    true,
    0.75,
    true,
    '{
        "score_per_cell": true,
        "require_all_cells": true,
        "min_chars_per_cell": 50
    }'::jsonb,
    100,
    70,
    'Validación de matriz: verifica que todas las celdas estén completadas correctamente',
    '{
        "submitted": {"matrix": {"cell1": "perspectiva A", "cell2": "perspectiva B"}},
        "solution": {"required_cells": ["cell1", "cell2"], "min_chars": 50},
        "result": {"is_correct": true, "score": 100}
    }'::jsonb
)

ON CONFLICT (exercise_type)
DO UPDATE SET
    validation_function = EXCLUDED.validation_function,
    case_sensitive = EXCLUDED.case_sensitive,
    allow_partial_credit = EXCLUDED.allow_partial_credit,
    fuzzy_matching_threshold = EXCLUDED.fuzzy_matching_threshold,
    normalize_text = EXCLUDED.normalize_text,
    special_rules = EXCLUDED.special_rules,
    default_max_points = EXCLUDED.default_max_points,
    default_passing_score = EXCLUDED.default_passing_score,
    description = EXCLUDED.description,
    examples = EXCLUDED.examples,
    updated_at = gamilit.now_mexico();

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Verificar que se cargaron las 15 configuraciones
DO $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM educational_content.exercise_validation_config;

    IF v_count < 15 THEN
        RAISE WARNING 'Solo se cargaron % configuraciones. Se esperaban 15.', v_count;
    ELSE
        RAISE NOTICE 'Configuraciones cargadas correctamente: % de 15', v_count;
    END IF;
END $$;

-- Mostrar resumen de configuraciones
SELECT
    exercise_type,
    validation_function,
    CASE
        WHEN allow_partial_credit THEN 'Parcial'
        ELSE 'Todo/Nada'
    END as scoring,
    CASE
        WHEN fuzzy_matching_threshold IS NOT NULL
        THEN fuzzy_matching_threshold::TEXT
        ELSE 'Exacto'
    END as matching,
    default_max_points as max_pts,
    default_passing_score as pass_pts
FROM educational_content.exercise_validation_config
ORDER BY exercise_type;
