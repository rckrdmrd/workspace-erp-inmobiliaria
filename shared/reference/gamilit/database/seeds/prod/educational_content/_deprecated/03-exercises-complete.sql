-- =====================================================
-- Seed: educational_content.exercises (PROD) - COMPLETO CORREGIDO
-- Description: Ejercicios completos para todos los módulos
-- Environment: PRODUCTION
-- Dependencies: educational_content.modules
-- Order: 03
-- Created: 2025-11-11
-- Version: 3.0 - CORREGIDO
-- =====================================================
--
-- CORRECCIONES APLICADAS (v3.0):
-- ✅ Usar exercise_type (no mechanic_type) según DDL
-- ✅ Usar valores correctos del ENUM exercise_type
-- ✅ Agregar order_index (requerido)
-- ✅ Agregar config JSONB con configuración de mecánica
-- ✅ Usar campos requeridos: title, instructions, order_index
--
-- EJERCICIOS POR MÓDULO:
-- - Módulo 1 (Comprensión Literal): 17 ejercicios
-- - Módulo 2 (Comprensión Inferencial): 17 ejercicios
-- - Módulo 3 (Comprensión Crítica): 17 ejercicios
-- - Módulo 4 (Lectura Digital): 17 ejercicios
-- - Módulo 5 (Producción de Textos): 17 ejercicios
--
-- TOTAL: 85 ejercicios
--
-- MECÁNICAS INCLUIDAS (de exercise_type ENUM):
-- - verdadero_falso (20%)
-- - completar_espacios (20%)
-- - crucigrama (20%)
-- - emparejamiento (20%)
-- - comprension_auditiva (20%)
-- =====================================================

SET search_path TO educational_content, public;

-- =====================================================
-- Generación de Ejercicios
-- =====================================================

DO $$
DECLARE
    module_rec RECORD;
    exercise_type_val TEXT;
    difficulty TEXT;
    exercise_count INTEGER := 0;
    i INTEGER;
    exercise_config JSONB;
BEGIN
    -- Iterar por cada módulo
    FOR module_rec IN
        SELECT id, module_number, title
        FROM educational_content.modules
        ORDER BY module_number
    LOOP
        RAISE NOTICE 'Creando ejercicios para módulo %: %', module_rec.module_number, module_rec.title;

        -- Crear 17 ejercicios por módulo
        FOR i IN 1..17 LOOP
            -- Seleccionar tipo de ejercicio de forma balanceada (usando valores reales del ENUM)
            exercise_type_val := CASE
                WHEN i <= 4 THEN 'verdadero_falso'       -- 24% (4/17)
                WHEN i <= 7 THEN 'completar_espacios'    -- 18% (3/17)
                WHEN i <= 10 THEN 'crucigrama'           -- 18% (3/17)
                WHEN i <= 14 THEN 'emparejamiento'       -- 24% (4/17)
                ELSE 'comprension_auditiva'              -- 18% (3/17)
            END;

            -- Seleccionar dificultad progresiva (usando valores CEFR del ENUM)
            difficulty := CASE
                WHEN i <= 6 THEN 'beginner'              -- A1
                WHEN i <= 12 THEN 'intermediate'         -- B2
                ELSE 'advanced'                          -- C2
            END;

            -- Configuración específica por tipo de ejercicio
            exercise_config := CASE exercise_type_val
                WHEN 'verdadero_falso' THEN jsonb_build_object(
                    'statements_count', 1,
                    'show_explanation', true,
                    'randomize', false
                )
                WHEN 'completar_espacios' THEN jsonb_build_object(
                    'blanks_count', CASE difficulty
                        WHEN 'beginner' THEN 2
                        WHEN 'intermediate' THEN 3
                        ELSE 4
                    END,
                    'case_sensitive', false,
                    'accept_synonyms', true
                )
                WHEN 'crucigrama' THEN jsonb_build_object(
                    'words_count', CASE difficulty
                        WHEN 'beginner' THEN 5
                        WHEN 'intermediate' THEN 8
                        ELSE 12
                    END,
                    'show_hints', true,
                    'hint_cost', 5
                )
                WHEN 'emparejamiento' THEN jsonb_build_object(
                    'pairs_count', CASE difficulty
                        WHEN 'beginner' THEN 4
                        WHEN 'intermediate' THEN 6
                        ELSE 8
                    END,
                    'randomize', true
                )
                WHEN 'comprension_auditiva' THEN jsonb_build_object(
                    'audio_duration_seconds', CASE difficulty
                        WHEN 'beginner' THEN 30
                        WHEN 'intermediate' THEN 60
                        ELSE 120
                    END,
                    'playback_limit', 3,
                    'show_transcript_after', true
                )
                ELSE jsonb_build_object()
            END;

            -- Insertar ejercicio
            INSERT INTO educational_content.exercises (
                id,
                module_id,
                title,
                instructions,
                exercise_type,                -- ✅ CORREGIDO: era mechanic_type
                order_index,                  -- ✅ AGREGADO: requerido
                config,                       -- ✅ AGREGADO: configuración específica
                difficulty_level,
                max_points,
                estimated_time_minutes,
                is_active,
                metadata,
                created_at,
                updated_at
            ) VALUES (
                gen_random_uuid(),
                module_rec.id,
                format('Ejercicio %s-%s: %s', module_rec.module_number, i,
                    CASE exercise_type_val
                        WHEN 'verdadero_falso' THEN 'Verdadero o Falso'
                        WHEN 'completar_espacios' THEN 'Completar Espacios'
                        WHEN 'crucigrama' THEN 'Crucigrama'
                        WHEN 'emparejamiento' THEN 'Emparejar'
                        WHEN 'comprension_auditiva' THEN 'Comprensión Auditiva'
                    END
                ),
                format('Lee cuidadosamente y %s',
                    CASE exercise_type_val
                        WHEN 'verdadero_falso' THEN 'indica si la afirmación es verdadera o falsa'
                        WHEN 'completar_espacios' THEN 'completa los espacios en blanco'
                        WHEN 'crucigrama' THEN 'completa el crucigrama con las palabras correctas'
                        WHEN 'emparejamiento' THEN 'empareja los elementos correctamente'
                        WHEN 'comprension_auditiva' THEN 'escucha el audio y responde las preguntas'
                    END
                ),
                exercise_type_val::educational_content.exercise_type,  -- ✅ Cast explícito
                i,                            -- ✅ order_index según posición
                exercise_config,              -- ✅ Configuración JSONB
                difficulty::educational_content.difficulty_level,     -- ✅ Cast explícito
                CASE difficulty
                    WHEN 'beginner' THEN 10
                    WHEN 'intermediate' THEN 15
                    WHEN 'advanced' THEN 20
                END,
                CASE difficulty
                    WHEN 'beginner' THEN 2
                    WHEN 'intermediate' THEN 3
                    WHEN 'advanced' THEN 5
                END,
                true,
                jsonb_build_object(
                    'tags', ARRAY['lectura', 'comprension'],
                    'estimated_time', format('%s minutos',
                        CASE difficulty
                            WHEN 'beginner' THEN '2'
                            WHEN 'intermediate' THEN '3'
                            WHEN 'advanced' THEN '5'
                        END
                    ),
                    'auto_generated', true,
                    'version', '3.0',
                    'corrected', true
                ),
                gamilit.now_mexico(),
                gamilit.now_mexico()
            );

            exercise_count := exercise_count + 1;
        END LOOP;
    END LOOP;

    RAISE NOTICE '========================================';
    RAISE NOTICE 'EJERCICIOS CREADOS EXITOSAMENTE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total ejercicios creados: %', exercise_count;
    RAISE NOTICE 'Esperados: 85 (17 por módulo × 5 módulos)';
    RAISE NOTICE '========================================';

    IF exercise_count = 85 THEN
        RAISE NOTICE '✓ Todos los ejercicios fueron creados correctamente';
    ELSE
        RAISE WARNING '⚠ Se esperaban 85 ejercicios, se crearon %', exercise_count;
    END IF;
