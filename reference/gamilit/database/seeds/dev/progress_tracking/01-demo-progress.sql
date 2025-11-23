-- =====================================================================================
-- SEED: Demo Progress Data for Progress Tracking Schema
-- =====================================================================================
-- Description: Module progress and learning sessions for demo students
-- Dependencies: auth.users, educational_content.modules, educational_content.exercises
-- Idempotency: Uses ON CONFLICT to handle re-runs safely
-- =====================================================================================

SET search_path TO progress_tracking, educational_content, auth, public;

-- =====================================================================================
-- MODULE PROGRESS & LEARNING SESSIONS
-- =====================================================================================

DO $$
DECLARE
    student1_id UUID;
    student2_id UUID;
    student3_id UUID;
    module1_id UUID;
    module2_id UUID;
    module3_id UUID;
BEGIN
    -- ==================================================================================
    -- GET USER IDS (Demo Students)
    -- ==================================================================================

    SELECT id INTO student1_id
    FROM auth.users
    WHERE email = 'estudiante1@demo.glit.edu.mx';

    SELECT id INTO student2_id
    FROM auth.users
    WHERE email = 'estudiante2@demo.glit.edu.mx';

    SELECT id INTO student3_id
    FROM auth.users
    WHERE email = 'estudiante3@demo.glit.edu.mx';

    -- ==================================================================================
    -- GET MODULE IDS (Marie Curie Modules)
    -- ==================================================================================

    SELECT id INTO module1_id
    FROM educational_content.modules
    WHERE module_code = 'MOD-01-LITERAL';

    SELECT id INTO module2_id
    FROM educational_content.modules
    WHERE module_code = 'MOD-02-INFERENCIAL';

    SELECT id INTO module3_id
    FROM educational_content.modules
    WHERE module_code = 'MOD-03-CRITICA';

    -- ==================================================================================
    -- MODULE PROGRESS: Student Progress Tracking
    -- ==================================================================================

    RAISE NOTICE 'Inserting module progress data...';

    INSERT INTO progress_tracking.module_progress (
        user_id, module_id,
        status, progress_percentage,
        completed_exercises, total_exercises,
        total_score, max_possible_score,
        time_spent, attempts_count,
        started_at, last_accessed_at, completed_at,
        metadata, created_at, updated_at
    ) VALUES
    -- ================================================================================
    -- ESTUDIANTE 1: Advanced Student (2 modules active)
    -- ================================================================================

    -- Module 1: COMPLETED (Perfect Performance)
    (
        student1_id, module1_id,
        'completed', 100,
        5, 5,
        480, 500,
        45, 8,
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '3 days',
        '{
            "average_score_percentage": 96,
            "completion_time_days": 7,
            "streak_days": 5,
            "comodines_used": ["pistas", "vision_lectora"],
            "performance_trend": "improving",
            "mastery_level": "advanced"
        }'::jsonb,
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '3 days'
    ),

    -- Module 2: IN PROGRESS (Good Progress)
    (
        student1_id, module2_id,
        'in_progress', 60,
        3, 5,
        285, 500,
        30, 5,
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '1 hour',
        NULL,
        '{
            "average_score_percentage": 95,
            "current_exercise": 4,
            "comodines_used": ["pistas"],
            "estimated_completion_days": 2,
            "difficulty_level": "intermediate"
        }'::jsonb,
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '1 hour'
    ),

    -- ================================================================================
    -- ESTUDIANTE 2: Intermediate Student (Completed Module 1, Advanced Module 3)
    -- ================================================================================

    -- Module 1: COMPLETED (Good Performance)
    (
        student2_id, module1_id,
        'completed', 100,
        5, 5,
        425, 500,
        60, 12,
        NOW() - INTERVAL '15 days',
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '5 days',
        '{
            "average_score_percentage": 85,
            "completion_time_days": 10,
            "streak_days": 3,
            "comodines_used": ["pistas", "segunda_oportunidad"],
            "performance_trend": "stable",
            "retry_rate": 40
        }'::jsonb,
        NOW() - INTERVAL '15 days',
        NOW() - INTERVAL '5 days'
    ),

    -- Module 3: IN PROGRESS (Challenge Level - Advanced)
    (
        student2_id, module3_id,
        'in_progress', 40,
        2, 5,
        160, 500,
        25, 4,
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '2 hours',
        NULL,
        '{
            "average_score_percentage": 80,
            "current_exercise": 3,
            "difficulty": "advanced",
            "skipped_module_2": false,
            "teacher_recommendation": "review inferential reading first"
        }'::jsonb,
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '2 hours'
    ),

    -- ================================================================================
    -- ESTUDIANTE 3: Foundational Student (Needs Support)
    -- ================================================================================

    -- Module 1: IN PROGRESS (Slower Pace, More Support Needed)
    (
        student3_id, module1_id,
        'in_progress', 40,
        2, 5,
        150, 500,
        35, 6,
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '3 hours',
        NULL,
        '{
            "average_score_percentage": 75,
            "current_exercise": 3,
            "comodines_used": ["pistas", "pistas", "vision_lectora"],
            "support_level": "foundational",
            "hints_per_exercise_avg": 2.5,
            "teacher_intervention_suggested": true
        }'::jsonb,
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '3 hours'
    )
    ON CONFLICT (user_id, module_id) DO UPDATE SET
        status = EXCLUDED.status,
        progress_percentage = EXCLUDED.progress_percentage,
        completed_exercises = EXCLUDED.completed_exercises,
        total_score = EXCLUDED.total_score,
        time_spent = EXCLUDED.time_spent,
        attempts_count = EXCLUDED.attempts_count,
        last_accessed_at = EXCLUDED.last_accessed_at,
        completed_at = EXCLUDED.completed_at,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();

    RAISE NOTICE 'Module progress data inserted successfully';

    -- ==================================================================================
    -- LEARNING SESSIONS: Study Session Tracking
    -- ==================================================================================

    RAISE NOTICE 'Inserting learning sessions data...';

    INSERT INTO progress_tracking.learning_sessions (
        user_id, module_id,
        started_at, ended_at, duration,
        exercises_attempted, exercises_completed,
        metadata, created_at
    ) VALUES
    -- ================================================================================
    -- ESTUDIANTE 1: Recent Active Sessions
    -- ================================================================================

    -- Session 1: Recent Module 2 Study (Focused & Productive)
    (
        student1_id, module2_id,
        NOW() - INTERVAL '1 hour',
        NOW() - INTERVAL '30 minutes',
        30,
        1, 1,
        95, ARRAY[]::text[],
        ARRAY['pistas']::text[],
        'study',
        '{
            "device": "laptop",
            "location": "home",
            "focus_score": 85,
            "interruptions": 0,
            "browser": "chrome",
            "screen_time_active_percentage": 95
        }'::jsonb,
        NOW() - INTERVAL '30 minutes'
    ),

    -- Session 2: Yesterday Module 2 Study
    (
        student1_id, module2_id,
        NOW() - INTERVAL '25 hours',
        NOW() - INTERVAL '24 hours',
        45,
        2, 2,
        190, ARRAY['quick_learner']::text[],
        ARRAY['vision_lectora']::text[],
        'study',
        '{
            "device": "laptop",
            "location": "library",
            "focus_score": 92,
            "interruptions": 0,
            "achievement_earned": "quick_learner"
        }'::jsonb,
        NOW() - INTERVAL '24 hours'
    ),

    -- ================================================================================
    -- ESTUDIANTE 2: Module 3 Sessions (Challenging Content)
    -- ================================================================================

    -- Session 1: Module 3 Study (Moderate Focus)
    (
        student2_id, module3_id,
        NOW() - INTERVAL '3 hours',
        NOW() - INTERVAL '2 hours',
        60,
        2, 1,
        80, ARRAY[]::text[],
        ARRAY['segunda_oportunidad']::text[],
        'study',
        '{
            "device": "tablet",
            "location": "school",
            "focus_score": 75,
            "interruptions": 2,
            "retry_used": true,
            "difficulty_feedback": "challenging but manageable"
        }'::jsonb,
        NOW() - INTERVAL '2 hours'
    ),

    -- Session 2: Module 3 Review Session
    (
        student2_id, module3_id,
        NOW() - INTERVAL '27 hours',
        NOW() - INTERVAL '26 hours',
        40,
        1, 0,
        0, ARRAY[]::text[],
        ARRAY['pistas', 'pistas']::text[],
        'review',
        '{
            "device": "tablet",
            "location": "home",
            "focus_score": 70,
            "interruptions": 1,
            "review_mode": true,
            "notes": "struggling with critical analysis concepts"
        }'::jsonb,
        NOW() - INTERVAL '26 hours'
    ),

    -- ================================================================================
    -- ESTUDIANTE 3: Module 1 Sessions (Needs Support)
    -- ================================================================================

    -- Session 1: Recent Study with Interruptions
    (
        student3_id, module1_id,
        NOW() - INTERVAL '4 hours',
        NOW() - INTERVAL '3 hours',
        45,
        2, 1,
        70, ARRAY[]::text[],
        ARRAY['pistas', 'vision_lectora']::text[],
        'study',
        '{
            "device": "mobile",
            "location": "home",
            "focus_score": 60,
            "interruptions": 3,
            "hints_requested": 2,
            "vocabulary_support_needed": true
        }'::jsonb,
        NOW() - INTERVAL '3 hours'
    ),

    -- Session 2: Previous Study Session (Low Completion)
    (
        student3_id, module1_id,
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days' + INTERVAL '25 minutes',
        25,
        1, 0,
        0, ARRAY[]::text[],
        ARRAY['pistas', 'pistas']::text[],
        'study',
        '{
            "device": "mobile",
            "location": "bus",
            "focus_score": 45,
            "interruptions": 5,
            "session_abandoned": true,
            "reason": "connectivity issues"
        }'::jsonb,
        NOW() - INTERVAL '2 days' + INTERVAL '25 minutes'
    )
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Learning sessions data inserted successfully';

    RAISE NOTICE '✓ Progress tracking seeds completed';
    RAISE NOTICE '  - Module progress entries: 5';
    RAISE NOTICE '  - Learning sessions: 6';

END $$;
