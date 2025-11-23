-- =============================================================================
-- Table: communication.messages
-- Description: Messages and chat system for teacher-student communication
-- Priority: P1 - Important for communication features
-- User Stories: US-PM-005 (Teacher Communication), US-AE-006 (Communication Management)
-- Created: 2025-11-19
-- =============================================================================

-- Drop table if exists
DROP TABLE IF EXISTS communication.messages CASCADE;

-- Create messages table
CREATE TABLE communication.messages (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Message relationships
    sender_id UUID NOT NULL
        REFERENCES auth_management.profiles(id) ON DELETE CASCADE,
    recipient_id UUID
        REFERENCES auth_management.profiles(id) ON DELETE CASCADE,

    -- Context (where message belongs)
    classroom_id UUID
        REFERENCES social_features.classrooms(id) ON DELETE CASCADE,
    thread_id UUID
        REFERENCES communication.messages(id) ON DELETE CASCADE,  -- For threaded conversations
    parent_message_id UUID
        REFERENCES communication.messages(id) ON DELETE SET NULL, -- For replies

    -- Message content
    subject VARCHAR(255),                    -- For direct messages
    content TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL DEFAULT 'direct',
    -- Types: 'direct', 'classroom_announcement', 'classroom_chat', 'private_feedback', 'assignment_comment'

    -- Attachments and media
    attachments JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"type": "file", "url": "...", "name": "...", "size": 1024}]

    -- Message status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth_management.profiles(id) ON DELETE SET NULL,

    -- Priority and flags
    priority VARCHAR(20) DEFAULT 'normal',  -- 'low', 'normal', 'high', 'urgent'
    is_pinned BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    requires_response BOOLEAN DEFAULT FALSE,
    response_deadline TIMESTAMPTZ,

    -- Reactions and engagement
    reactions JSONB DEFAULT '{}'::jsonb,
    -- Example: {"thumbs_up": ["user-uuid-1", "user-uuid-2"], "heart": ["user-uuid-3"]}

    -- Moderation
    is_flagged BOOLEAN DEFAULT FALSE,
    flagged_reason TEXT,
    flagged_by UUID REFERENCES auth_management.profiles(id) ON DELETE SET NULL,
    flagged_at TIMESTAMPTZ,
    moderation_status VARCHAR(50) DEFAULT 'approved',
    -- 'approved', 'pending', 'flagged', 'removed'

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    -- Additional context: assignment_id, exercise_id, etc.

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    edited_at TIMESTAMPTZ,
    edit_count INTEGER DEFAULT 0,

    -- Constraints
    CONSTRAINT messages_type_valid
        CHECK (message_type IN ('direct', 'classroom_announcement', 'classroom_chat', 'private_feedback', 'assignment_comment', 'system')),
    CONSTRAINT messages_priority_valid
        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    CONSTRAINT messages_moderation_status_valid
        CHECK (moderation_status IN ('approved', 'pending', 'flagged', 'removed')),
    CONSTRAINT messages_recipient_or_classroom
        CHECK (recipient_id IS NOT NULL OR classroom_id IS NOT NULL)
        -- Must have either recipient (direct) or classroom (broadcast)
);

-- =============================================================================
-- Indexes for performance
-- =============================================================================

-- Index for sender's sent messages
CREATE INDEX idx_messages_sender
    ON communication.messages(sender_id, created_at DESC)
    WHERE is_deleted = FALSE;

-- Index for recipient's inbox
CREATE INDEX idx_messages_recipient
    ON communication.messages(recipient_id, created_at DESC)
    WHERE is_deleted = FALSE;

-- Index for classroom messages/announcements
CREATE INDEX idx_messages_classroom
    ON communication.messages(classroom_id, created_at DESC)
    WHERE is_deleted = FALSE;

-- Index for unread messages (important for notifications)
CREATE INDEX idx_messages_unread
    ON communication.messages(recipient_id, created_at DESC)
    WHERE is_read = FALSE AND is_deleted = FALSE;

-- Index for threaded conversations
CREATE INDEX idx_messages_thread
    ON communication.messages(thread_id, created_at ASC)
    WHERE thread_id IS NOT NULL AND is_deleted = FALSE;

-- Index for parent-child reply structure
CREATE INDEX idx_messages_parent
    ON communication.messages(parent_message_id, created_at ASC)
    WHERE parent_message_id IS NOT NULL AND is_deleted = FALSE;

-- Index for flagged messages (moderation)
CREATE INDEX idx_messages_flagged
    ON communication.messages(flagged_at DESC)
    WHERE is_flagged = TRUE;

-- Index for messages requiring response
CREATE INDEX idx_messages_requiring_response
    ON communication.messages(recipient_id, response_deadline)
    WHERE requires_response = TRUE AND is_deleted = FALSE;

-- Composite index for classroom + type (efficient filtering)
CREATE INDEX idx_messages_classroom_type
    ON communication.messages(classroom_id, message_type, created_at DESC)
    WHERE is_deleted = FALSE;

-- GIN index for searching attachments
CREATE INDEX idx_messages_attachments
    ON communication.messages USING GIN(attachments);

