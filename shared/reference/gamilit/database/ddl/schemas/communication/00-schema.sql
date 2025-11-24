-- =============================================================================
-- Schema: communication
-- Description: Communication and messaging system for teacher-student interaction
-- Created: 2025-11-19
-- Priority: P1
-- =============================================================================

-- Create communication schema
CREATE SCHEMA IF NOT EXISTS communication;

-- Grant usage to application user
GRANT USAGE ON SCHEMA communication TO gamilit_user;
GRANT ALL ON SCHEMA communication TO gamilit_user;

-- Add comment
COMMENT ON SCHEMA communication IS
'Schema for communication features including direct messaging between teachers and students, classroom announcements, and notifications.';
