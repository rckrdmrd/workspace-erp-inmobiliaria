-- =============================================================================
-- Table: educational_content.teacher_content
-- Description: Custom educational content created by teachers
-- Priority: P1 - Important for teacher content creation features
-- User Story: US-PM-007 (Custom Content Creation), US-AE-008 (Content Management)
-- Created: 2025-11-19
-- =============================================================================

-- Drop table if exists
DROP TABLE IF EXISTS educational_content.teacher_content CASCADE;

-- Create teacher_content table
CREATE TABLE educational_content.teacher_content (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Ownership
    teacher_id UUID NOT NULL
        REFERENCES auth_management.profiles(id) ON DELETE CASCADE,
    tenant_id UUID
        REFERENCES auth_management.tenants(id) ON DELETE CASCADE,

    -- Content identification
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL,
    -- Types: 'custom_exercise', 'worksheet', 'reading_material', 'video_lesson', 'presentation', 'quiz', 'assignment', 'resource_pack'

    -- Content body
    content_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Structure varies by content_type, can include:
    -- - exercises: questions, answers, rubrics
    -- - worksheets: sections, instructions
    -- - reading: text, images, references
    -- - videos: url, transcript, chapters
    -- - presentations: slides, notes

    instructions TEXT,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    -- Example: ["Understand fractions", "Solve linear equations"]

    prerequisites JSONB DEFAULT '[]'::jsonb,
    -- Skills or content needed before this

    -- Classification
    subject_area VARCHAR(100),
    grade_level VARCHAR(50),
    difficulty_level VARCHAR(20),  -- 'easy', 'medium', 'hard', 'expert'
    estimated_duration_minutes INTEGER,

    -- Media and attachments
    media_resources JSONB DEFAULT '[]'::jsonb,
    -- Array of media_resource UUIDs or embedded media
    -- Example: ["uuid-1", "uuid-2"] or [{"type": "image", "url": "..."}]

    attachments JSONB DEFAULT '[]'::jsonb,
    -- Additional files (PDFs, docs, etc.)

    -- Classroom assignment
    target_classrooms JSONB DEFAULT '[]'::jsonb,
    -- Array of classroom UUIDs where this content is used
    -- Example: ["classroom-uuid-1", "classroom-uuid-2"]

    -- Sharing and visibility
    visibility VARCHAR(50) DEFAULT 'private',
    -- 'private' (only teacher), 'classroom' (assigned classrooms), 'school' (all teachers in tenant), 'public' (all)

    is_shared BOOLEAN DEFAULT FALSE,
    shared_with_teachers JSONB DEFAULT '[]'::jsonb,
    -- Array of teacher UUIDs who have access

    allow_modifications BOOLEAN DEFAULT FALSE,
    -- If shared, can other teachers modify?

    -- Publishing and approval
    status VARCHAR(50) DEFAULT 'draft',
    -- 'draft', 'pending_review', 'approved', 'published', 'archived'

    published_at TIMESTAMPTZ,
    published_version INTEGER DEFAULT 1,

    requires_approval BOOLEAN DEFAULT FALSE,
    approved_by UUID
        REFERENCES auth_management.profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,

    -- Usage tracking
    times_assigned INTEGER DEFAULT 0,
    times_completed INTEGER DEFAULT 0,
    average_score DECIMAL(5,2),
    average_duration_minutes INTEGER,

    -- Tags and categorization
    tags JSONB DEFAULT '[]'::jsonb,
    -- Example: ["geometry", "problem-solving", "interactive"]

    keywords JSONB DEFAULT '[]'::jsonb,
    -- For search

    -- Gamification (optional)
    points_value INTEGER DEFAULT 0,
    ml_coins_reward INTEGER DEFAULT 0,

    -- Quality metrics
    student_rating DECIMAL(3,2),  -- 0.00 to 5.00
    rating_count INTEGER DEFAULT 0,
    teacher_rating DECIMAL(3,2),  -- Peer ratings
    teacher_rating_count INTEGER DEFAULT 0,

    -- Licensing and attribution
    license VARCHAR(100),
    -- 'CC-BY', 'CC-BY-SA', 'proprietary', 'educational_use_only'

    attribution TEXT,
    based_on_content_id UUID
        REFERENCES educational_content.teacher_content(id) ON DELETE SET NULL,
    -- If this is derived from another teacher's content

    -- Versioning
    version_number INTEGER DEFAULT 1,
    is_latest_version BOOLEAN DEFAULT TRUE,
    previous_version_id UUID
        REFERENCES educational_content.teacher_content(id) ON DELETE SET NULL,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    -- Additional custom fields

    -- Flags
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,  -- Can be used as template by other teachers

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT teacher_content_type_valid
        CHECK (content_type IN ('custom_exercise', 'worksheet', 'reading_material', 'video_lesson', 'presentation', 'quiz', 'assignment', 'resource_pack', 'other')),
    CONSTRAINT teacher_content_difficulty_valid
        CHECK (difficulty_level IS NULL OR difficulty_level IN ('easy', 'medium', 'hard', 'expert')),
    CONSTRAINT teacher_content_visibility_valid
        CHECK (visibility IN ('private', 'classroom', 'school', 'public')),
    CONSTRAINT teacher_content_status_valid
        CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'archived')),
    CONSTRAINT teacher_content_duration_positive
        CHECK (estimated_duration_minutes IS NULL OR estimated_duration_minutes > 0),
    CONSTRAINT teacher_content_points_non_negative
        CHECK (points_value >= 0 AND ml_coins_reward >= 0)
);

