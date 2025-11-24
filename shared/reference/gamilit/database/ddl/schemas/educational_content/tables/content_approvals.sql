-- Tabla: content_approvals
-- Schema: educational_content
-- Descripción: Workflow de aprobación de contenido educativo
-- CREADO: 2025-11-08
-- Epic: EXT-006

CREATE TABLE educational_content.content_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('module', 'exercise', 'assignment', 'resource')),
    content_id UUID NOT NULL,
    submitted_by UUID NOT NULL REFERENCES auth.users(id),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_revision')),
    reviewer_notes TEXT,
    revision_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_content_approvals_content ON educational_content.content_approvals(content_type, content_id);
CREATE INDEX idx_content_approvals_status ON educational_content.content_approvals(status);
CREATE INDEX idx_content_approvals_submitted_by ON educational_content.content_approvals(submitted_by);
CREATE INDEX idx_content_approvals_reviewed_by ON educational_content.content_approvals(reviewed_by) WHERE reviewed_by IS NOT NULL;
CREATE INDEX idx_content_approvals_pending ON educational_content.content_approvals(submitted_at) WHERE status = 'pending';

-- Comentarios
COMMENT ON TABLE educational_content.content_approvals IS 'Approval workflow for educational content (EXT-006)';
COMMENT ON COLUMN educational_content.content_approvals.content_type IS 'Type of content: module, exercise, assignment, or resource';
COMMENT ON COLUMN educational_content.content_approvals.status IS 'Approval status: pending, approved, rejected, or needs_revision';
COMMENT ON COLUMN educational_content.content_approvals.reviewer_notes IS 'Notes from reviewer about the approval/rejection';
COMMENT ON COLUMN educational_content.content_approvals.revision_notes IS 'Notes from submitter about revisions made';

-- Trigger para updated_at
CREATE TRIGGER update_content_approvals_updated_at
    BEFORE UPDATE ON educational_content.content_approvals
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
