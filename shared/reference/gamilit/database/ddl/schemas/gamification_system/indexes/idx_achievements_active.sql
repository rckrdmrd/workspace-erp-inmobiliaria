-- Índice: idx_achievements_active
-- Tabla: gamification_system
-- Schema: gamification_system

CREATE INDEX idx_achievements_active ON gamification_system.achievements(is_active) WHERE is_active = true;