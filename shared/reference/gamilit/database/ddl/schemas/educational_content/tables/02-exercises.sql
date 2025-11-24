-- =====================================================
-- Table: educational_content.exercises
-- Description: Ejercicios con 27 mecánicas diferentes - crucigramas, mapas, debates, etc.
-- Dependencies:
--   - educational_content.modules (NOT NULL, CASCADE) - CRÍTICA
--   - auth_management.profiles (SET NULL) - Auditoría
-- Created: 2025-10-27
-- Migrated: 2025-11-02 (Template T-VM-001)
-- Migration Agent: SA-MIGRACION-EDU-03
-- Note: prerequisites[] es referencia débil auto-referencial sin FK constraint
-- Adjustments Applied:
--   P0: Added ON DELETE SET NULL to created_by/reviewed_by FKs
--   P1: Added idx_exercises_prerequisites GIN index
--   P1: Added CHECK constraints for time validations
--
-- 📚 Documentación:
-- Requerimiento: docs/01-requerimientos/03-contenido-educativo/RF-EDU-001-mecanicas-ejercicios.md
-- Especificación: docs/02-especificaciones-tecnicas/03-contenido-educativo/ET-EDU-001-mecanicas-ejercicios.md
-- Ver también: docs/01-requerimientos/modulos/MODULOS-EDUCATIVOS.md
-- =====================================================

SET search_path TO educational_content, public;

DROP TABLE IF EXISTS educational_content.exercises CASCADE;

CREATE TABLE educational_content.exercises (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    module_id uuid NOT NULL,
    title text NOT NULL,
    subtitle text,
    description text,
    instructions text,
    exercise_type educational_content.exercise_type NOT NULL,
    order_index integer NOT NULL,
    config jsonb DEFAULT '{}'::jsonb NOT NULL,
    content jsonb DEFAULT '{"options": [], "question": "", "explanations": {}, "correct_answers": []}'::jsonb NOT NULL,
    solution jsonb,
    rubric jsonb,
    auto_gradable boolean DEFAULT true,

    -- Contenido pedagógico expandido (DB-125: 2025-11-19)
    objective TEXT,
    how_to_solve TEXT,
    recommended_strategy TEXT,
    pedagogical_notes TEXT,

    difficulty_level educational_content.difficulty_level DEFAULT 'beginner'::educational_content.difficulty_level,
    max_points integer DEFAULT 100,
    passing_score integer DEFAULT 70,
    estimated_time_minutes integer DEFAULT 10,
    time_limit_minutes integer,
    max_attempts integer DEFAULT 3,
    allow_retry boolean DEFAULT true,
    retry_delay_minutes integer DEFAULT 0,
    hints text[],
    enable_hints boolean DEFAULT true,
    hint_cost_ml_coins integer DEFAULT 5,
    comodines_allowed gamification_system.comodin_type[] DEFAULT ARRAY['pistas'::gamification_system.comodin_type, 'vision_lectora'::gamification_system.comodin_type, 'segunda_oportunidad'::gamification_system.comodin_type],
    comodines_config jsonb DEFAULT '{"pistas": {"cost": 15, "enabled": true}, "vision_lectora": {"cost": 25, "enabled": true}, "segunda_oportunidad": {"cost": 40, "enabled": true}}'::jsonb,
    xp_reward integer DEFAULT 20,
    ml_coins_reward integer DEFAULT 5,
    bonus_multiplier numeric(3,2) DEFAULT 1.00,
    is_active boolean DEFAULT true,
    is_optional boolean DEFAULT false,
    is_bonus boolean DEFAULT false,
    version integer DEFAULT 1,
    version_notes text,
    created_by uuid,
    reviewed_by uuid,
    adaptive_difficulty boolean DEFAULT false,
    prerequisites uuid[],
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    updated_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    CONSTRAINT exercises_check CHECK (((passing_score > 0) AND (passing_score <= max_points))),
    CONSTRAINT exercises_max_points_check CHECK ((max_points > 0)),
    CONSTRAINT exercises_ml_coins_reward_check CHECK ((ml_coins_reward >= 0)),
    CONSTRAINT exercises_xp_reward_check CHECK ((xp_reward >= 0)),
    CONSTRAINT exercises_estimated_time_check CHECK ((estimated_time_minutes > 0)),
    CONSTRAINT exercises_time_limit_check CHECK ((time_limit_minutes IS NULL OR time_limit_minutes > 0)),
    CONSTRAINT exercises_max_attempts_check CHECK ((max_attempts IS NULL OR max_attempts > 0))
);

ALTER TABLE educational_content.exercises OWNER TO gamilit_user;

-- Primary Key
ALTER TABLE ONLY educational_content.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (id);

-- Unique Constraints
ALTER TABLE ONLY educational_content.exercises
    ADD CONSTRAINT exercises_module_type_order_key UNIQUE (module_id, exercise_type, order_index);

