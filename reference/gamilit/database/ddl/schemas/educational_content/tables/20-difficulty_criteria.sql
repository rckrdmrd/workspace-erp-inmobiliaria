-- =====================================================
-- Table: difficulty_criteria
-- Description: Criterios específicos de cada nivel de dificultad CEFR
-- Schema: educational_content
-- Created: 2025-11-11
-- Version: 1.0
-- =====================================================

CREATE TABLE IF NOT EXISTS educational_content.difficulty_criteria (
    level educational_content.difficulty_level PRIMARY KEY,

    -- Criterios de complejidad
    vocab_range_min INT NOT NULL,
    vocab_range_max INT,
    sentence_length_min INT NOT NULL,
    sentence_length_max INT,
    time_multiplier NUMERIC(3,2) NOT NULL DEFAULT 1.0,

    -- Recompensas
    base_xp INT NOT NULL DEFAULT 10,
    base_coins INT NOT NULL DEFAULT 5,

    -- Criterios de promoción
    promotion_success_rate NUMERIC(5,2) NOT NULL DEFAULT 80.00,
    promotion_min_exercises INT NOT NULL DEFAULT 30,
    promotion_time_threshold NUMERIC(3,2) NOT NULL DEFAULT 1.50,

    -- Metadatos
    cefr_level VARCHAR(5) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT gamilit.now_mexico(),
    updated_at TIMESTAMPTZ DEFAULT gamilit.now_mexico()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_difficulty_criteria_cefr
    ON educational_content.difficulty_criteria(cefr_level);

-- Trigger para updated_at
CREATE TRIGGER trg_difficulty_criteria_updated_at
    BEFORE UPDATE ON educational_content.difficulty_criteria
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Comentarios
COMMENT ON TABLE educational_content.difficulty_criteria IS
'Criterios específicos para cada nivel de dificultad CEFR (A1-C2+).
Define rangos de vocabulario, complejidad de oraciones, recompensas y requisitos de promoción.';

COMMENT ON COLUMN educational_content.difficulty_criteria.vocab_range_min IS
'Mínimo de palabras de vocabulario requerido para este nivel';

COMMENT ON COLUMN educational_content.difficulty_criteria.time_multiplier IS
'Multiplicador de tiempo permitido (3.00 = 3x más tiempo que nivel nativo)';

COMMENT ON COLUMN educational_content.difficulty_criteria.promotion_success_rate IS
'Tasa de éxito mínima requerida para promoción (ej: 80.00 = 80%)';

-- Grants
GRANT SELECT ON educational_content.difficulty_criteria TO authenticated;
