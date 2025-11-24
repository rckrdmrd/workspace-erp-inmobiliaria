-- =============================================================================
-- Migration: Implementar ENUMs en tablas audit_logging y social_features
-- Ticket: DB-124 / H-034
-- Date: 2025-11-19
-- Author: Database Agent
-- =============================================================================
--
-- CONTEXTO:
-- La auditoría DB-124 identificó 10 ENUMs sin uso en schemas que SÍ tienen
-- tablas implementadas. Las tablas usan tipos primitivos (TEXT/VARCHAR) en
-- lugar de ENUMs definidos.
--
-- Esta migración implementa los ENUMs en las columnas apropiadas.
--
-- IMPACT:
-- - audit_logging: 6 tablas (0 registros) - SIN IMPACTO
-- - social_features: 6 tablas (5 registros solo en classrooms) - BAJO IMPACTO
--
-- ROLLBACK:
-- Para revertir, ejecutar ALTER TABLE cambiando ENUMs de vuelta a TEXT/VARCHAR
--
-- =============================================================================

SET search_path TO audit_logging, social_features, public;

-- =============================================================================
-- AUDIT_LOGGING SCHEMA
-- =============================================================================

-- Tabla: audit_logs
-- =====================

-- 1. Cambiar audit_logs.action: TEXT → audit_action ENUM
ALTER TABLE audit_logging.audit_logs
    ALTER COLUMN action DROP DEFAULT,
    ALTER COLUMN action TYPE audit_logging.audit_action
        USING CASE
            WHEN action IN ('create', 'update', 'delete', 'login', 'logout', 'access', 'export', 'import')
            THEN action::audit_logging.audit_action
            ELSE 'access'::audit_logging.audit_action  -- default fallback
        END,
    ALTER COLUMN action SET DEFAULT 'access'::audit_logging.audit_action;

-- 2. Cambiar audit_logs.severity: TEXT → alert_severity ENUM
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'audit_logging'
          AND table_name = 'audit_logs'
          AND column_name = 'severity'
          AND data_type IN ('text', 'character varying')
    ) THEN
        ALTER TABLE audit_logging.audit_logs
            ALTER COLUMN severity DROP DEFAULT,
            ALTER COLUMN severity TYPE audit_logging.alert_severity
                USING severity::audit_logging.alert_severity,
            ALTER COLUMN severity SET DEFAULT 'info'::audit_logging.alert_severity;
        RAISE NOTICE '✓ audit_logs.severity cambiado a alert_severity ENUM';
    ELSE
        RAISE NOTICE '→ audit_logs.severity ya es ENUM o no existe';
    END IF;
END $$;

-- Tabla: system_alerts
-- =====================

-- 3. Cambiar system_alerts.severity: TEXT → alert_severity ENUM
ALTER TABLE audit_logging.system_alerts
    ALTER COLUMN severity TYPE audit_logging.alert_severity
        USING CASE
            WHEN severity IN ('info', 'warning', 'error', 'critical')
            THEN severity::audit_logging.alert_severity
            ELSE 'warning'::audit_logging.alert_severity
        END;

-- 4. Cambiar system_alerts.status: TEXT → alert_status ENUM
ALTER TABLE audit_logging.system_alerts
    ALTER COLUMN status DROP DEFAULT,
    ALTER COLUMN status TYPE audit_logging.alert_status
        USING CASE
            WHEN status IN ('active', 'acknowledged', 'resolved', 'ignored')
            THEN status::audit_logging.alert_status
            WHEN status = 'open' THEN 'active'::audit_logging.alert_status
            ELSE 'active'::audit_logging.alert_status
        END,
    ALTER COLUMN status SET DEFAULT 'active'::audit_logging.alert_status;

-- Tabla: system_logs
-- =====================

-- 5. Cambiar system_logs.log_level: TEXT → log_level ENUM
ALTER TABLE audit_logging.system_logs
    ALTER COLUMN log_level TYPE audit_logging.log_level
        USING CASE
            WHEN log_level IN ('debug', 'info', 'warning', 'error', 'critical')
            THEN log_level::audit_logging.log_level
            ELSE 'info'::audit_logging.log_level
        END;

-- Tabla: performance_metrics
-- =====================

-- 6. Cambiar performance_metrics.metric_type: TEXT → metric_type ENUM
ALTER TABLE audit_logging.performance_metrics
    ALTER COLUMN metric_type TYPE audit_logging.metric_type
        USING CASE
            WHEN metric_type IN ('engagement', 'performance', 'completion', 'time_spent', 'accuracy', 'streak', 'social_interaction')
            THEN metric_type::audit_logging.metric_type
            ELSE 'engagement'::audit_logging.metric_type
        END;

