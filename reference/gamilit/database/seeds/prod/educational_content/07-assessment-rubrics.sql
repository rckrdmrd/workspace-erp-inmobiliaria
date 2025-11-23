-- =====================================================
-- Seed: educational_content.assessment_rubrics (PROD)
-- Description: Rúbricas de evaluación para ejercicios
-- Environment: PRODUCTION
-- Dependencies: educational_content.modules
-- Order: 07
-- Created: 2025-01-11
-- Version: 1.0
-- =====================================================
--
-- RÚBRICAS INCLUIDAS:
-- - Comprensión Literal (3 niveles)
-- - Comprensión Inferencial (3 niveles)
-- - Comprensión Crítica (4 niveles)
-- - Producción de Textos (5 niveles)
--
-- TOTAL: 15 rúbricas (criteria)
--
-- IMPORTANTE: Estas rúbricas son usadas para evaluar ejercicios.
-- =====================================================

SET search_path TO educational_content, public;

-- =====================================================
-- INSERT: Rúbricas de Evaluación
-- =====================================================

INSERT INTO educational_content.assessment_rubrics (
    id,
    name,
    description,
    rubric_type,
    criteria,
    scoring_guide,
    max_score,
    pass_threshold,
    is_active,
    metadata,
    created_at,
    updated_at
) VALUES

-- =====================================================
-- MÓDULO 1: COMPRENSIÓN LITERAL
-- =====================================================
(
    '80000001-0001-0000-0000-000000000001'::uuid,
    'Comprensión Literal - Nivel Básico',
    'Rúbrica para evaluar comprensión literal básica: identificación de información explícita.',
    'holistic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object(
            'name', 'Insuficiente',
            'description', 'No identifica información básica del texto',
            'score', 0,
            'indicators', jsonb_build_array(
                'No localiza datos explícitos',
                'Confunde información principal'
            )
        ),
        'nivel_2', jsonb_build_object(
            'name', 'Suficiente',
            'description', 'Identifica algunos datos explícitos',
            'score', 50,
            'indicators', jsonb_build_array(
                'Localiza datos básicos',
                'Identifica personajes y lugares'
            )
        ),
        'nivel_3', jsonb_build_object(
            'name', 'Excelente',
            'description', 'Identifica toda la información explícita relevante',
            'score', 100,
            'indicators', jsonb_build_array(
                'Localiza todos los datos explícitos',
                'Distingue ideas principales de secundarias',
                'Comprende la secuencia cronológica'
            )
        )
    ),
    jsonb_build_object(
        'scoring_method', 'levels',
        'levels', 3,
        'weighted', false
    ),
    100,
    60,  -- 60% para aprobar
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 1: Comprensión Literal',
        'bloom_level', 'remember',
        'created_by', 'seed_script'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

(
    '80000001-0002-0000-0000-000000000002'::uuid,
    'Comprensión Literal - Nivel Intermedio',
    'Rúbrica para evaluar comprensión literal intermedia: organización y secuenciación.',
    'holistic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object(
            'name', 'Insuficiente',
            'description', 'No puede organizar la información',
            'score', 0
        ),
        'nivel_2', jsonb_build_object(
            'name', 'Suficiente',
            'description', 'Organiza información con ayuda',
            'score', 70
        ),
        'nivel_3', jsonb_build_object(
            'name', 'Excelente',
            'description', 'Organiza y secuencia información de forma autónoma',
            'score', 100
        )
    ),
    jsonb_build_object(
        'scoring_method', 'levels',
        'levels', 3
    ),
    100,
    70,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 1: Comprensión Literal',
        'bloom_level', 'understand'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

(
    '80000001-0003-0000-0000-000000000003'::uuid,
    'Comprensión Literal - Nivel Avanzado',
    'Rúbrica para evaluar comprensión literal avanzada: integración de información múltiple.',
    'holistic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object(
            'name', 'Insuficiente',
            'description', 'No puede integrar información de múltiples fuentes',
            'score', 0
        ),
        'nivel_2', jsonb_build_object(
            'name', 'Suficiente',
            'description', 'Integra información de 2-3 fuentes',
            'score', 75
        ),
        'nivel_3', jsonb_build_object(
            'name', 'Excelente',
            'description', 'Integra y sintetiza información de múltiples fuentes',
            'score', 100
        )
    ),
    jsonb_build_object(
        'scoring_method', 'levels',
        'levels', 3
    ),
    100,
    75,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 1: Comprensión Literal',
        'bloom_level', 'apply'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- MÓDULO 2: COMPRENSIÓN INFERENCIAL