-- =============================================================================
-- Indexes for performance
-- =============================================================================

-- Index for teacher's content
CREATE INDEX idx_teacher_content_teacher
    ON educational_content.teacher_content(teacher_id, created_at DESC)
    WHERE is_active = TRUE;

-- Index for published content
CREATE INDEX idx_teacher_content_published
    ON educational_content.teacher_content(published_at DESC)
    WHERE status = 'published' AND is_active = TRUE;

-- Index for content by type
CREATE INDEX idx_teacher_content_type
    ON educational_content.teacher_content(content_type, created_at DESC)
    WHERE is_active = TRUE;

-- Index for shared content
CREATE INDEX idx_teacher_content_shared
    ON educational_content.teacher_content(visibility, status)
    WHERE is_shared = TRUE AND is_active = TRUE;

-- Index for featured/template content
CREATE INDEX idx_teacher_content_featured
    ON educational_content.teacher_content(created_at DESC)
    WHERE (is_featured = TRUE OR is_template = TRUE) AND is_active = TRUE;

-- Index for pending approval
CREATE INDEX idx_teacher_content_pending
    ON educational_content.teacher_content(created_at ASC)
    WHERE status = 'pending_review' AND is_active = TRUE;

-- Composite index for classroom content search
CREATE INDEX idx_teacher_content_classroom_search
    ON educational_content.teacher_content(status, visibility, content_type)
    WHERE is_active = TRUE;

-- GIN indexes for JSONB searches
CREATE INDEX idx_teacher_content_tags
    ON educational_content.teacher_content USING GIN(tags);

CREATE INDEX idx_teacher_content_keywords
    ON educational_content.teacher_content USING GIN(keywords);

CREATE INDEX idx_teacher_content_target_classrooms
    ON educational_content.teacher_content USING GIN(target_classrooms);

CREATE INDEX idx_teacher_content_metadata
    ON educational_content.teacher_content USING GIN(metadata);

-- =============================================================================
-- Triggers
-- =============================================================================

-- Trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION educational_content.update_teacher_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();

    -- Auto-set published_at when status changes to published
    IF NEW.status = 'published' AND OLD.status != 'published' THEN
        NEW.published_at = NOW();
    END IF;

    -- Increment times_assigned when target_classrooms changes
    IF NEW.target_classrooms IS DISTINCT FROM OLD.target_classrooms THEN
        NEW.times_assigned = COALESCE(OLD.times_assigned, 0) +
            (jsonb_array_length(NEW.target_classrooms) - jsonb_array_length(COALESCE(OLD.target_classrooms, '[]'::jsonb)));
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_teacher_content_timestamp
    BEFORE UPDATE ON educational_content.teacher_content
    FOR EACH ROW
    EXECUTE FUNCTION educational_content.update_teacher_content_timestamp();

