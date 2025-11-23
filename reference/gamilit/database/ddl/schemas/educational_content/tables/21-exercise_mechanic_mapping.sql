-- ============================================================================
-- TABLA: exercise_mechanic_mapping
-- Schema: educational_content
-- Descripción: Mapeo N:M entre categorías pedagógicas universales y
--              implementaciones específicas GAMILIT
-- Relacionado: ADR-008 (Sistema Dual exercise_type + Categorías Pedagógicas)
-- RF: RF-EDU-001, ET-EDU-001
-- ============================================================================

-- ============================================================================
-- TABLA: exercise_mechanic_mapping
-- ============================================================================

CREATE TABLE educational_content.exercise_mechanic_mapping (
    -- Identificador único
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- ========================================================================
    -- CLASIFICACIÓN PEDAGÓGICA UNIVERSAL
    -- ========================================================================

    -- Categoría principal (7 categorías universales)
    -- Valores: 'vocabulario', 'gramatica', 'lectura', 'escritura', 'audio', 'pronunciacion', 'cultura'
    mechanic_category VARCHAR(50) NOT NULL,

    -- Subcategoría pedagógica específica (31 subcategorías genéricas)
    -- Ejemplos: 'multiple_choice', 'word_search', 'inference', 'free_writing', etc.
    mechanic_subcategory VARCHAR(50),

    -- ========================================================================
    -- IMPLEMENTACIÓN GAMILIT
    -- ========================================================================

    -- Tipo de ejercicio específico GAMILIT (35 implementaciones)
    -- Referencia: educational_content.exercise_type ENUM
    exercise_type educational_content.exercise_type NOT NULL,

    -- ========================================================================
    -- CONTEXTO EDUCATIVO
    -- ========================================================================

    -- Nivel en Taxonomía de Bloom
    -- Valores: 'recordar', 'comprender', 'aplicar', 'analizar', 'evaluar', 'crear'
    bloom_level VARCHAR(50),

    -- Niveles CEFR aplicables (array para soportar múltiples niveles)
    -- Valores: 'basico', 'intermedio', 'avanzado', 'experto'
    cefr_level educational_content.difficulty_level[],

    -- Propósito pedagógico del mapeo
    pedagogical_purpose TEXT,

    -- Objetivos de aprendizaje que cumple
    learning_objectives TEXT[],

    -- ========================================================================
    -- CARACTERÍSTICAS DE INTERACCIÓN
    -- ========================================================================

    -- Tipo de interacción del usuario
    -- Ejemplos: 'drag_drop', 'text_input', 'selection', 'audio_recording', 'drawing'
    interaction_type VARCHAR(50),

    -- Carga cognitiva aproximada
    -- Valores: 'bajo', 'medio', 'alto'
    cognitive_load VARCHAR(20),

    -- ========================================================================
    -- METADATOS Y CONTROL
    -- ========================================================================

    -- Tags adicionales para búsqueda flexible
    tags TEXT[],

    -- Control de activación (permite deshabilitar mappings obsoletos)
    is_active BOOLEAN DEFAULT true NOT NULL,

    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- ========================================================================
    -- CONSTRAINTS
    -- ========================================================================

    -- Previene duplicados: misma subcategoría + mismo exercise_type
    CONSTRAINT uq_mechanic_mapping_subcategory_type
        UNIQUE(mechanic_subcategory, exercise_type),

    -- Validación: cognitive_load debe ser uno de los valores permitidos
    CONSTRAINT chk_cognitive_load
        CHECK (cognitive_load IN ('bajo', 'medio', 'alto'))
);

-- ============================================================================
-- ÍNDICES OPTIMIZADOS
-- ============================================================================

-- Índice para búsqueda por categoría pedagógica principal
CREATE INDEX idx_mechanic_mapping_category
    ON educational_content.exercise_mechanic_mapping(mechanic_category)
    WHERE is_active = true;

-- Índice para búsqueda por subcategoría pedagógica específica
CREATE INDEX idx_mechanic_mapping_subcategory
    ON educational_content.exercise_mechanic_mapping(mechanic_subcategory)
    WHERE is_active = true;

-- Índice para búsqueda por tipo de ejercicio GAMILIT
CREATE INDEX idx_mechanic_mapping_exercise_type
    ON educational_content.exercise_mechanic_mapping(exercise_type)
    WHERE is_active = true;

-- Índice para búsqueda por nivel de Bloom
CREATE INDEX idx_mechanic_mapping_bloom
    ON educational_content.exercise_mechanic_mapping(bloom_level)
    WHERE is_active = true;

-- Índice GIN para búsqueda por tags
CREATE INDEX idx_mechanic_mapping_tags_gin
    ON educational_content.exercise_mechanic_mapping USING gin(tags);

