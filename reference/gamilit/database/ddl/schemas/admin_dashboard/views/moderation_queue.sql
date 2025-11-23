-- =====================================================
-- View: admin_dashboard.moderation_queue
-- Description: Pending content moderation items prioritized for review
-- Type: Normal View
-- Created: 2025-10-16
-- =====================================================

CREATE OR REPLACE VIEW admin_dashboard.moderation_queue AS
SELECT
    fc.id,
    fc.content_type,
    fc.content_id,
    fc.content_preview,
    fc.reason,
    fc.priority,
    fc.status,
    fc.created_at,
    u.email as reporter_email,
    p.full_name as reporter_name
FROM content_management.flagged_content fc
LEFT JOIN auth.users u ON fc.reported_by = u.id
LEFT JOIN auth_management.profiles p ON fc.reported_by = p.user_id
WHERE fc.status = 'pending'
ORDER BY
    CASE fc.priority
        WHEN 'high' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 3
    END,
    fc.created_at ASC;

COMMENT ON VIEW admin_dashboard.moderation_queue IS 'Pending content moderation items prioritized for review';