-- =====================================================
(
    '80000002-0001-0000-0000-000000000004'::uuid,
    'Comprensión Inferencial - Nivel Básico',
    'Rúbrica para evaluar inferencias simples y deducciones básicas.',
    'holistic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object(
            'name', 'Insuficiente',
            'description', 'No realiza inferencias',
            'score', 0
        ),
        'nivel_2', jsonb_build_object(
            'name', 'Suficiente',
            'description', 'Realiza inferencias simples',
            'score', 65
        ),
        'nivel_3', jsonb_build_object(
            'name', 'Excelente',
            'description', 'Realiza inferencias precisas y justificadas',
            'score', 100
        )
    ),
    jsonb_build_object(
        'scoring_method', 'levels',
        'levels', 3
    ),
    100,
    65,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 2: Comprensión Inferencial',
        'bloom_level', 'understand'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

(
    '80000002-0002-0000-0000-000000000005'::uuid,
    'Comprensión Inferencial - Nivel Intermedio',
    'Rúbrica para evaluar predicciones y análisis de causa-efecto.',
    'holistic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object(
            'name', 'Insuficiente',
            'description', 'No identifica relaciones causa-efecto',
            'score', 0
        ),
        'nivel_2', jsonb_build_object(
            'name', 'Suficiente',
            'description', 'Identifica algunas relaciones causa-efecto',
            'score', 70
        ),
        'nivel_3', jsonb_build_object(
            'name', 'Excelente',
            'description', 'Analiza relaciones causa-efecto complejas',
            'score', 100
        )
    ),
    jsonb_build_object(
        'scoring_method', 'levels',
        'levels', 3
    ),
    100,
    70,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 2: Comprensión Inferencial',
        'bloom_level', 'analyze'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

(
    '80000002-0003-0000-0000-000000000006'::uuid,
    'Comprensión Inferencial - Nivel Avanzado',
    'Rúbrica para evaluar interpretación de intenciones y lenguaje figurado.',
    'holistic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object(
            'name', 'Insuficiente',
            'description', 'No interpreta lenguaje figurado',
            'score', 0
        ),
        'nivel_2', jsonb_build_object(
            'name', 'Suficiente',
            'description', 'Interpreta lenguaje figurado simple',
            'score', 75
        ),
        'nivel_3', jsonb_build_object(
            'name', 'Excelente',
            'description', 'Interpreta intenciones y lenguaje figurado complejo',
            'score', 100
        )
    ),
    jsonb_build_object(
        'scoring_method', 'levels',
        'levels', 3
    ),
    100,
    75,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 2: Comprensión Inferencial',
        'bloom_level', 'analyze'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- MÓDULO 3: COMPRENSIÓN CRÍTICA
-- =====================================================
(
    '80000003-0001-0000-0000-000000000007'::uuid,
    'Comprensión Crítica - Nivel 1: Análisis',
    'Rúbrica para evaluar análisis crítico de textos.',
    'holistic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object('name', 'Insuficiente', 'score', 0),
        'nivel_2', jsonb_build_object('name', 'Básico', 'score', 50),
        'nivel_3', jsonb_build_object('name', 'Competente', 'score', 75),
        'nivel_4', jsonb_build_object('name', 'Excelente', 'score', 100,
            'description', 'Análisis crítico profundo y fundamentado')
    ),
    jsonb_build_object('scoring_method', 'levels', 'levels', 4),
    100,
    65,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 3: Comprensión Crítica',
        'bloom_level', 'analyze'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

