-- =====================================================
-- ENUM: gamification_system.notification_priority
-- Descripción: 4 niveles de prioridad para notificaciones
-- Documentación: docs/02-especificaciones-tecnicas/tipos-compartidos/TYPES-NOTIFICATIONS.md
-- Epic: EXT-003
-- Created: 2025-11-08
-- =====================================================

CREATE TYPE gamification_system.notification_priority AS ENUM (
    'low',        -- Prioridad baja: informativas, sin urgencia
    'medium',     -- Prioridad media: estándar (DEFAULT)
    'high',       -- Prioridad alta: requieren atención inmediata
    'critical'    -- Prioridad crítica: alertas del sistema, emergencias
);

COMMENT ON TYPE gamification_system.notification_priority IS
'Niveles de prioridad de notificaciones (4 niveles).
Sincronizado con backend NotificationPriorityEnum (apps/backend/src/shared/constants/enums.constants.ts).
Valor por defecto: medium.';
