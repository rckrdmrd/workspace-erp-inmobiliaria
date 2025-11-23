-- ============================================================================
-- TABLA: exercise_validation_config
-- Descripción: Configuración de validación de respuestas por exercise_type
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116 (Handoff FE-059)
-- ============================================================================

CREATE TABLE IF NOT EXISTS educational_content.exercise_validation_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- TIPO DE EJERCICIO
    exercise_type educational_content.exercise_type UNIQUE NOT NULL,

    -- FUNCIÓN DE VALIDACIÓN
    validation_function TEXT NOT NULL,           -- Nombre de función SQL a llamar

    -- REGLAS DE VALIDACIÓN
    case_sensitive BOOLEAN DEFAULT false,        -- Importa mayúsculas/minúsculas
    allow_partial_credit BOOLEAN DEFAULT false,  -- Permite puntuación parcial
    fuzzy_matching_threshold NUMERIC(3,2),       -- 0.00 - 1.00 (para similaridad texto)
    normalize_text BOOLEAN DEFAULT true,         -- Normalizar acentos, espacios, etc.

    -- CONFIGURACIÓN ESPECÍFICA
    special_rules JSONB DEFAULT '{}'::jsonb,     -- Reglas específicas del tipo

    -- RECOMPENSAS
    default_max_points INTEGER DEFAULT 100,
    default_passing_score INTEGER DEFAULT 70,

    -- METADATOS
    description TEXT,
    examples JSONB,                              -- Ejemplos de validación
    created_at TIMESTAMP WITH TIME ZONE DEFAULT gamilit.now_mexico(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT gamilit.now_mexico(),

    -- CONSTRAINTS
    CONSTRAINT valid_fuzzy_threshold CHECK (
        fuzzy_matching_threshold IS NULL
        OR (fuzzy_matching_threshold >= 0.00 AND fuzzy_matching_threshold <= 1.00)
    ),
    CONSTRAINT valid_max_points CHECK (default_max_points > 0),
    CONSTRAINT valid_passing_score CHECK (
        default_passing_score >= 0
        AND default_passing_score <= default_max_points
    )
);

-- COMENTARIOS
COMMENT ON TABLE educational_content.exercise_validation_config IS
'Configuración de validación de respuestas por tipo de ejercicio. Define qué función SQL usar y sus parámetros.';

COMMENT ON COLUMN educational_content.exercise_validation_config.exercise_type IS
'Tipo de ejercicio (crucigrama, verdadero_falso, etc.). Debe existir en ENUM educational_content.exercise_type';

COMMENT ON COLUMN educational_content.exercise_validation_config.validation_function IS
'Nombre de la función SQL a llamar para validar (ej: validate_crucigrama, validate_true_false)';

COMMENT ON COLUMN educational_content.exercise_validation_config.case_sensitive IS
'Si TRUE, la validación distingue entre mayúsculas y minúsculas';

COMMENT ON COLUMN educational_content.exercise_validation_config.allow_partial_credit IS
'Si TRUE, permite puntuación parcial (ej: 7/10 respuestas = 70 puntos). Si FALSE, todo o nada.';

COMMENT ON COLUMN educational_content.exercise_validation_config.fuzzy_matching_threshold IS
'Umbral de similaridad para fuzzy matching (0.00 = no match, 1.00 = match exacto). NULL = no usar fuzzy matching';

COMMENT ON COLUMN educational_content.exercise_validation_config.normalize_text IS
'Si TRUE, normaliza texto antes de comparar (quita acentos, espacios extras, etc.)';

COMMENT ON COLUMN educational_content.exercise_validation_config.special_rules IS
'Reglas específicas del tipo en formato JSONB (ej: {"allow_synonyms": true, "min_word_count": 50})';

COMMENT ON COLUMN educational_content.exercise_validation_config.examples IS
'Ejemplos de validación en formato JSONB mostrando entrada, solución y resultado esperado';

-- ÍNDICES
CREATE INDEX idx_validation_config_type
    ON educational_content.exercise_validation_config(exercise_type);

CREATE INDEX idx_validation_config_function
    ON educational_content.exercise_validation_config(validation_function);

-- TRIGGER UPDATED_AT
CREATE TRIGGER trg_exercise_validation_config_updated_at
    BEFORE UPDATE ON educational_content.exercise_validation_config
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- PERMISOS
GRANT SELECT ON educational_content.exercise_validation_config TO authenticated;
GRANT ALL ON educational_content.exercise_validation_config TO admin_teacher;
