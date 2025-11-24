-- =============================================================================
-- Table: educational_content.classroom_modules
-- Description: Manages module assignments to classrooms
-- Dependencies:
--   - social_features.classrooms
--   - educational_content.modules
--   - auth_management.profiles (for assigned_by)
-- Created: 2025-11-19
-- Priority: P0 - CRITICAL BLOCKER
-- User Story: US-ADM-004 (Module Assignment to Classrooms)
-- =============================================================================

-- Drop table if exists (for clean recreation)
DROP TABLE IF EXISTS educational_content.classroom_modules CASCADE;

-- Create classroom_modules table
CREATE TABLE educational_content.classroom_modules (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Foreign keys
    classroom_id UUID NOT NULL
        REFERENCES social_features.classrooms(id) ON DELETE CASCADE,
    module_id UUID NOT NULL
        REFERENCES educational_content.modules(id) ON DELETE CASCADE,

    -- Assignment tracking
    assigned_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by UUID
        REFERENCES auth_management.profiles(id) ON DELETE SET NULL,
    due_date DATE,

    -- Status and configuration
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,

    -- Module-specific settings for this classroom
    settings JSONB DEFAULT '{}'::jsonb,
    -- Example settings:
    -- {
    --   "allow_retries": true,
    --   "max_attempts": 3,
    --   "points_multiplier": 1.0,
    --   "unlock_date": "2025-01-15",
    --   "is_optional": false,
    --   "prerequisites": ["module-uuid-1", "module-uuid-2"]
    -- }

    -- Completion tracking override (optional)
    custom_passing_score INTEGER,  -- Override module default passing score
    time_limit_minutes INTEGER,    -- Override module default time limit

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT classroom_modules_unique UNIQUE(classroom_id, module_id),
    CONSTRAINT classroom_modules_order_positive CHECK(display_order >= 0),
    CONSTRAINT classroom_modules_passing_score_valid
        CHECK(custom_passing_score IS NULL OR (custom_passing_score >= 0 AND custom_passing_score <= 100)),
    CONSTRAINT classroom_modules_time_limit_positive
        CHECK(time_limit_minutes IS NULL OR time_limit_minutes > 0)
);

-- =============================================================================
-- Indexes for performance optimization
-- =============================================================================

-- Index for finding all modules in a classroom (most common query)
CREATE INDEX idx_classroom_modules_classroom
    ON educational_content.classroom_modules(classroom_id)
    WHERE is_active = TRUE;

-- Index for finding all classrooms using a module
CREATE INDEX idx_classroom_modules_module
    ON educational_content.classroom_modules(module_id)
    WHERE is_active = TRUE;

-- Index for ordered retrieval of active modules
CREATE INDEX idx_classroom_modules_classroom_order
    ON educational_content.classroom_modules(classroom_id, display_order)
    WHERE is_active = TRUE;

-- Index for due date queries
CREATE INDEX idx_classroom_modules_due_date
    ON educational_content.classroom_modules(due_date)
    WHERE is_active = TRUE AND due_date IS NOT NULL;

-- Index for assignments by teacher (for analytics)
CREATE INDEX idx_classroom_modules_assigned_by
    ON educational_content.classroom_modules(assigned_by, assigned_date);

-- =============================================================================
-- Trigger for updated_at timestamp
-- =============================================================================

CREATE OR REPLACE FUNCTION educational_content.update_classroom_modules_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_classroom_modules_timestamp
    BEFORE UPDATE ON educational_content.classroom_modules
    FOR EACH ROW
    EXECUTE FUNCTION educational_content.update_classroom_modules_timestamp();

-- =============================================================================
-- Row Level Security (RLS) - To be configured based on tenant requirements
-- =============================================================================

-- Enable RLS
ALTER TABLE educational_content.classroom_modules ENABLE ROW LEVEL SECURITY;

-- Policy: Teachers can manage modules in their classrooms
CREATE POLICY classroom_modules_teacher_access
    ON educational_content.classroom_modules
    FOR ALL
    USING (
        classroom_id IN (
            SELECT classroom_id
            FROM social_features.classroom_members
            WHERE student_id = auth.uid()
              AND status = 'teacher'
              AND is_active = TRUE
        )
    );

-- Policy: Students can view modules in their classrooms
CREATE POLICY classroom_modules_student_view
    ON educational_content.classroom_modules
    FOR SELECT
    USING (
        is_active = TRUE
        AND classroom_id IN (
            SELECT classroom_id
            FROM social_features.classroom_members
            WHERE student_id = auth.uid()
              AND is_active = TRUE
        )
    );

-- Policy: Admins and super admins can manage all
CREATE POLICY classroom_modules_admin_access
    ON educational_content.classroom_modules
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth_management.user_roles
            WHERE user_id = auth.uid()
              AND role IN ('admin_teacher', 'super_admin')
              AND is_active = TRUE
        )
    );

-- =============================================================================
-- Comments for documentation
-- =============================================================================

COMMENT ON TABLE educational_content.classroom_modules IS
'Manages the assignment and configuration of educational modules to specific classrooms. Allows customization of module settings per classroom.';

COMMENT ON COLUMN educational_content.classroom_modules.settings IS
'JSON configuration for module-specific settings in this classroom (retries, attempts, points multiplier, unlock dates, prerequisites, etc.)';

COMMENT ON COLUMN educational_content.classroom_modules.custom_passing_score IS
'Override the module default passing score for this specific classroom (0-100)';

COMMENT ON COLUMN educational_content.classroom_modules.display_order IS
'Order in which modules should be displayed to students in this classroom (0-indexed)';

-- =============================================================================
-- Grant permissions
-- =============================================================================

-- Grant appropriate permissions to backend service role
GRANT SELECT, INSERT, UPDATE, DELETE ON educational_content.classroom_modules TO gamilit_user;
GRANT USAGE ON SCHEMA educational_content TO gamilit_user;
