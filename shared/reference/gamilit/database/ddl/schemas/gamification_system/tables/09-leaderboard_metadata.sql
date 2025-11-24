-- =====================================================
-- TABLE: leaderboard_metadata
-- SCHEMA: gamification_system
-- DESCRIPTION: Tracks refresh status and statistics for materialized leaderboard views
-- =====================================================

CREATE TABLE gamification_system.leaderboard_metadata (
    view_name text NOT NULL,
    last_refresh_at timestamp with time zone DEFAULT now(),
    total_users integer,
    refresh_duration_ms integer,
    created_at timestamp with time zone DEFAULT now()
);

-- =====================================================
-- CONSTRAINTS
-- =====================================================

ALTER TABLE gamification_system.leaderboard_metadata
    ADD CONSTRAINT leaderboard_metadata_pkey PRIMARY KEY (view_name);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE gamification_system.leaderboard_metadata IS 'Tracks refresh status and statistics for materialized leaderboard views';
