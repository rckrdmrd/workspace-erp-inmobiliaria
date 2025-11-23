-- =====================================================
-- View: admin_dashboard.recent_activity
-- Description: Recent user activity for admin dashboard (last 100 actions)
-- Created: 2025-11-12 (FE-051 P0)
--
-- 📚 Documentación:
-- Proyecto: FE-051 Admin Portal API Integration
-- Handoff: orchestration/integracion/HANDOFF-FE-051-DATABASE-CHANGES.md
-- Backend Handoff: orchestration/integracion/HANDOFF-FE-051-DASHBOARD-TO-BE.md
-- =====================================================

SET search_path TO admin_dashboard, public;

-- =====================================================
-- VIEW: recent_activity
-- =====================================================

CREATE VIEW admin_dashboard.recent_activity AS
SELECT
  al.id,
  al.user_id,
  u.email,
  p.first_name,
  p.last_name,
  al.action_type,
  al.description,
  al.metadata,
  al.created_at
FROM audit_logging.activity_log al
LEFT JOIN auth.users u ON al.user_id = u.id
LEFT JOIN auth_management.profiles p ON u.id = p.user_id
ORDER BY al.created_at DESC
LIMIT 100;

-- =====================================================
-- Comments
-- =====================================================

COMMENT ON VIEW admin_dashboard.recent_activity IS
    'Recent user activity for admin dashboard (last 100 actions). Joins activity_log with user emails and profile names.';

-- =====================================================
-- Usage
-- =====================================================

-- Query recent activity:
-- SELECT * FROM admin_dashboard.recent_activity;

-- =====================================================
-- Dependencies
-- =====================================================

-- Required tables:
-- - audit_logging.activity_log (source table)
-- - auth.users (for email)
-- - auth_management.profiles (for first_name, last_name)

-- =====================================================
-- Backend Usage
-- =====================================================

-- Endpoint: GET /api/admin/dashboard
-- Controller: AdminDashboardController
-- Service: AdminDashboardService
-- Query: SELECT * FROM admin_dashboard.recent_activity;
