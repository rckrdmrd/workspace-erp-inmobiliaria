-- =====================================================
-- Seed Data: Achievements (STAGING)
-- =====================================================
-- Description: Logros esenciales para demostración
-- Environment: STAGING (configuración + demo data)
-- Records: 15 (solo logros esenciales)
-- Date: 2025-11-02
-- Migrated by: SA-SEEDS-GAM-01
-- =====================================================

SET search_path TO gamification_system, public;

-- =====================================================
-- LOGROS ESENCIALES (15 registros)
-- =====================================================

INSERT INTO gamification_system.achievements (
    tenant_id,
    name,
    description,
    icon,
    category,
    rarity,
    difficulty_level,
    conditions,
    rewards,
    is_secret,
    is_active,
    is_repeatable,
    order_index,
    points_value,
    ml_coins_reward,
    created_at,
    updated_at
) VALUES
-- Progreso básico
(NULL, 'Primer Paso', 'Complete tu primer ejercicio', '🎯', 'progress', 'common', 'beginner', '{"type": "exercise_completed", "requirements": {"exercises_count": 1}}', '{"xp": 10, "ml_coins": 50}', false, true, false, 1, 0, 50, NOW(), NOW()),
(NULL, 'Practicante', 'Completa 10 ejercicios', 'clipboard-check', 'progress', 'common', 'beginner', '{"type": "exercise_completed", "requirements": {"exercises_count": 10}}', '{"xp": 30, "ml_coins": 100}', false, true, false, 2, 0, 100, NOW(), NOW()),
(NULL, 'Aprendiz', 'Alcanza 100 XP totales', 'trending-up', 'progress', 'common', 'beginner', '{"type": "xp_milestone", "requirements": {"total_xp": 100}}', '{"xp": 20, "ml_coins": 50}', false, true, false, 3, 0, 50, NOW(), NOW()),
(NULL, 'Sabio', 'Alcanza 1000 XP totales', 'trending-up', 'progress', 'rare', 'intermediate', '{"type": "xp_milestone", "requirements": {"total_xp": 1000}}', '{"xp": 100, "ml_coins": 200}', false, true, false, 4, 0, 200, NOW(), NOW()),

-- Racha
(NULL, 'Racha Inicial', 'Mantén una racha de 3 días consecutivos', 'zap', 'streak', 'common', 'beginner', '{"type": "streak", "requirements": {"days": 3}}', '{"xp": 30, "ml_coins": 75}', false, true, false, 10, 0, 75, NOW(), NOW()),
(NULL, 'Persistente', 'Mantén una racha de 7 días consecutivos', 'zap', 'streak', 'rare', 'beginner', '{"type": "streak", "requirements": {"days": 7}}', '{"xp": 75, "ml_coins": 150}', false, true, false, 11, 0, 150, NOW(), NOW()),

-- Completación
(NULL, 'Detective Novato', 'Completa tu primer módulo completo', '🔍', 'completion', 'common', 'beginner', '{"type": "module_completed", "requirements": {"modules_count": 1}}', '{"xp": 50, "ml_coins": 100}', false, true, false, 20, 0, 100, NOW(), NOW()),
(NULL, 'Perfeccionista Novato', 'Obtén 5 calificaciones perfectas (100%)', 'target', 'completion', 'rare', 'intermediate', '{"type": "perfect_score", "requirements": {"perfect_count": 5}}', '{"xp": 50, "ml_coins": 100}', false, true, false, 21, 0, 100, NOW(), NOW()),

-- Maestría
(NULL, 'Ascenso Maya: BATAB', 'Alcanza el rango BATAB', '🏛️', 'mastery', 'rare', 'beginner', '{"type": "rank_achieved", "requirements": {"rank": "batab"}}', '{"xp": 50, "ml_coins": 100}', false, true, false, 30, 0, 100, NOW(), NOW()),
(NULL, 'Líder HOLCATTE', 'Alcanza el rango HOLCATTE', '🛡️', 'mastery', 'epic', 'beginner', '{"type": "rank_achieved", "requirements": {"rank": "holcatte"}}', '{"xp": 100, "ml_coins": 200}', false, true, false, 31, 0, 200, NOW(), NOW()),

-- Exploración
(NULL, 'Explorador Curioso', 'Completa 10 ejercicios diferentes', '🗺️', 'exploration', 'common', 'beginner', '{"type": "exercise_variety", "requirements": {"unique_exercises": 10}}', '{"xp": 30, "ml_coins": 75}', false, true, false, 40, 0, 75, NOW(), NOW()),

-- Social
(NULL, 'Líder de Equipo', 'Crea un equipo y recluta 5 miembros', '👥', 'social', 'common', 'beginner', '{"type": "team_leader", "requirements": {"team_members": 5}}', '{"xp": 50, "ml_coins": 100}', false, true, false, 50, 0, 100, NOW(), NOW()),

-- Especial
(NULL, 'Madrugador', 'Completa un ejercicio antes de las 6 AM', '🌅', 'special', 'rare', 'beginner', '{"type": "time_based", "requirements": {"hour_before": 6}}', '{"xp": 50, "ml_coins": 100}', false, true, false, 60, 0, 100, NOW(), NOW()),
(NULL, 'Noctámbulo', 'Completa un ejercicio después de las 11 PM', '🌙', 'special', 'rare', 'beginner', '{"type": "time_based", "requirements": {"hour_after": 23}}', '{"xp": 50, "ml_coins": 100}', false, true, false, 61, 0, 100, NOW(), NOW()),
(NULL, 'Coleccionista', 'Desbloquea 10 logros diferentes', '🎖️', 'special', 'rare', 'beginner', '{"type": "achievement_count", "requirements": {"achievements": 10}}', '{"xp": 125, "ml_coins": 250}', false, true, false, 62, 0, 250, NOW(), NOW());

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

SELECT
    'Achievements (Staging)' AS seed_name,
    COUNT(*) AS total_achievements
FROM gamification_system.achievements;

-- =====================================================
-- MIGRATION NOTES
-- =====================================================
-- ENVIRONMENT: STAGING
-- CORRECCIONES APLICADAS:
-- 1. UUIDs autogenerados (gen_random_uuid) en lugar de hardcodeados
-- 2. Fechas dinámicas (NOW()) en lugar de hardcodeadas
-- 3. Solo 15 logros esenciales (vs 37 en dev)
-- 4. Sin IDs explícitos (permite autogeneración)
-- 5. Sin ON CONFLICT (permite inserción limpia)
-- =====================================================