-- ============================================================================
-- TRIGGER: updated_at automático
-- ============================================================================

CREATE TRIGGER trg_exercise_mechanic_mapping_updated_at
    BEFORE UPDATE ON educational_content.exercise_mechanic_mapping
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- ============================================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================================

COMMENT ON TABLE educational_content.exercise_mechanic_mapping IS
'Mapeo N:M entre categorías pedagógicas universales (31 subcategorías) e implementaciones específicas GAMILIT (35 exercise_types).
Sistema Dual que permite clasificación pedagógica sin romper implementación existente.
Ver ADR-008 para contexto y decisión arquitectónica.';

COMMENT ON COLUMN educational_content.exercise_mechanic_mapping.mechanic_category IS
'Categoría pedagógica principal (7 valores): vocabulario, gramatica, lectura, escritura, audio, pronunciacion, cultura';

COMMENT ON COLUMN educational_content.exercise_mechanic_mapping.mechanic_subcategory IS
'Subcategoría pedagógica genérica (31 valores posibles). Ejemplos: multiple_choice, word_search, inference, free_writing';

COMMENT ON COLUMN educational_content.exercise_mechanic_mapping.exercise_type IS
'Tipo de ejercicio específico GAMILIT (35 implementaciones). Referencia ENUM educational_content.exercise_type';

COMMENT ON COLUMN educational_content.exercise_mechanic_mapping.bloom_level IS
'Nivel en Taxonomía de Bloom: recordar, comprender, aplicar, analizar, evaluar, crear';

COMMENT ON COLUMN educational_content.exercise_mechanic_mapping.cefr_level IS
'Niveles CEFR aplicables como array. Permite mapear un exercise_type a múltiples niveles de dificultad';

COMMENT ON COLUMN educational_content.exercise_mechanic_mapping.pedagogical_purpose IS
'Descripción del propósito pedagógico de este mapeo. Por qué este exercise_type sirve para esta categoría';

COMMENT ON COLUMN educational_content.exercise_mechanic_mapping.learning_objectives IS
'Array de objetivos de aprendizaje específicos que cumple este mapeo';

COMMENT ON COLUMN educational_content.exercise_mechanic_mapping.interaction_type IS
'Tipo de interacción del usuario: drag_drop, text_input, selection, audio_recording, drawing, etc.';

COMMENT ON COLUMN educational_content.exercise_mechanic_mapping.cognitive_load IS
'Carga cognitiva aproximada: bajo, medio, alto. Ayuda a equilibrar asignaciones';

COMMENT ON COLUMN educational_content.exercise_mechanic_mapping.tags IS
'Tags adicionales para búsqueda flexible. Ejemplos: [colaborativo, individual, visual, auditivo]';

COMMENT ON COLUMN educational_content.exercise_mechanic_mapping.is_active IS
'Permite deshabilitar mappings obsoletos sin eliminar histórico';

-- ============================================================================
-- VISTA HELPER: exercises_with_mechanics
-- ============================================================================

CREATE VIEW educational_content.exercises_with_mechanics AS
SELECT
    -- Campos de exercises
    e.id,
    e.module_id,
    e.exercise_type,
    e.title,
    e.description,
    e.difficulty_level,
    e.estimated_duration_minutes,
    e.content_data,
    e.ml_coins_reward,
    e.xp_reward,
    e.order_index,
    e.is_active AS exercise_is_active,
    e.created_at AS exercise_created_at,
    e.updated_at AS exercise_updated_at,

    -- Campos de exercise_mechanic_mapping
    m.id AS mapping_id,
    m.mechanic_category,
    m.mechanic_subcategory,
    m.bloom_level,
    m.cefr_level AS mechanic_cefr_levels,
    m.pedagogical_purpose,
    m.learning_objectives,
    m.interaction_type,
    m.cognitive_load,
    m.tags AS mechanic_tags
FROM
    educational_content.exercises e
LEFT JOIN
    educational_content.exercise_mechanic_mapping m
    ON e.exercise_type = m.exercise_type
    AND m.is_active = true
WHERE
    e.is_active = true;

COMMENT ON VIEW educational_content.exercises_with_mechanics IS
'Vista helper que combina exercises con sus categorías pedagógicas del Sistema Dual.
Facilita queries de profesores para buscar ejercicios por competencia pedagógica.
Solo incluye exercises activos y mappings activos.';

-- ============================================================================
-- GRANTS (RLS se maneja en nivel de schema)
-- ============================================================================

-- Los permisos se manejan mediante RLS policies en educational_content schema
-- Este comentario documenta que la tabla hereda las policies del schema
