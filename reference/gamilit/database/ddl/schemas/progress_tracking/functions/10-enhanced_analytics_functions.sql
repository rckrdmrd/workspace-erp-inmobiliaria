-- =============================================================================
-- Enhanced Analytics Functions for Progress Tracking
-- Priority: P1 - Important for teacher dashboards and analytics
-- Created: 2025-11-19
-- =============================================================================

-- =============================================================================
-- Function: progress_tracking.get_teacher_dashboard
-- Description: Get complete dashboard statistics for a teacher
-- =============================================================================

CREATE OR REPLACE FUNCTION progress_tracking.get_teacher_dashboard(
    p_teacher_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'teacher_id', p_teacher_id,
        'total_classrooms', (
            SELECT COUNT(*)
            FROM social_features.teacher_classrooms
            WHERE teacher_id = p_teacher_id
        ),
        'total_students', (
            SELECT COUNT(DISTINCT cm.student_id)
            FROM social_features.teacher_classrooms tc
            JOIN social_features.classroom_members cm ON cm.classroom_id = tc.classroom_id
            WHERE tc.teacher_id = p_teacher_id
              AND cm.is_active = TRUE
        ),
        'active_assignments', (
            SELECT COUNT(*)
            FROM educational_content.assignments
            WHERE teacher_id = p_teacher_id
              AND is_published = TRUE
        ),
        'pending_grades', (
            SELECT COUNT(*)
            FROM educational_content.assignment_students ast
            JOIN educational_content.assignments a ON a.id = ast.assignment_id
            WHERE a.teacher_id = p_teacher_id
              AND ast.status = 'submitted'
        ),
        'avg_student_progress', (
            SELECT COALESCE(AVG(us.exercises_completed), 0)::INTEGER
            FROM gamification_system.user_stats us
            JOIN social_features.classroom_members cm ON cm.student_id = us.user_id
            JOIN social_features.teacher_classrooms tc ON tc.classroom_id = cm.classroom_id
            WHERE tc.teacher_id = p_teacher_id
              AND cm.is_active = TRUE
        ),
        'classrooms', (
            SELECT json_agg(
                json_build_object(
                    'id', c.id,
                    'name', c.name,
                    'student_count', (
                        SELECT COUNT(*)
                        FROM social_features.classroom_members
                        WHERE classroom_id = c.id AND is_active = TRUE
                    ),
                    'avg_xp', (
                        SELECT COALESCE(AVG(us.total_xp), 0)::INTEGER
                        FROM gamification_system.user_stats us
                        JOIN social_features.classroom_members cm ON cm.student_id = us.user_id
                        WHERE cm.classroom_id = c.id AND cm.is_active = TRUE
                    )
                )
            )
            FROM social_features.classrooms c
            JOIN social_features.teacher_classrooms tc ON tc.classroom_id = c.id
            WHERE tc.teacher_id = p_teacher_id
              AND c.is_active = TRUE
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION progress_tracking.get_teacher_dashboard IS
'Get complete dashboard summary for a teacher including all classrooms, students, assignments, and statistics.
Usage: SELECT progress_tracking.get_teacher_dashboard(teacher_uuid);';

-- =============================================================================
-- Function: progress_tracking.get_classroom_detailed_analytics
-- Description: Enhanced version of classroom analytics with more metrics
-- =============================================================================

CREATE OR REPLACE FUNCTION progress_tracking.get_classroom_detailed_analytics(
    p_classroom_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'classroom_id', p_classroom_id,
        'classroom_name', c.name,
        'student_count', (
            SELECT COUNT(*)
            FROM social_features.classroom_members
            WHERE classroom_id = p_classroom_id AND is_active = TRUE
        ),
        'active_students_week', (
            SELECT COUNT(DISTINCT cm.student_id)
            FROM social_features.classroom_members cm
            JOIN gamification_system.user_stats us ON us.user_id = cm.student_id
            WHERE cm.classroom_id = p_classroom_id
              AND cm.is_active = TRUE
              AND us.last_activity_at >= CURRENT_DATE - 7
        ),
        'total_xp', (
            SELECT COALESCE(SUM(us.total_xp), 0)::BIGINT
            FROM gamification_system.user_stats us
            JOIN social_features.classroom_members cm ON cm.student_id = us.user_id
            WHERE cm.classroom_id = p_classroom_id
              AND cm.is_active = TRUE
        ),
        'avg_xp_per_student', (
            SELECT COALESCE(AVG(us.total_xp), 0)::INTEGER
            FROM gamification_system.user_stats us
            JOIN social_features.classroom_members cm ON cm.student_id = us.user_id
            WHERE cm.classroom_id = p_classroom_id
              AND cm.is_active = TRUE
        ),
        'avg_level', (
            SELECT COALESCE(AVG(us.level), 1)::DECIMAL(4,1)
            FROM gamification_system.user_stats us
            JOIN social_features.classroom_members cm ON cm.student_id = us.user_id
            WHERE cm.classroom_id = p_classroom_id
              AND cm.is_active = TRUE
        ),
        'total_exercises_completed', (
            SELECT COALESCE(SUM(us.exercises_completed), 0)::INTEGER
            FROM gamification_system.user_stats us
            JOIN social_features.classroom_members cm ON cm.student_id = us.user_id
            WHERE cm.classroom_id = p_classroom_id
              AND cm.is_active = TRUE
        ),
        'avg_streak', (
            SELECT COALESCE(AVG(us.current_streak), 0)::DECIMAL(4,1)
            FROM gamification_system.user_stats us
            JOIN social_features.classroom_members cm ON cm.student_id = us.user_id
            WHERE cm.classroom_id = p_classroom_id
              AND cm.is_active = TRUE
        ),
        'assigned_modules', (
            SELECT COUNT(*)
            FROM educational_content.classroom_modules
            WHERE classroom_id = p_classroom_id AND is_active = TRUE
        ),
        'top_students', (
            SELECT json_agg(top_data)
            FROM (
                SELECT json_build_object(
                    'student_id', us.user_id,
                    'name', p.display_name,
                    'xp', us.total_xp,
                    'level', us.level,
                    'rank', us.current_rank::TEXT
                ) as top_data
                FROM gamification_system.user_stats us
                JOIN social_features.classroom_members cm ON cm.student_id = us.user_id
                JOIN auth_management.profiles p ON p.id = us.user_id
                WHERE cm.classroom_id = p_classroom_id
                  AND cm.is_active = TRUE
                ORDER BY us.total_xp DESC
                LIMIT 5
            ) top_5
        )
    ) INTO v_result
    FROM social_features.classrooms c
    WHERE c.id = p_classroom_id;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION progress_tracking.get_classroom_detailed_analytics IS
'Get detailed analytics for a classroom including student metrics, XP, levels, and top performers.
Usage: SELECT progress_tracking.get_classroom_detailed_analytics(classroom_uuid);';

-- =============================================================================
-- View: progress_tracking.classroom_students_metrics
-- Description: Quick view of all students with their key metrics per classroom
-- =============================================================================

CREATE OR REPLACE VIEW progress_tracking.classroom_students_metrics AS
SELECT
    cm.classroom_id,
    c.name as classroom_name,
    cm.student_id,
    p.display_name as student_name,
    p.email as student_email,
    cm.enrollment_date,
    cm.status as enrollment_status,

    -- Gamification metrics
    COALESCE(us.total_xp, 0) as total_xp,
    COALESCE(us.level, 1) as current_level,
    COALESCE(us.current_rank::TEXT, 'ajaw') as current_rank,
    COALESCE(us.ml_coins, 0) as ml_coins,

    -- Progress metrics
    COALESCE(us.exercises_completed, 0) as exercises_completed,
    COALESCE(us.modules_completed, 0) as modules_completed,
    COALESCE(us.total_score, 0) as total_score,

    -- Engagement metrics
    COALESCE(us.current_streak, 0) as current_streak,
    COALESCE(us.max_streak, 0) as max_streak,
    COALESCE(us.days_active_total, 0) as days_active,
    us.last_activity_at,

    -- Calculated engagement score (0-100)
    LEAST(100, (
        COALESCE(us.exercises_completed, 0) * 2 +
        COALESCE(us.modules_completed, 0) * 10 +
        COALESCE(us.current_streak, 0) * 5 +
        COALESCE(us.days_active_total, 0)
    ) / 10) as engagement_score,

    -- Classroom-specific
    cm.final_grade,
    cm.attendance_percentage,
    cm.is_active as is_active_in_classroom

FROM social_features.classroom_members cm
JOIN social_features.classrooms c ON c.id = cm.classroom_id
JOIN auth_management.profiles p ON p.id = cm.student_id
LEFT JOIN gamification_system.user_stats us ON us.user_id = cm.student_id
WHERE cm.is_active = TRUE
ORDER BY c.name, us.total_xp DESC NULLS LAST;

COMMENT ON VIEW progress_tracking.classroom_students_metrics IS
'Comprehensive view of all students in classrooms with their metrics, progress, and engagement scores.
Useful for teacher dashboards and student progress tracking.';

-- =============================================================================
-- Grant permissions
-- =============================================================================

GRANT EXECUTE ON FUNCTION progress_tracking.get_teacher_dashboard TO gamilit_user;
GRANT EXECUTE ON FUNCTION progress_tracking.get_classroom_detailed_analytics TO gamilit_user;
GRANT SELECT ON progress_tracking.classroom_students_metrics TO gamilit_user;
