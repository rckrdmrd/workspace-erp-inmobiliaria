-- =============================================================================
-- Seeds: system_configuration.gamification_parameters
-- Description: Production gamification parameters for GAMILIT platform
-- Priority: P0 - Required for gamification functionality
-- Reference: Documento de Diseño Mecánicas GAMILIT v6.1
-- Created: 2025-11-19
-- =============================================================================

-- Clean existing seeds (if any)
TRUNCATE TABLE system_configuration.gamification_parameters CASCADE;

-- =============================================================================
-- POINTS & XP PARAMETERS
-- =============================================================================

INSERT INTO system_configuration.gamification_parameters
(param_key, param_name, description, category, param_value, default_value, value_type, min_value, max_value, scope, is_system_managed, is_overridable, affects_systems, tags)
VALUES
-- Base points for exercises
('points_per_exercise_easy', 'Puntos por Ejercicio Fácil', 'Puntos XP otorgados por completar ejercicio de dificultad baja', 'points', '50'::jsonb, '50'::jsonb, 'number', 1, 1000, 'global', FALSE, TRUE, '["xp_calculation", "level_progression"]'::jsonb, '["xp", "exercises"]'::jsonb),
('points_per_exercise_medium', 'Puntos por Ejercicio Medio', 'Puntos XP otorgados por completar ejercicio de dificultad media', 'points', '100'::jsonb, '100'::jsonb, 'number', 1, 1000, 'global', FALSE, TRUE, '["xp_calculation", "level_progression"]'::jsonb, '["xp", "exercises"]'::jsonb),
('points_per_exercise_hard', 'Puntos por Ejercicio Difícil', 'Puntos XP otorgados por completar ejercicio de dificultad alta', 'points', '200'::jsonb, '200'::jsonb, 'number', 1, 1000, 'global', FALSE, TRUE, '["xp_calculation", "level_progression"]'::jsonb, '["xp", "exercises"]'::jsonb),

-- Mission completion points
('points_per_mission', 'Puntos por Misión Completada', 'Puntos XP base por completar una misión completa', 'points', '500'::jsonb, '500'::jsonb, 'number', 100, 5000, 'global', FALSE, TRUE, '["xp_calculation", "mission_completion"]'::jsonb, '["xp", "missions"]'::jsonb),
('bonus_perfect_mission', 'Bonus Misión Perfecta', 'Puntos XP adicionales por completar misión sin errores', 'points', '200'::jsonb, '200'::jsonb, 'number', 0, 1000, 'global', FALSE, TRUE, '["xp_calculation", "mission_completion"]'::jsonb, '["xp", "bonus", "missions"]'::jsonb),

-- Streak bonuses
('points_daily_streak', 'Bonus Racha Diaria', 'Puntos adicionales por días consecutivos activos', 'points', '25'::jsonb, '25'::jsonb, 'number', 0, 500, 'global', FALSE, TRUE, '["xp_calculation", "engagement"]'::jsonb, '["xp", "streaks", "engagement"]'::jsonb),
('max_streak_multiplier', 'Multiplicador Máximo de Racha', 'Multiplicador máximo por rachas largas (ej: 2x en racha de 30 días)', 'multipliers', '2.0'::jsonb, '2.0'::jsonb, 'number', 1, 5, 'global', FALSE, TRUE, '["xp_calculation"]'::jsonb, '["multiplier", "streaks"]'::jsonb),

-- =============================================================================
-- ML COINS (MAYA LUDENS COINS) PARAMETERS
-- =============================================================================

