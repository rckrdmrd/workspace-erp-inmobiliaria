-- =====================================================
-- Seed: educational_content.difficulty_criteria (PROD)
-- Description: Criterios de los 8 niveles de dificultad CEFR (A1-C2+)
-- Environment: PRODUCTION
-- Dependencies: educational_content.difficulty_level ENUM
-- Order: 08
-- Created: 2025-11-11
-- Version: 1.0
-- =====================================================

SET search_path TO educational_content, public;

-- =====================================================
-- INSERT: 8 Niveles CEFR
-- =====================================================

INSERT INTO educational_content.difficulty_criteria (
    level,
    vocab_range_min,
    vocab_range_max,
    sentence_length_min,
    sentence_length_max,
    time_multiplier,
    base_xp,
    base_coins,
    promotion_success_rate,
    promotion_min_exercises,
    promotion_time_threshold,
    cefr_level,
    description
) VALUES
    -- A1: Beginner
    (
        'beginner',
        10, 50,
        3, 5,
        3.00,
        10, 5,
        80.00, 30, 1.50,
        'A1',
        'Nivel principiante: vocabulario básico de supervivencia, saludos, familia, números'
    ),
    -- A2: Elementary
    (
        'elementary',
        50, 150,
        5, 8,
        2.50,
        15, 7,
        80.00, 30, 1.50,
        'A2',
        'Nivel elemental: vocabulario cotidiano, presente/pasado simple, descripciones básicas'
    ),
    -- B1: Pre-intermediate
    (
        'pre_intermediate',
        150, 400,
        8, 12,
        2.00,
        20, 10,
        80.00, 30, 1.50,
        'B1',
        'Pre-intermedio: conversaciones básicas, experiencias personales, expresar opiniones simples'
    ),
    -- B2: Intermediate
    (
        'intermediate',
        400, 800,
        12, 18,
        1.50,
        30, 15,
        80.00, 30, 1.50,
        'B2',
        'Intermedio: discusiones abstractas, argumentación, textos técnicos básicos'
    ),
    -- C1: Upper Intermediate
    (
        'upper_intermediate',
        800, 1500,
        18, 25,
        1.25,
        40, 20,
        80.00, 30, 1.50,
        'C1',
        'Intermedio avanzado: lenguaje fluido, matices, textos complejos, uso implícito'
    ),
    -- C2: Advanced
    (
        'advanced',
        1500, 3000,
        25, 40,
        1.00,
        50, 25,
        80.00, 30, 1.50,
        'C2',
        'Avanzado: dominio amplio, literatura, expresiones idiomáticas, registro formal/informal'
    ),
    -- C2+: Proficient
    (
        'proficient',
        3000, NULL,
        40, NULL,
        1.00,
        70, 35,
        80.00, 30, 1.50,
        'C2+',
        'Competente: vocabulario especializado, contextos académicos, textos literarios complejos'
    ),
    -- Native
    (
        'native',
        3000, NULL,
        40, NULL,
        0.80,
        100, 50,
        80.00, 30, 1.50,
        'Nativo',
        'Nativo: dominio total del idioma, incluyendo modismos regionales y variantes dialectales'
    )
ON CONFLICT (level) DO UPDATE SET
    vocab_range_min = EXCLUDED.vocab_range_min,
    vocab_range_max = EXCLUDED.vocab_range_max,
    sentence_length_min = EXCLUDED.sentence_length_min,
    sentence_length_max = EXCLUDED.sentence_length_max,
    time_multiplier = EXCLUDED.time_multiplier,
    base_xp = EXCLUDED.base_xp,
    base_coins = EXCLUDED.base_coins,
    promotion_success_rate = EXCLUDED.promotion_success_rate,
    promotion_min_exercises = EXCLUDED.promotion_min_exercises,
    promotion_time_threshold = EXCLUDED.promotion_time_threshold,
    cefr_level = EXCLUDED.cefr_level,
    description = EXCLUDED.description,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

SELECT
    'Difficulty Criteria (Production)' AS seed_name,
    COUNT(*) AS records_inserted,
    MIN(vocab_range_min) AS min_vocab,
    MAX(COALESCE(vocab_range_max, 9999)) AS max_vocab
FROM educational_content.difficulty_criteria;

-- Mostrar criterios insertados
SELECT
    level,
    cefr_level,
    vocab_range_min,
    vocab_range_max,
    base_xp,
    base_coins,
    promotion_success_rate,
    time_multiplier
FROM educational_content.difficulty_criteria
ORDER BY vocab_range_min;
