-- =============================================================================
-- Materialized Views: admin_dashboard
-- Description: Pre-aggregated views for admin dashboard performance
-- Priority: P1 - Important for dashboard performance
-- User Story: US-ADM-003 (Admin Dashboard), US-ANA-001 (Dashboard Analytics)
-- Created: 2025-11-19
-- =============================================================================

-- =============================================================================
-- 1. SYSTEM OVERVIEW MATERIALIZED VIEW
-- =============================================================================

DROP MATERIALIZED VIEW IF EXISTS admin_dashboard.system_overview_mv CASCADE;

CREATE MATERIALIZED VIEW admin_dashboard.system_overview_mv AS
SELECT
    -- Timestamp of aggregation
    NOW() as snapshot_timestamp,

    -- User statistics
    (SELECT COUNT(*) FROM auth_management.profiles WHERE status = 'active') as total_active_users,
    (SELECT COUNT(*) FROM auth_management.user_roles WHERE role = 'student' AND is_active = TRUE) as total_students,
    (SELECT COUNT(*) FROM auth_management.user_roles WHERE role = 'admin_teacher' AND is_active = TRUE) as total_teachers,
    (SELECT COUNT(*) FROM auth_management.profiles WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as new_users_week,
    (SELECT COUNT(*) FROM auth_management.profiles WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_month,

    -- Classroom statistics
    (SELECT COUNT(*) FROM social_features.classrooms WHERE is_active = TRUE) as total_classrooms,
    (SELECT COUNT(*) FROM social_features.classroom_members WHERE is_active = TRUE) as total_enrollments,
    (SELECT AVG(member_count)::INTEGER FROM (
        SELECT COUNT(*) as member_count
        FROM social_features.classroom_members
        WHERE is_active = TRUE
        GROUP BY classroom_id
    ) avg_calc) as avg_classroom_size,

    -- Content statistics
    (SELECT COUNT(*) FROM educational_content.modules WHERE is_active = TRUE) as total_modules,
    (SELECT COUNT(*) FROM educational_content.exercises WHERE is_active = TRUE) as total_exercises,
    (SELECT COUNT(*) FROM educational_content.assignments WHERE is_published = TRUE) as total_assignments,
    (SELECT COUNT(*) FROM educational_content.teacher_content WHERE status = 'published') as total_teacher_content,

    -- Activity statistics (last 24 hours)
    (SELECT COUNT(*) FROM auth_management.user_sessions WHERE last_activity_at >= NOW() - INTERVAL '24 hours') as active_sessions_24h,
    (SELECT COUNT(DISTINCT user_id) FROM auth_management.user_sessions WHERE last_activity_at >= NOW() - INTERVAL '24 hours') as unique_active_users_24h,

    -- Gamification statistics
    (SELECT COUNT(*) FROM gamification_system.user_stats) as total_gamification_users,
    (SELECT AVG(total_xp)::INTEGER FROM gamification_system.user_stats) as avg_user_xp,
    (SELECT AVG(ml_coins_balance)::INTEGER FROM gamification_system.user_stats) as avg_user_ml_coins,
    (SELECT SUM(total_xp)::BIGINT FROM gamification_system.user_stats) as total_xp_system,
    (SELECT SUM(ml_coins_balance)::BIGINT FROM gamification_system.user_stats) as total_ml_coins_system,

    -- System health
    (SELECT COUNT(*) FROM system_configuration.feature_flags WHERE is_enabled = TRUE) as enabled_features_count,
    (SELECT COUNT(*) FROM audit_logging.system_events WHERE created_at >= NOW() - INTERVAL '1 hour' AND severity = 'error') as errors_last_hour;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_system_overview_mv_snapshot
    ON admin_dashboard.system_overview_mv(snapshot_timestamp);

COMMENT ON MATERIALIZED VIEW admin_dashboard.system_overview_mv IS
'System-wide overview statistics for admin dashboard. Refreshed periodically for performance.
Refresh with: REFRESH MATERIALIZED VIEW CONCURRENTLY admin_dashboard.system_overview_mv;';

-- =============================================================================
-- 2. USER ANALYTICS MATERIALIZED VIEW
-- =============================================================================

DROP MATERIALIZED VIEW IF EXISTS admin_dashboard.user_analytics_mv CASCADE;

CREATE MATERIALIZED VIEW admin_dashboard.user_analytics_mv AS
SELECT
    p.id as user_id,
    p.display_name,
    p.email,
    p.avatar_url,
    ur.role,
    p.tenant_id,
    p.status,
    p.created_at as registered_at,

    -- Gamification stats
    COALESCE(us.total_xp, 0) as total_xp,
    COALESCE(us.current_level, 1) as current_level,
    COALESCE(us.current_rank::TEXT, 'ajaw') as current_rank,
    COALESCE(us.ml_coins_balance, 0) as ml_coins,
    COALESCE(us.total_ml_coins_earned, 0) as ml_coins_earned,

    -- Activity metrics
    COALESCE(us.total_exercises_completed, 0) as exercises_completed,
    COALESCE(us.total_missions_completed, 0) as missions_completed,
    COALESCE(us.current_streak_days, 0) as current_streak,
    COALESCE(us.longest_streak_days, 0) as longest_streak,
    us.last_activity_at,

    -- Engagement score (0-100)
    LEAST(100, (
        COALESCE(us.total_exercises_completed, 0) * 2 +
        COALESCE(us.total_missions_completed, 0) * 10 +
        COALESCE(us.current_streak_days, 0) * 5
    ) / 10) as engagement_score,

    -- Classroom participation (for students)
    (SELECT COUNT(*) FROM social_features.classroom_members cm
     WHERE cm.student_id = p.id AND cm.is_active = TRUE) as enrolled_classrooms_count,

    -- Teaching (for teachers)
    (SELECT COUNT(*) FROM social_features.teacher_classrooms tc
     WHERE tc.teacher_id = p.id AND tc.is_active = TRUE) as teaching_classrooms_count,

    -- Session info
    (SELECT last_activity_at FROM auth_management.user_sessions
     WHERE user_id = p.id ORDER BY last_activity_at DESC LIMIT 1) as last_session_at,

    -- Snapshot timestamp
    NOW() as snapshot_timestamp

FROM auth_management.profiles p
LEFT JOIN auth_management.user_roles ur ON ur.user_id = p.id AND ur.is_active = TRUE
LEFT JOIN gamification_system.user_stats us ON us.user_id = p.id
WHERE p.status = 'active';

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_user_analytics_mv_user
    ON admin_dashboard.user_analytics_mv(user_id);

-- Additional indexes for common queries
CREATE INDEX idx_user_analytics_mv_role
    ON admin_dashboard.user_analytics_mv(role, engagement_score DESC);

CREATE INDEX idx_user_analytics_mv_xp
    ON admin_dashboard.user_analytics_mv(total_xp DESC);

CREATE INDEX idx_user_analytics_mv_engagement
    ON admin_dashboard.user_analytics_mv(engagement_score DESC);

COMMENT ON MATERIALIZED VIEW admin_dashboard.user_analytics_mv IS
'Per-user analytics including gamification stats, engagement metrics, and activity tracking.
Refresh with: REFRESH MATERIALIZED VIEW CONCURRENTLY admin_dashboard.user_analytics_mv;';

-- =============================================================================
-- 3. CLASSROOM SUMMARY MATERIALIZED VIEW
-- =============================================================================

DROP MATERIALIZED VIEW IF EXISTS admin_dashboard.classroom_summary_mv CASCADE;

CREATE MATERIALIZED VIEW admin_dashboard.classroom_summary_mv AS
SELECT
    c.id as classroom_id,
    c.name as classroom_name,
    c.description,
    c.grade_level,
    c.subject,
    c.code as classroom_code,
    c.is_active,
    c.created_at,

    -- Teacher info
    (SELECT p.display_name FROM auth_management.profiles p
     JOIN social_features.teacher_classrooms tc ON tc.teacher_id = p.id
     WHERE tc.classroom_id = c.id AND tc.is_active = TRUE
     LIMIT 1) as primary_teacher_name,

    -- Student counts
    (SELECT COUNT(*) FROM social_features.classroom_members cm
     WHERE cm.classroom_id = c.id AND cm.is_active = TRUE) as student_count,

    (SELECT COUNT(*) FROM social_features.classroom_members cm
     WHERE cm.classroom_id = c.id AND cm.is_active = TRUE
       AND cm.enrollment_date >= CURRENT_DATE - INTERVAL '7 days') as new_students_week,

    -- Module/Content stats
    (SELECT COUNT(*) FROM educational_content.classroom_modules clm
     WHERE clm.classroom_id = c.id AND clm.is_active = TRUE) as assigned_modules_count,

    (SELECT COUNT(*) FROM educational_content.assignments a
     JOIN social_features.assignment_classrooms ac ON ac.assignment_id = a.id
     WHERE ac.classroom_id = c.id AND a.is_published = TRUE) as active_assignments_count,

    -- Engagement metrics
    COALESCE((
        SELECT AVG(us.total_xp)::INTEGER
        FROM gamification_system.user_stats us
        JOIN social_features.classroom_members cm ON cm.student_id = us.user_id
        WHERE cm.classroom_id = c.id AND cm.is_active = TRUE
    ), 0) as avg_student_xp,

    COALESCE((
        SELECT AVG(us.current_level)::DECIMAL(4,1)
        FROM gamification_system.user_stats us
        JOIN social_features.classroom_members cm ON cm.student_id = us.user_id
        WHERE cm.classroom_id = c.id AND cm.is_active = TRUE
    ), 1) as avg_student_level,

    COALESCE((
        SELECT AVG(us.total_exercises_completed)::INTEGER
        FROM gamification_system.user_stats us
        JOIN social_features.classroom_members cm ON cm.student_id = us.user_id
        WHERE cm.classroom_id = c.id AND cm.is_active = TRUE
    ), 0) as avg_exercises_completed,

    -- Activity in last 7 days
    (SELECT COUNT(DISTINCT cm.student_id)
     FROM social_features.classroom_members cm
     JOIN gamification_system.user_stats us ON us.user_id = cm.student_id
     WHERE cm.classroom_id = c.id AND cm.is_active = TRUE
       AND us.last_activity_at >= NOW() - INTERVAL '7 days') as active_students_week,

    -- Snapshot timestamp
    NOW() as snapshot_timestamp

FROM social_features.classrooms c
WHERE c.is_active = TRUE;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_classroom_summary_mv_classroom
    ON admin_dashboard.classroom_summary_mv(classroom_id);

-- Additional indexes
CREATE INDEX idx_classroom_summary_mv_student_count
    ON admin_dashboard.classroom_summary_mv(student_count DESC);

CREATE INDEX idx_classroom_summary_mv_avg_xp
    ON admin_dashboard.classroom_summary_mv(avg_student_xp DESC);

COMMENT ON MATERIALIZED VIEW admin_dashboard.classroom_summary_mv IS
'Aggregated classroom statistics including student counts, engagement metrics, and content assignments.
Refresh with: REFRESH MATERIALIZED VIEW CONCURRENTLY admin_dashboard.classroom_summary_mv;';

-- =============================================================================
-- Helper function to refresh all dashboard materialized views
-- =============================================================================

CREATE OR REPLACE FUNCTION admin_dashboard.refresh_all_dashboards()
RETURNS TEXT AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY admin_dashboard.system_overview_mv;
    REFRESH MATERIALIZED VIEW CONCURRENTLY admin_dashboard.user_analytics_mv;
    REFRESH MATERIALIZED VIEW CONCURRENTLY admin_dashboard.classroom_summary_mv;

    RETURN 'All dashboard materialized views refreshed at ' || NOW()::TEXT;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION admin_dashboard.refresh_all_dashboards IS
'Refresh all admin dashboard materialized views concurrently.
Usage: SELECT admin_dashboard.refresh_all_dashboards();
Recommended to run via cron job every 15-30 minutes.';

-- =============================================================================
-- Grant permissions
-- =============================================================================

GRANT SELECT ON admin_dashboard.system_overview_mv TO gamilit_user;
GRANT SELECT ON admin_dashboard.user_analytics_mv TO gamilit_user;
GRANT SELECT ON admin_dashboard.classroom_summary_mv TO gamilit_user;
GRANT EXECUTE ON FUNCTION admin_dashboard.refresh_all_dashboards TO gamilit_user;

-- =============================================================================
-- Initial refresh
-- =============================================================================

REFRESH MATERIALIZED VIEW admin_dashboard.system_overview_mv;
REFRESH MATERIALIZED VIEW admin_dashboard.user_analytics_mv;
REFRESH MATERIALIZED VIEW admin_dashboard.classroom_summary_mv;