('ml_coins_per_mission', 'ML Coins por Misión', 'Monedas ML otorgadas por completar una misión', 'rewards', '10'::jsonb, '10'::jsonb, 'number', 1, 100, 'global', FALSE, TRUE, '["ml_coins", "mission_completion"]'::jsonb, '["ml_coins", "missions"]'::jsonb),
('ml_coins_per_level_up', 'ML Coins por Subir de Nivel', 'Monedas ML otorgadas al subir de nivel', 'rewards', '50'::jsonb, '50'::jsonb, 'number', 10, 500, 'global', FALSE, TRUE, '["ml_coins", "level_progression"]'::jsonb, '["ml_coins", "levels"]'::jsonb),
('ml_coins_per_rank_up', 'ML Coins por Ascenso de Rango', 'Monedas ML otorgadas al ascender de rango maya', 'rewards', '100'::jsonb, '100'::jsonb, 'number', 50, 1000, 'global', FALSE, TRUE, '["ml_coins", "rank_advancement"]'::jsonb, '["ml_coins", "ranks"]'::jsonb),
('ml_coins_daily_login', 'ML Coins Login Diario', 'Monedas ML por iniciar sesión cada día', 'rewards', '5'::jsonb, '5'::jsonb, 'number', 0, 50, 'global', FALSE, TRUE, '["ml_coins", "engagement"]'::jsonb, '["ml_coins", "daily", "engagement"]'::jsonb),

-- ML Coins shop prices (reference values)
('ml_coins_avatar_item_price', 'Precio Item de Avatar (ML)', 'Costo en ML coins de items de avatar', 'rewards', '20'::jsonb, '20'::jsonb, 'number', 1, 1000, 'global', FALSE, TRUE, '["ml_coins", "shop"]'::jsonb, '["ml_coins", "shop", "avatar"]'::jsonb),
('ml_coins_hint_price', 'Precio Pista (ML)', 'Costo en ML coins de una pista para ejercicio', 'rewards', '10'::jsonb, '10'::jsonb, 'number', 1, 100, 'global', FALSE, TRUE, '["ml_coins", "shop", "hints"]'::jsonb, '["ml_coins", "shop", "gameplay"]'::jsonb),
('ml_coins_retry_price', 'Precio Reintento Extra (ML)', 'Costo en ML coins de un reintento adicional', 'rewards', '15'::jsonb, '15'::jsonb, 'number', 1, 100, 'global', FALSE, TRUE, '["ml_coins", "shop", "retries"]'::jsonb, '["ml_coins", "shop", "gameplay"]'::jsonb),

-- =============================================================================
-- LEVEL PROGRESSION PARAMETERS
-- =============================================================================

('xp_base_for_level_1', 'XP Base Nivel 1', 'XP requerido para alcanzar nivel 1 (desde nivel 0)', 'levels', '100'::jsonb, '100'::jsonb, 'number', 50, 500, 'global', TRUE, FALSE, '["level_progression"]'::jsonb, '["levels", "progression"]'::jsonb),
('xp_level_growth_factor', 'Factor Crecimiento XP por Nivel', 'Factor multiplicador de XP requerido por nivel (ej: 1.15 = 15% más por nivel)', 'levels', '1.15'::jsonb, '1.15'::jsonb, 'number', 1.05, 2, 'global', TRUE, FALSE, '["level_progression"]'::jsonb, '["levels", "progression", "scaling"]'::jsonb),
('max_level', 'Nivel Máximo', 'Nivel máximo alcanzable en el sistema', 'levels', '100'::jsonb, '100'::jsonb, 'number', 50, 200, 'global', TRUE, FALSE, '["level_progression"]'::jsonb, '["levels", "cap"]'::jsonb),

-- =============================================================================
-- MAYA RANKS PARAMETERS
-- =============================================================================

