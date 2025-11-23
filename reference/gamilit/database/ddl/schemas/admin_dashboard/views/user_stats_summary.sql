-- =====================================================
-- View: admin_dashboard.user_stats_summary
-- Description: Aggregated user statistics for admin dashboard
-- Type: Normal View
-- Created: 2025-10-16
-- =====================================================

CREATE OR REPLACE VIEW admin_dashboard.user_stats_summary AS
SELECT
    COUNT(*) FILTER (WHERE deleted_at IS NULL) as total_users,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as users_today,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as users_this_week,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as users_this_month,
    COUNT(*) FILTER (WHERE last_sign_in_at >= CURRENT_DATE) as active_users_today,
    COUNT(*) FILTER (WHERE last_sign_in_at >= CURRENT_DATE - INTERVAL '7 days') as active_users_week,
    COUNT(*) FILTER (WHERE role = 'student') as total_students,
    COUNT(*) FILTER (WHERE role = 'admin_teacher') as total_teachers,
    COUNT(*) FILTER (WHERE role = 'super_admin') as total_admins
FROM auth.users;

COMMENT ON VIEW admin_dashboard.user_stats_summary IS 'Aggregated user statistics for admin dashboard';
