-- =====================================================
-- Table: educational_content.assessment_rubrics
-- Description: Rúbricas de evaluación para ejercicios o módulos (relación polimórfica)
-- Dependencies: educational_content.exercises, educational_content.modules, auth_management.profiles
-- Created: 2025-10-27
-- Migrated: 2025-11-02 (Template T-VM-001)
-- Note: Restricción polimórfica - SOLO exercise_id O module_id, nunca ambos, nunca ninguno
-- =====================================================

SET search_path TO educational_content, public;

DROP TABLE IF EXISTS educational_content.assessment_rubrics CASCADE;

CREATE TABLE educational_content.assessment_rubrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    exercise_id uuid,
    module_id uuid,
    name text NOT NULL,
    description text,
    assessment_type text,
    criteria jsonb DEFAULT '{"criteria_1": {"name": "Comprehension", "levels": {"good": {"points": 75, "description": "Good comprehension"}, "basic": {"points": 50, "description": "Basic comprehension"}, "excellent": {"points": 100, "description": "Full comprehension"}, "insufficient": {"points": 25, "description": "Limited comprehension"}}, "weight": 40}}'::jsonb,
    scoring_scale jsonb DEFAULT '{"max": 100, "min": 0, "passing": 70}'::jsonb,
    weight_percentage numeric(5,2) DEFAULT 100.00,
    is_active boolean DEFAULT true,
    allow_resubmission boolean DEFAULT true,
    feedback_template text,
    auto_feedback_enabled boolean DEFAULT true,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_by uuid,
    created_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    updated_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    CONSTRAINT assessment_rubrics_assessment_type_check CHECK ((assessment_type = ANY (ARRAY['automatic'::text, 'manual'::text, 'hybrid'::text, 'peer_review'::text]))),
    CONSTRAINT assessment_rubrics_weight_percentage_check CHECK ((weight_percentage > (0)::numeric AND weight_percentage <= (100)::numeric)),
    CONSTRAINT rubric_reference_check CHECK ((((exercise_id IS NOT NULL) AND (module_id IS NULL)) OR ((exercise_id IS NULL) AND (module_id IS NOT NULL))))
);

ALTER TABLE educational_content.assessment_rubrics OWNER TO gamilit_user;

-- Primary Key
ALTER TABLE ONLY educational_content.assessment_rubrics
    ADD CONSTRAINT assessment_rubrics_pkey PRIMARY KEY (id);

-- Indexes
CREATE INDEX idx_rubrics_active ON educational_content.assessment_rubrics USING btree (is_active) WHERE (is_active = true);
CREATE INDEX idx_rubrics_exercise_id ON educational_content.assessment_rubrics USING btree (exercise_id);
CREATE INDEX idx_rubrics_module_id ON educational_content.assessment_rubrics USING btree (module_id);
CREATE INDEX idx_rubrics_created_by ON educational_content.assessment_rubrics USING btree (created_by);

-- Triggers
CREATE TRIGGER trg_assessment_rubrics_updated_at BEFORE UPDATE ON educational_content.assessment_rubrics FOR EACH ROW EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Foreign Keys
ALTER TABLE ONLY educational_content.assessment_rubrics
    ADD CONSTRAINT assessment_rubrics_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth_management.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY educational_content.assessment_rubrics
    ADD CONSTRAINT assessment_rubrics_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES educational_content.exercises(id) ON DELETE CASCADE;

ALTER TABLE ONLY educational_content.assessment_rubrics
    ADD CONSTRAINT assessment_rubrics_module_id_fkey FOREIGN KEY (module_id) REFERENCES educational_content.modules(id) ON DELETE CASCADE;

-- Row Level Security
ALTER TABLE educational_content.assessment_rubrics ENABLE ROW LEVEL SECURITY;

-- Permissions
GRANT ALL ON TABLE educational_content.assessment_rubrics TO gamilit_user;

-- Comments
COMMENT ON TABLE educational_content.assessment_rubrics IS 'Rúbricas de evaluación para ejercicios y módulos. Relación polimórfica: cada rúbrica se asocia SOLO a un ejercicio O a un módulo, nunca a ambos.';
COMMENT ON COLUMN educational_content.assessment_rubrics.exercise_id IS 'FK a exercises. Parte de relación polimórfica con module_id (SOLO uno puede ser NOT NULL)';
COMMENT ON COLUMN educational_content.assessment_rubrics.module_id IS 'FK a modules. Parte de relación polimórfica con exercise_id (SOLO uno puede ser NOT NULL)';
COMMENT ON COLUMN educational_content.assessment_rubrics.assessment_type IS 'Tipo: automatic, manual, hybrid, peer_review';
COMMENT ON COLUMN educational_content.assessment_rubrics.criteria IS 'JSONB con criterios de evaluación y niveles de logro';
COMMENT ON COLUMN educational_content.assessment_rubrics.scoring_scale IS 'JSONB con escala de puntuación (min, max, passing)';
COMMENT ON COLUMN educational_content.assessment_rubrics.weight_percentage IS 'Peso porcentual de esta rúbrica (1-100%)';
COMMENT ON COLUMN educational_content.assessment_rubrics.created_by IS 'FK a profiles. Usuario que creó la rúbrica';
COMMENT ON CONSTRAINT rubric_reference_check ON educational_content.assessment_rubrics IS 'Restricción polimórfica: exercise_id XOR module_id (exclusivo)';
