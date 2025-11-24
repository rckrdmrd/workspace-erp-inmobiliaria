-- Índice: idx_achievements_secret
-- Tabla: gamification_system
-- Schema: gamification_system

CREATE INDEX idx_achievements_secret ON gamification_system.achievements(is_secret) WHERE is_secret = true;