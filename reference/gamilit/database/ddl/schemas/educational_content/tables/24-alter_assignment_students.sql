-- =============================================================================
-- Table Alteration: educational_content.assignment_students
-- Description: Add missing grading and submission fields
-- Priority: P0 - CRITICAL BLOCKER
-- User Story: US-PM-003a (Grading Queue), US-PM-004a (Progress Analytics)
-- Created: 2025-11-19
-- =============================================================================

-- Add missing columns for grading functionality
ALTER TABLE educational_content.assignment_students
    -- Submission tracking
    ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS submission_data JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS submission_url TEXT,
    ADD COLUMN IF NOT EXISTS submission_files JSONB DEFAULT '[]'::jsonb,

    -- Grading fields
    ADD COLUMN IF NOT EXISTS score DECIMAL(5,2),
    ADD COLUMN IF NOT EXISTS max_score DECIMAL(5,2),
    ADD COLUMN IF NOT EXISTS percentage DECIMAL(5,2),
    ADD COLUMN IF NOT EXISTS feedback TEXT,
    ADD COLUMN IF NOT EXISTS graded_by UUID
        REFERENCES auth_management.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS graded_at TIMESTAMPTZ,

    -- Status tracking
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'assigned',
    -- Possible values: 'assigned', 'in_progress', 'submitted', 'graded', 'returned', 'late'

    -- Attempt tracking
    ADD COLUMN IF NOT EXISTS attempt_number INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS max_attempts INTEGER DEFAULT 1,

    -- Late submission
    ADD COLUMN IF NOT EXISTS is_late BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS late_penalty_applied DECIMAL(5,2) DEFAULT 0,

    -- Grading rubric results
    ADD COLUMN IF NOT EXISTS rubric_scores JSONB DEFAULT '{}'::jsonb,
    -- Example: {"criteria_1": 8.5, "criteria_2": 9.0, "criteria_3": 7.5}

    -- Teacher notes and flags
    ADD COLUMN IF NOT EXISTS teacher_notes TEXT,
    ADD COLUMN IF NOT EXISTS flagged_for_review BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS flag_reason TEXT,

    -- Audit fields
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- =============================================================================
-- Add constraints
-- =============================================================================

-- Ensure score is within valid range if provided
ALTER TABLE educational_content.assignment_students
    ADD CONSTRAINT IF NOT EXISTS assignment_students_score_valid
        CHECK (score IS NULL OR (score >= 0 AND score <= max_score));

-- Ensure percentage is valid
ALTER TABLE educational_content.assignment_students
    ADD CONSTRAINT IF NOT EXISTS assignment_students_percentage_valid
        CHECK (percentage IS NULL OR (percentage >= 0 AND percentage <= 100));

-- Ensure attempt number is positive
ALTER TABLE educational_content.assignment_students
    ADD CONSTRAINT IF NOT EXISTS assignment_students_attempt_positive
        CHECK (attempt_number > 0 AND attempt_number <= max_attempts);

-- Status must be one of the valid values
ALTER TABLE educational_content.assignment_students
    ADD CONSTRAINT IF NOT EXISTS assignment_students_status_valid
        CHECK (status IN ('assigned', 'in_progress', 'submitted', 'graded', 'returned', 'late', 'excused'));

-- =============================================================================
-- Create indexes for performance
-- =============================================================================

-- Index for finding assignments by status
CREATE INDEX IF NOT EXISTS idx_assignment_students_status
    ON educational_content.assignment_students(status);

-- Index for finding ungraded submissions
CREATE INDEX IF NOT EXISTS idx_assignment_students_submitted_ungraded
    ON educational_content.assignment_students(assignment_id, submitted_at)
    WHERE status = 'submitted';

-- Index for finding flagged assignments
CREATE INDEX IF NOT EXISTS idx_assignment_students_flagged
    ON educational_content.assignment_students(assignment_id)
    WHERE flagged_for_review = TRUE;

