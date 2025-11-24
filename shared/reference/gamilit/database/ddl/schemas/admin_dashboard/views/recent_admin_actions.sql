-- =====================================================
-- View: admin_dashboard.recent_admin_actions
-- Description: Recent admin actions from audit log
-- Type: Normal View
-- Created: 2025-10-16
-- =====================================================

CREATE OR REPLACE VIEW admin_dashboard.recent_admin_actions AS
SELECT
    ale.id,
    ale.action,
    ale.resource_type,
    ale.resource_id,
    ale.description,
    ale.status,
    ale.created_at,
    u.email as admin_email,
    p.full_name as admin_name
FROM audit_logging.audit_log_events ale
LEFT JOIN auth.users u ON ale.actor_id = u.id
LEFT JOIN auth_management.profiles p ON ale.actor_id = p.user_id
WHERE ale.event_type = 'admin_action'
ORDER BY ale.created_at DESC
LIMIT 100;

COMMENT ON VIEW admin_dashboard.recent_admin_actions IS 'Recent admin actions from audit log';
