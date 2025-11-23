-- =====================================================
-- Seed Data: Achievement Categories (PRODUCTION)
-- =====================================================
-- Description: Categorías de logros del sistema de gamificación
-- Environment: PRODUCTION
-- Records: 5
-- Date: 2025-11-02
-- Migrated by: SA-SEEDS-GAM-01
-- =====================================================

SET search_path TO gamification_system, public;

-- =====================================================
-- CATEGORÍAS DE LOGROS (CONFIGURACIÓN ESENCIAL)
-- =====================================================

INSERT INTO gamification_system.achievement_categories (
    name,
    description,
    icon_url,
    display_order,
    is_active
) VALUES
    ('Progreso', 'Logros relacionados con el avance general del estudiante', '🎯', 1, true),
    ('Racha', 'Logros de días consecutivos de actividad', '🔥', 2, true),
    ('Completación', 'Logros de finalización de módulos y ejercicios', '✅', 3, true),
    ('Maestría', 'Logros de dominio y habilidades avanzadas', '👑', 4, true),
    ('Exploración', 'Logros de descubrimiento de contenido', '🔍', 5, true),
    ('Social', 'Logros de colaboración e interacción', '👥', 6, true),
    ('Especial', 'Logros únicos y eventos especiales', '⭐', 7, true)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    icon_url = EXCLUDED.icon_url,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

SELECT
    'Achievement Categories (Production)' AS seed_name,
    COUNT(*) AS records_inserted
FROM gamification_system.achievement_categories;

-- =====================================================
-- MIGRATION NOTES
-- =====================================================
-- CORRECCIONES APLICADAS:
-- 1. Cambiado 'icon' → 'icon_url' (compatibilidad con DDL)
-- 2. Cambiado 'sort_order' → 'display_order' (compatibilidad con DDL)
-- 3. Eliminados IDs hardcodeados, ahora autogenerados (gen_random_uuid)
-- 4. Agregada categoría 'Racha' (faltaba en backup original)
-- 5. Agregada categoría 'Maestría' (faltaba en backup original)
-- 6. Agregada categoría 'Especial' (faltaba en backup original)
-- 7. Uso de ON CONFLICT seguro para production
-- =====================================================