('rank_xp_threshold_ajaw', 'XP para Rango Ajaw', 'XP total requerido para alcanzar rango Ajaw (nivel de entrada)', 'ranks', '0'::jsonb, '0'::jsonb, 'number', 0, 1000, 'global', TRUE, FALSE, '["rank_advancement"]'::jsonb, '["ranks", "maya", "thresholds"]'::jsonb),
('rank_xp_threshold_halach_uinic', 'XP para Rango Halach Uinic', 'XP total requerido para Halach Uinic', 'ranks', '5000'::jsonb, '5000'::jsonb, 'number', 1000, 20000, 'global', TRUE, FALSE, '["rank_advancement"]'::jsonb, '["ranks", "maya", "thresholds"]'::jsonb),
('rank_xp_threshold_nacom', 'XP para Rango Nacom', 'XP total requerido para Nacom', 'ranks', '15000'::jsonb, '15000'::jsonb, 'number', 5000, 50000, 'global', TRUE, FALSE, '["rank_advancement"]'::jsonb, '["ranks", "maya", "thresholds"]'::jsonb),
('rank_xp_threshold_ah_kin', 'XP para Rango Ah Kin', 'XP total requerido para Ah Kin', 'ranks', '30000'::jsonb, '30000'::jsonb, 'number', 10000, 100000, 'global', TRUE, FALSE, '["rank_advancement"]'::jsonb, '["ranks", "maya", "thresholds"]'::jsonb),
('rank_xp_threshold_kukulkan', 'XP para Rango Kukulkan', 'XP total requerido para Kukulkan (máximo rango)', 'ranks', '50000'::jsonb, '50000'::jsonb, 'number', 20000, 200000, 'global', TRUE, FALSE, '["rank_advancement"]'::jsonb, '["ranks", "maya", "thresholds"]'::jsonb),

-- Rank benefits
('rank_ml_coins_bonus_multiplier', 'Multiplicador ML por Rango', 'Multiplicador de ML coins ganados según rango (ej: 0.1 = +10% por rango)', 'multipliers', '0.1'::jsonb, '0.1'::jsonb, 'number', 0, 1, 'global', FALSE, TRUE, '["ml_coins", "rank_advancement"]'::jsonb, '["multiplier", "ranks", "ml_coins"]'::jsonb),
('rank_xp_bonus_multiplier', 'Multiplicador XP por Rango', 'Multiplicador de XP ganado según rango', 'multipliers', '0.05'::jsonb, '0.05'::jsonb, 'number', 0, 0.5, 'global', FALSE, TRUE, '["xp_calculation", "rank_advancement"]'::jsonb, '["multiplier", "ranks", "xp"]'::jsonb),

-- =============================================================================
-- PENALTY PARAMETERS
-- =============================================================================

('penalty_wrong_answer', 'Penalización Respuesta Incorrecta', 'Puntos XP deducidos por respuesta incorrecta (0 = sin penalización)', 'penalties', '0'::jsonb, '0'::jsonb, 'number', 0, 100, 'global', FALSE, TRUE, '["xp_calculation"]'::jsonb, '["penalties", "exercises"]'::jsonb),
('penalty_late_submission', 'Penalización Entrega Tardía', 'Porcentaje de puntos deducidos por entregar tarde (0-100)', 'penalties', '20'::jsonb, '20'::jsonb, 'number', 0, 100, 'global', FALSE, TRUE, '["grading", "assignments"]'::jsonb, '["penalties", "assignments", "deadlines"]'::jsonb),
('max_attempts_per_exercise', 'Intentos Máximos por Ejercicio', 'Número máximo de intentos permitidos por ejercicio', 'penalties', '3'::jsonb, '3'::jsonb, 'number', 1, 10, 'global', FALSE, TRUE, '["exercise_completion"]'::jsonb, '["attempts", "exercises"]'::jsonb),

-- =============================================================================
-- MULTIPLIERS & BONUSES
-- =============================================================================

