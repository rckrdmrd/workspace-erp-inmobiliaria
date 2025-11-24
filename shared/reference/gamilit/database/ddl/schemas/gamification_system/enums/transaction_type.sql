-- =====================================================================================
-- Enum: transaction_type
-- Schema: gamification_system
-- Description: Tipos de transacciones de ML Coins (Maya Learning Coins)
-- Versión: 2.0 (2025-11-08) - Sincronizado con documentación oficial
-- Fuente de Verdad:
--   - RF: docs/01-fase-alcance-inicial/EAI-003-gamificacion/requerimientos/RF-GAM-004-economia-ml-coins.md
--   - ET: docs/01-fase-alcance-inicial/EAI-003-gamificacion/especificaciones/ET-GAM-004-tipos-compartidos-gamificacion.md
-- Responsable: SA-DB-005
-- =====================================================================================

CREATE TYPE gamification_system.transaction_type AS ENUM (
    'earned_exercise',      -- Ganado por completar ejercicio
    'earned_module',        -- Ganado por completar módulo
    'earned_achievement',   -- Ganado por desbloquear achievement
    'earned_rank',          -- Ganado por subir de rango
    'earned_streak',        -- Ganado por racha de días
    'earned_daily',         -- Ganado por bonus diario
    'earned_bonus',         -- Ganado por bonus especial
    'spent_powerup',        -- Gastado en power-ups/comodines
    'spent_hint',           -- Gastado en pistas
    'spent_retry',          -- Gastado en reintento
    'admin_adjustment',     -- Ajuste manual por admin
    'refund',               -- Devolución de coins
    'bonus',                -- Bonus general
    'welcome_bonus'         -- Bonus de bienvenida
);

-- =====================================================================================
-- Comments
-- =====================================================================================

COMMENT ON TYPE gamification_system.transaction_type IS
    'Tipos de transacciones de ML Coins (v2.0 - 2025-11-07). '
    'Alineado con documentación oficial en TYPES-GAMIFICATION.md. '
    '14 tipos: 7 earned (ingresos), 3 spent (gastos), 4 admin/sistema.';

-- =====================================================================================
-- Changelog
-- =====================================================================================
--
-- v2.0 (2025-11-07): Sincronización con documentación oficial
--   - Migrado de public schema a gamification_system
--   - Agregados 4 valores faltantes: earned_daily, earned_bonus, bonus, welcome_bonus
--   - Total: 14 valores (7 earned, 3 spent, 4 admin)
--   - Alineado con CHECK constraint de tabla ml_coins_transactions
--
-- v1.0 (legacy): 10 valores en public schema
--   - earned_exercise, earned_achievement, earned_daily_bonus, earned_rank_promotion,
--     spent_hint, spent_unlock_content, spent_customization, refund, admin_adjustment, gift
--   - DESACTUALIZADO y desincronizado con tabla
--
-- =====================================================================================
-- Categorías de Transacciones
-- =====================================================================================
--
-- EARNED (Ingresos - 7 tipos):
--   - earned_exercise: +5-50 coins por ejercicio completado (varía por dificultad)
--   - earned_module: +100-300 coins por módulo completado
--   - earned_achievement: +50-500 coins por logro desbloqueado (varía por rareza)
--   - earned_rank: +100-1000 coins por subida de rango
--   - earned_streak: +10-100 coins por mantener racha (varía por días)
--   - earned_daily: +50 coins por login diario
--   - earned_bonus: Bonus especial por eventos o promociones
--
-- SPENT (Gastos - 3 tipos):
--   - spent_powerup: -15 a -40 coins por comodín (pistas: 15, visión: 25, segunda: 40)
--   - spent_hint: -10 coins por pista contextual
--   - spent_retry: -20 coins por reintento de ejercicio
--
-- ADMIN/SISTEMA (4 tipos):
--   - admin_adjustment: Ajuste manual (puede ser + o -)
--   - refund: Devolución de coins
--   - bonus: Bonus general del sistema
--   - welcome_bonus: +100 coins al registrarse
--
-- =====================================================================================
-- Migration Notes
-- =====================================================================================
--
-- IMPORTANTE: Este ENUM reemplaza:
-- 1. public.transaction_type (10 valores - legacy)
-- 2. CHECK constraint en ml_coins_transactions (12 valores - incompleto)
--
-- Para aplicar a base de datos existente:
-- 1. Usar migration: migrations/XXXX-sync-transaction-type-enum.sql
-- 2. El migration:
--    - Elimina CHECK constraint de ml_coins_transactions
--    - Convierte columna de TEXT a ENUM
--    - Mapea valores legacy a nuevos valores
--    - Elimina public.transaction_type
--
-- Valores legacy que NO existen en v2.0:
--   - earned_daily_bonus → MAPEAR A earned_daily
--   - earned_rank_promotion → MAPEAR A earned_rank
--   - spent_unlock_content → MAPEAR A spent_powerup o admin_adjustment
--   - spent_customization → MAPEAR A spent_powerup o admin_adjustment
--   - gift → MAPEAR A bonus
--
-- =====================================================================================
-- References
-- =====================================================================================
--
-- Documentación:
-- - Requerimiento: docs/01-fase-alcance-inicial/EAI-003-gamificacion/requerimientos/RF-GAM-004-economia-ml-coins.md
-- - Especificación: docs/01-fase-alcance-inicial/EAI-003-gamificacion/especificaciones/ET-GAM-004-tipos-compartidos-gamificacion.md
-- - Sección ET: 1. TransactionType (transaction_type)
--
-- Backend:
-- - Constants: apps/backend/src/shared/constants/enums.constants.ts (TransactionTypeEnum)
-- - Entity: apps/backend/src/modules/gamification/entities/ml-coins-transaction.entity.ts
--
-- Base de Datos:
-- - Tabla: gamification_system.ml_coins_transactions (columna: transaction_type)
--
-- =====================================================================================
