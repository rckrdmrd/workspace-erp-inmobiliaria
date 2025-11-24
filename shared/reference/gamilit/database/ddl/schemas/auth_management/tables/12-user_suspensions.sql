-- =====================================================
-- USER SUSPENSIONS TABLE
-- =====================================================
-- Schema: auth_management
-- Table: user_suspensions
-- Description: User account suspensions and bans
-- Created: 2025-11-02

-- Create table for user suspensions
CREATE TABLE IF NOT EXISTS auth_management.user_suspensions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    suspension_until TIMESTAMP WITH TIME ZONE, -- NULL means permanent ban
    suspended_by UUID NOT NULL REFERENCES auth.users(id),
    suspended_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Ensure one suspension record per user
    UNIQUE(user_id)
);

-- Create indexes for user suspensions
CREATE INDEX IF NOT EXISTS idx_user_suspensions_user_id ON auth_management.user_suspensions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_suspensions_suspended_by ON auth_management.user_suspensions(suspended_by);
CREATE INDEX IF NOT EXISTS idx_user_suspensions_until ON auth_management.user_suspensions(suspension_until)
    WHERE suspension_until IS NOT NULL;

-- Add comments
COMMENT ON TABLE auth_management.user_suspensions IS 'User account suspensions and bans';
COMMENT ON COLUMN auth_management.user_suspensions.suspension_until IS 'NULL indicates permanent ban, otherwise temporary suspension until this date';
