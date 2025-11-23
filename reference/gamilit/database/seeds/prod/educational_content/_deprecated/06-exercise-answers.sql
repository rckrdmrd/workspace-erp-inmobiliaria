-- =====================================================
-- Seed: educational_content.exercise_answers (PROD) - CORREGIDO
-- Description: Respuestas correctas para ejercicios de texto abierto
-- Environment: PRODUCTION
-- Dependencies: educational_content.exercises
-- Order: 06
-- Created: 2025-11-11
-- Version: 2.0 - CORREGIDO
-- =====================================================
--
-- CORRECCIONES APLICADAS (v2.0):
-- ✅ Usar estructura correcta del DDL (answer_text, is_case_sensitive, etc.)
-- ✅ Eliminar campos inexistentes (option_id, answer_data, explanation)
-- ✅ Solo crear respuestas para tipos que las necesitan
-- ✅ Usar alternate_answers para respuestas alternativas
--
-- TIPOS QUE USAN exercise_answers:
-- - completar_espacios: Respuestas de texto para espacios en blanco
-- - crucigrama: Palabras correctas del crucigrama
-- - verdadero_falso: Respuesta correcta (True/False)
--
-- TOTAL: ~50 respuestas (aproximado según tipos)
-- =====================================================

SET search_path TO educational_content, public;

-- =====================================================
-- INSERT: Exercise Answers
-- =====================================================

DO $$
DECLARE
    exercise_rec RECORD;
    answer_count INTEGER := 0;
BEGIN
    -- Iterar por cada ejercicio que necesita respuestas
    FOR exercise_rec IN
        SELECT id, title, exercise_type, difficulty_level
        FROM educational_content.exercises
        WHERE exercise_type IN ('completar_espacios', 'crucigrama', 'verdadero_falso')
        ORDER BY id
    LOOP
        -- Generar respuesta según tipo de ejercicio
        CASE exercise_rec.exercise_type
            -- ===== COMPLETAR ESPACIOS =====
            WHEN 'completar_espacios' THEN
                -- Crear múltiples respuestas para los espacios en blanco
                FOR i IN 1..(CASE exercise_rec.difficulty_level
                    WHEN 'beginner' THEN 2
                    WHEN 'intermediate' THEN 3
                    ELSE 4
                END) LOOP
                    INSERT INTO educational_content.exercise_answers (
                        id,
                        exercise_id,
                        answer_text,
                        is_case_sensitive,
                        is_exact_match,
                        alternate_answers,
                        points_value,
                        created_at,
                        updated_at
                    ) VALUES (
                        gen_random_uuid(),
                        exercise_rec.id,
                        format('respuesta_%s', i),              -- Texto de respuesta principal
                        false,                                   -- No case sensitive
                        false,                                   -- Fuzzy match permitido
                        ARRAY[                                   -- Respuestas alternativas aceptables
                            format('alternativa_%s_a', i),
                            format('alternativa_%s_b', i)
                        ],
                        CASE exercise_rec.difficulty_level       -- Puntos según dificultad
                            WHEN 'beginner' THEN 2
                            WHEN 'intermediate' THEN 3
                            ELSE 5
                        END,
                        gamilit.now_mexico(),
                        gamilit.now_mexico()
                    );
                    answer_count := answer_count + 1;
                END LOOP;

            -- ===== CRUCIGRAMA =====
            WHEN 'crucigrama' THEN
                -- Crear respuestas para palabras del crucigrama
                FOR i IN 1..(CASE exercise_rec.difficulty_level
                    WHEN 'beginner' THEN 5
                    WHEN 'intermediate' THEN 8
                    ELSE 12
                END) LOOP
                    INSERT INTO educational_content.exercise_answers (
                        id,
                        exercise_id,
                        answer_text,
                        is_case_sensitive,
                        is_exact_match,
                        alternate_answers,
                        points_value,
                        created_at,
                        updated_at
                    ) VALUES (
                        gen_random_uuid(),
                        exercise_rec.id,
                        format('palabra_%s', i),                 -- Palabra correcta
                        false,                                   -- No case sensitive
                        true,                                    -- Exact match requerido
                        NULL,                                    -- No alternativas para crucigramas
                        1,                                       -- 1 punto por palabra
                        gamilit.now_mexico(),
                        gamilit.now_mexico()
                    );
                    answer_count := answer_count + 1;
                END LOOP;

            -- ===== VERDADERO/FALSO =====
            WHEN 'verdadero_falso' THEN
                -- Crear una respuesta True o False
                INSERT INTO educational_content.exercise_answers (
                    id,
                    exercise_id,
                    answer_text,
                    is_case_sensitive,
                    is_exact_match,
                    alternate_answers,
                    points_value,
                    created_at,
                    updated_at
                ) VALUES (
                    gen_random_uuid(),
                    exercise_rec.id,
                    CASE (exercise_rec.id::text)::bytea::bit(1)::int % 2
                        WHEN 0 THEN 'true'
                        ELSE 'false'
                    END,                                         -- Alternar True/False
                    false,                                       -- No case sensitive
                    true,                                        -- Exact match
                    NULL,                                        -- No alternativas
                    CASE exercise_rec.difficulty_level           -- Puntos según dificultad
                        WHEN 'beginner' THEN 5
                        WHEN 'intermediate' THEN 8
                        ELSE 10
                    END,
                    gamilit.now_mexico(),
                    gamilit.now_mexico()
                );
                answer_count := answer_count + 1;

            ELSE
                RAISE WARNING 'Tipo de ejercicio no soportado para answers: %', exercise_rec.exercise_type;
        END CASE;
    END LOOP;

    RAISE NOTICE '========================================';
    RAISE NOTICE 'RESPUESTAS DE EJERCICIOS CREADAS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total respuestas creadas: %', answer_count;
    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    answers_count INTEGER;
    exercises_with_answers INTEGER;
    type_rec RECORD;