-- Indexes
CREATE INDEX idx_exercises_active ON educational_content.exercises USING btree (is_active) WHERE (is_active = true);
CREATE INDEX idx_exercises_active_gradable ON educational_content.exercises USING btree (module_id, order_index) WHERE ((is_active = true) AND (auto_gradable = true));
CREATE INDEX idx_exercises_config_gin ON educational_content.exercises USING gin (config);
CREATE INDEX idx_exercises_content_gin ON educational_content.exercises USING gin (content);
CREATE INDEX idx_exercises_difficulty ON educational_content.exercises USING btree (difficulty_level);
CREATE INDEX idx_exercises_module_id ON educational_content.exercises USING btree (module_id);
CREATE INDEX idx_exercises_module_type_active ON educational_content.exercises USING btree (module_id, exercise_type, is_active);
CREATE INDEX idx_exercises_order ON educational_content.exercises USING btree (module_id, order_index);
CREATE INDEX idx_exercises_prerequisites ON educational_content.exercises USING gin (prerequisites);
CREATE INDEX idx_exercises_search ON educational_content.exercises USING gin (to_tsvector('spanish'::regconfig, ((COALESCE(title, ''::text) || ' '::text) || COALESCE(description, ''::text))));
CREATE INDEX idx_exercises_type ON educational_content.exercises USING btree (exercise_type);

-- Triggers
CREATE TRIGGER trg_exercises_updated_at BEFORE UPDATE ON educational_content.exercises FOR EACH ROW EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Foreign Keys
ALTER TABLE ONLY educational_content.exercises
    ADD CONSTRAINT exercises_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth_management.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY educational_content.exercises
    ADD CONSTRAINT exercises_module_id_fkey FOREIGN KEY (module_id) REFERENCES educational_content.modules(id) ON DELETE CASCADE;

ALTER TABLE ONLY educational_content.exercises
    ADD CONSTRAINT exercises_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth_management.profiles(id) ON DELETE SET NULL;

-- Row Level Security Policies
CREATE POLICY exercises_all_admin ON educational_content.exercises USING (gamilit.is_admin());
CREATE POLICY exercises_select_active ON educational_content.exercises FOR SELECT USING ((is_active = true));
CREATE POLICY exercises_select_admin ON educational_content.exercises FOR SELECT USING (gamilit.is_admin());

-- Permissions
GRANT ALL ON TABLE educational_content.exercises TO gamilit_user;

-- Comments
COMMENT ON TABLE educational_content.exercises IS 'Ejercicios con 27 mecánicas diferentes - crucigramas, mapas, debates, etc.';
COMMENT ON COLUMN educational_content.exercises.module_id IS 'Módulo al que pertenece el ejercicio (FK CRÍTICA, NOT NULL, CASCADE)';
COMMENT ON COLUMN educational_content.exercises.exercise_type IS 'Tipo de ejercicio: crucigrama, mapa_conceptual, detective_textual, etc.';
COMMENT ON COLUMN educational_content.exercises.prerequisites IS 'Array UUID de ejercicios prerequisitos (auto-referencia débil sin FK constraint)';
COMMENT ON COLUMN educational_content.exercises.comodines_allowed IS 'Power-ups permitidos en este ejercicio (gamification_system.comodin_type[] ARRAY). Valores: pistas (15 coins), vision_lectora (25 coins), segunda_oportunidad (40 coins). DEFAULT: todos habilitados.';
COMMENT ON COLUMN educational_content.exercises.created_by IS 'Perfil del creador (auditoría, ON DELETE SET NULL)';
COMMENT ON COLUMN educational_content.exercises.reviewed_by IS 'Perfil del revisor (auditoría, ON DELETE SET NULL)';

-- Comentarios de contenido pedagógico (DB-125: 2025-11-19)
COMMENT ON COLUMN educational_content.exercises.objective IS
'Objetivo pedagógico expandido del ejercicio (200-500 palabras). Describe qué aprenderá el estudiante y por qué es importante según el modelo de comprensión lectora de Daniel Cassany.';

COMMENT ON COLUMN educational_content.exercises.how_to_solve IS
'Guía detallada de cómo resolver el ejercicio (300-800 palabras). Pasos pedagógicos, estrategias de pensamiento, y consejos para completar exitosamente el ejercicio.';

COMMENT ON COLUMN educational_content.exercises.recommended_strategy IS
'Estrategias recomendadas para resolver eficientemente (100-300 palabras). Tips, trucos, y mejores prácticas para estudiantes.';

COMMENT ON COLUMN educational_content.exercises.pedagogical_notes IS
'Notas metodológicas para educadores (100-400 palabras). Contexto pedagógico, relación con competencias, y alineación con modelo Cassany.';
