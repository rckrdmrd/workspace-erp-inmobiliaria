-- =====================================================
-- Seed Data: Maya Ranks Configuration (PRODUCTION)
-- =====================================================
-- Description: Configuración de rangos maya del sistema de gamificación
-- Environment: PRODUCTION
-- Records: 5
-- Date: 2025-11-16 (Updated)
-- Version: 2.0
-- Source: ESPECIFICACION-TECNICA-RANGOS-MAYA-v2.0.md
-- =====================================================

SET search_path TO gamification_system, public;

-- =====================================================
-- CONFIGURACIÓN DE RANGOS MAYA
-- =====================================================
-- Esta configuración sincroniza los rangos que estaban
-- hardcodeados en backend con la base de datos, permitiendo
-- gestión dinámica sin necesidad de deploys.
--
-- Referencia: apps/backend/src/modules/gamification/services/ranks.service.ts
-- =====================================================

INSERT INTO gamification_system.maya_ranks (
    rank_name,
    display_name,
    description,
    min_xp_required,
    max_xp_threshold,
    ml_coins_bonus,
    xp_multiplier,
    missions_required,
    modules_required,
    perks,
    icon,
    color,
    badge_image_url,
    rank_order,
    next_rank,
    is_active
) VALUES
    -- Nivel 1: Ajaw (Señor - Nivel inicial)
    (
        'Ajaw',
        'Ajaw',
        'Señor - Inicio del camino del conocimiento',
        0,
        499,
        0,
        1.00,
        0,
        0,
        '["basic_access", "forum_access"]'::jsonb,
        'star',
        '#8B4513',  -- Brown (tierra, inicio)
        NULL,
        1,
        'Nacom',
        true
    ),
    -- Nivel 2: Nacom (Capitán de Guerra)
    (
        'Nacom',
        'Nacom',
        'Capitán de Guerra - Guerrero en entrenamiento',
        500,
        999,
        100,
        1.10,
        0,
        0,
        '["xp_boost_10", "daily_bonus", "forum_access", "first_warrior_badge"]'::jsonb,
        'shield',
        '#CD7F32',  -- Bronze
        NULL,
        2,
        'Ah K''in',
        true
    ),
    -- Nivel 3: Ah K'in (Sacerdote del Sol)
    (
        'Ah K''in',
        'Ah K''in',
        'Sacerdote del Sol - Guía del conocimiento',
        1000,
        1499,
        250,
        1.15,
        0,
        0,
        '["xp_boost_15", "coin_bonus", "exclusive_content", "custom_avatar", "special_missions"]'::jsonb,
        'sun',
        '#C0C0C0',  -- Silver
        NULL,
        3,
        'Halach Uinic',
        true
    ),
    -- Nivel 4: Halach Uinic (Hombre Verdadero)
    (
        'Halach Uinic',
        'Halach Uinic',
        'Hombre Verdadero - Líder de la comunidad',
        1500,
        2249,
        500,
        1.20,
        0,
        0,
        '["xp_boost_20", "priority_support", "exclusive_missions", "leaderboard_badge", "mentor_privileges", "premium_content"]'::jsonb,
        'crown',
        '#FFD700',  -- Gold
        NULL,
        4,
        'K''uk''ulkan',
        true
    ),
    -- Nivel 5: K'uk'ulkan (Serpiente Emplumada - Máximo rango)
    (
        'K''uk''ulkan',
        'K''uk''ulkan',
        'Serpiente Emplumada - Maestro legendario',
        2250,
        NULL,  -- Sin límite superior
        1000,
        1.25,
        0,
        0,
        '["xp_boost_25", "all_perks", "mentor_access", "exclusive_events", "legendary_badge", "hall_of_fame", "downloadable_certificate", "maya_master_title"]'::jsonb,
        'dragon',
        '#9B59B6',  -- Purple (legendario)
        NULL,
        5,
        NULL,  -- No hay siguiente rango
        true
    )
ON CONFLICT (rank_name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    min_xp_required = EXCLUDED.min_xp_required,
    max_xp_threshold = EXCLUDED.max_xp_threshold,
    ml_coins_bonus = EXCLUDED.ml_coins_bonus,
    xp_multiplier = EXCLUDED.xp_multiplier,
    missions_required = EXCLUDED.missions_required,
    modules_required = EXCLUDED.modules_required,
    perks = EXCLUDED.perks,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    badge_image_url = EXCLUDED.badge_image_url,
    rank_order = EXCLUDED.rank_order,
    next_rank = EXCLUDED.next_rank,
    is_active = EXCLUDED.is_active,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

SELECT
    'Maya Ranks Configuration (Production)' AS seed_name,
    COUNT(*) AS records_inserted,
    MIN(min_xp_required) AS min_xp_start,
    MAX(COALESCE(max_xp_threshold, 999999)) AS max_xp_end
FROM gamification_system.maya_ranks;

-- Mostrar rangos insertados
SELECT
    rank_order,
    rank_name,
    min_xp_required,
    max_xp_threshold,
    ml_coins_bonus,
    xp_multiplier,
    next_rank
FROM gamification_system.maya_ranks
ORDER BY rank_order;

-- =====================================================
-- MIGRATION NOTES v2.0 (2025-11-16)
-- =====================================================
-- CAMBIOS RESPECTO A v1.0:
-- - Ajustados umbrales XP para alinearse con contenido disponible
-- - v1.0: Rangos hasta 10,000+ XP (inalcanzables)
-- - v2.0: Rangos hasta 2,250+ XP (todos alcanzables)
-- - ML Coins bonus reducidos proporcionalmente
-- - XP multipliers más conservadores (1.00 → 1.25)
-- - Perks actualizados y ampliados
--
-- DISTRIBUCIÓN v2.0:
-- - Ajaw:         0-499 XP (< 1 módulo)
-- - Nacom:        500-999 XP (1 módulo)
-- - Ah K'in:      1,000-1,499 XP (2 módulos)
-- - Halach Uinic: 1,500-2,249 XP (3+ módulos)
-- - K'uk'ulkan:   2,250+ XP (casi todos los módulos con excelencia)
--
-- BENEFICIOS:
-- - Configuración actualizable sin deploy
-- - Funciones SQL pueden consultar directamente
-- - Todos los 5 rangos son ahora alcanzables
-- - Progresión justa y motivante
-- - Sincronización con: calculate_user_rank, update_user_rank, etc.
--
-- DOCUMENTACIÓN:
-- - Especificación: docs/00-vision-general/ESPECIFICACION-TECNICA-RANGOS-MAYA-v2.0.md
-- - Documento de diseño: docs/00-vision-general/DocumentoDiseño_Mecanicas_GAMILIT_v6.2.md
-- - Script de migración: scripts/migrations/2025-11-16_ajustar-umbrales-xp-rangos-v2.sql
-- =====================================================
