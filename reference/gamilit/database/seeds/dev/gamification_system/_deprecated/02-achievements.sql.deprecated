-- =====================================================
-- Seed Data: Achievements (DEV)
-- =====================================================
-- Description: Logros predefinidos del sistema GAMILIT
-- Environment: DEVELOPMENT (incluye todos los logros de prueba)
-- Records: 37 (sin duplicados)
-- Date: 2025-11-02
-- Migrated by: SA-SEEDS-GAM-01
-- =====================================================

SET search_path TO gamification_system, public;

-- =====================================================
-- LOGROS DE PROGRESO (15 registros)
-- =====================================================

INSERT INTO gamification_system.achievements (
    id,
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
-- Primeros pasos
('a9672e47-94a4-4164-a06f-9055bade05fb', NULL, 'Primer Paso', 'Complete tu primer ejercicio', '🎯', 'progress', 'common', 'beginner', '{"type": "exercise_completed", "requirements": {"exercises_count": 1}}', '{"xp": 10, "ml_coins": 50}', false, true, false, 1, 0, 50, NOW(), NOW()),
('b6f15dd3-76c9-42e3-9ca0-6ace1c269f55', NULL, 'Detective Novato', 'Completa tu primer módulo completo', '🔍', 'progress', 'common', 'beginner', '{"type": "module_completed", "requirements": {"modules_count": 1}}', '{"xp": 50, "ml_coins": 100}', false, true, false, 2, 0, 100, NOW(), NOW()),
('8b4d1398-36e4-4248-81d4-42031e289458', NULL, 'Estudiante Dedicado', 'Alcanza 500 XP totales', '⭐', 'progress', 'common', 'beginner', '{"type": "xp_milestone", "requirements": {"total_xp": 500}}', '{"xp": 0, "ml_coins": 100}', false, true, false, 5, 0, 100, NOW(), NOW()),

-- Serie de ejercicios completados
('edb455ec-67d4-4f0c-80de-42a1d5fdc802', NULL, 'Practicante', 'Completa 10 ejercicios', 'clipboard-check', 'progress', 'common', 'beginner', '{"type": "exercise_completed", "requirements": {"exercises_count": 10}}', '{"xp": 30, "ml_coins": 100}', false, true, false, 10, 0, 100, NOW(), NOW()),
('cb6ee45b-75d8-4b40-af09-9a3e71088d06', NULL, 'Dedicado', 'Completa 50 ejercicios', 'clipboard-check', 'progress', 'rare', 'intermediate', '{"type": "exercise_completed", "requirements": {"exercises_count": 50}}', '{"xp": 100, "ml_coins": 250}', false, true, false, 11, 0, 250, NOW(), NOW()),
('7a85a374-cbf5-4af0-beef-7303899da699', NULL, 'Incansable', 'Completa 100 ejercicios', 'clipboard-check', 'progress', 'epic', 'advanced', '{"type": "exercise_completed", "requirements": {"exercises_count": 100}}', '{"xp": 200, "ml_coins": 500}', false, true, false, 12, 0, 500, NOW(), NOW()),

-- Serie de XP acumulada
('00ed5f05-a77b-4e5d-9c28-d5e5004cd627', NULL, 'Aprendiz', 'Alcanza 100 XP totales', 'trending-up', 'progress', 'common', 'beginner', '{"type": "xp_milestone", "requirements": {"total_xp": 100}}', '{"xp": 20, "ml_coins": 50}', false, true, false, 20, 0, 50, NOW(), NOW()),
('95706ea4-94fc-49f1-8f64-644119d82790', NULL, 'Sabio', 'Alcanza 1000 XP totales', 'trending-up', 'progress', 'rare', 'intermediate', '{"type": "xp_milestone", "requirements": {"total_xp": 1000}}', '{"xp": 100, "ml_coins": 200}', false, true, false, 21, 0, 200, NOW(), NOW()),
('b01d9d33-9542-4f2f-a849-e6914931af3c', NULL, 'Maestro del Conocimiento', 'Alcanza 5000 XP totales', 'award', 'progress', 'epic', 'advanced', '{"type": "xp_milestone", "requirements": {"total_xp": 5000}}', '{"xp": 250, "ml_coins": 500}', false, true, false, 22, 0, 500, NOW(), NOW()),
('d6b3b9b4-322a-42c1-acf3-5feb76bb4a69', NULL, 'Leyenda', 'Alcanza 10000 XP totales', 'crown', 'progress', 'legendary', 'advanced', '{"type": "xp_milestone", "requirements": {"total_xp": 10000}}', '{"xp": 500, "ml_coins": 1000}', false, true, false, 23, 0, 1000, NOW(), NOW()),

-- Serie de ML Coins acumulados
('7d42dada-5909-4991-8909-313d9304dc21', NULL, 'Ahorrador', 'Gana 100 ML Coins en total', 'dollar-sign', 'progress', 'common', 'beginner', '{"type": "coins_milestone", "requirements": {"ml_coins": 100}}', '{"xp": 20, "ml_coins": 50}', false, true, false, 30, 0, 50, NOW(), NOW()),
('05a516a6-a549-4b6e-a50d-afcab7e03772', NULL, 'Rico', 'Gana 500 ML Coins en total', 'dollar-sign', 'progress', 'rare', 'intermediate', '{"type": "coins_milestone", "requirements": {"ml_coins": 500}}', '{"xp": 50, "ml_coins": 100}', false, true, false, 31, 0, 100, NOW(), NOW()),
('77c13f9a-dbe1-478f-83c6-91cab668c0a5', NULL, 'Magnate', 'Gana 1000 ML Coins en total', 'dollar-sign', 'progress', 'epic', 'intermediate', '{"type": "coins_milestone", "requirements": {"ml_coins": 1000}}', '{"xp": 100, "ml_coins": 200}', false, true, false, 32, 0, 200, NOW(), NOW()),
('1332811d-db41-46b1-8e3d-f9c9b72bfc52', NULL, 'Completador de Módulos', 'Completa 3 módulos', 'book-open', 'progress', 'rare', 'intermediate', '{"type": "module_completed", "requirements": {"modules_count": 3}}', '{"xp": 150, "ml_coins": 300}', false, true, false, 40, 0, 300, NOW(), NOW()),

-- Exploración
('af6b9be5-e790-4825-a8db-250b4aa63a41', NULL, 'Explorador Curioso', 'Completa 10 ejercicios diferentes', '🗺️', 'exploration', 'common', 'beginner', '{"type": "exercise_variety", "requirements": {"unique_exercises": 10}}', '{"xp": 30, "ml_coins": 75}', false, true, false, 4, 0, 75, NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    category = EXCLUDED.category,
    rarity = EXCLUDED.rarity,
    difficulty_level = EXCLUDED.difficulty_level,
    conditions = EXCLUDED.conditions,
    rewards = EXCLUDED.rewards,
    is_secret = EXCLUDED.is_secret,
    is_active = EXCLUDED.is_active,
    is_repeatable = EXCLUDED.is_repeatable,
    order_index = EXCLUDED.order_index,
    points_value = EXCLUDED.points_value,
    ml_coins_reward = EXCLUDED.ml_coins_reward,
    updated_at = NOW();

-- =====================================================
-- LOGROS DE RACHA (4 registros)
-- =====================================================

INSERT INTO gamification_system.achievements (
    id,
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
('a7ba1ab7-bf70-4359-ad9d-5ea6e712807b', NULL, 'Lector Persistente', 'Mantén una racha de 7 días consecutivos', '🔥', 'streak', 'rare', 'beginner', '{"type": "streak", "requirements": {"days": 7}}', '{"xp": 75, "ml_coins": 150}', false, true, false, 51, 0, 150, NOW(), NOW()),
('e240d39f-cba1-455c-bbc0-211ab80bf38b', NULL, 'Racha Imparable', 'Mantén una racha de 30 días consecutivos', '🔥', 'streak', 'legendary', 'beginner', '{"type": "streak", "requirements": {"days": 30}}', '{"xp": 250, "ml_coins": 500}', false, true, false, 53, 0, 500, NOW(), NOW()),
('4ddc767d-8364-4599-b3b3-164e6360adcc', NULL, 'Racha Inicial', 'Mantén una racha de 3 días consecutivos', 'zap', 'streak', 'common', 'beginner', '{"type": "streak", "requirements": {"days": 3}}', '{"xp": 30, "ml_coins": 75}', false, true, false, 50, 0, 75, NOW(), NOW()),
('935602c1-dd19-4161-abc1-fac85658159d', NULL, 'Persistente', 'Mantén una racha de 14 días consecutivos', 'zap', 'streak', 'rare', 'intermediate', '{"type": "streak", "requirements": {"days": 14}}', '{"xp": 100, "ml_coins": 250}', false, true, false, 52, 0, 250, NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    category = EXCLUDED.category,
    rarity = EXCLUDED.rarity,
    difficulty_level = EXCLUDED.difficulty_level,
    conditions = EXCLUDED.conditions,
    rewards = EXCLUDED.rewards,
    updated_at = NOW();

-- =====================================================
-- LOGROS DE COMPLETACIÓN (8 registros)
-- =====================================================

INSERT INTO gamification_system.achievements (
    id,
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
('4cc02c8e-bdd5-4bc8-aca0-98bf4d0b11d9', NULL, 'Graduado Literal', 'Completa todos los ejercicios del Módulo 1', '📖', 'completion', 'rare', 'beginner', '{"type": "module_mastery", "requirements": {"module_id": 1, "completion": 100}}', '{"xp": 100, "ml_coins": 200}', false, true, false, 60, 0, 200, NOW(), NOW()),
('15ab1073-8129-401a-b619-4efb07f047ec', NULL, 'Maestro Inferencial', 'Completa todos los ejercicios del Módulo 2', '🧠', 'completion', 'rare', 'beginner', '{"type": "module_mastery", "requirements": {"module_id": 2, "completion": 100}}', '{"xp": 125, "ml_coins": 250}', false, true, false, 61, 0, 250, NOW(), NOW()),
('fcfbb109-49cd-4616-b75b-f400bc81cc7a', NULL, 'Crítico Experto', 'Completa todos los ejercicios del Módulo 3', '🎓', 'completion', 'epic', 'beginner', '{"type": "module_mastery", "requirements": {"module_id": 3, "completion": 100}}', '{"xp": 150, "ml_coins": 300}', false, true, false, 62, 0, 300, NOW(), NOW()),
('cf97f026-a827-4f8d-a339-fb15b4c4a939', NULL, 'Lector Digital', 'Completa todos los ejercicios del Módulo 4', '💻', 'completion', 'epic', 'beginner', '{"type": "module_mastery", "requirements": {"module_id": 4, "completion": 100}}', '{"xp": 175, "ml_coins": 350}', false, true, false, 63, 0, 350, NOW(), NOW()),
('6c65eb4b-01b4-4f19-b986-f9f6e9186f18', NULL, 'Productor Creativo', 'Completa todos los ejercicios del Módulo 5', '🎨', 'completion', 'epic', 'beginner', '{"type": "module_mastery", "requirements": {"module_id": 5, "completion": 100}}', '{"xp": 200, "ml_coins": 400}', false, true, false, 64, 0, 400, NOW(), NOW()),
('89792caf-e702-4090-8023-15b7e7d0f059', NULL, 'Maestría Completa', 'Completa todos los 5 módulos', '👑', 'completion', 'legendary', 'beginner', '{"type": "all_modules", "requirements": {"modules_count": 5}}', '{"xp": 500, "ml_coins": 1000}', false, true, false, 65, 0, 1000, NOW(), NOW()),
('7aab881a-a50b-474a-8d3b-752e26ceee8d', NULL, 'Perfeccionista Novato', 'Obtén 5 calificaciones perfectas (100%)', 'target', 'completion', 'rare', 'intermediate', '{"type": "perfect_score", "requirements": {"perfect_count": 5}}', '{"xp": 50, "ml_coins": 100}', false, true, false, 70, 0, 100, NOW(), NOW()),
('f9c1a1de-6e60-4253-a436-6e1b7e949495', NULL, 'Excelencia Total', 'Obtén 10 calificaciones perfectas (100%)', 'target', 'completion', 'epic', 'intermediate', '{"type": "perfect_score", "requirements": {"perfect_count": 10}}', '{"xp": 100, "ml_coins": 200}', false, true, false, 71, 0, 200, NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

-- =====================================================
-- LOGROS DE MAESTRÍA (8 registros)
-- =====================================================

INSERT INTO gamification_system.achievements (
    id,
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
('6b088b5a-6278-41d6-97a3-17fed0949896', NULL, 'Ascenso Maya: Nacom', 'Alcanza el rango Nacom (Capitán de Guerra)', '🏛️', 'mastery', 'rare', 'beginner', '{"type": "rank_achieved", "requirements": {"rank": "Nacom"}}', '{"xp": 50, "ml_coins": 100}', false, true, false, 80, 0, 100, NOW(), NOW()),
('5259f524-5327-47ad-948c-e037b9e895b2', NULL, 'Sacerdote Ah K''in', 'Alcanza el rango Ah K''in (Sacerdote del Sol)', '🛡️', 'mastery', 'epic', 'intermediate', '{"type": "rank_achieved", "requirements": {"rank": "Ah K''in"}}', '{"xp": 100, "ml_coins": 200}', false, true, false, 81, 0, 200, NOW(), NOW()),
('2365f7e3-001d-427f-a55a-cc552fdd89bb', NULL, 'Halach Uinic', 'Alcanza el rango Halach Uinic (Hombre Verdadero)', '⚔️', 'mastery', 'epic', 'advanced', '{"type": "rank_achieved", "requirements": {"rank": "Halach Uinic"}}', '{"xp": 250, "ml_coins": 500}', false, true, false, 82, 0, 500, NOW(), NOW()),
('641e9e4f-277f-429f-ad6d-6c851e1f09e2', NULL, 'K''uk''ulkan Legendario', 'Alcanza el rango legendario K''uk''ulkan (Serpiente Emplumada)', '👑', 'mastery', 'legendary', 'advanced', '{"type": "rank_achieved", "requirements": {"rank": "K''uk''ulkan"}}', '{"xp": 500, "ml_coins": 1000}', false, true, false, 83, 0, 1000, NOW(), NOW()),
('60ab998b-befb-401e-91ed-dbae49e5f4bb', NULL, 'Perfeccionista', 'Obtén 10 puntuaciones perfectas (100%)', '💯', 'mastery', 'rare', 'beginner', '{"type": "perfect_scores", "requirements": {"count": 10}}', '{"xp": 100, "ml_coins": 200}', false, true, false, 90, 0, 200, NOW(), NOW()),
('6f5228a5-fd27-477a-b8c9-9ea13306cb59', NULL, 'Erudito', 'Completa todos los 27 tipos de ejercicios', '📚', 'mastery', 'legendary', 'beginner', '{"type": "exercise_variety", "requirements": {"unique_types": 27}}', '{"xp": 250, "ml_coins": 500}', false, true, false, 91, 0, 500, NOW(), NOW()),
('355d716a-1f08-4f5b-8ef5-ec1b3648875e', NULL, 'Sin Ayuda', 'Completa 20 ejercicios sin usar comodines', '🦾', 'mastery', 'epic', 'beginner', '{"type": "no_powerups", "requirements": {"exercises_count": 20}}', '{"xp": 150, "ml_coins": 300}', false, true, false, 92, 0, 300, NOW(), NOW()),
('48d73bc6-d392-4a4f-8cbb-cca626485871', NULL, 'Triple Corona', 'Completa 3 módulos con 100% en todos los ejercicios', '🏆', 'mastery', 'legendary', 'beginner', '{"type": "perfect_modules", "requirements": {"modules_count": 3}}', '{"xp": 375, "ml_coins": 750}', false, true, false, 93, 0, 750, NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

-- =====================================================
-- LOGROS SOCIALES (3 registros)
-- =====================================================

INSERT INTO gamification_system.achievements (
    id,
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
('3643878a-3c6d-4a29-b442-fa4c479415da', NULL, 'Líder de Equipo', 'Crea un equipo y recluta 5 miembros', '👥', 'social', 'common', 'beginner', '{"type": "team_leader", "requirements": {"team_members": 5}}', '{"xp": 50, "ml_coins": 100}', false, true, false, 100, 0, 100, NOW(), NOW()),
('5b412395-f090-4f4d-aa07-1e7a36ad4b66', NULL, 'Competidor', 'Gana tu primera competencia', '🥇', 'social', 'rare', 'beginner', '{"type": "competition_win", "requirements": {"wins": 1}}', '{"xp": 100, "ml_coins": 200}', false, true, false, 101, 0, 200, NOW(), NOW()),
('4b7a171d-8c87-4cbf-8852-35aaa3c6675b', NULL, 'Mentor', 'Ayuda a 5 estudiantes diferentes', '🤝', 'social', 'epic', 'beginner', '{"type": "mentor", "requirements": {"students_helped": 5}}', '{"xp": 75, "ml_coins": 150}', false, true, false, 102, 0, 150, NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

-- =====================================================
-- LOGROS ESPECIALES (7 registros sin duplicados)
-- =====================================================

INSERT INTO gamification_system.achievements (
    id,
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
('080a514d-654c-458f-8b48-69d01daa9cc2', NULL, 'Ascenso Rápido', 'Alcanza Nacom en menos de 2 semanas', '⚡', 'special', 'rare', 'beginner', '{"type": "quick_rank", "requirements": {"days": 14, "rank": "Nacom"}}', '{"xp": 75, "ml_coins": 150}', false, true, false, 110, 0, 150, NOW(), NOW()),
('48ad7526-f040-491f-bba7-25d0a4c710bd', NULL, 'Velocista', 'Completa un ejercicio en el top 10% de velocidad', '🏃', 'special', 'rare', 'beginner', '{"type": "speed", "requirements": {"percentile": 10}}', '{"xp": 75, "ml_coins": 150}', false, true, false, 111, 0, 150, NOW(), NOW()),
('547dcbcd-0219-40a6-9f2d-fe157481f629', NULL, 'Madrugador', 'Completa un ejercicio antes de las 6 AM', '🌅', 'special', 'rare', 'beginner', '{"type": "time_based", "requirements": {"hour_before": 6}}', '{"xp": 50, "ml_coins": 100}', false, true, false, 112, 0, 100, NOW(), NOW()),
('514810b4-464a-40b2-8fd4-a1f3a32fd0a8', NULL, 'Noctámbulo', 'Completa un ejercicio después de las 11 PM', '🌙', 'special', 'rare', 'beginner', '{"type": "time_based", "requirements": {"hour_after": 23}}', '{"xp": 50, "ml_coins": 100}', false, true, false, 113, 0, 100, NOW(), NOW()),
('b5717244-5248-4e2a-9a59-05435c287227', NULL, 'Científico Curie', 'Explora todo el contenido sobre Marie Curie', '🧪', 'special', 'epic', 'beginner', '{"type": "content_exploration", "requirements": {"topic": "marie_curie", "completion": 100}}', '{"xp": 150, "ml_coins": 300}', false, true, false, 114, 0, 300, NOW(), NOW()),
('a7a3441f-e4ab-4b15-a84b-bb0a9b7f93a9', NULL, 'Coleccionista', 'Desbloquea 10 logros diferentes', '🎖️', 'special', 'rare', 'beginner', '{"type": "achievement_count", "requirements": {"achievements": 10}}', '{"xp": 125, "ml_coins": 250}', false, true, false, 115, 0, 250, NOW(), NOW()),
('d4f56804-9e8c-407b-8557-4eb9b3875401', NULL, 'Millonario ML', 'Acumula 10,000 ML Coins totales ganados', '💰', 'special', 'legendary', 'beginner', '{"type": "coins_milestone", "requirements": {"total_earned": 10000}}', '{"xp": 500, "ml_coins": 1000}', false, true, false, 116, 0, 1000, NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

SELECT
    'Achievements (Dev)' AS seed_name,
    COUNT(*) AS total_achievements,
    COUNT(DISTINCT category) AS total_categories
FROM gamification_system.achievements;

-- =====================================================
-- MIGRATION NOTES
-- =====================================================
-- ENVIRONMENT: DEV
-- CORRECCIONES APLICADAS:
-- 1. Eliminado TRUNCATE TABLE (usa ON CONFLICT para seguridad)
-- 2. Cambiadas fechas hardcodeadas a NOW()
-- 3. Eliminados duplicados (ej: 'Primer Paso' estaba 2 veces)
-- 4. Eliminados duplicados de 'Madrugador' y 'Noctámbulo'
-- 5. UUIDs mantenidos fijos para DEV (tests predecibles)
-- 6. Total de 37 logros únicos (vs 49 con duplicados)
-- 7. Agregado ml_coins_reward explícito
-- =====================================================
