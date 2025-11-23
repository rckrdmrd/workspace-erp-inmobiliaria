-- =====================================================
-- Add Soft-Delete to Critical Tables
-- Created: 2025-11-19
-- Issue: DB-124 Hallazgo H-022 - Exceso CASCADE
-- Purpose: Prevent accidental data loss by implementing soft-delete
-- =====================================================

-- Add deleted_at to profiles
ALTER TABLE auth_management.profiles
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Add deleted_at to tenants
ALTER TABLE auth_management.tenants
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Create indexes for efficient queries (only non-deleted records)
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at
ON auth_management.profiles(deleted_at)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_tenants_deleted_at
ON auth_management.tenants(deleted_at)
WHERE deleted_at IS NULL;

-- Add comments
COMMENT ON COLUMN auth_management.profiles.deleted_at IS
'Soft-delete timestamp. NULL = active, NOT NULL = deleted. DB-124 H-022: Prevents accidental data loss from CASCADE deletes (77 FKs to this table)';

COMMENT ON COLUMN auth_management.tenants.deleted_at IS
'Soft-delete timestamp. NULL = active, NOT NULL = deleted. DB-124 H-022: Prevents accidental organization data loss from CASCADE deletes (29 FKs to this table)';

-- Note: Existing queries MUST be updated to include WHERE deleted_at IS NULL
-- Note: This is a NON-BREAKING change (deleted_at defaults to NULL)
-- Note: Application logic needs to be updated to:
--   1. Set deleted_at = NOW() instead of DELETE
--   2. Add WHERE deleted_at IS NULL to all SELECT queries
--   3. Consider periodic cleanup job for permanently deleting old records
