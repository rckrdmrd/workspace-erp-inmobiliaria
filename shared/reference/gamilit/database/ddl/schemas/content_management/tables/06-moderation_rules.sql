-- =====================================================
-- Tabla: moderation_rules
-- Schema: content_management
-- Descripción: Reglas de moderación automática de contenido
-- Relacionado: EXT-002 (Admin Extendido - Moderación Automática)
-- Fecha: 2025-11-11
-- =====================================================

CREATE TABLE content_management.moderation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Nombre descriptivo de la regla
    rule_name VARCHAR(255) NOT NULL,

    -- Tipo de regla
    -- Valores: 'keyword', 'pattern', 'length', 'frequency'
    rule_type VARCHAR(50) NOT NULL,

    -- Entidad objetivo de la regla
    -- Valores: 'content', 'comment', 'message', 'post'
    target_entity VARCHAR(50) NOT NULL,

    -- Configuración de la regla en formato JSON
    -- Ejemplos:
    -- keyword: {"keywords": ["spam", "scam"], "case_sensitive": false}
    -- pattern: {"regex": "\\d{3}-\\d{3}-\\d{4}", "description": "Phone numbers"}
    -- length: {"min_length": 10, "max_length": 5000}
    -- frequency: {"max_posts_per_hour": 10, "window_minutes": 60}
    rule_config JSONB NOT NULL,

    -- Acción a tomar cuando la regla coincide
    -- Valores: 'flag', 'block', 'notify', 'escalate'
    action VARCHAR(20) NOT NULL,

    -- Severidad de la regla
    -- Valores: 'low', 'medium', 'high', 'critical'
    severity VARCHAR(20) DEFAULT 'medium',

    -- Si la acción se ejecuta automáticamente
    auto_execute BOOLEAN DEFAULT false,

    -- Si requiere revisión humana después de la acción
    require_review BOOLEAN DEFAULT true,

    -- Si la regla está activa
    is_active BOOLEAN DEFAULT true,

    -- Prioridad de evaluación (mayor = se evalúa primero)
    priority INTEGER DEFAULT 0,

    -- Auditoría
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT gamilit.now_mexico(),
    updated_at TIMESTAMP DEFAULT gamilit.now_mexico(),

    -- Constraints
    CONSTRAINT chk_mod_rule_type CHECK (rule_type IN ('keyword', 'pattern', 'length', 'frequency')),
    CONSTRAINT chk_mod_rule_entity CHECK (target_entity IN ('content', 'comment', 'message', 'post')),
    CONSTRAINT chk_mod_rule_action CHECK (action IN ('flag', 'block', 'notify', 'escalate')),
    CONSTRAINT chk_mod_rule_severity CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

-- Índices
CREATE INDEX idx_mod_rules_type ON content_management.moderation_rules(rule_type);
CREATE INDEX idx_mod_rules_entity ON content_management.moderation_rules(target_entity);
CREATE INDEX idx_mod_rules_action ON content_management.moderation_rules(action);

-- Índice parcial para reglas activas (las más consultadas)
CREATE INDEX idx_mod_rules_active ON content_management.moderation_rules(is_active, priority DESC, severity DESC)
    WHERE is_active = true;

CREATE INDEX idx_mod_rules_priority ON content_management.moderation_rules(priority DESC);

-- Comentarios
COMMENT ON TABLE content_management.moderation_rules IS 'Reglas de moderación automática con motor de evaluación';
COMMENT ON COLUMN content_management.moderation_rules.rule_type IS 'Tipo de regla: keyword, pattern, length, frequency';
COMMENT ON COLUMN content_management.moderation_rules.rule_config IS 'Configuración JSON específica del tipo de regla';
COMMENT ON COLUMN content_management.moderation_rules.action IS 'Acción a tomar: flag, block, notify, escalate';
COMMENT ON COLUMN content_management.moderation_rules.severity IS 'Severidad: low, medium, high, critical';
COMMENT ON COLUMN content_management.moderation_rules.auto_execute IS 'Si la acción se ejecuta automáticamente sin revisión';
COMMENT ON COLUMN content_management.moderation_rules.priority IS 'Prioridad de evaluación (mayor número = mayor prioridad)';
