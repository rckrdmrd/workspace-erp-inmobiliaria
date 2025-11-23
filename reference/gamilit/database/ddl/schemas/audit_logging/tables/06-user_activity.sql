-- =====================================================
-- USER ACTIVITY LOG TABLE
-- =====================================================

-- Create table for user activity logging
CREATE TABLE IF NOT EXISTS audit_logging.user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for user activity
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON audit_logging.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON audit_logging.user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON audit_logging.user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_metadata ON audit_logging.user_activity USING gin(metadata);

-- Add comments
COMMENT ON TABLE audit_logging.user_activity IS 'User activity log for admin monitoring';