-- =============================================================================
-- Helper function to check if teacher can access content
-- =============================================================================

CREATE OR REPLACE FUNCTION educational_content.can_teacher_access_content(
    p_content_id UUID,
    p_teacher_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_content RECORD;
BEGIN
    SELECT * INTO v_content
    FROM educational_content.teacher_content
    WHERE id = p_content_id
      AND is_active = TRUE;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Owner always has access
    IF v_content.teacher_id = p_teacher_id THEN
        RETURN TRUE;
    END IF;

    -- Check visibility
    IF v_content.visibility = 'public' THEN
        RETURN TRUE;
    END IF;

    IF v_content.visibility = 'school' OR v_content.visibility = 'classroom' THEN
        -- Check if teacher is in same tenant
        IF EXISTS (
            SELECT 1 FROM auth_management.profiles
            WHERE id = p_teacher_id
              AND tenant_id = v_content.tenant_id
        ) THEN
            RETURN TRUE;
        END IF;
    END IF;

    -- Check if explicitly shared
    IF v_content.shared_with_teachers @> to_jsonb(p_teacher_id::text) THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================================================
-- View: Published teacher content library
-- =============================================================================

CREATE OR REPLACE VIEW educational_content.published_teacher_content AS
SELECT
    tc.id,
    tc.teacher_id,
    p.display_name as teacher_name,
    tc.title,
    tc.description,
    tc.content_type,
    tc.subject_area,
    tc.grade_level,
    tc.difficulty_level,
    tc.estimated_duration_minutes,
    tc.visibility,
    tc.tags,
    tc.points_value,
    tc.ml_coins_reward,
    tc.student_rating,
    tc.rating_count,
    tc.teacher_rating,
    tc.teacher_rating_count,
    tc.times_assigned,
    tc.times_completed,
    tc.is_featured,
    tc.is_template,
    tc.license,
    tc.published_at,
    tc.created_at
FROM educational_content.teacher_content tc
JOIN auth_management.profiles p ON p.id = tc.teacher_id
WHERE tc.status = 'published'
  AND tc.is_active = TRUE
ORDER BY
    tc.is_featured DESC,
    tc.published_at DESC;

-- =============================================================================
-- Comments for documentation
-- =============================================================================

COMMENT ON TABLE educational_content.teacher_content IS
'Custom educational content created by teachers. Supports various content types including exercises, worksheets, reading materials, videos, quizzes, and resource packs. Includes sharing, versioning, and approval workflows.';

COMMENT ON COLUMN educational_content.teacher_content.content_data IS
'JSONB containing the actual content structure, varies by content_type. Examples: exercises (questions, answers), worksheets (sections), videos (url, chapters), presentations (slides)';

COMMENT ON COLUMN educational_content.teacher_content.visibility IS
'Content visibility: private (only creator), classroom (assigned classrooms), school (all teachers in tenant), public (all users)';

COMMENT ON COLUMN educational_content.teacher_content.target_classrooms IS
'JSON array of classroom UUIDs where this content is assigned or available';

COMMENT ON COLUMN educational_content.teacher_content.is_template IS
'If true, other teachers can use this as a template to create their own versions';

COMMENT ON FUNCTION educational_content.can_teacher_access_content IS
'Check if a teacher has permission to view/use specific teacher-created content based on visibility, sharing, and ownership.
Usage: SELECT educational_content.can_teacher_access_content(content_uuid, teacher_uuid);';

-- =============================================================================
-- Grant permissions
-- =============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON educational_content.teacher_content TO gamilit_user;
GRANT SELECT ON educational_content.published_teacher_content TO gamilit_user;
GRANT EXECUTE ON FUNCTION educational_content.can_teacher_access_content TO gamilit_user;
