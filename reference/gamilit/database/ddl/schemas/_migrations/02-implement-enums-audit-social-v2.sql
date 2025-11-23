-- =============================================================================
-- Migration V2: Implementar ENUMs en tablas audit_logging y social_features
-- Ticket: DB-124 / H-034
-- Date: 2025-11-19
-- Author: Database Agent
-- Version: 2 (corregido - maneja columnas existentes y policies)
-- =============================================================================

SET search_path TO audit_logging, social_features, public;

-- =============================================================================
-- AUDIT_LOGGING SCHEMA
-- =============================================================================

-- 2. system_alerts.severity: TEXT → alert_severity ENUM
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'audit_logging'
          AND table_name = 'system_alerts'
          AND column_name = 'severity'
          AND data_type IN ('text', 'character varying')
    ) THEN
        ALTER TABLE audit_logging.system_alerts
            ALTER COLUMN severity TYPE audit_logging.alert_severity
                USING severity::audit_logging.alert_severity;
        RAISE NOTICE '✓ system_alerts.severity → alert_severity ENUM';
    ELSE
        RAISE NOTICE '→ system_alerts.severity ya es ENUM';
    END IF;
END $$;

-- 3. system_alerts.status: TEXT → alert_status ENUM
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'audit_logging'
          AND table_name = 'system_alerts'
          AND column_name = 'status'
          AND data_type IN ('text', 'character varying')
    ) THEN
        ALTER TABLE audit_logging.system_alerts
            ALTER COLUMN status DROP DEFAULT,
            ALTER COLUMN status TYPE audit_logging.alert_status
                USING CASE
                    WHEN status = 'open' THEN 'active'
                    WHEN status IN ('active', 'acknowledged', 'resolved', 'ignored')
                    THEN status
                    ELSE 'active'
                END::audit_logging.alert_status,
            ALTER COLUMN status SET DEFAULT 'active'::audit_logging.alert_status;
        RAISE NOTICE '✓ system_alerts.status → alert_status ENUM';
    ELSE
        RAISE NOTICE '→ system_alerts.status ya es ENUM';
    END IF;
END $$;

-- 4. system_logs.log_level: TEXT → log_level ENUM
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'audit_logging'
          AND table_name = 'system_logs'
          AND column_name = 'log_level'
          AND data_type IN ('text', 'character varying')
    ) THEN
        ALTER TABLE audit_logging.system_logs
            ALTER COLUMN log_level TYPE audit_logging.log_level
                USING log_level::audit_logging.log_level;
        RAISE NOTICE '✓ system_logs.log_level → log_level ENUM';
    ELSE
        RAISE NOTICE '→ system_logs.log_level ya es ENUM';
    END IF;
END $$;

-- 5. performance_metrics.metric_type: TEXT → metric_type ENUM
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'audit_logging'
          AND table_name = 'performance_metrics'
          AND column_name = 'metric_type'
          AND data_type IN ('text', 'character varying')
    ) THEN
        ALTER TABLE audit_logging.performance_metrics
            ALTER COLUMN metric_type TYPE audit_logging.metric_type
                USING metric_type::audit_logging.metric_type;
        RAISE NOTICE '✓ performance_metrics.metric_type → metric_type ENUM';
    ELSE
        RAISE NOTICE '→ performance_metrics.metric_type ya es ENUM';
    END IF;
END $$;

-- =============================================================================
-- SOCIAL_FEATURES SCHEMA
-- =============================================================================

-- 6. friendships.status: VARCHAR → friendship_status ENUM (con manejo de policies)
DO $$
DECLARE
    policy_exists BOOLEAN;
BEGIN
    -- Verificar si existe policy que bloquea el cambio
    SELECT EXISTS (
        SELECT 1 FROM pg_policy
        WHERE schemaname = 'gamification_system'
          AND tablename = 'user_achievements'
          AND policyname = 'user_achievements_read_friends'
    ) INTO policy_exists;

    -- Si la columna es VARCHAR y existe la policy problemática, advertir
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'social_features'
          AND table_name = 'friendships'
          AND column_name = 'status'
          AND data_type IN ('text', 'character varying')
    ) THEN
        IF policy_exists THEN
            RAISE NOTICE '⚠ friendships.status NO cambiado - bloqueado por policy gamification_system.user_achievements_read_friends';
            RAISE NOTICE '→ Solución: Ejecutar DROP POLICY user_achievements_read_friends ON gamification_system.user_achievements; primero';
        ELSE
            ALTER TABLE social_features.friendships
                ALTER COLUMN status DROP DEFAULT,
                ALTER COLUMN status TYPE social_features.friendship_status
                    USING status::social_features.friendship_status,
                ALTER COLUMN status SET DEFAULT 'pending'::social_features.friendship_status;
            RAISE NOTICE '✓ friendships.status → friendship_status ENUM';
        END IF;
    ELSE
        RAISE NOTICE '→ friendships.status ya es ENUM';
    END IF;
END $$;

-- =============================================================================
-- VERIFICACIÓN
-- =============================================================================

DO $$
DECLARE
    enum_count INTEGER;
    audit_logging_count INTEGER;
    social_features_count INTEGER;
BEGIN
    -- Contar ENUMs implementados por schema
    SELECT COUNT(*) INTO audit_logging_count
    FROM information_schema.columns
    WHERE table_schema = 'audit_logging'
        AND data_type = 'USER-DEFINED'
        AND udt_name IN ('audit_action', 'alert_severity', 'alert_status', 'log_level', 'metric_type');

    SELECT COUNT(*) INTO social_features_count
    FROM information_schema.columns
    WHERE table_schema = 'social_features'
        AND data_type = 'USER-DEFINED'
        AND udt_name IN ('classroom_role', 'team_role', 'friendship_status');

    enum_count := audit_logging_count + social_features_count;

    RAISE NOTICE '';
    RAISE NOTICE '=== RESUMEN ===';
    RAISE NOTICE 'audit_logging: % ENUMs implementados (esperado: 5)', audit_logging_count;
    RAISE NOTICE 'social_features: % ENUMs implementados (esperado: 3)', social_features_count;
    RAISE NOTICE 'TOTAL: % ENUMs implementados (esperado: 8-9)', enum_count;

    IF enum_count >= 7 THEN
        RAISE NOTICE '✓ Migración exitosa';
    ELSE
        RAISE WARNING '⚠ Solo % columnas usan ENUMs', enum_count;
    END IF;
END $$;

-- Mostrar uso actualizado de ENUMs
SELECT
    n.nspname as schema,
    t.typname as enum_name,
    COUNT(c.*) as usos
FROM pg_type t
JOIN pg_namespace n ON t.typnamespace = n.oid
LEFT JOIN information_schema.columns c ON c.udt_schema = n.nspname AND c.udt_name = t.typname
WHERE t.typtype = 'e'
    AND n.nspname IN ('audit_logging', 'social_features')
GROUP BY n.nspname, t.typname
ORDER BY n.nspname, usos DESC, t.typname;
