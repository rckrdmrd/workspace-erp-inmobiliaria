-- =====================================================================================
-- Tabla: lti_sessions
-- Descripción: Sesiones activas de LTI - tracking de launches desde LMS externos
-- Documentación: docs/03-fase-extensiones/EXT-007-lti-integration/
-- Epic: EXT-007
-- Created: 2025-11-08
-- =====================================================================================

CREATE TABLE IF NOT EXISTS lti_integration.lti_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relaciones
    consumer_id UUID NOT NULL REFERENCES lti_integration.lti_consumers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth_management.profiles(id) ON DELETE SET NULL,

    -- Identificadores LTI
    launch_id TEXT NOT NULL,                -- ID único del launch
    message_type TEXT NOT NULL,             -- LtiResourceLinkRequest, LtiDeepLinkingRequest, etc.

    -- Contexto del LMS
    context_id TEXT,                        -- Course ID en el LMS
    context_label TEXT,                     -- Código del curso (e.g., "CS101")
    context_title TEXT,                     -- Nombre del curso

    -- Resource Link
    resource_link_id TEXT,                  -- ID del resource link
    resource_link_title TEXT,               -- Título del contenido/assignment
    resource_link_description TEXT,

    -- Usuario en el LMS
    lms_user_id TEXT,                       -- User ID en el LMS
    lms_user_email TEXT,
    lms_user_name TEXT,
    lms_user_roles TEXT[],                  -- Roles en el LMS (Learner, Instructor, etc.)

    -- Claims del JWT
    id_token_claims JSONB DEFAULT '{}',    -- Claims completos del ID token

    -- Configuración de la sesión
    locale TEXT DEFAULT 'es-MX',
    timezone TEXT,

    -- Return URL (para volver al LMS)
    return_url TEXT,

    -- Estado de la sesión
    session_state TEXT,                     -- Estado del flujo LTI
    is_active BOOLEAN DEFAULT true,

    -- Auditoría
    launched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    metadata JSONB DEFAULT '{}'
);

-- Índices
CREATE INDEX idx_lti_sessions_consumer_id ON lti_integration.lti_sessions(consumer_id);
CREATE INDEX idx_lti_sessions_user_id ON lti_integration.lti_sessions(user_id);
CREATE INDEX idx_lti_sessions_launch_id ON lti_integration.lti_sessions(launch_id);
CREATE INDEX idx_lti_sessions_context_id ON lti_integration.lti_sessions(context_id);
CREATE INDEX idx_lti_sessions_resource_link ON lti_integration.lti_sessions(resource_link_id);
CREATE INDEX idx_lti_sessions_active ON lti_integration.lti_sessions(is_active) WHERE is_active = true;
CREATE INDEX idx_lti_sessions_launched_at ON lti_integration.lti_sessions(launched_at DESC);
CREATE INDEX idx_lti_sessions_lms_user ON lti_integration.lti_sessions(consumer_id, lms_user_id);

-- Índice GIN para búsqueda en JSONB
CREATE INDEX idx_lti_sessions_claims_gin ON lti_integration.lti_sessions USING GIN(id_token_claims);

-- Comentarios
COMMENT ON TABLE lti_integration.lti_sessions IS 'Sesiones activas de LTI - tracking de launches desde LMS externos. Epic EXT-007.';
COMMENT ON COLUMN lti_integration.lti_sessions.launch_id IS 'ID único del LTI launch request';
COMMENT ON COLUMN lti_integration.lti_sessions.message_type IS 'Tipo de mensaje LTI (LtiResourceLinkRequest, LtiDeepLinkingRequest)';
COMMENT ON COLUMN lti_integration.lti_sessions.context_id IS 'Course ID en el LMS externo';
COMMENT ON COLUMN lti_integration.lti_sessions.lms_user_roles IS 'Roles del usuario en el LMS (Learner, Instructor, Administrator)';
COMMENT ON COLUMN lti_integration.lti_sessions.id_token_claims IS 'Claims completos del ID token JWT para auditoría';
