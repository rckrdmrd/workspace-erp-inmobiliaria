-- =============================================================================
-- Seeds: system_configuration.feature_flags
-- Description: Production feature flags for GAMILIT platform
-- Priority: P0 - Required for Admin Portal functionality
-- Created: 2025-11-19
-- =============================================================================

-- Clean existing seeds (if any)
TRUNCATE TABLE system_configuration.feature_flags CASCADE;

-- =============================================================================
-- Core Platform Features
-- =============================================================================

INSERT INTO system_configuration.feature_flags
(flag_key, flag_name, description, category, is_enabled, is_system_wide, rollout_percentage, rollout_strategy, required_role, is_user_configurable, tags)
VALUES
-- Gamification Features
('enable_gamification', 'Gamificación Habilitada', 'Habilita todo el sistema de gamificación (XP, niveles, rangos, recompensas)', 'gamification', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["core", "gamification"]'),
('enable_ml_coins', 'Monedas ML (Maya Ludens)', 'Habilita el sistema de monedas ML para recompensas', 'gamification', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["gamification", "rewards"]'),
('enable_xp_system', 'Sistema de Experiencia (XP)', 'Habilita puntos de experiencia y niveles', 'gamification', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["gamification", "progression"]'),
('enable_maya_ranks', 'Rangos Maya', 'Habilita el sistema de rangos mayas (Ajaw, Halach Uinic, etc.)', 'gamification', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["gamification", "ranks"]'),
('enable_badges', 'Insignias y Logros', 'Habilita el sistema de insignias y logros', 'gamification', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["gamification", "achievements"]'),
('enable_leaderboards', 'Tablas de Clasificación', 'Habilita leaderboards globales y por aula', 'gamification', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["gamification", "social"]'),

-- Educational Features
('enable_ai_hints', 'Pistas con IA', 'Habilita sugerencias generadas por IA para ejercicios', 'educational', FALSE, FALSE, 0, 'beta_users', 'super_admin', FALSE, '["beta", "ai", "educational"]'),
('enable_adaptive_difficulty', 'Dificultad Adaptativa', 'Ajusta dificultad de ejercicios según rendimiento del estudiante', 'educational', FALSE, FALSE, 0, 'beta_users', 'super_admin', FALSE, '["beta", "educational", "adaptive"]'),
('allow_exercise_retries', 'Reintentos de Ejercicios', 'Permite a estudiantes reintentar ejercicios', 'educational', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["educational", "pedagogy"]'),
('enable_collaborative_missions', 'Misiones Colaborativas', 'Habilita misiones que requieren trabajo en equipo', 'educational', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["educational", "social", "collaboration"]'),

-- Social Features
('enable_chat', 'Chat en Aulas', 'Habilita chat entre estudiantes y maestros', 'social', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["social", "communication"]'),
('enable_teams', 'Equipos de Estudiantes', 'Permite creación de equipos dentro de aulas', 'social', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["social", "collaboration"]'),
('enable_student_profiles', 'Perfiles Públicos', 'Permite a estudiantes tener perfiles visibles por compañeros', 'social', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["social", "privacy"]'),
('enable_friend_system', 'Sistema de Amigos', 'Permite a estudiantes agregar amigos', 'social', FALSE, FALSE, 50, 'percentage', 'admin_teacher', TRUE, '["social", "beta"]'),

-- Admin & Analytics Features
('enable_advanced_analytics', 'Analytics Avanzados', 'Habilita dashboards y reportes avanzados para maestros', 'admin', TRUE, TRUE, 100, 'all', 'admin_teacher', FALSE, '["admin", "analytics"]'),
('enable_bulk_operations', 'Operaciones Masivas', 'Permite acciones en lote (ej: inscribir múltiples estudiantes)', 'admin', TRUE, TRUE, 100, 'all', 'admin_teacher', FALSE, '["admin", "efficiency"]'),
('enable_custom_reports', 'Reportes Personalizados', 'Permite a maestros crear reportes personalizados', 'admin', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["admin", "analytics", "customization"]'),
('enable_parent_access', 'Acceso para Padres', 'Permite a padres ver progreso de sus hijos', 'admin', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["admin", "communication", "family"]'),

-- Integration Features
('enable_lti_integration', 'Integración LTI', 'Habilita integración con plataformas LMS vía LTI', 'integration', FALSE, TRUE, 0, 'whitelist', 'super_admin', FALSE, '["integration", "lti", "enterprise"]'),
('enable_google_classroom', 'Google Classroom', 'Sincronización con Google Classroom', 'integration', FALSE, FALSE, 0, 'whitelist', 'super_admin', FALSE, '["integration", "google", "beta"]'),
('enable_api_access', 'Acceso API Externo', 'Permite acceso a API para integraciones de terceros', 'integration', FALSE, TRUE, 0, 'whitelist', 'super_admin', FALSE, '["integration", "api", "enterprise"]'),

-- Content & Moderation
('enable_user_generated_content', 'Contenido Generado por Usuarios', 'Permite a maestros crear contenido personalizado', 'content', TRUE, FALSE, 100, 'all', 'admin_teacher', TRUE, '["content", "customization"]'),
('enable_content_moderation', 'Moderación de Contenido', 'Habilita revisión de contenido generado por usuarios', 'content', TRUE, TRUE, 100, 'all', 'super_admin', FALSE, '["content", "safety", "moderation"]'),

-- Performance & Debugging
('enable_performance_monitoring', 'Monitoreo de Rendimiento', 'Habilita métricas de performance del sistema', 'system', TRUE, TRUE, 100, 'all', 'super_admin', FALSE, '["system", "monitoring", "performance"]'),
('enable_debug_mode', 'Modo Debug', 'Habilita logs detallados y herramientas de debugging', 'system', FALSE, TRUE, 0, 'whitelist', 'super_admin', FALSE, '["system", "debugging", "development"]'),
('enable_feature_usage_tracking', 'Tracking de Uso de Features', 'Rastrea qué features se usan más', 'system', TRUE, TRUE, 100, 'all', 'super_admin', FALSE, '["system", "analytics", "product"]');

-- =============================================================================
-- Update timestamps for initial flags
-- =============================================================================

UPDATE system_configuration.feature_flags
SET enabled_at = NOW()
WHERE is_enabled = TRUE;

-- =============================================================================
-- Set dependencies and conflicts
-- =============================================================================

-- ML Coins depends on gamification being enabled
UPDATE system_configuration.feature_flags
SET depends_on_flags = '["enable_gamification"]'::jsonb
WHERE flag_key = 'enable_ml_coins';

-- XP System depends on gamification
UPDATE system_configuration.feature_flags
SET depends_on_flags = '["enable_gamification"]'::jsonb
WHERE flag_key = 'enable_xp_system';

-- Maya Ranks depends on XP system
UPDATE system_configuration.feature_flags
SET depends_on_flags = '["enable_gamification", "enable_xp_system"]'::jsonb
WHERE flag_key = 'enable_maya_ranks';

-- Badges depend on gamification
UPDATE system_configuration.feature_flags
SET depends_on_flags = '["enable_gamification"]'::jsonb
WHERE flag_key = 'enable_badges';

-- Leaderboards depend on XP system
UPDATE system_configuration.feature_flags
SET depends_on_flags = '["enable_gamification", "enable_xp_system"]'::jsonb
WHERE flag_key = 'enable_leaderboards';

-- Friend system depends on student profiles
UPDATE system_configuration.feature_flags
SET depends_on_flags = '["enable_student_profiles"]'::jsonb
WHERE flag_key = 'enable_friend_system';

-- Content moderation conflicts with user generated content being disabled
UPDATE system_configuration.feature_flags
SET depends_on_flags = '["enable_user_generated_content"]'::jsonb
WHERE flag_key = 'enable_content_moderation';

-- =============================================================================
-- Verification
-- =============================================================================

-- Show created flags
SELECT
    flag_key,
    flag_name,
    category,
    is_enabled,
    is_system_wide
FROM system_configuration.feature_flags
ORDER BY category, flag_key;