END $$;

-- =====================================================
-- Verificación de distribución por módulo
-- =====================================================

DO $$
DECLARE
    module_rec RECORD;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DISTRIBUCIÓN DE EJERCICIOS POR MÓDULO';
    RAISE NOTICE '========================================';

    FOR module_rec IN
        SELECT
            m.module_number,
            m.title,
            COUNT(e.id) as exercise_count
        FROM educational_content.modules m
        LEFT JOIN educational_content.exercises e ON e.module_id = m.id
        GROUP BY m.module_number, m.title, m.id
        ORDER BY m.module_number
    LOOP
        RAISE NOTICE 'Módulo %: % - % ejercicios',
            module_rec.module_number,
            module_rec.title,
            module_rec.exercise_count;
    END LOOP;

    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- Verificación de tipos de ejercicio
-- =====================================================

DO $$
DECLARE
    type_rec RECORD;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DISTRIBUCIÓN POR TIPO DE EJERCICIO';
    RAISE NOTICE '========================================';

    FOR type_rec IN
        SELECT
            exercise_type,
            COUNT(*) as count,
            ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM educational_content.exercises)), 1) as percentage
        FROM educational_content.exercises
        GROUP BY exercise_type
        ORDER BY count DESC
    LOOP
        RAISE NOTICE '%: % ejercicios (%%)',
            type_rec.exercise_type,
            type_rec.count,
            type_rec.percentage;
    END LOOP;

    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- Verificación de dificultad
-- =====================================================

DO $$
DECLARE
    difficulty_rec RECORD;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DISTRIBUCIÓN POR DIFICULTAD';
    RAISE NOTICE '========================================';

    FOR difficulty_rec IN
        SELECT
            difficulty_level,
            COUNT(*) as count,
            ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM educational_content.exercises)), 1) as percentage
        FROM educational_content.exercises
        GROUP BY difficulty_level
        ORDER BY
            CASE difficulty_level
                WHEN 'beginner' THEN 1
                WHEN 'elementary' THEN 2
                WHEN 'pre_intermediate' THEN 3
                WHEN 'intermediate' THEN 4
                WHEN 'upper_intermediate' THEN 5
                WHEN 'advanced' THEN 6
                WHEN 'proficient' THEN 7
                WHEN 'native' THEN 8
            END
    LOOP
        RAISE NOTICE '%: % ejercicios (%%)',
            difficulty_rec.difficulty_level,
            difficulty_rec.count,
            difficulty_rec.percentage;
    END LOOP;

    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- Testing Info
-- =====================================================
-- VERSIÓN 3.0 - CORREGIDA
-- Se crearon 85 ejercicios distribuidos en:
-- - 5 módulos (17 ejercicios cada uno)
-- - 5 tipos de ejercicio (del ENUM exercise_type)
-- - 3 niveles de dificultad CEFR (beginner, intermediate, advanced)
-- - Cada ejercicio tiene config JSONB específico para su tipo
-- =====================================================