(
    '80000003-0002-0000-0000-000000000008'::uuid,
    'Comprensión Crítica - Nivel 2: Evaluación',
    'Rúbrica para evaluar juicios y valoraciones fundamentadas.',
    'holistic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object('name', 'Insuficiente', 'score', 0),
        'nivel_2', jsonb_build_object('name', 'Básico', 'score', 55),
        'nivel_3', jsonb_build_object('name', 'Competente', 'score', 75),
        'nivel_4', jsonb_build_object('name', 'Excelente', 'score', 100)
    ),
    jsonb_build_object('scoring_method', 'levels', 'levels', 4),
    100,
    70,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 3: Comprensión Crítica',
        'bloom_level', 'evaluate'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

(
    '80000003-0003-0000-0000-000000000009'::uuid,
    'Comprensión Crítica - Nivel 3: Argumentación',
    'Rúbrica para evaluar construcción de argumentos sólidos.',
    'holistic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object('name', 'Insuficiente', 'score', 0),
        'nivel_2', jsonb_build_object('name', 'Básico', 'score', 60),
        'nivel_3', jsonb_build_object('name', 'Competente', 'score', 80),
        'nivel_4', jsonb_build_object('name', 'Excelente', 'score', 100)
    ),
    jsonb_build_object('scoring_method', 'levels', 'levels', 4),
    100,
    75,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 3: Comprensión Crítica',
        'bloom_level', 'evaluate'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

(
    '80000003-0004-0000-0000-000000000010'::uuid,
    'Comprensión Crítica - Nivel 4: Síntesis',
    'Rúbrica para evaluar síntesis y propuestas creativas.',
    'holistic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object('name', 'Insuficiente', 'score', 0),
        'nivel_2', jsonb_build_object('name', 'Básico', 'score', 60),
        'nivel_3', jsonb_build_object('name', 'Competente', 'score', 80),
        'nivel_4', jsonb_build_object('name', 'Excelente', 'score', 100)
    ),
    jsonb_build_object('scoring_method', 'levels', 'levels', 4),
    100,
    75,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 3: Comprensión Crítica',
        'bloom_level', 'create'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- MÓDULO 5: PRODUCCIÓN DE TEXTOS
-- =====================================================
(
    '80000005-0001-0000-0000-000000000011'::uuid,
    'Producción de Textos - Nivel 1: Estructura',
    'Rúbrica para evaluar estructura y organización textual.',
    'analytic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object('name', 'Deficiente', 'score', 0),
        'nivel_2', jsonb_build_object('name', 'Insuficiente', 'score', 40),
        'nivel_3', jsonb_build_object('name', 'Aceptable', 'score', 60),
        'nivel_4', jsonb_build_object('name', 'Bueno', 'score', 80),
        'nivel_5', jsonb_build_object('name', 'Excelente', 'score', 100)
    ),
    jsonb_build_object('scoring_method', 'levels', 'levels', 5),
    100,
    60,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 5: Producción de Textos',
        'bloom_level', 'create',
        'criteria_focus', 'structure'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

(
    '80000005-0002-0000-0000-000000000012'::uuid,
    'Producción de Textos - Nivel 2: Contenido',
    'Rúbrica para evaluar calidad y relevancia del contenido.',
    'analytic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object('name', 'Deficiente', 'score', 0),
        'nivel_2', jsonb_build_object('name', 'Insuficiente', 'score', 40),
        'nivel_3', jsonb_build_object('name', 'Aceptable', 'score', 65),
        'nivel_4', jsonb_build_object('name', 'Bueno', 'score', 85),
        'nivel_5', jsonb_build_object('name', 'Excelente', 'score', 100)
    ),
    jsonb_build_object('scoring_method', 'levels', 'levels', 5),
    100,
    65,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 5: Producción de Textos',
        'bloom_level', 'create',
        'criteria_focus', 'content'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

(
    '80000005-0003-0000-0000-000000000013'::uuid,
    'Producción de Textos - Nivel 3: Lenguaje',
    'Rúbrica para evaluar uso del lenguaje y vocabulario.',
    'analytic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object('name', 'Deficiente', 'score', 0),
        'nivel_2', jsonb_build_object('name', 'Insuficiente', 'score', 45),
        'nivel_3', jsonb_build_object('name', 'Aceptable', 'score', 65),
        'nivel_4', jsonb_build_object('name', 'Bueno', 'score', 85),
        'nivel_5', jsonb_build_object('name', 'Excelente', 'score', 100)
    ),
    jsonb_build_object('scoring_method', 'levels', 'levels', 5),
    100,
    65,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 5: Producción de Textos',
        'bloom_level', 'create',
        'criteria_focus', 'language'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

