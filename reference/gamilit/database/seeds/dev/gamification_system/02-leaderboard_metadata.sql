-- =====================================================
-- Seed Data: Leaderboard Metadata (PRODUCTION)
-- =====================================================
-- Description: Configuración inicial de leaderboards
-- Environment: PRODUCTION
-- Records: 4
-- Date: 2025-11-02
-- Migrated by: SA-SEEDS-GAM-01
-- =====================================================

SET search_path TO gamification_system, public;

-- =====================================================
-- METADATA DE LEADERBOARDS
-- =====================================================

INSERT INTO gamification_system.leaderboard_metadata (
    view_name,
    last_refresh_at,
    total_users,
    refresh_duration_ms,
    created_at
) VALUES
('leaderboard_xp', gamilit.now_mexico(), 0, 0, gamilit.now_mexico()),
('leaderboard_coins', gamilit.now_mexico(), 0, 0, gamilit.now_mexico()),
('leaderboard_streaks', gamilit.now_mexico(), 0, 0, gamilit.now_mexico()),
('leaderboard_global', gamilit.now_mexico(), 0, 0, gamilit.now_mexico())

ON CONFLICT (view_name) DO UPDATE SET
    last_refresh_at = EXCLUDED.last_refresh_at,
    total_users = EXCLUDED.total_users,
    refresh_duration_ms = EXCLUDED.refresh_duration_ms;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

SELECT
    'Leaderboard Metadata (Production)' AS seed_name,
    COUNT(*) AS records_inserted
FROM gamification_system.leaderboard_metadata;

-- =====================================================
-- MIGRATION NOTES
-- =====================================================
-- ENVIRONMENT: PRODUCTION
-- CORRECCIONES APLICADAS:
-- 1. Eliminado TRUNCATE TABLE
-- 2. Cambiadas fechas hardcodeadas a NOW()
-- 3. Valores inicializados en 0 (se actualizarán automáticamente)
-- 4. Uso de ON CONFLICT para seguridad
-- =====================================================