('multiplier_weekend_bonus', 'Bonus Fin de Semana', 'Multiplicador de XP aplicado en fines de semana', 'multipliers', '1.2'::jsonb, '1.2'::jsonb, 'number', 1, 3, 'global', FALSE, TRUE, '["xp_calculation"]'::jsonb, '["multiplier", "temporal", "engagement"]'::jsonb),
('multiplier_team_collaboration', 'Bonus Colaboración en Equipo', 'Multiplicador de XP cuando se completa en equipo', 'multipliers', '1.3'::jsonb, '1.3'::jsonb, 'number', 1, 2, 'global', FALSE, TRUE, '["xp_calculation", "team_system"]'::jsonb, '["multiplier", "collaboration", "teams"]'::jsonb),
('multiplier_first_completion', 'Bonus Primera Vez', 'Multiplicador para primera vez que completa un tipo de ejercicio', 'multipliers', '1.5'::jsonb, '1.5'::jsonb, 'number', 1, 3, 'global', FALSE, TRUE, '["xp_calculation"]'::jsonb, '["multiplier", "first_time", "discovery"]'::jsonb),

-- =============================================================================
-- ENGAGEMENT & RETENTION PARAMETERS
-- =============================================================================

('daily_mission_goal', 'Meta Diaria de Misiones', 'Número de misiones sugeridas por día para mantener progreso', 'engagement', '3'::jsonb, '3'::jsonb, 'number', 1, 10, 'global', FALSE, TRUE, '["engagement", "mission_system"]'::jsonb, '["daily", "goals", "missions"]'::jsonb),
('weekly_xp_goal', 'Meta Semanal de XP', 'XP sugerido por semana para progreso óptimo', 'engagement', '2000'::jsonb, '2000'::jsonb, 'number', 500, 10000, 'global', FALSE, TRUE, '["engagement", "xp_calculation"]'::jsonb, '["weekly", "goals", "xp"]'::jsonb),
('inactivity_grace_period_days', 'Días de Gracia Inactividad', 'Días antes de penalizar por inactividad', 'engagement', '7'::jsonb, '7'::jsonb, 'number', 1, 30, 'global', FALSE, TRUE, '["engagement", "retention"]'::jsonb, '["inactivity", "retention"]'::jsonb),

-- =============================================================================
-- BADGE & ACHIEVEMENT PARAMETERS
-- =============================================================================

('badge_collection_bonus_ml', 'Bonus ML por Colección de Insignias', 'ML coins extra por completar colección de insignias', 'rewards', '100'::jsonb, '100'::jsonb, 'number', 10, 500, 'global', FALSE, TRUE, '["ml_coins", "badge_system"]'::jsonb, '["ml_coins", "badges", "collections"]'::jsonb),
('achievements_count_for_rank', 'Logros Requeridos para Rango', 'Si se requieren logros además de XP para ascender de rango', 'ranks', 'false'::jsonb, 'false'::jsonb, 'boolean', NULL, NULL, 'global', FALSE, TRUE, '["rank_advancement", "badge_system"]'::jsonb, '["ranks", "achievements", "requirements"]'::jsonb),

-- =============================================================================
-- CLASSROOM-SPECIFIC PARAMETERS (Examples)
-- =============================================================================

('classroom_custom_xp_multiplier', 'Multiplicador XP Personalizado por Aula', 'Permite a maestros ajustar XP ganado en su aula', 'multipliers', '1.0'::jsonb, '1.0'::jsonb, 'number', 0.5, 3, 'classroom', FALSE, TRUE, '["xp_calculation"]'::jsonb, '["multiplier", "classroom", "customization"]'::jsonb),
('classroom_ml_coins_multiplier', 'Multiplicador ML Coins por Aula', 'Permite a maestros ajustar ML coins en su aula', 'multipliers', '1.0'::jsonb, '1.0'::jsonb, 'number', 0.5, 3, 'classroom', FALSE, TRUE, '["ml_coins"]'::jsonb, '["multiplier", "classroom", "customization"]'::jsonb);

-- =============================================================================
-- Verification
-- =============================================================================

SELECT
    param_key,
    param_name,
    category,
    param_value,
    scope
FROM system_configuration.gamification_parameters
ORDER BY category, param_key;