(
    '80000005-0004-0000-0000-000000000014'::uuid,
    'Producción de Textos - Nivel 4: Coherencia',
    'Rúbrica para evaluar coherencia y cohesión textual.',
    'analytic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object('name', 'Deficiente', 'score', 0),
        'nivel_2', jsonb_build_object('name', 'Insuficiente', 'score', 50),
        'nivel_3', jsonb_build_object('name', 'Aceptable', 'score', 70),
        'nivel_4', jsonb_build_object('name', 'Bueno', 'score', 85),
        'nivel_5', jsonb_build_object('name', 'Excelente', 'score', 100)
    ),
    jsonb_build_object('scoring_method', 'levels', 'levels', 5),
    100,
    70,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 5: Producción de Textos',
        'bloom_level', 'create',
        'criteria_focus', 'coherence'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

(
    '80000005-0005-0000-0000-000000000015'::uuid,
    'Producción de Textos - Nivel 5: Creatividad',
    'Rúbrica para evaluar originalidad y creatividad.',
    'analytic',
    jsonb_build_object(
        'nivel_1', jsonb_build_object('name', 'Deficiente', 'score', 0),
        'nivel_2', jsonb_build_object('name', 'Insuficiente', 'score', 50),
        'nivel_3', jsonb_build_object('name', 'Aceptable', 'score', 70),
        'nivel_4', jsonb_build_object('name', 'Bueno', 'score', 90),
        'nivel_5', jsonb_build_object('name', 'Excelente', 'score', 100)
    ),
    jsonb_build_object('scoring_method', 'levels', 'levels', 5),
    100,
    70,
    true,
    jsonb_build_object(
        'module_name', 'MÓDULO 5: Producción de Textos',
        'bloom_level', 'create',
        'criteria_focus', 'creativity'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    criteria = EXCLUDED.criteria,
    scoring_guide = EXCLUDED.scoring_guide,
    max_score = EXCLUDED.max_score,
    pass_threshold = EXCLUDED.pass_threshold,
    is_active = EXCLUDED.is_active,
    metadata = EXCLUDED.metadata,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    rubric_count INTEGER;
    literal_count INTEGER;
    inferencial_count INTEGER;
    critica_count INTEGER;
    produccion_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO rubric_count
    FROM educational_content.assessment_rubrics;

    SELECT COUNT(*) INTO literal_count
    FROM educational_content.assessment_rubrics
    WHERE metadata->>'module_name' LIKE '%Comprensión Literal%';

    SELECT COUNT(*) INTO inferencial_count
    FROM educational_content.assessment_rubrics
    WHERE metadata->>'module_name' LIKE '%Comprensión Inferencial%';

    SELECT COUNT(*) INTO critica_count
    FROM educational_content.assessment_rubrics
    WHERE metadata->>'module_name' LIKE '%Comprensión Crítica%';

    SELECT COUNT(*) INTO produccion_count
    FROM educational_content.assessment_rubrics
    WHERE metadata->>'module_name' LIKE '%Producción de Textos%';

    RAISE NOTICE '========================================';
    RAISE NOTICE 'RÚBRICAS DE EVALUACIÓN CREADAS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total rúbricas: %', rubric_count;
    RAISE NOTICE '  - Comprensión Literal: %', literal_count;
    RAISE NOTICE '  - Comprensión Inferencial: %', inferencial_count;
    RAISE NOTICE '  - Comprensión Crítica: %', critica_count;
    RAISE NOTICE '  - Producción de Textos: %', produccion_count;
    RAISE NOTICE '========================================';

    IF rubric_count = 15 THEN
        RAISE NOTICE '✓ Todas las rúbricas fueron creadas correctamente';
    ELSE
        RAISE WARNING '⚠ Se esperaban 15 rúbricas, se crearon %', rubric_count;
    END IF;
END $$;
