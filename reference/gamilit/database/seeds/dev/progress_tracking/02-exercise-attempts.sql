-- =====================================================================================
-- SEED: Exercise Attempts and Submissions for Progress Tracking
-- =====================================================================================
-- Description: Exercise attempts, submissions and detailed performance tracking
-- Dependencies: auth.users, educational_content.exercises, module_progress
-- Idempotency: Uses ON CONFLICT to handle re-runs safely
-- =====================================================================================

SET search_path TO progress_tracking, educational_content, auth, public;

-- =====================================================================================
-- EXERCISE ATTEMPTS & SUBMISSIONS
-- =====================================================================================

DO $$
DECLARE
    student1_id UUID;
    student2_id UUID;
    student3_id UUID;
    exercise_1_1_id UUID; -- Crucigrama Científico
    exercise_1_2_id UUID; -- Línea de Tiempo
    exercise_1_3_id UUID; -- Completar Biografía
    exercise_2_1_id UUID; -- Detective de Motivaciones
    exercise_2_2_id UUID; -- Predictor de Consecuencias
    exercise_3_1_id UUID; -- Juez de Argumentos
BEGIN
    -- ==================================================================================
    -- GET USER IDS (Demo Students)
    -- ==================================================================================

    SELECT user_id INTO student1_id
    FROM auth.users
    WHERE email = 'estudiante1@demo.glit.edu.mx';

    SELECT user_id INTO student2_id
    FROM auth.users
    WHERE email = 'estudiante2@demo.glit.edu.mx';

    SELECT user_id INTO student3_id
    FROM auth.users
    WHERE email = 'estudiante3@demo.glit.edu.mx';

    -- ==================================================================================
    -- GET EXERCISE IDS (by title patterns)
    -- ==================================================================================

    -- Module 1 Exercises (Literal)
    SELECT exercise_id INTO exercise_1_1_id
    FROM educational_content.exercises
    WHERE title ILIKE '%Crucigrama%'
    ORDER BY created_at LIMIT 1;

    SELECT exercise_id INTO exercise_1_2_id
    FROM educational_content.exercises
    WHERE title ILIKE '%Línea de Tiempo%'
    ORDER BY created_at LIMIT 1;

    SELECT exercise_id INTO exercise_1_3_id
    FROM educational_content.exercises
    WHERE title ILIKE '%Biografía%'
    ORDER BY created_at LIMIT 1;

    -- Module 2 Exercises (Inferencial)
    SELECT exercise_id INTO exercise_2_1_id
    FROM educational_content.exercises
    WHERE title ILIKE '%Detective%'
    ORDER BY created_at LIMIT 1;

    SELECT exercise_id INTO exercise_2_2_id
    FROM educational_content.exercises
    WHERE title ILIKE '%Predictor%'
    ORDER BY created_at LIMIT 1;

    -- Module 3 Exercises (Crítica)
    SELECT exercise_id INTO exercise_3_1_id
    FROM educational_content.exercises
    WHERE title ILIKE '%Juez%'
    ORDER BY created_at LIMIT 1;

    -- ==================================================================================
    -- EXERCISE ATTEMPTS: Detailed Attempt Tracking
    -- ==================================================================================

    RAISE NOTICE 'Inserting exercise attempts data...';

    INSERT INTO progress_tracking.exercise_attempts (
        user_id, exercise_id,
        attempt_number, status,
        score, max_score, score_percentage,
        time_spent_seconds, started_at, completed_at,
        hints_used, comodines_used,
        metadata, created_at, updated_at
    ) VALUES
    -- ================================================================================
    -- ESTUDIANTE 1: Crucigrama Científico (Progressive Improvement - 3 attempts)
    -- ================================================================================

    -- Attempt 1: First Try (Good but not perfect)
    (
        student1_id, exercise_1_1_id,
        1, 'completed',
        75, 100, 75,
        420, -- 7 minutes
        NOW() - INTERVAL '9 days',
        NOW() - INTERVAL '9 days' + INTERVAL '7 minutes',
        1, ARRAY[]::text[],
        '{
            "mistakes": 5,
            "corrections": 3,
            "completion_path": "sequential",
            "words_completed": ["RADIO", "NOBEL", "SORBONA"],
            "words_struggled": ["PECHBLENDA", "POLONIO"],
            "hint_words": ["PECHBLENDA"]
        }'::jsonb,
        NOW() - INTERVAL '9 days',
        NOW() - INTERVAL '9 days' + INTERVAL '7 minutes'
    ),

    -- Attempt 2: Second Try (Significant Improvement)
    (
        student1_id, exercise_1_1_id,
        2, 'completed',
        90, 100, 90,
        360, -- 6 minutes
        NOW() - INTERVAL '8 days',
        NOW() - INTERVAL '8 days' + INTERVAL '6 minutes',
        0, ARRAY['vision_lectora']::text[],
        '{
            "mistakes": 2,
            "corrections": 1,
            "improvements": ["mejor tiempo", "menos pistas", "mejor vocabulario"],
            "words_completed": ["RADIO", "POLONIO", "NOBEL", "SORBONA"],
            "words_struggled": ["RADIOACTIVIDAD"],
            "power_up_impact": "high"
        }'::jsonb,
        NOW() - INTERVAL '8 days',
        NOW() - INTERVAL '8 days' + INTERVAL '6 minutes'
    ),

    -- Attempt 3: Mastery Achievement (Perfect Score)
    (
        student1_id, exercise_1_1_id,
        3, 'completed',
        100, 100, 100,
        300, -- 5 minutes
        NOW() - INTERVAL '7 days',
        NOW() - INTERVAL '7 days' + INTERVAL '5 minutes',
        0, ARRAY[]::text[],
        '{
            "mistakes": 0,
            "perfect_score": true,
            "mastery_achieved": true,
            "all_words_correct": ["RADIO", "POLONIO", "RADIOACTIVIDAD", "NOBEL", "SORBONA", "PECHBLENDA"],
            "speed_improvement": "40%",
            "bonus_points": 25
        }'::jsonb,
        NOW() - INTERVAL '7 days',
        NOW() - INTERVAL '7 days' + INTERVAL '5 minutes'
    ),

    -- ================================================================================
    -- ESTUDIANTE 1: Línea de Tiempo (1 attempt - High Performance)
    -- ================================================================================

    (
        student1_id, exercise_1_2_id,
        1, 'completed',
        95, 100, 95,
        480, -- 8 minutes
        NOW() - INTERVAL '6 days',
        NOW() - INTERVAL '6 days' + INTERVAL '8 minutes',
        0, ARRAY[]::text[],
        '{
            "date_errors": 0,
            "sequence_errors": 1,
            "events_placed": 8,
            "chronological_accuracy": "excellent",
            "minor_error": "Nobel Química date slightly off"
        }'::jsonb,
        NOW() - INTERVAL '6 days',
        NOW() - INTERVAL '6 days' + INTERVAL '8 minutes'
    ),

    -- ================================================================================
    -- ESTUDIANTE 1: Detective de Motivaciones (Module 2 - Current)
    -- ================================================================================

    (
        student1_id, exercise_2_1_id,
        1, 'completed',
        95, 100, 95,
        540, -- 9 minutes
        NOW() - INTERVAL '1 hour',
        NOW() - INTERVAL '1 hour' + INTERVAL '9 minutes',
        1, ARRAY['pistas']::text[],
        '{
            "clues_found": 8,
            "clues_total": 8,
            "inference_accuracy": "excellent",
            "motivation_identified": "pasión por la ciencia",
            "supporting_evidence": ["sacrificios personales", "dedicación", "persistencia"]
        }'::jsonb,
        NOW() - INTERVAL '1 hour',
        NOW() - INTERVAL '1 hour' + INTERVAL '9 minutes'
    ),

    -- ================================================================================
    -- ESTUDIANTE 2: Línea de Tiempo (2 attempts - Improvement Pattern)
    -- ================================================================================

    -- Attempt 1: First Try (Needs Improvement)
    (
        student2_id, exercise_1_2_id,
        1, 'completed',
        70, 100, 70,
        540, -- 9 minutes
        NOW() - INTERVAL '12 days',
        NOW() - INTERVAL '12 days' + INTERVAL '9 minutes',
        2, ARRAY['pistas']::text[],
        '{
            "date_errors": 3,
            "sequence_errors": 2,
            "events_placed": 8,
            "common_mistakes": ["confusión entre Nobels", "fecha matrimonio incorrecta"],
            "hints_used_for": ["Nobel Física", "Descubrimiento Polonio"]
        }'::jsonb,
        NOW() - INTERVAL '12 days',
        NOW() - INTERVAL '12 days' + INTERVAL '9 minutes'
    ),

    -- Attempt 2: Retry with Power-up (Good Improvement)
    (
        student2_id, exercise_1_2_id,
        2, 'completed',
        85, 100, 85,
        480, -- 8 minutes
        NOW() - INTERVAL '11 days',
        NOW() - INTERVAL '11 days' + INTERVAL '8 minutes',
        1, ARRAY['segunda_oportunidad']::text[],
        '{
            "date_errors": 1,
            "sequence_errors": 0,
            "improvement": "significant",
            "events_placed": 8,
            "corrected_mistakes": ["Nobels diferenciados", "matrimonio correcto"],
            "remaining_issue": "fecha descubrimiento Radio"
        }'::jsonb,
        NOW() - INTERVAL '11 days',
        NOW() - INTERVAL '11 days' + INTERVAL '8 minutes'
    ),

    -- ================================================================================
    -- ESTUDIANTE 2: Completar Biografía (1 attempt - Good)
    -- ================================================================================

    (
        student2_id, exercise_1_3_id,
        1, 'completed',
        80, 100, 80,
        600, -- 10 minutes
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '10 days' + INTERVAL '10 minutes',
        1, ARRAY[]::text[],
        '{
            "blanks_total": 10,
            "blanks_correct": 8,
            "vocabulary_accuracy": "good",
            "context_understanding": "solid",
            "errors": ["confusión: Pechblenda/Uranio", "sintaxis menor"]
        }'::jsonb,
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '10 days' + INTERVAL '10 minutes'
    ),

    -- ================================================================================
    -- ESTUDIANTE 2: Juez de Argumentos (Module 3 - Challenge Level)
    -- ================================================================================

    -- Attempt 1: First Try (Struggling with Critical Analysis)
    (
        student2_id, exercise_3_1_id,
        1, 'completed',
        70, 100, 70,
        720, -- 12 minutes
        NOW() - INTERVAL '3 hours',
        NOW() - INTERVAL '3 hours' + INTERVAL '12 minutes',
        2, ARRAY['segunda_oportunidad']::text[],
        '{
            "arguments_analyzed": 5,
            "correct_evaluations": 3,
            "critical_thinking_level": "developing",
            "struggles": ["identificar falacias", "diferenciar hecho/opinión"],
            "strengths": ["comprensión literal", "identificar evidencia"]
        }'::jsonb,
        NOW() - INTERVAL '3 hours',
        NOW() - INTERVAL '3 hours' + INTERVAL '12 minutes'
    ),

    -- ================================================================================
    -- ESTUDIANTE 3: Crucigrama Científico (2 attempts - Foundational Level)
    -- ================================================================================

    -- Attempt 1: First Try (Significant Vocabulary Challenges)
    (
        student3_id, exercise_1_1_id,
        1, 'completed',
        60, 100, 60,
        600, -- 10 minutes
        NOW() - INTERVAL '4 days',
        NOW() - INTERVAL '4 days' + INTERVAL '10 minutes',
        3, ARRAY['pistas', 'vision_lectora']::text[],
        '{
            "mistakes": 8,
            "corrections": 5,
            "vocabulary_struggles": ["PECHBLENDA", "RADIOACTIVIDAD", "POLONIO"],
            "words_completed": ["RADIO", "NOBEL"],
            "words_incomplete": ["PECHBLENDA", "RADIOACTIVIDAD"],
            "hints_used_for": ["PECHBLENDA", "POLONIO", "RADIOACTIVIDAD"],
            "reading_support_needed": true
        }'::jsonb,
        NOW() - INTERVAL '4 days',
        NOW() - INTERVAL '4 days' + INTERVAL '10 minutes'
    ),

    -- Attempt 2: Retry (Currently In Progress)
    (
        student3_id, exercise_1_1_id,
        2, 'in_progress',
        0, 100, 0,
        180, -- 3 minutes so far
        NOW() - INTERVAL '3 hours',
        NULL,
        1, ARRAY['pistas']::text[],
        '{
            "current_progress": 40,
            "words_completed": ["RADIO", "NOBEL"],
            "current_word": "SORBONA",
            "pause_reason": "break",
            "session_active": true
        }'::jsonb,
        NOW() - INTERVAL '3 hours',
        NOW()
    ),

    -- ================================================================================
    -- ESTUDIANTE 3: Línea de Tiempo (1 attempt - Needs Support)
    -- ================================================================================

    (
        student3_id, exercise_1_2_id,
        1, 'completed',
        65, 100, 65,
        720, -- 12 minutes
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '3 days' + INTERVAL '12 minutes',
        2, ARRAY['pistas', 'vision_lectora']::text[],
        '{
            "date_errors": 4,
            "sequence_errors": 3,
            "events_placed": 8,
            "chronological_confusion": "high",
            "hints_used_for": ["Nobel Física fecha", "Descubrimiento Radio"],
            "support_recommendation": "review timeline concepts"
        }'::jsonb,
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '3 days' + INTERVAL '12 minutes'
    )
    ON CONFLICT (user_id, exercise_id, attempt_number) DO UPDATE SET
        status = EXCLUDED.status,
        score = EXCLUDED.score,
        score_percentage = EXCLUDED.score_percentage,
        time_spent_seconds = EXCLUDED.time_spent_seconds,
        completed_at = EXCLUDED.completed_at,
        hints_used = EXCLUDED.hints_used,
        comodines_used = EXCLUDED.comodines_used,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();

    RAISE NOTICE 'Exercise attempts data inserted successfully';

    -- ==================================================================================
    -- EXERCISE SUBMISSIONS: Detailed Submission Data
    -- ==================================================================================

    RAISE NOTICE 'Inserting exercise submissions data...';

    INSERT INTO progress_tracking.exercise_submissions (
        user_id, exercise_id, attempt_number,
        submission_type, answer_data, submission_files,
        auto_graded, score, feedback,
        submitted_at, graded_at, graded_by,
        metadata, created_at, updated_at
    ) VALUES
    -- ================================================================================
    -- ESTUDIANTE 1: Crucigrama Perfect Score Submission
    -- ================================================================================

    (
        student1_id, exercise_1_1_id, 3,
        'interactive',
        '{
            "exercise_type": "crossword",
            "answers": {
                "1_across": "RADIO",
                "2_across": "POLONIO",
                "3_down": "RADIOACTIVIDAD",
                "4_down": "NOBEL",
                "5_across": "SORBONA",
                "6_down": "PECHBLENDA"
            },
            "completion_time_seconds": 300,
            "all_correct": true
        }'::jsonb,
        ARRAY[]::text[],
        true, 100,
        '{
            "correct_answers": 6,
            "total_answers": 6,
            "feedback": "¡Perfecto! Dominas el vocabulario científico de Marie Curie.",
            "feedback_details": {
                "vocabulary": "excelente",
                "spelling": "perfecto",
                "context_understanding": "avanzado"
            },
            "encouragement": "Has demostrado un dominio completo del tema."
        }'::jsonb,
        NOW() - INTERVAL '7 days' + INTERVAL '5 minutes',
        NOW() - INTERVAL '7 days' + INTERVAL '5 minutes',
        NULL,
        '{
            "auto_grade_confidence": 100,
            "perfect_score_bonus": 25,
            "mastery_badge_earned": true,
            "grading_algorithm": "exact_match_v2"
        }'::jsonb,
        NOW() - INTERVAL '7 days',
        NOW() - INTERVAL '7 days'
    ),

    -- ================================================================================
    -- ESTUDIANTE 1: Línea de Tiempo High Performance Submission
    -- ================================================================================

    (
        student1_id, exercise_1_2_id, 1,
        'interactive',
        '{
            "exercise_type": "timeline",
            "timeline": [
                {"year": 1867, "event": "Nacimiento en Varsovia", "correct": true},
                {"year": 1891, "event": "Llegada a París", "correct": true},
                {"year": 1895, "event": "Matrimonio con Pierre", "correct": true},
                {"year": 1898, "event": "Descubrimientos Radio y Polonio", "correct": true},
                {"year": 1903, "event": "Premio Nobel de Física", "correct": true},
                {"year": 1906, "event": "Muerte de Pierre", "correct": true},
                {"year": 1911, "event": "Premio Nobel de Química", "correct": false, "student_answer": 1910},
                {"year": 1934, "event": "Fallecimiento", "correct": true}
            ],
            "sequence_accuracy": "perfect"
        }'::jsonb,
        ARRAY[]::text[],
        true, 95,
        '{
            "correct_events": 7,
            "total_events": 8,
            "date_precision": "high",
            "sequence_accuracy": "perfect",
            "feedback": "Excelente trabajo. Solo un pequeño error en la fecha del segundo Nobel (1911, no 1910).",
            "feedback_details": {
                "chronological_thinking": "excelente",
                "attention_to_detail": "muy bueno",
                "historical_context": "sólido"
            }
        }'::jsonb,
        NOW() - INTERVAL '6 days' + INTERVAL '8 minutes',
        NOW() - INTERVAL '6 days' + INTERVAL '8 minutes',
        NULL,
        '{
            "auto_grade_confidence": 98,
            "grading_algorithm": "timeline_matcher_v1"
        }'::jsonb,
        NOW() - INTERVAL '6 days',
        NOW() - INTERVAL '6 days'
    ),

    -- ================================================================================
    -- ESTUDIANTE 2: Línea de Tiempo Retry Submission
    -- ================================================================================

    (
        student2_id, exercise_1_2_id, 2,
        'interactive',
        '{
            "exercise_type": "timeline",
            "timeline": [
                {"year": 1867, "event": "Nacimiento en Varsovia", "correct": true},
                {"year": 1891, "event": "Llegada a París", "correct": true},
                {"year": 1895, "event": "Matrimonio con Pierre", "correct": true},
                {"year": 1898, "event": "Descubrimientos Radio y Polonio", "correct": false, "student_answer": 1897},
                {"year": 1903, "event": "Premio Nobel de Física", "correct": true},
                {"year": 1906, "event": "Muerte de Pierre", "correct": true},
                {"year": 1911, "event": "Premio Nobel de Química", "correct": true},
                {"year": 1934, "event": "Fallecimiento", "correct": true}
            ],
            "sequence_accuracy": "perfect"
        }'::jsonb,
        ARRAY[]::text[],
        true, 85,
        '{
            "correct_events": 7,
            "total_events": 8,
            "date_precision": "good",
            "sequence_accuracy": "perfect",
            "feedback": "Muy bien. Has mejorado significativamente. Pequeño error en fecha descubrimiento Radio (1898, no 1897).",
            "feedback_details": {
                "improvement": "notable",
                "nobel_dates_mastered": true,
                "minor_date_confusion": "discovery dates"
            },
            "encouragement": "Has corregido los errores principales. ¡Buen trabajo!"
        }'::jsonb,
        NOW() - INTERVAL '11 days' + INTERVAL '8 minutes',
        NOW() - INTERVAL '11 days' + INTERVAL '8 minutes',
        NULL,
        '{
            "auto_grade_confidence": 95,
            "improvement_from_attempt_1": 15,
            "grading_algorithm": "timeline_matcher_v1"
        }'::jsonb,
        NOW() - INTERVAL '11 days',
        NOW() - INTERVAL '11 days'
    ),

    -- ================================================================================
    -- ESTUDIANTE 2: Completar Biografía Submission
    -- ================================================================================

    (
        student2_id, exercise_1_3_id, 1,
        'fill_in_blank',
        '{
            "exercise_type": "fill_in_blank",
            "blanks": [
                {"position": 1, "correct_answer": "Varsovia", "student_answer": "Varsovia", "correct": true},
                {"position": 2, "correct_answer": "Polonia", "student_answer": "Polonia", "correct": true},
                {"position": 3, "correct_answer": "física", "student_answer": "física", "correct": true},
                {"position": 4, "correct_answer": "Pierre Curie", "student_answer": "Pierre Curie", "correct": true},
                {"position": 5, "correct_answer": "radio", "student_answer": "radio", "correct": true},
                {"position": 6, "correct_answer": "polonio", "student_answer": "polonio", "correct": true},
                {"position": 7, "correct_answer": "pechblenda", "student_answer": "uranio", "correct": false},
                {"position": 8, "correct_answer": "Nobel", "student_answer": "Nobel", "correct": true},
                {"position": 9, "correct_answer": "radioactividad", "student_answer": "radioactividad", "correct": true},
                {"position": 10, "correct_answer": "Sorbona", "student_answer": "Sorbona", "correct": true}
            ]
        }'::jsonb,
        ARRAY[]::text[],
        true, 80,
        '{
            "correct_answers": 8,
            "total_answers": 10,
            "vocabulary_accuracy": "good",
            "feedback": "Buen trabajo. Solo un error: el mineral es pechblenda, no uranio (aunque uranio está relacionado).",
            "feedback_details": {
                "names_accuracy": "perfecto",
                "scientific_terms": "muy bueno",
                "context_understanding": "sólido",
                "area_for_improvement": "vocabulario mineralógico"
            }
        }'::jsonb,
        NOW() - INTERVAL '10 days' + INTERVAL '10 minutes',
        NOW() - INTERVAL '10 days' + INTERVAL '10 minutes',
        NULL,
        '{
            "auto_grade_confidence": 95,
            "partial_credit_given": false,
            "grading_algorithm": "exact_match_with_synonyms_v1"
        }'::jsonb,
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '10 days'
    )
    ON CONFLICT (user_id, exercise_id, attempt_number) DO UPDATE SET
        answer_data = EXCLUDED.answer_data,
        score = EXCLUDED.score,
        feedback = EXCLUDED.feedback,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();

    RAISE NOTICE 'Exercise submissions data inserted successfully';

    RAISE NOTICE '✓ Exercise attempts and submissions seeds completed';
    RAISE NOTICE '  - Exercise attempts: 11';
    RAISE NOTICE '  - Exercise submissions: 4';
    RAISE NOTICE '  - Students tracked: 3';
    RAISE NOTICE '  - Exercises covered: 6';

END $$;