-- NOTA: aggregation_period ENUM no tiene columna correspondiente en las tablas actuales.
-- Se mantiene definido para uso futuro en reportes agregados.

-- =============================================================================
-- SOCIAL_FEATURES SCHEMA
-- =============================================================================

-- Tabla: teacher_classrooms
-- =====================

-- 7. Cambiar teacher_classrooms.role: VARCHAR → classroom_role ENUM
ALTER TABLE social_features.teacher_classrooms
    ALTER COLUMN role DROP DEFAULT,
    ALTER COLUMN role TYPE social_features.classroom_role
        USING CASE
            WHEN role IN ('teacher', 'student', 'assistant')
            THEN role::social_features.classroom_role
            ELSE 'teacher'::social_features.classroom_role
        END,
    ALTER COLUMN role SET DEFAULT 'teacher'::social_features.classroom_role;

-- Tabla: team_members
-- =====================

-- 8. Cambiar team_members.role: VARCHAR → team_role ENUM
ALTER TABLE social_features.team_members
    ALTER COLUMN role DROP DEFAULT,
    ALTER COLUMN role TYPE social_features.team_role
        USING CASE
            WHEN role IN ('leader', 'member', 'coordinator')
            THEN role::social_features.team_role
            ELSE 'member'::social_features.team_role
        END,
    ALTER COLUMN role SET DEFAULT 'member'::social_features.team_role;

-- Tabla: friendships
-- =====================

-- 9. Cambiar friendships.status: VARCHAR → friendship_status ENUM
ALTER TABLE social_features.friendships
    ALTER COLUMN status DROP DEFAULT,
    ALTER COLUMN status TYPE social_features.friendship_status
        USING CASE
            WHEN status IN ('pending', 'accepted', 'blocked')
            THEN status::social_features.friendship_status
            ELSE 'pending'::social_features.friendship_status
        END,
    ALTER COLUMN status SET DEFAULT 'pending'::social_features.friendship_status;

-- NOTA: social_event_type ENUM podría usarse en social_interactions.interaction_type
-- pero requiere análisis adicional de los valores esperados. Se deja para fase 2.

-- =============================================================================
-- VERIFICACIÓN
-- =============================================================================

-- Verificar que los cambios se aplicaron correctamente
DO $$
DECLARE
    enum_count INTEGER;
BEGIN
    -- Contar columnas que ahora usan ENUMs
    SELECT COUNT(*) INTO enum_count
    FROM information_schema.columns
    WHERE (table_schema = 'audit_logging' OR table_schema = 'social_features')
        AND data_type = 'USER-DEFINED'
        AND udt_name IN (
            'audit_action', 'alert_severity', 'alert_status', 'log_level', 'metric_type',
            'classroom_role', 'team_role', 'friendship_status'
        );

    RAISE NOTICE '✓ Columnas con ENUMs implementados: %', enum_count;

    IF enum_count >= 9 THEN
        RAISE NOTICE '✓ Migración exitosa - 9+ columnas ahora usan ENUMs';
    ELSE
        RAISE WARNING '⚠ Solo % columnas usan ENUMs (esperado: 9+)', enum_count;
    END IF;
END $$;

-- Mostrar uso actual de ENUMs
SELECT
    n.nspname as schema,
    t.typname as enum_name,
    COUNT(c.*) as num_usos_columnas
FROM pg_type t
JOIN pg_namespace n ON t.typnamespace = n.oid
LEFT JOIN information_schema.columns c ON c.udt_schema = n.nspname AND c.udt_name = t.typname
WHERE t.typtype = 'e'
    AND n.nspname IN ('audit_logging', 'social_features')
GROUP BY n.nspname, t.typname
ORDER BY n.nspname, num_usos_columnas DESC, t.typname;

-- =============================================================================
-- RESUMEN
-- =============================================================================
--
-- ENUMs implementados (9 de 10):
-- ✅ audit_action         → audit_logs.action
-- ✅ alert_severity       → audit_logs.severity, system_alerts.severity
-- ✅ alert_status         → system_alerts.status
-- ✅ log_level            → system_logs.log_level
-- ✅ metric_type          → performance_metrics.metric_type
-- ✅ classroom_role       → teacher_classrooms.role
-- ✅ team_role            → team_members.role
-- ✅ friendship_status    → friendships.status
-- ⏳ aggregation_period   → (reservado para uso futuro)
-- ⏳ social_event_type    → (requiere análisis - fase 2)
--
-- Beneficios:
-- - Validación de datos a nivel de BD
-- - Mejor rendimiento en queries con índices
-- - Autocomplete en herramientas de BD
-- - Prevención de typos y valores inválidos
--
-- =============================================================================
