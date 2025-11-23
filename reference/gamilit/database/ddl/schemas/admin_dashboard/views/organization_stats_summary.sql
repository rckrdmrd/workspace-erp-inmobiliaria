-- =====================================================
-- View: admin_dashboard.organization_stats_summary
-- Description: Aggregated organization statistics for admin dashboard
-- Type: Normal View
-- Created: 2025-10-16
-- =====================================================

CREATE OR REPLACE VIEW admin_dashboard.organization_stats_summary AS
SELECT
    COUNT(*) as total_organizations,
    COUNT(*) FILTER (WHERE is_active = true) as active_organizations,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_organizations_month
FROM auth_management.tenants;

COMMENT ON VIEW admin_dashboard.organization_stats_summary IS 'Aggregated organization statistics for admin dashboard';
