-- ============================================================================
-- TABLA: exercise_validation_audit
-- Descripción: Auditoría completa de validaciones de ejercicios
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE TABLE IF NOT EXISTS educational_content.exercise_validation_audit (
    -- Identificadores
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id UUID NOT NULL REFERENCES educational_content.exercises(id),
    user_id UUID NOT NULL,
    attempt_number INTEGER NOT NULL,

    -- Snapshot de respuesta enviada (INMUTABLE - para trazabilidad)
    submitted_answer JSONB NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT gamilit.now_mexico(),

    -- Snapshot del ejercicio en el momento de la validación
    exercise_snapshot JSONB NOT NULL,
    -- Formato: {
    --   "exercise_type": "crucigrama",
    --   "content": {...},
    --   "solution": {...},
    --   "max_points": 100
    -- }

    -- Snapshot de configuración de validación usada
    validation_config_snapshot JSONB NOT NULL,
    -- Formato: {
    --   "validation_function": "validate_crucigrama",
    --   "case_sensitive": false,
    --   "allow_partial_credit": true,
    --   "fuzzy_matching_threshold": 0.80,
    --   ...
    -- }

    -- Resultado de la validación
    is_correct BOOLEAN NOT NULL,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    feedback TEXT,
    validation_details JSONB,

    -- Información de validación
    validation_function_used TEXT NOT NULL,
    validation_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT gamilit.now_mexico(),
    validation_duration_ms INTEGER,

    -- Información de recálculo
    is_recalculated BOOLEAN DEFAULT false,
    recalculated_at TIMESTAMP WITH TIME ZONE,
    recalculated_by UUID,
    recalculation_reason TEXT,
    original_audit_id UUID REFERENCES educational_content.exercise_validation_audit(id),

    -- Flags de auditoría
    has_discrepancy BOOLEAN DEFAULT false,
    discrepancy_type TEXT,
    discrepancy_notes TEXT,

    -- Metadatos
    client_metadata JSONB DEFAULT '{}'::jsonb,
    -- Formato: {"ip": "x.x.x.x", "user_agent": "...", "session_id": "..."}

    created_at TIMESTAMP WITH TIME ZONE DEFAULT gamilit.now_mexico(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT gamilit.now_mexico()
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================

-- Búsqueda por ejercicio y usuario
CREATE INDEX IF NOT EXISTS idx_validation_audit_exercise_user
ON educational_content.exercise_validation_audit(exercise_id, user_id);

-- Búsqueda por usuario (para historial del estudiante)
CREATE INDEX IF NOT EXISTS idx_validation_audit_user_submitted
ON educational_content.exercise_validation_audit(user_id, submitted_at DESC);

-- Búsqueda de recálculos
CREATE INDEX IF NOT EXISTS idx_validation_audit_recalculated
ON educational_content.exercise_validation_audit(is_recalculated, recalculated_at)
WHERE is_recalculated = true;

-- Búsqueda de discrepancias
CREATE INDEX IF NOT EXISTS idx_validation_audit_discrepancy
ON educational_content.exercise_validation_audit(has_discrepancy, exercise_id)
WHERE has_discrepancy = true;

-- Búsqueda por tipo de validador usado
CREATE INDEX IF NOT EXISTS idx_validation_audit_validation_function
ON educational_content.exercise_validation_audit(validation_function_used);

-- Búsqueda de intentos por ejercicio
CREATE INDEX IF NOT EXISTS idx_validation_audit_exercise_attempt
ON educational_content.exercise_validation_audit(exercise_id, attempt_number);

-- Índice para análisis temporal
CREATE INDEX IF NOT EXISTS idx_validation_audit_validation_timestamp
ON educational_content.exercise_validation_audit(validation_timestamp DESC);

-- Índice JSONB para búsqueda en submitted_answer
CREATE INDEX IF NOT EXISTS idx_validation_audit_submitted_answer_gin
ON educational_content.exercise_validation_audit USING gin(submitted_answer);

-- ============================================================================
-- CONSTRAINTS
-- ============================================================================

-- Constraint: score no puede exceder max_score
ALTER TABLE educational_content.exercise_validation_audit
ADD CONSTRAINT chk_validation_audit_score_range
CHECK (score >= 0 AND score <= max_score);

-- Constraint: attempt_number debe ser positivo
ALTER TABLE educational_content.exercise_validation_audit
ADD CONSTRAINT chk_validation_audit_attempt_positive
CHECK (attempt_number > 0);

-- Constraint: si es recalculado, debe tener timestamp y razón
ALTER TABLE educational_content.exercise_validation_audit
ADD CONSTRAINT chk_validation_audit_recalculation_data
CHECK (
    (is_recalculated = false) OR
    (is_recalculated = true AND recalculated_at IS NOT NULL AND recalculation_reason IS NOT NULL)
);

-- Constraint: si tiene discrepancia, debe tener tipo
ALTER TABLE educational_content.exercise_validation_audit
ADD CONSTRAINT chk_validation_audit_discrepancy_type
CHECK (
    (has_discrepancy = false) OR
    (has_discrepancy = true AND discrepancy_type IS NOT NULL)
);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger para updated_at
CREATE TRIGGER trg_validation_audit_updated_at
BEFORE UPDATE ON educational_content.exercise_validation_audit
FOR EACH ROW
EXECUTE FUNCTION gamilit.update_updated_at_column();

-- ============================================================================
-- COMENTARIOS
-- ============================================================================

COMMENT ON TABLE educational_content.exercise_validation_audit IS
'Auditoría completa de todas las validaciones de ejercicios.
Almacena snapshot inmutable de respuesta, ejercicio y configuración.
Permite trazabilidad completa y recálculo si se detectan errores.';

COMMENT ON COLUMN educational_content.exercise_validation_audit.submitted_answer IS
'Snapshot INMUTABLE de la respuesta enviada por el usuario en formato JSONB.
NO debe modificarse nunca - es la evidencia de lo que el usuario envió.';

COMMENT ON COLUMN educational_content.exercise_validation_audit.exercise_snapshot IS
'Snapshot del ejercicio completo en el momento de la validación.
Incluye exercise_type, content, solution, max_points.
Permite recalcular incluso si el ejercicio fue modificado después.';

COMMENT ON COLUMN educational_content.exercise_validation_audit.validation_config_snapshot IS
'Snapshot de la configuración de validación usada.
Incluye validation_function, case_sensitive, allow_partial_credit, etc.
Permite recalcular con la misma configuración original.';

COMMENT ON COLUMN educational_content.exercise_validation_audit.is_recalculated IS
'Indica si este registro es resultado de un recálculo.
Si true, original_audit_id apunta al registro original.';

COMMENT ON COLUMN educational_content.exercise_validation_audit.has_discrepancy IS
'Indica si se detectó una discrepancia entre validación original y recálculo.
Útil para identificar casos donde la validación cambió.';

-- ============================================================================
-- PERMISOS
-- ============================================================================

-- Los estudiantes pueden insertar (a través de la aplicación)
GRANT SELECT, INSERT ON educational_content.exercise_validation_audit TO authenticated;

-- Los profesores pueden ver todas las auditorías y marcar discrepancias
GRANT SELECT, UPDATE ON educational_content.exercise_validation_audit TO admin_teacher;

-- Solo administradores pueden eliminar (nunca debería ocurrir)
-- (no se otorga DELETE - los registros de auditoría son inmutables)
