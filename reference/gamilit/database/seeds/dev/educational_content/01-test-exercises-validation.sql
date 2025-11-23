-- ============================================================================
-- SEED: Ejercicios de Prueba para Validadores
-- Descripción: 15 ejercicios de prueba (uno por tipo) para testing de validadores
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-117
-- Ambiente: DEV/TEST (no production)
-- ============================================================================

-- NOTA: Este seed requiere que exista al menos un módulo
-- Si no existe, crear módulo de prueba

DO $$
DECLARE
    v_test_module_id UUID;
    v_test_user_id UUID := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid; -- Usuario demo teacher
BEGIN
    -- ========================================================================
    -- CREAR MÓDULO DE PRUEBA SI NO EXISTE
    -- ========================================================================
    SELECT id INTO v_test_module_id
    FROM educational_content.modules
    WHERE title = 'Módulo de Prueba - Validadores'
    LIMIT 1;

    IF v_test_module_id IS NULL THEN
        INSERT INTO educational_content.modules (
            id,
            title,
            description,
            order_index,
            is_active
        ) VALUES (
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
            'Módulo de Prueba - Validadores',
            'Módulo de prueba con ejercicios para testing de validadores',
            99,
            true
        ) RETURNING id INTO v_test_module_id;

        RAISE NOTICE 'Módulo de prueba creado: %', v_test_module_id;
    ELSE
        RAISE NOTICE 'Módulo de prueba ya existe: %', v_test_module_id;
    END IF;

    -- ========================================================================
    -- MÓDULO 1: COMPRENSIÓN LITERAL (5 ejercicios)
    -- ========================================================================

    -- 1. CRUCIGRAMA
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        '11111111-1111-1111-1111-111111111111'::uuid,
        v_test_module_id,
        'TEST: Crucigrama - Científicos Famosos',
        'crucigrama',
        1,
        '{
            "instructions": "Completa el crucigrama con nombres de científicos",
            "clues": {
                "h1": {"question": "Universidad donde estudió Marie Curie", "answer_length": 7},
                "h2": {"question": "Premio que ganó Marie Curie", "answer_length": 5}
            }
        }'::jsonb,
        '{
            "clues": {
                "h1": "SORBONA",
                "h2": "NOBEL"
            }
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- 2. LÍNEA DE TIEMPO
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        '22222222-2222-2222-2222-222222222222'::uuid,
        v_test_module_id,
        'TEST: Línea de Tiempo - Vida de Marie Curie',
        'linea_tiempo',
        2,
        '{
            "instructions": "Ordena los eventos cronológicamente",
            "events": {
                "event_1": {"text": "Nace en Polonia", "year": 1867},
                "event_2": {"text": "Se muda a París", "year": 1891},
                "event_3": {"text": "Gana primer Nobel", "year": 1903},
                "event_4": {"text": "Gana segundo Nobel", "year": 1911}
            }
        }'::jsonb,
        '{
            "correctOrder": ["event_1", "event_2", "event_3", "event_4"]
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- 3. SOPA DE LETRAS
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        '33333333-3333-3333-3333-333333333333'::uuid,
        v_test_module_id,
        'TEST: Sopa de Letras - Elementos Químicos',
        'sopa_letras',
        3,
        '{
            "instructions": "Encuentra las palabras ocultas",
            "grid": "...",
            "words_to_find": ["RADIO", "POLONIO", "URANIO"]
        }'::jsonb,
        '{
            "words": ["RADIO", "POLONIO", "URANIO"]
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- 4. COMPLETAR ESPACIOS
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        '44444444-4444-4444-4444-444444444444'::uuid,
        v_test_module_id,
        'TEST: Completar Espacios - Biografía',
        'completar_espacios',
        4,
        '{
            "instructions": "Completa los espacios en blanco",
            "text": "Marie Curie fue una {{blank1}} polaca que ganó el premio {{blank2}} en {{blank3}}.",
            "blanks": {
                "blank1": {"hint": "Profesión"},
                "blank2": {"hint": "Premio famoso"},
                "blank3": {"hint": "Área de estudio"}
            }
        }'::jsonb,
        '{
            "blanks": {
                "blank1": "científica",
                "blank2": "Nobel",
                "blank3": "física"
            }
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- 5. VERDADERO/FALSO
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        '55555555-5555-5555-5555-555555555555'::uuid,
        v_test_module_id,
        'TEST: Verdadero/Falso - Datos de Marie Curie',
        'verdadero_falso',
        5,
        '{
            "instructions": "Indica si las afirmaciones son verdaderas o falsas",
            "statements": {
                "stmt1": {"text": "Marie Curie nació en Francia"},
                "stmt2": {"text": "Ganó dos premios Nobel"},
                "stmt3": {"text": "Descubrió el radio"}
            }
        }'::jsonb,
        '{
            "statements": {
                "stmt1": false,
                "stmt2": true,
                "stmt3": true
            }
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- ========================================================================
    -- MÓDULO 2: COMPRENSIÓN INFERENCIAL (5 ejercicios)
    -- ========================================================================

    -- 6. DETECTIVE TEXTUAL
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        '66666666-6666-6666-6666-666666666666'::uuid,
        v_test_module_id,
        'TEST: Detective Textual - Inferencias',
        'detective_textual',
        6,
        '{
            "instructions": "Responde las preguntas basándote en inferencias del texto",
            "text": "Marie Curie trabajaba con materiales peligrosos sin protección...",
            "questions": {
                "q1": {
                    "question": "¿Por qué Marie Curie murió joven?",
                    "options": {
                        "option_a": "Accidente de laboratorio",
                        "option_b": "Exposición a radiación",
                        "option_c": "Enfermedad congénita"
                    }
                }
            }
        }'::jsonb,
        '{
            "correctAnswers": {
                "q1": "option_b"
            }
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- 7. CONSTRUCCIÓN DE HIPÓTESIS
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        '77777777-7777-7777-7777-777777777777'::uuid,
        v_test_module_id,
        'TEST: Construcción de Hipótesis - Descubrimiento',
        'construccion_hipotesis',
        7,
        '{
            "instructions": "Construye una hipótesis sobre el descubrimiento del radio (mínimo 20 palabras)",
            "context": "Marie Curie trabajó años con minerales radiactivos..."
        }'::jsonb,
        '{
            "keywords": ["descubrió", "radio", "experimento", "investigación", "evidencia"],
            "min_words": 20
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- 8. PREDICCIÓN NARRATIVA
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        '88888888-8888-8888-8888-888888888888'::uuid,
        v_test_module_id,
        'TEST: Predicción Narrativa - Consecuencias',
        'prediccion_narrativa',
        8,
        '{
            "instructions": "Predice qué pasará después (mínimo 30 palabras)",
            "narrative": "Marie Curie acaba de ganar su primer Nobel en 1903..."
        }'::jsonb,
        '{
            "keywords": ["continuará", "investigación", "premio", "descubrimiento"],
            "min_words": 30
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- 9. PUZZLE DE CONTEXTO
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        '99999999-9999-9999-9999-999999999999'::uuid,
        v_test_module_id,
        'TEST: Puzzle de Contexto - Análisis Contextual',
        'puzzle_contexto',
        9,
        '{
            "instructions": "Analiza el contexto y responde",
            "context": "A principios del siglo XX, pocas mujeres estudiaban ciencias...",
            "questions": {
                "q1": {
                    "question": "¿Qué podemos inferir del contexto?",
                    "options": {
                        "option_a": "Marie Curie fue excepcional",
                        "option_b": "Era común que mujeres fueran científicas",
                        "option_c": "No había discriminación"
                    }
                }
            }
        }'::jsonb,
        '{
            "correctAnswers": {
                "q1": "option_a"
            }
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- 10. RUEDA DE INFERENCIAS
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        'aaaaaaaa-1111-1111-1111-111111111111'::uuid,
        v_test_module_id,
        'TEST: Rueda de Inferencias - Causa y Efecto',
        'rueda_inferencias',
        10,
        '{
            "instructions": "Relaciona cada inferencia con su conclusión",
            "inferences": {
                "inf1": {"text": "Marie trabajó con materiales radiactivos sin protección"},
                "inf2": {"text": "Dedicó toda su vida a la ciencia"}
            },
            "conclusions": ["conclusion1", "conclusion2"]
        }'::jsonb,
        '{
            "correctInferences": {
                "inf1": "conclusion1",
                "inf2": "conclusion2"
            }
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- ========================================================================
    -- MÓDULO 3: PENSAMIENTO CRÍTICO (5 ejercicios)
    -- ========================================================================

    -- 11. TRIBUNAL DE OPINIONES
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        'bbbbbbbb-1111-1111-1111-111111111111'::uuid,
        v_test_module_id,
        'TEST: Tribunal de Opiniones - Argumento',
        'tribunal_opiniones',
        11,
        '{
            "instructions": "Escribe tu opinión argumentada sobre el papel de Marie Curie en la ciencia (mínimo 100 palabras)",
            "topic": "Impacto de Marie Curie en la ciencia moderna"
        }'::jsonb,
        '{
            "keywords": ["opinión", "argumento", "evidencia", "conclusión", "porque"],
            "min_words": 100
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- 12. DEBATE DIGITAL
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        'cccccccc-1111-1111-1111-111111111111'::uuid,
        v_test_module_id,
        'TEST: Debate Digital - Pros y Contras',
        'debate_digital',
        12,
        '{
            "instructions": "Presenta argumento y contraargumento sobre el uso de radiación (mínimo 150 palabras totales)",
            "topic": "Uso de radiación en medicina"
        }'::jsonb,
        '{
            "keywords": ["argumento", "contraargumento", "sin embargo", "por el contrario"],
            "min_words": 150
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- 13. ANÁLISIS DE FUENTES
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        'dddddddd-1111-1111-1111-111111111111'::uuid,
        v_test_module_id,
        'TEST: Análisis de Fuentes - Credibilidad',
        'analisis_fuentes',
        13,
        '{
            "instructions": "Analiza la credibilidad de las fuentes",
            "sources": [
                {
                    "id": "source1",
                    "title": "Artículo científico revisado por pares",
                    "author": "Dr. Smith, Universidad de Oxford"
                }
            ],
            "questions": {
                "q1": {
                    "question": "¿Cuál es el nivel de credibilidad de la fuente 1?",
                    "options": {
                        "option_a": "Alta",
                        "option_b": "Media",
                        "option_c": "Baja"
                    }
                }
            }
        }'::jsonb,
        '{
            "correctAnswers": {
                "q1": "option_a"
            },
            "criticalQuestions": {
                "q1": true
            }
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- 14. PODCAST ARGUMENTATIVO
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        'eeeeeeee-1111-1111-1111-111111111111'::uuid,
        v_test_module_id,
        'TEST: Podcast Argumentativo - Audio',
        'podcast_argumentativo',
        14,
        '{
            "instructions": "Graba un podcast argumentativo sobre Marie Curie (2-10 minutos)"
        }'::jsonb,
        '{
            "min_duration_seconds": 120,
            "max_duration_seconds": 600,
            "max_size_mb": 50,
            "allowed_formats": ["mp3", "m4a", "wav", "ogg"]
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    -- 15. MATRIZ DE PERSPECTIVAS
    INSERT INTO educational_content.exercises (
        id,
        module_id,
        title,
        exercise_type,
        order_index,
        content,
        solution,
        auto_gradable,
        max_points,
        created_by
    ) VALUES (
        'ffffffff-1111-1111-1111-111111111111'::uuid,
        v_test_module_id,
        'TEST: Matriz de Perspectivas - Análisis Multidimensional',
        'matriz_perspectivas',
        15,
        '{
            "instructions": "Analiza el tema desde diferentes perspectivas (mínimo 50 caracteres por celda)",
            "topic": "Impacto de Marie Curie",
            "perspectives": ["perspective1", "perspective2", "perspective3"]
        }'::jsonb,
        '{
            "requiredPerspectives": ["perspective1", "perspective2", "perspective3"],
            "min_chars_per_cell": 50
        }'::jsonb,
        true,
        100,
        v_test_user_id
    ) ON CONFLICT (module_id, exercise_type, order_index) DO NOTHING;

    RAISE NOTICE '15 ejercicios de prueba creados exitosamente';
END $$;

-- ============================================================================
-- VALIDACIÓN
-- ============================================================================

-- Verificar que se crearon los 15 ejercicios
DO $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM educational_content.exercises
    WHERE module_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid;

    IF v_count = 15 THEN
        RAISE NOTICE '✅ VALIDACIÓN EXITOSA: 15 ejercicios de prueba creados';
    ELSE
        RAISE WARNING '⚠️ VALIDACIÓN FALLIDA: Se esperaban 15 ejercicios, se encontraron %', v_count;
    END IF;
END $$;