-- Index for grading queue (submitted, not graded, ordered by submission time)
CREATE INDEX IF NOT EXISTS idx_assignment_students_grading_queue
    ON educational_content.assignment_students(assignment_id, submitted_at)
    WHERE status IN ('submitted', 'in_progress')
    ORDER BY submitted_at ASC;

-- Index for student's assignment history
CREATE INDEX IF NOT EXISTS idx_assignment_students_student_history
    ON educational_content.assignment_students(student_id, submitted_at DESC);

-- Index for grader analytics
CREATE INDEX IF NOT EXISTS idx_assignment_students_graded_by
    ON educational_content.assignment_students(graded_by, graded_at)
    WHERE status = 'graded';

-- =============================================================================
-- Create/Update trigger for updated_at timestamp
-- =============================================================================

CREATE OR REPLACE FUNCTION educational_content.update_assignment_students_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();

    -- Auto-calculate percentage when score is updated
    IF NEW.score IS NOT NULL AND NEW.max_score IS NOT NULL AND NEW.max_score > 0 THEN
        NEW.percentage = (NEW.score / NEW.max_score) * 100;
    END IF;

    -- Auto-set graded_at when status changes to 'graded'
    IF NEW.status = 'graded' AND OLD.status != 'graded' THEN
        NEW.graded_at = NOW();
    END IF;

    -- Auto-detect late submission
    IF NEW.submitted_at IS NOT NULL THEN
        -- Get assignment due date
        DECLARE
            assignment_due_date TIMESTAMPTZ;
        BEGIN
            SELECT due_date INTO assignment_due_date
            FROM educational_content.assignments
            WHERE id = NEW.assignment_id;

            IF assignment_due_date IS NOT NULL AND NEW.submitted_at > assignment_due_date THEN
                NEW.is_late = TRUE;
            END IF;
        END;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_assignment_students_timestamp
    ON educational_content.assignment_students;

CREATE TRIGGER trigger_update_assignment_students_timestamp
    BEFORE UPDATE ON educational_content.assignment_students
    FOR EACH ROW
    EXECUTE FUNCTION educational_content.update_assignment_students_timestamp();

-- =============================================================================
-- Add comments for documentation
-- =============================================================================

COMMENT ON COLUMN educational_content.assignment_students.status IS
'Current status of the assignment: assigned, in_progress, submitted, graded, returned, late, excused';

COMMENT ON COLUMN educational_content.assignment_students.submission_data IS
'JSON data containing the student submission (answers, files metadata, completion data)';

COMMENT ON COLUMN educational_content.assignment_students.rubric_scores IS
'JSON object with scores per rubric criteria for detailed grading';

COMMENT ON COLUMN educational_content.assignment_students.score IS
'Points earned by the student (0 to max_score)';

COMMENT ON COLUMN educational_content.assignment_students.percentage IS
'Auto-calculated percentage grade (0-100) based on score/max_score';

COMMENT ON COLUMN educational_content.assignment_students.flagged_for_review IS
'True if this submission requires special attention or review';

-- =============================================================================
-- Sample query for grading queue
-- =============================================================================

COMMENT ON TABLE educational_content.assignment_students IS
'Tracks individual student submissions and grades for assignments.

Example grading queue query:
SELECT
    ass.id,
    ass.student_id,
    p.display_name as student_name,
    a.title as assignment_title,
    ass.submitted_at,
    ass.attempt_number,
    ass.is_late
FROM educational_content.assignment_students ass
JOIN educational_content.assignments a ON a.id = ass.assignment_id
JOIN auth_management.profiles p ON p.id = ass.student_id
WHERE ass.status = ''submitted''
  AND a.teacher_id = ''<teacher_id>''
ORDER BY ass.submitted_at ASC;
';

-- =============================================================================
-- Grant permissions
-- =============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON educational_content.assignment_students TO gamilit_user;
