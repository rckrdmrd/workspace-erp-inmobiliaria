-- =====================================================================================
-- Tabla: lti_grade_passback
-- Descripción: Registro de envío de calificaciones a LMS externos vía LTI AGS
--              (Assignment and Grade Services)
-- Documentación: docs/03-fase-extensiones/EXT-007-lti-integration/
-- Epic: EXT-007
-- Created: 2025-11-08
-- =====================================================================================

CREATE TABLE IF NOT EXISTS lti_integration.lti_grade_passback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relaciones
    session_id UUID NOT NULL REFERENCES lti_integration.lti_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth_management.profiles(id) ON DELETE CASCADE,
    consumer_id UUID NOT NULL REFERENCES lti_integration.lti_consumers(id) ON DELETE CASCADE,

    -- AGS Lineitem (assignment en el LMS)
    lineitem_url TEXT NOT NULL,             -- URL del lineitem en el LMS
    lineitem_id TEXT,                       -- ID del lineitem
    lineitem_label TEXT,                    -- Etiqueta del assignment

    -- Calificación
    score_given NUMERIC(5,2),               -- Calificación obtenida
    score_maximum NUMERIC(5,2) DEFAULT 100, -- Calificación máxima
    score_percentage NUMERIC(5,2),          -- Porcentaje (calculado)

    -- Activity Progress (LTI Spec)
    activity_progress TEXT CHECK (activity_progress IN (
        'Initialized',
        'Started',
        'InProgress',
        'Submitted',
        'Completed'
    )),

    -- Grading Progress (LTI Spec)
    grading_progress TEXT CHECK (grading_progress IN (
        'NotReady',
        'Failed',
        'Pending',
        'PendingManual',
        'FullyGraded',
        'Processed'
    )),

    -- Comentario/Feedback (opcional)
    comment TEXT,

    -- Estado del passback
    passback_status TEXT DEFAULT 'pending' CHECK (passback_status IN (
        'pending',      -- Pendiente de envío
        'sending',      -- Enviando al LMS
        'success',      -- Enviado exitosamente
        'failed',       -- Falló el envío
        'retrying'      -- Reintentando
    )),

    -- Respuesta del LMS
    lms_response JSONB,                     -- Respuesta completa del LMS
    lms_response_code INTEGER,              -- HTTP status code
    error_message TEXT,                     -- Mensaje de error si falló

    -- Intentos
    attempt_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    next_retry_at TIMESTAMP WITH TIME ZONE,

    -- Auditoría
    graded_at TIMESTAMP WITH TIME ZONE,     -- Cuándo se calificó en Gamilit
    first_sent_at TIMESTAMP WITH TIME ZONE, -- Primer intento de envío
    last_sent_at TIMESTAMP WITH TIME ZONE,  -- Último intento
    success_at TIMESTAMP WITH TIME ZONE,    -- Cuándo se confirmó éxito
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Metadata
    metadata JSONB DEFAULT '{}'
);

-- Índices
CREATE INDEX idx_lti_grade_passback_session ON lti_integration.lti_grade_passback(session_id);
CREATE INDEX idx_lti_grade_passback_user ON lti_integration.lti_grade_passback(user_id);
CREATE INDEX idx_lti_grade_passback_consumer ON lti_integration.lti_grade_passback(consumer_id);
CREATE INDEX idx_lti_grade_passback_status ON lti_integration.lti_grade_passback(passback_status);
CREATE INDEX idx_lti_grade_passback_pending ON lti_integration.lti_grade_passback(passback_status, next_retry_at)
    WHERE passback_status IN ('pending', 'retrying');
CREATE INDEX idx_lti_grade_passback_lineitem ON lti_integration.lti_grade_passback(lineitem_url);
CREATE INDEX idx_lti_grade_passback_created_at ON lti_integration.lti_grade_passback(created_at DESC);

-- Índice GIN para metadata
CREATE INDEX idx_lti_grade_passback_metadata ON lti_integration.lti_grade_passback USING GIN(metadata);

-- Comentarios
COMMENT ON TABLE lti_integration.lti_grade_passback IS 'Registro de envío de calificaciones a LMS externos vía LTI AGS (Assignment and Grade Services). Epic EXT-007.';
COMMENT ON COLUMN lti_integration.lti_grade_passback.lineitem_url IS 'URL del lineitem (assignment) en el LMS para envío de calificación';
COMMENT ON COLUMN lti_integration.lti_grade_passback.score_given IS 'Calificación obtenida por el estudiante';
COMMENT ON COLUMN lti_integration.lti_grade_passback.activity_progress IS 'Estado del progreso de la actividad según spec LTI';
COMMENT ON COLUMN lti_integration.lti_grade_passback.grading_progress IS 'Estado de la calificación según spec LTI';
COMMENT ON COLUMN lti_integration.lti_grade_passback.passback_status IS 'Estado del envío de la calificación al LMS';
COMMENT ON COLUMN lti_integration.lti_grade_passback.attempt_count IS 'Número de intentos de envío (para retry logic)';
