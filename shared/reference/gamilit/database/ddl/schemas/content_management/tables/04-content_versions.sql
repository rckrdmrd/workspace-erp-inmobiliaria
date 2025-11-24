-- ============================================================================
-- TABLE: content_management.content_versions
-- Description: Version control for content (exercises, modules, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS content_management.content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES auth_management.tenants(id) ON DELETE CASCADE,

    -- Content Reference
    content_type TEXT NOT NULL, -- 'exercise', 'module', 'lesson', 'quiz'
    content_id UUID NOT NULL,

    -- Version Information
    version_number INTEGER NOT NULL,
    version_name TEXT, -- Optional name like "v1.0", "beta", etc.

    -- Content Snapshot
    content_data JSONB NOT NULL, -- Full snapshot of content at this version

    -- Change Information
    change_summary TEXT,
    change_notes TEXT,

    -- Metadata
    created_by UUID REFERENCES auth_management.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Status
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,

    metadata JSONB DEFAULT '{}'::jsonb,

    UNIQUE(content_type, content_id, version_number)
);

COMMENT ON TABLE content_management.content_versions IS 'Control de versiones para contenido educativo';
COMMENT ON COLUMN content_management.content_versions.content_data IS 'Snapshot completo del contenido en esta versión';

CREATE INDEX idx_content_versions_type_id ON content_management.content_versions(content_type, content_id);
CREATE INDEX idx_content_versions_tenant ON content_management.content_versions(tenant_id);
CREATE INDEX idx_content_versions_created_by ON content_management.content_versions(created_by);
CREATE INDEX idx_content_versions_created_at ON content_management.content_versions(created_at DESC);
