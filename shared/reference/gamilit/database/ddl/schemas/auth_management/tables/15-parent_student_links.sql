-- =====================================================================================
-- Tabla: parent_student_links
-- Descripción: Vinculación entre padres/tutores y estudiantes (relación N:M)
-- Documentación: docs/03-fase-extensiones/EXT-010-parent-notifications/
-- Epic: EXT-010
-- Created: 2025-11-08
-- =====================================================================================

CREATE TABLE IF NOT EXISTS auth_management.parent_student_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relaciones
    parent_account_id UUID NOT NULL REFERENCES auth_management.parent_accounts(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth_management.profiles(id) ON DELETE CASCADE,

    -- Tipo de relación
    relationship_type TEXT NOT NULL CHECK (relationship_type IN (
        'mother',
        'father',
        'guardian',
        'tutor',
        'stepparent',
        'grandparent',
        'other'
    )),

    -- Permisos específicos de este vínculo
    can_view_progress BOOLEAN DEFAULT true,
    can_view_grades BOOLEAN DEFAULT true,
    can_receive_notifications BOOLEAN DEFAULT true,
    can_contact_teachers BOOLEAN DEFAULT false,

    -- Estado del vínculo
    link_status TEXT DEFAULT 'pending' CHECK (link_status IN (
        'pending',      -- Pendiente de aprobación
        'active',       -- Activo
        'suspended',    -- Suspendido temporalmente
        'revoked'       -- Revocado
    )),

    -- Verificación
    is_verified BOOLEAN DEFAULT false,          -- Verificado por escuela/admin
    verified_by UUID REFERENCES auth_management.profiles(id), -- Quien verificó
    verified_at TIMESTAMP WITH TIME ZONE,

    -- Código de verificación (para auto-link)
    verification_code TEXT,                     -- Código único para verificación
    verification_code_expires_at TIMESTAMP WITH TIME ZONE,
    verification_attempts INTEGER DEFAULT 0,

    -- Aprobación del estudiante (si es mayor de edad)
    student_approval_required BOOLEAN DEFAULT false,
    student_approved BOOLEAN,
    student_approved_at TIMESTAMP WITH TIME ZONE,

    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    activated_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_by UUID REFERENCES auth_management.profiles(id),
    revocation_reason TEXT,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Constraints
    CONSTRAINT unique_parent_student UNIQUE(parent_account_id, student_id)
);

-- Índices
CREATE INDEX idx_parent_student_links_parent ON auth_management.parent_student_links(parent_account_id);
CREATE INDEX idx_parent_student_links_student ON auth_management.parent_student_links(student_id);
CREATE INDEX idx_parent_student_links_status ON auth_management.parent_student_links(link_status);
CREATE INDEX idx_parent_student_links_active ON auth_management.parent_student_links(parent_account_id, student_id, link_status)
    WHERE link_status = 'active';
CREATE INDEX idx_parent_student_links_pending ON auth_management.parent_student_links(link_status, created_at)
    WHERE link_status = 'pending';
CREATE INDEX idx_parent_student_links_verification_code ON auth_management.parent_student_links(verification_code)
    WHERE verification_code IS NOT NULL;

-- Trigger para updated_at
CREATE TRIGGER trg_parent_student_links_updated_at
    BEFORE UPDATE ON auth_management.parent_student_links
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Comentarios
COMMENT ON TABLE auth_management.parent_student_links IS 'Vinculación N:M entre padres/tutores y estudiantes con permisos y verificación. Epic EXT-010.';
COMMENT ON COLUMN auth_management.parent_student_links.relationship_type IS 'Tipo de relación familiar (mother, father, guardian, etc.)';
COMMENT ON COLUMN auth_management.parent_student_links.link_status IS 'Estado del vínculo (pending, active, suspended, revoked)';
COMMENT ON COLUMN auth_management.parent_student_links.verification_code IS 'Código único para auto-vinculación del padre con el estudiante';
COMMENT ON COLUMN auth_management.parent_student_links.student_approval_required IS 'Si el estudiante debe aprobar el vínculo (estudiantes mayores de edad)';