BEGIN
    SELECT COUNT(*) INTO answers_count
    FROM educational_content.exercise_answers;

    SELECT COUNT(DISTINCT exercise_id) INTO exercises_with_answers
    FROM educational_content.exercise_answers;

    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERIFICACIÓN DE RESPUESTAS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total respuestas: %', answers_count;
    RAISE NOTICE 'Ejercicios con respuestas: %', exercises_with_answers;
    RAISE NOTICE '========================================';

    -- Distribución por tipo de ejercicio
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DISTRIBUCIÓN POR TIPO DE EJERCICIO';
    RAISE NOTICE '========================================';

    FOR type_rec IN
        SELECT
            e.exercise_type,
            COUNT(ea.id) as answers_count,
            COUNT(DISTINCT ea.exercise_id) as exercises_count
        FROM educational_content.exercises e
        LEFT JOIN educational_content.exercise_answers ea ON ea.exercise_id = e.id
        WHERE e.exercise_type IN ('completar_espacios', 'crucigrama', 'verdadero_falso')
        GROUP BY e.exercise_type
        ORDER BY e.exercise_type
    LOOP
        RAISE NOTICE '%: % respuestas en % ejercicios',
            type_rec.exercise_type,
            type_rec.answers_count,
            type_rec.exercises_count;
    END LOOP;

    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- Verificación: Ejercicios con/sin respuestas
-- =====================================================

DO $$
DECLARE
    with_answers INTEGER;
    without_answers INTEGER;
    expected_with_answers INTEGER;
BEGIN
    SELECT COUNT(DISTINCT e.id) INTO with_answers
    FROM educational_content.exercises e
    INNER JOIN educational_content.exercise_answers ea ON ea.exercise_id = e.id;

    SELECT COUNT(*) INTO without_answers
    FROM educational_content.exercises e
    WHERE NOT EXISTS (
        SELECT 1 FROM educational_content.exercise_answers ea WHERE ea.exercise_id = e.id
    );

    SELECT COUNT(*) INTO expected_with_answers
    FROM educational_content.exercises
    WHERE exercise_type IN ('completar_espacios', 'crucigrama', 'verdadero_falso');

    RAISE NOTICE '========================================';
    RAISE NOTICE 'COBERTURA DE RESPUESTAS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Ejercicios CON respuestas: %', with_answers;
    RAISE NOTICE 'Ejercicios SIN respuestas: %', without_answers;
    RAISE NOTICE 'Esperados con respuestas: %', expected_with_answers;
    RAISE NOTICE '========================================';

    IF with_answers = expected_with_answers THEN
        RAISE NOTICE '✓ Todos los ejercicios esperados tienen respuestas';
    ELSE
        RAISE WARNING '⚠ Diferencia: % vs % esperados', with_answers, expected_with_answers;
    END IF;

    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- Testing Info
-- =====================================================
-- VERSIÓN 2.0 - CORREGIDA
-- Se crearon respuestas para ejercicios de:
-- - completar_espacios: Múltiples respuestas por ejercicio (2-4)
-- - crucigrama: Palabras del crucigrama (5-12 por ejercicio)
-- - verdadero_falso: Una respuesta por ejercicio (true/false)
--
-- Estructura DDL correcta:
-- - answer_text: Texto de la respuesta principal
-- - is_case_sensitive: false (no distingue mayúsculas)
-- - is_exact_match: según tipo (true para crucigrama, false para completar)
-- - alternate_answers: Array de respuestas alternativas aceptables
-- - points_value: Puntos por respuesta correcta
-- =====================================================
