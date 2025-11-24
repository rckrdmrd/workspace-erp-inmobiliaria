-- =====================================================
-- Seed: educational_content.exercises (PROD - DEMO)
-- Description: Ejercicios demo para producción
-- Environment: PRODUCTION
-- Dependencies: educational_content.modules must have data
-- Order: 02
-- Created: 2025-11-11
-- Version: 1.0
-- =====================================================
--
-- PROPÓSITO:
-- Cargar ejercicios demo mínimos para que la plataforma tenga contenido
-- funcional en producción para pruebas y demostración.
--
-- ALCANCE:
-- - 1-2 ejercicios por cada uno de los 5 módulos Marie Curie
-- - Ejercicios representativos de diferentes mecánicas
-- - Contenido de calidad pero cantidad mínima
--
-- IMPORTANTE:
-- Este es contenido DEMO para producción. Para contenido completo
-- usar seeds de dev o cargar contenido real después del deployment.
--
-- CONTENIDO:
-- - Módulo 1: Comprensión Literal (2 ejercicios)
-- - Módulo 2: Comprensión Inferencial (2 ejercicios)
-- - Módulo 3: Comprensión Crítica (2 ejercicios)
-- - Módulo 4: Lectura Digital (2 ejercicios)
-- - Módulo 5: Producción de Textos (2 ejercicios)
--
-- Total: 10 ejercicios demo
--
-- =====================================================

SET search_path TO educational_content, gamification_system, public;

-- =====================================================
-- VALIDACIÓN PREVIA
-- =====================================================

DO $$
DECLARE
    modules_count INTEGER;
BEGIN
    -- Verificar que existen módulos
    SELECT COUNT(*) INTO modules_count FROM educational_content.modules;

    IF modules_count < 5 THEN
        RAISE EXCEPTION 'Se requieren al menos 5 módulos. Ejecutar 01-modules.sql primero. Encontrados: %', modules_count;
    END IF;

    RAISE NOTICE '✓ Validación completada: % módulos encontrados', modules_count;
END $$;

-- =====================================================
-- MÓDULO 1: COMPRENSIÓN LITERAL - 2 EJERCICIOS DEMO
-- =====================================================

