-- =====================================================
-- FLAGGED CONTENT TABLE
-- =====================================================

-- Create table for flagged content moderation
CREATE TABLE IF NOT EXISTS content_management.flagged_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL, -- 'exercise', 'comment', 'profile', 'post', 'message'
    content_id UUID NOT NULL,
    content_preview TEXT,

    -- Reporter information
    reported_by UUID NOT NULL REFERENCES auth.users(id),
    reason VARCHAR(255) NOT NULL,
    description TEXT,

    -- Moderation status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'removed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),

    -- Review information
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for flagged content
CREATE INDEX IF NOT EXISTS idx_flagged_content_type ON content_management.flagged_content(content_type);
CREATE INDEX IF NOT EXISTS idx_flagged_content_id ON content_management.flagged_content(content_id);
CREATE INDEX IF NOT EXISTS idx_flagged_content_status ON content_management.flagged_content(status);
CREATE INDEX IF NOT EXISTS idx_flagged_content_priority ON content_management.flagged_content(priority);
CREATE INDEX IF NOT EXISTS idx_flagged_content_reported_by ON content_management.flagged_content(reported_by);
CREATE INDEX IF NOT EXISTS idx_flagged_content_reviewed_by ON content_management.flagged_content(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_flagged_content_created_at ON content_management.flagged_content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flagged_content_pending ON content_management.flagged_content(created_at DESC)
    WHERE status = 'pending';

-- Add comments
COMMENT ON TABLE content_management.flagged_content IS 'Content flagged for moderation review';
COMMENT ON COLUMN content_management.flagged_content.content_preview IS 'Short preview of the flagged content for quick review';