-- GIN index for metadata search
CREATE INDEX idx_messages_metadata
    ON communication.messages USING GIN(metadata);

-- =============================================================================
-- Triggers
-- =============================================================================

-- Trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION communication.update_messages_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();

    -- Track edits
    IF OLD.content IS DISTINCT FROM NEW.content THEN
        NEW.edited_at = NOW();
        NEW.edit_count = COALESCE(OLD.edit_count, 0) + 1;
    END IF;

    -- Auto-set read_at when is_read changes to true
    IF NEW.is_read = TRUE AND OLD.is_read = FALSE THEN
        NEW.read_at = NOW();
    END IF;

    -- Auto-set deleted_at when is_deleted changes to true
    IF NEW.is_deleted = TRUE AND OLD.is_deleted = FALSE THEN
        NEW.deleted_at = NOW();
    END IF;

    -- Auto-set flagged_at when is_flagged changes to true
    IF NEW.is_flagged = TRUE AND OLD.is_flagged = FALSE THEN
        NEW.flagged_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_messages_timestamp
    BEFORE UPDATE ON communication.messages
    FOR EACH ROW
    EXECUTE FUNCTION communication.update_messages_timestamp();

-- =============================================================================
-- Helper function to get unread count
-- =============================================================================

CREATE OR REPLACE FUNCTION communication.get_unread_count(
    p_user_id UUID,
    p_classroom_id UUID DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM communication.messages
    WHERE recipient_id = p_user_id
      AND is_read = FALSE
      AND is_deleted = FALSE
      AND (p_classroom_id IS NULL OR classroom_id = p_classroom_id);

    RETURN v_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================================================
-- Helper function to mark conversation as read
-- =============================================================================

CREATE OR REPLACE FUNCTION communication.mark_conversation_read(
    p_user_id UUID,
    p_thread_id UUID
) RETURNS INTEGER AS $$
DECLARE
    v_updated INTEGER;
BEGIN
    UPDATE communication.messages
    SET is_read = TRUE,
        read_at = NOW()
    WHERE recipient_id = p_user_id
      AND thread_id = p_thread_id
      AND is_read = FALSE
      AND is_deleted = FALSE;

    GET DIAGNOSTICS v_updated = ROW_COUNT;
    RETURN v_updated;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- View: Recent classroom messages (for chat widget)
-- =============================================================================

CREATE OR REPLACE VIEW communication.recent_classroom_messages AS
SELECT
    m.id,
    m.classroom_id,
    m.sender_id,
    p.display_name as sender_name,
    p.avatar_url as sender_avatar,
    m.content,
    m.message_type,
    m.attachments,
    m.reactions,
    m.is_pinned,
    m.created_at,
    m.edited_at,
    m.edit_count,
    -- Count replies
    (SELECT COUNT(*) FROM communication.messages replies
     WHERE replies.parent_message_id = m.id
       AND replies.is_deleted = FALSE) as reply_count
FROM communication.messages m
JOIN auth_management.profiles p ON p.id = m.sender_id
WHERE m.classroom_id IS NOT NULL
  AND m.is_deleted = FALSE
  AND m.parent_message_id IS NULL  -- Only top-level messages
ORDER BY
    CASE WHEN m.is_pinned THEN 0 ELSE 1 END,
    m.created_at DESC;

-- =============================================================================
-- Comments for documentation
-- =============================================================================

COMMENT ON TABLE communication.messages IS
'Messages and chat system for teacher-student communication. Supports direct messages, classroom announcements, threaded conversations, and assignment feedback.';

COMMENT ON COLUMN communication.messages.message_type IS
'Type of message: direct (1-to-1), classroom_announcement (teacher to all), classroom_chat (group), private_feedback (assignment/exercise feedback), assignment_comment';

COMMENT ON COLUMN communication.messages.attachments IS
'JSON array of file attachments with structure: [{"type": "file|image|video", "url": "...", "name": "...", "size": 1024, "mime_type": "..."}]';

COMMENT ON COLUMN communication.messages.reactions IS
'JSON object tracking emoji reactions: {"thumbs_up": ["user-uuid-1"], "heart": ["user-uuid-2", "user-uuid-3"]}';

COMMENT ON COLUMN communication.messages.thread_id IS
'For grouping messages in a conversation thread. Set to the first message ID in the thread.';

COMMENT ON COLUMN communication.messages.parent_message_id IS
'For direct replies to a specific message. Creates a tree structure within threads.';

COMMENT ON FUNCTION communication.get_unread_count IS
'Get count of unread messages for a user, optionally filtered by classroom.
Usage: SELECT communication.get_unread_count(user_uuid, classroom_uuid);';

COMMENT ON FUNCTION communication.mark_conversation_read IS
'Mark all messages in a thread as read for a user.
Usage: SELECT communication.mark_conversation_read(user_uuid, thread_uuid);';

-- =============================================================================
-- Grant permissions
-- =============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON communication.messages TO gamilit_user;
GRANT SELECT ON communication.recent_classroom_messages TO gamilit_user;
GRANT EXECUTE ON FUNCTION communication.get_unread_count TO gamilit_user;
GRANT EXECUTE ON FUNCTION communication.mark_conversation_read TO gamilit_user;