INSERT INTO educational_content.exercises (
    id,
    module_id,
    title,
    description,
    exercise_type,
    cognitive_level,
    difficulty_level,
    content,
    correct_answer,
    xp_reward,
    ml_coins_reward,
    time_limit_seconds,
    max_attempts,
    orden,
    is_published,
    created_at,
    updated_at
) VALUES
(
    '00000001-demo-0000-0000-000000000001'::uuid,
    'd7e8f9a0-1b2c-3d4e-5f6a-7b8c9d0e1f20'::uuid, -- Módulo 1
    'Datos Básicos de Marie Curie',
    'Identifica información explícita en el texto biográfico',
    'multiple_choice'::educational_content.exercise_type,
    'remember'::educational_content.cognitive_level,
    'easy'::educational_content.difficulty_level,
    jsonb_build_object(
        'question', '¿En qué año nació Marie Curie?',
        'passage', 'Marie Curie nació el 7 de noviembre de 1867 en Varsovia, Polonia. Fue una destacada física y química que realizó investigaciones pioneras sobre la radioactividad.',
        'options', jsonb_build_array(
            jsonb_build_object('id', 'A', 'text', '1867'),
            jsonb_build_object('id', 'B', 'text', '1877'),
            jsonb_build_object('id', 'C', 'text', '1857'),
            jsonb_build_object('id', 'D', 'text', '1887')
        )
    ),
    jsonb_build_object('correct_option', 'A'),
    10, -- XP
    5,  -- ML Coins
    180, -- 3 minutos
    3,
    1,
    true,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '00000001-demo-0000-0000-000000000002'::uuid,
    'd7e8f9a0-1b2c-3d4e-5f6a-7b8c9d0e1f20'::uuid, -- Módulo 1
    'Lugar de Nacimiento',
    'Ubica información geográfica del texto',
    'select_text'::educational_content.exercise_type,
    'understand'::educational_content.cognitive_level,
    'easy'::educational_content.difficulty_level,
    jsonb_build_object(
        'question', 'Selecciona la ciudad donde nació Marie Curie',
        'passage', 'Marie Curie nació en Varsovia, la capital de Polonia. Desde joven mostró gran interés por la ciencia.',
        'instruction', 'Haz clic en la palabra correcta del texto'
    ),
    jsonb_build_object('correct_selection', 'Varsovia'),
    10,
    5,
    120,
    3,
    2,
    true,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- MÓDULO 2: COMPRENSIÓN INFERENCIAL - 2 EJERCICIOS DEMO
-- =====================================================

(
    '00000002-demo-0000-0000-000000000001'::uuid,
    'e8f9a0b1-2c3d-4e5f-6a7b-8c9d0e1f2a30'::uuid, -- Módulo 2
    'Motivación de Marie Curie',
    'Infiere las motivaciones del personaje',
    'multiple_choice'::educational_content.exercise_type,
    'understand'::educational_content.cognitive_level,
    'medium'::educational_content.difficulty_level,
    jsonb_build_object(
        'question', '¿Qué se puede inferir sobre la actitud de Marie Curie hacia la ciencia?',
        'passage', 'A pesar de las dificultades económicas y la discriminación por ser mujer, Marie Curie perseveró en sus estudios. Trabajaba de día como institutriz y estudiaba por las noches, mostrando una determinación inquebrantable.',
        'options', jsonb_build_array(
            jsonb_build_object('id', 'A', 'text', 'Tenía pasión y dedicación por el conocimiento científico'),
            jsonb_build_object('id', 'B', 'text', 'Estudiaba solo por obligación familiar'),
            jsonb_build_object('id', 'C', 'text', 'No disfrutaba estudiar ciencias'),
            jsonb_build_object('id', 'D', 'text', 'Prefería trabajar que estudiar')
        )
    ),
    jsonb_build_object('correct_option', 'A'),
    15,
    10,
    240,
    3,
    1,
    true,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '00000002-demo-0000-0000-000000000002'::uuid,
    'e8f9a0b1-2c3d-4e5f-6a7b-8c9d0e1f2a30'::uuid, -- Módulo 2
    'Contexto Histórico',
    'Deduce información del contexto',
    'fill_blank'::educational_content.exercise_type,
    'apply'::educational_content.cognitive_level,
    'medium'::educational_content.difficulty_level,
    jsonb_build_object(
        'question', 'Completa el texto con la palabra que mejor describe el contexto de Marie Curie',
        'passage', 'En el siglo XIX, las mujeres enfrentaban _____ significativas para acceder a la educación universitaria. Marie Curie tuvo que superar estas dificultades para estudiar en la Sorbona.',
        'blanks', jsonb_build_array(
            jsonb_build_object('position', 1, 'options', jsonb_build_array('barreras', 'facilidades', 'oportunidades', 'invitaciones'))
        )
    ),
    jsonb_build_object('correct_words', jsonb_build_array('barreras')),
    15,
    10,
    180,
    3,
    2,
    true,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- MÓDULO 3: COMPRENSIÓN CRÍTICA - 2 EJERCICIOS DEMO
-- =====================================================

(
    '00000003-demo-0000-0000-000000000001'::uuid,
    'f9a0b1c2-3d4e-5f6a-7b8c-9d0e1f2a3b40'::uuid, -- Módulo 3
    'Evaluación del Legado',
    'Analiza críticamente el impacto histórico',
    'essay'::educational_content.exercise_type,
    'evaluate'::educational_content.cognitive_level,
    'hard'::educational_content.difficulty_level,
    jsonb_build_object(
        'question', 'Evalúa la importancia del descubrimiento de la radioactividad para la ciencia moderna',
        'passage', 'Marie Curie descubrió dos elementos radioactivos: el polonio y el radio. Sus investigaciones sobre la radioactividad revolucionaron la física y la química, y sentaron las bases para aplicaciones médicas como la radioterapia contra el cáncer.',
        'min_words', 50,
        'max_words', 150,
        'rubric', jsonb_build_object(
            'criteria', jsonb_build_array(
                'Identifica impactos científicos',
                'Menciona aplicaciones médicas',
                'Proporciona argumentos coherentes',
                'Usa vocabulario apropiado'
            )
        )
    ),
    jsonb_build_object('requires_manual_grading', true),
    25,
    20,
    600, -- 10 minutos
    1,
    1,
    true,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '00000003-demo-0000-0000-000000000002'::uuid,
    'f9a0b1c2-3d4e-5f6a-7b8c-9d0e1f2a3b40'::uuid, -- Módulo 3
    'Valoración de Obstáculos',
    'Analiza y valora desafíos históricos',
    'multiple_choice'::educational_content.exercise_type,
    'analyze'::educational_content.cognitive_level,
    'hard'::educational_content.difficulty_level,
    jsonb_build_object(
        'question', '¿Cuál fue el mayor obstáculo que Marie Curie tuvo que superar?',
        'passage', 'Marie Curie enfrentó múltiples desafíos: la pobreza, la discriminación de género en la ciencia, la resistencia de la comunidad académica, y las dificultades técnicas de trabajar con materiales radioactivos sin protección adecuada.',
        'options', jsonb_build_array(
            jsonb_build_object('id', 'A', 'text', 'La discriminación sistemática contra las mujeres en la ciencia'),
            jsonb_build_object('id', 'B', 'text', 'La falta de equipamiento en su laboratorio'),
            jsonb_build_object('id', 'C', 'text', 'El desinterés de la comunidad científica'),
            jsonb_build_object('id', 'D', 'text', 'La distancia geográfica de Polonia a Francia')
        )
    ),
    jsonb_build_object('correct_option', 'A'),
    20,
    15,
    300,
    2,
    2,
    true,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- MÓDULO 4: LECTURA DIGITAL - 2 EJERCICIOS DEMO
-- =====================================================

(
    '00000004-demo-0000-0000-000000000001'::uuid,
    'a0b1c2d3-4e5f-6a7b-8c9d-0e1f2a3b4c50'::uuid, -- Módulo 4
    'Búsqueda de Información',
    'Localiza información en recursos digitales',
    'matching'::educational_content.exercise_type,
    'understand'::educational_content.cognitive_level,
    'medium'::educational_content.difficulty_level,
    jsonb_build_object(
        'question', 'Relaciona cada descubrimiento con su fecha correcta',
        'instruction', 'Arrastra cada descubrimiento a su fecha correspondiente',
        'pairs', jsonb_build_array(
            jsonb_build_object('left', 'Descubrimiento del polonio', 'right', '1898'),
            jsonb_build_object('left', 'Primer Premio Nobel', 'right', '1903'),
            jsonb_build_object('left', 'Segundo Premio Nobel', 'right', '1911'),
            jsonb_build_object('left', 'Aislamiento del radio puro', 'right', '1910')
        )
    ),
    jsonb_build_object('correct_matches', 4),
    20,
    15,
    300,
    3,
    1,
    true,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '00000004-demo-0000-0000-000000000002'::uuid,
    'a0b1c2d3-4e5f-6a7b-8c9d-0e1f2a3b4c50'::uuid, -- Módulo 4
    'Navegación de Contenidos',
    'Interpreta información multimedia',
    'ordering'::educational_content.exercise_type,
    'analyze'::educational_content.cognitive_level,
    'medium'::educational_content.difficulty_level,
    jsonb_build_object(
        'question', 'Ordena cronológicamente los eventos de la vida de Marie Curie',
        'items', jsonb_build_array(
            jsonb_build_object('id', '1', 'text', 'Nació en Varsovia'),
            jsonb_build_object('id', '2', 'text', 'Se mudó a París'),
            jsonb_build_object('id', '3', 'text', 'Descubrió el polonio'),
            jsonb_build_object('id', '4', 'text', 'Ganó su primer Nobel'),
            jsonb_build_object('id', '5', 'text', 'Ganó su segundo Nobel')
        )
    ),
    jsonb_build_object('correct_order', jsonb_build_array('1', '2', '3', '4', '5')),
    20,
    15,
    240,
    3,
    2,
    true,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- MÓDULO 5: PRODUCCIÓN DE TEXTOS - 2 EJERCICIOS DEMO
-- =====================================================

(
    '00000005-demo-0000-0000-000000000001'::uuid,
    'b1c2d3e4-5f6a-7b8c-9d0e-1f2a3b4c5d60'::uuid, -- Módulo 5
    'Biografía Corta',
    'Redacta un texto biográfico coherente',
    'essay'::educational_content.exercise_type,
    'create'::educational_content.cognitive_level,
    'hard'::educational_content.difficulty_level,
    jsonb_build_object(
        'question', 'Escribe una biografía corta de Marie Curie (100-200 palabras)',
        'instructions', jsonb_build_array(
            'Incluye fecha y lugar de nacimiento',
            'Menciona sus principales descubrimientos',
            'Explica su impacto en la ciencia',
            'Usa lenguaje formal y objetivo'
        ),
        'min_words', 100,
        'max_words', 200,
        'rubric', jsonb_build_object(
            'estructura', 20,
            'contenido', 40,
            'coherencia', 20,
            'ortografia', 20
        )
    ),
    jsonb_build_object('requires_manual_grading', true),
    30,
    25,
    900, -- 15 minutos
    1,
    1,
    true,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '00000005-demo-0000-0000-000000000002'::uuid,
    'b1c2d3e4-5f6a-7b8c-9d0e-1f2a3b4c5d60'::uuid, -- Módulo 5
    'Resumen Científico',
    'Sintetiza información científica',
    'fill_blank'::educational_content.exercise_type,
    'create'::educational_content.cognitive_level,
    'medium'::educational_content.difficulty_level,
    jsonb_build_object(
        'question', 'Completa el resumen con las palabras apropiadas',
        'passage', 'Marie Curie fue una _____ polaca que descubrió dos _____ radioactivos. Por sus contribuciones ganó dos Premios _____ en diferentes disciplinas científicas.',
        'blanks', jsonb_build_array(
            jsonb_build_object('position', 1, 'hint', 'profesión'),
            jsonb_build_object('position', 2, 'hint', 'sustancia química'),
            jsonb_build_object('position', 3, 'hint', 'premio internacional')
        )
    ),
    jsonb_build_object(
        'correct_words', jsonb_build_array('científica', 'elementos', 'Nobel'),
        'accept_variants', true
    ),
    20,
    15,
    240,
    3,
    2,
    true,
    gamilit.now_mexico(),
    gamilit.now_mexico()
)

ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- VERIFICACIÓN DE INSERCIÓN
-- =====================================================

DO $$
DECLARE
    exercises_count INTEGER;
    exercises_per_module RECORD;
BEGIN
    SELECT COUNT(*) INTO exercises_count FROM educational_content.exercises;

    RAISE NOTICE '════════════════════════════════════════════════════════';
    RAISE NOTICE '  SEED COMPLETADO: exercises-demo';
    RAISE NOTICE '════════════════════════════════════════════════════════';
    RAISE NOTICE '✓ Ejercicios demo insertados: %', exercises_count;
    RAISE NOTICE '';

    -- Mostrar distribución por módulo
    FOR exercises_per_module IN
        SELECT m.title, COUNT(e.id) as count
        FROM educational_content.modules m
        LEFT JOIN educational_content.exercises e ON e.module_id = m.id
        WHERE e.id LIKE '00000%demo%'
        GROUP BY m.title
        ORDER BY m.order_index
    LOOP
        RAISE NOTICE '  └─ %: % ejercicios', exercises_per_module.title, exercises_per_module.count;
    END LOOP;

    RAISE NOTICE '';
    RAISE NOTICE '⚠️  NOTA: Contenido DEMO para producción';
    RAISE NOTICE '  Para contenido completo, cargar seeds adicionales';
    RAISE NOTICE '════════════════════════════════════════════════════════';

    IF exercises_count < 10 THEN
        RAISE EXCEPTION 'ERROR: Se esperaban 10 ejercicios, se insertaron %', exercises_count;
    END IF;
END $$;
